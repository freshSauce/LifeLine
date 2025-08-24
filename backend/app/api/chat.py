import asyncio

from fastapi import APIRouter, HTTPException

from backend.app.models import ChatRequest, ChatResponse, Msg
from backend.app.core import GENERIC_FALLBACK, CRISIS_TEMPLATE, SYSTEM_MESSAGE, SYSTEM_MESSAGE_WITH_NICKNAME
from backend.app.services import moderate_out, moderate_in
from backend.app.services.llm import llm_reply
from backend.app.utils import get_history

router = APIRouter(prefix="/api", tags=["api"])

@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    if not payload.messages:
        raise HTTPException(400, "messages vacío")

    messages = [Msg(role="system", content=SYSTEM_MESSAGE_WITH_NICKNAME.format(pronoun=payload.meta["pronoun"],
                                                           nickname=payload.meta["nickname"])
            if payload.meta["nickname"]
            else SYSTEM_MESSAGE.format(pronoun=payload.meta["pronoun"]))
    ]

    messages.extend(payload.messages)

    last_user = next((m for m in reversed(messages) if m.role == "user"), None)
    if not last_user:
        raise HTTPException(400, "falta último mensaje de usuario")

    # 1) Gate-in
    mod_in = moderate_in(last_user.content)
    if mod_in.get("risk_inminente"):
        return ChatResponse(message=Msg(role="assistant", content=CRISIS_TEMPLATE))

    # 2) LLM con timeout + fallback
    try:
        # límite duro para no colgar el frontend
        clean_messages = get_history(messages)
        llm_text = await asyncio.wait_for(llm_reply(clean_messages), timeout=8.0)
    except  asyncio.TimeoutError:
        llm_text = GENERIC_FALLBACK
    except Exception:
        llm_text = GENERIC_FALLBACK

    # 3) Gate-out
    mod_out = moderate_out(llm_text)
    if mod_out.get("risk_inminente"):
        llm_text = CRISIS_TEMPLATE

    return ChatResponse(message=Msg(role="assistant", content=llm_text))