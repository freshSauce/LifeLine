import { useCallback } from 'react'
import { chatApi } from '../services/chatApi.js'

function trimmedContext(list, maxChars = 8000) {
  const out = []
  let total = 0
  for (let i = list.length - 1; i >= 0; i--) {
    const m = list[i]
    total += (m.content || '').length
    if (total > maxChars) break
    out.unshift(m)
  }
  return out
}

export function useChat({ userId, messages, setMessages, pronoun, nickname, isCrisis, setTyping }) {
  const send = useCallback(async (text) => {
    const clean = (text || '').trim()
    if (!clean) return

    const mine = { role: 'user', content: clean, ts: Date.now() }
    setMessages(prev => [...prev, mine])

    if (isCrisis(clean)) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          ts: Date.now(),
          content:
            'Lamento que estés pasando por un momento tan difícil 💙. No estás solo/a. Si estás en peligro inmediato, llama al 911. En México puedes comunicarte 24/7 a la Línea de la Vida: 800 911 2000. Puedo seguir aquí para leerte.'
        }
      ])
      return
    }

    setTyping(true)
    try {
      const payload = {
        user_id: userId,
        messages: trimmedContext([...messages, mine]),
        meta: { pronoun, nickname },
      }
      const data = await chatApi.send(payload)
      const assistant = data?.message ?? { role: 'assistant', content: 'Lo siento, no pude responder ahora.' }
      setMessages(prev => [...prev, { ...assistant, ts: Date.now() }])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          ts: Date.now(),
          status: 'error',
          content:
            'Ahora mismo tengo problemas para responder. Podemos intentar de nuevo en un momento o usar una técnica breve de respiración si te parece.',
        },
      ])
    } finally {
      setTyping(false)
    }
  }, [userId, messages, pronoun, nickname, isCrisis, setMessages, setTyping])

  return { send }
}
