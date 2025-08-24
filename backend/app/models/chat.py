from typing import Literal, List

from pydantic import BaseModel, Field

Role = Literal["user", "assistant", "system"]

class Msg(BaseModel):
    role: Role
    content: str = Field(min_length=1, max_length=8000)

class ChatRequest(BaseModel):
    user_id: str
    messages: List[Msg]
    meta: dict | None = None

class ChatResponse(BaseModel):
    message: Msg