from openai import OpenAI

from backend.app.core import settings


client = OpenAI(
    api_key=settings.google_api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

async def llm_reply(messages) -> str | None:
    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=messages
    )

    return response.choices[0].message.content
