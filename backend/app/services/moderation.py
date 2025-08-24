from openai import OpenAI
from backend.app.core import settings

moderator = OpenAI(api_key=settings.openai_api_key)

def moderate_in(text: str) -> dict:
    moderation_response = moderator.moderations.create(
        model="omni-moderation-latest",
        input=text
    )

    triggers = [
        moderation_response.results[0].categories.self_harm,
        moderation_response.results[0].categories.self_harm_instructions,
        moderation_response.results[0].categories.self_harm_intent
    ]

    risk = any(triggers)
    return {"risk_inminente": risk, "block": False}

def moderate_out(text: str) -> dict:
    # Segunda pasada (por si el LLM se desvía)
    return moderate_in(text)  # en mock usamos lo mismo