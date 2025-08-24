// Simple client para /api/chat con timeout y manejo de errores

const DEFAULT_TIMEOUT_MS = 15_000

function withTimeout(ms = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, cancel: () => clearTimeout(id) }
}

async function fetchJSON(input, init = {}) {
  const res = await fetch(input, init)
  if (!res.ok) {
    // intenta leer texto para debug
    const msg = await res.text().catch(() => '')
    const err = new Error(`HTTP ${res.status}${msg ? `: ${msg.slice(0, 200)}` : ''}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export const chatApi = {
  /**
   * Envía el payload estándar:
   * {
   *   user_id: "string",
   *   messages: [{role:"user|assistant|system", content:"..."}],
   *   meta: { pronoun?: string, nickname?: string }
   * }
   * Devuelve: { message: { role, content } }
   */
  async send(payload, opts = {}) {
    const { timeoutMs = DEFAULT_TIMEOUT_MS } = opts
    const { signal, cancel } = withTimeout(timeoutMs)
    try {
      return await fetchJSON('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal,
      })
    } finally {
      cancel()
    }
  },

  // --- (Opcional) Esqueleto para streaming con SSE/Web Streams si luego lo habilitas en FastAPI ---
  // async *stream(payload, opts = {}) {
  //   const { timeoutMs = 30000 } = opts
  //   const { signal, cancel } = withTimeout(timeoutMs)
  //   try {
  //     const res = await fetch('/api/chat/stream', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(payload),
  //       signal,
  //     })
  //     if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)
  //     const reader = res.body.getReader()
  //     const decoder = new TextDecoder()
  //     while (true) {
  //       const { value, done } = await reader.read()
  //       if (done) break
  //       yield decoder.decode(value)
  //     }
  //   } finally {
  //     cancel()
  //   }
  // },
}
