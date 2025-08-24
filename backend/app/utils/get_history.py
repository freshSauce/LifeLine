from backend.app.models import Msg

from typing import List


def get_history(messages: List[Msg]):
    history = []
    for message in messages:
        history.append({
            "role": message.role,
            "content": message.content
        })
    return history


