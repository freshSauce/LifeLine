import React, { useEffect, useRef, useState } from 'react'
import ChatBubble from '../components/ChatBubble.jsx'
import SettingsPanel from '../components/SettingsPanel.jsx'
import Onboarding from './Onboarding.jsx'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Loader2, Settings, Moon, Sun } from 'lucide-react'
import { chatApi } from '../services/chatApi.js'

/* ---------- util: id anónimo ---------- */
function genAnonId() {
  const buf = new Uint8Array(16)
  crypto.getRandomValues(buf)
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('')
}
function useAnonIdentity(storageKey = 'anon_user_id') {
  const [id, setId] = useState('')
  useEffect(() => {
    let v = localStorage.getItem(storageKey)
    if (!v) {
      v = genAnonId()
      localStorage.setItem(storageKey, v)
    }
    setId(v)
  }, [storageKey])
  return id
}

/* ---------- crisis detection (demo local) ---------- */
const CRISIS_TERMS = [
  'suicid','quitarme la vida','no quiero vivir','me quiero morir',
  'me voy a matar','hacerme dano','autolesion','auto lesion','no aguanto mas'
]
const normalize = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
function isCrisis(text) {
  const t = normalize(text)
  return CRISIS_TERMS.some(k => t.includes(normalize(k)))
}

/* ---------- recorte de contexto ---------- */
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

/* ---------- helpers de fecha (separadores) ---------- */
function sameDay(a, b) {
  const da = new Date(a), db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}
function dayLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (sameDay(d, now)) return 'Hoy'
  const yest = new Date(now); yest.setDate(now.getDate() - 1)
  if (sameDay(d, yest)) return 'Ayer'
  return d.toLocaleDateString()
}

/* ---------- Header compacto ---------- */
function Header({ onOpenSettings, crisisMode, darkMode, toggleDark }) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-slate-200/70 dark:border-gray-700 px-4 py-3 rounded-t-3xl">
      <div className="text-base md:text-lg font-semibold tracking-tight text-slate-900 dark:text-gray-100">
        Espacio seguro 🌿
      </div>
      <div className="flex items-center gap-2">
        {crisisMode && (
          <span className="rounded-full border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-800 px-2 py-1 text-[11px] text-red-700 dark:text-red-300">
            Modo crisis activo
          </span>
        )}
        <Button variant="secondary" className="text-xs" onClick={toggleDark} title="Cambiar tema">
          {darkMode ? <Sun className="mr-1 h-4 w-4" /> : <Moon className="mr-1 h-4 w-4" />}
          {darkMode ? 'Claro' : 'Oscuro'}
        </Button>
        <Button variant="secondary" className="text-xs" onClick={onOpenSettings}>
          <Settings className="mr-1 h-4 w-4" />
          Ajustes
        </Button>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const userId = useAnonIdentity()
  const [onboardingDone, setOnboardingDone] = useState(
  () => localStorage.getItem('onboarding_done') === '1'
  )

  const [pronoun, setPronoun] = useState(localStorage.getItem('pronoun') || '')
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '')

  /* tema (persistente) */
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])
  const toggleDark = () => setDarkMode(v => !v)


  /* ajustes / estado */
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [localEnabled, setLocalEnabled] = useState(true)
  const [cloudEnabled, setCloudEnabled] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [crisisMode, setCrisisMode] = useState(false)

  /* chat */
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('local_history_messages')
      return raw
        ? JSON.parse(raw)
        : [{ role: 'assistant', content: 'Hola 👋, me alegra que estés aquí. ¿Cómo te sientes hoy?', ts: Date.now() }]
    } catch {
      return [{ role: 'assistant', content: 'Hola 👋, me alegra que estés aquí. ¿Cómo te sientes hoy?', ts: Date.now() }]
    }
  })
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  /* autoscroll + persistencia local */
  const listRef = useRef(null)
  useEffect(() => {
    if (localEnabled) {
      try { localStorage.setItem('local_history_messages', JSON.stringify(messages)) } catch {}
    }
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, localEnabled])

  /* persistir identidad */
  useEffect(() => {
    if (pronoun) localStorage.setItem('pronoun', pronoun)
    if (nickname) localStorage.setItem('nickname', nickname)
  }, [pronoun, nickname])

  /* nube demo + importar/exportar */
  const saveCloud = async (passphrase) => {
    alert(`(demo) respaldado con passphrase de longitud: ${passphrase?.length || 0}`)
  }
  const clearCloud = async () => { alert('(demo) respaldo en nube eliminado') }
  const clearLocal = () => {
    try { localStorage.removeItem('local_history_messages') } catch {}
    setMessages([{ role: 'assistant', content: 'He borrado tu historial local. ¿Comenzamos de nuevo?', ts: Date.now() }])
  }
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ messages, pronoun, nickname }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'safe-chat-history.json'
    a.click()
    URL.revokeObjectURL(url)
  }
  const importJson = async (file) => {
    try {
      const txt = await file.text()
      const data = JSON.parse(txt)
      if (Array.isArray(data.messages)) setMessages(data.messages)
      if (data.pronoun) setPronoun(data.pronoun)
      if (data.nickname) setNickname(data.nickname)
      alert('Historial importado.')
    } catch {
      alert('Archivo inválido.')
    }
  }

  /* envío principal */
  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return

    const mine = { role: 'user', content: text, ts: Date.now() }
    setMessages(prev => [...prev, mine])
    setInput('')

    if (isCrisis(text)) {
      setCrisisMode(true)
      setShowResources(true)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Lamento que estés pasando por un momento tan difícil 💙. No estás solo/a. Si estás en peligro inmediato, llama al 911. En México puedes comunicarte 24/7 a la Línea de la Vida: 800 911 2000. Puedo seguir aquí para leerte.',
          ts: Date.now(),
        },
      ])
      return
    }

    setTyping(true)
    try {
      const payload = { user_id: userId, messages: trimmedContext([...messages, mine]), meta: { pronoun, nickname } }
      const data = await chatApi.send(payload)
      const assistant = data?.message ?? { role: 'assistant', content: 'Lo siento, no pude responder ahora.' }
      setMessages(prev => [...prev, { ...assistant, ts: Date.now() }])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Ahora mismo tengo problemas para responder. Podemos intentar de nuevo en un momento o usar una técnica breve de respiración si te parece.',
          ts: Date.now(),
          status: 'error',
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const needsOnboarding = !onboardingDone

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-2xl p-4 md:p-6">
        <Card className="rounded-3xl shadow-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800">
          <CardContent className="p-0 flex flex-col h-[85vh]">

            <Header
              onOpenSettings={() => setSettingsOpen(true)}
              crisisMode={crisisMode}
              darkMode={darkMode}
              toggleDark={toggleDark}
            />

            {/* Recursos (alerta compacta) */}
            {showResources && (
              <div className="mx-4 mt-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-slate-800 dark:text-slate-100">
                <div className="font-medium">Recursos de ayuda inmediata</div>
                <ul className="ml-5 list-disc">
                  <li><b>Emergencias:</b> 911</li>
                  <li><b>Línea de la Vida (MX, 24/7):</b> 800 911 2000</li>
                </ul>
                <p className="mt-1">Puedo seguir aquí para leerte si lo necesitas.</p>
              </div>
            )}

            {/* Lista de mensajes con separadores de fecha */}
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 md:px-4 py-3 space-y-3 scroll-smooth">
              {messages.map((m, i) => {
                const prev = messages[i - 1]
                const showDivider = !prev || !sameDay(prev.ts || Date.now(), m.ts || Date.now())
                return (
                  <React.Fragment key={i}>
                    {showDivider && (
                      <div className="my-2 flex items-center justify-center">
                        <span className="px-3 py-1 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-full">
                          {dayLabel(m.ts || Date.now())}
                        </span>
                      </div>
                    )}
                    <ChatBubble
                      role={m.role === 'assistant' ? 'assistant' : 'user'}
                      content={m.content}
                      ts={m.ts}
                      status={m.status || 'sent'}
                      maxWidthPct={88}
                      className="fade-in-up"
                    />
                  </React.Fragment>
                )
              })}

              {typing && <ChatBubble role="assistant" status="typing" showTimestamp={false} content="" className="fade-in-up" />}
            </div>

            {/* Input bar – sticky bottom (pill) */}
            <div className="sticky bottom-0 border-t border-slate-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-3 md:px-4 py-3 rounded-b-3xl">
              <div className="flex gap-2">
                <Input
                  className="h-11 flex-1 rounded-2xl border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-gray-100 placeholder:text-slate-400 dark:placeholder:text-gray-400"
                  placeholder="Escribe aquí…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                />
                <Button className="h-11 rounded-2xl px-4" onClick={sendMessage} disabled={typing}>
                  {typing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar'}
                </Button>
              </div>
              <div className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                ⚠️ Este espacio no sustituye atención profesional. Si estás en crisis, llama al <b>911</b> o a la <b>Línea de la Vida: 800 911 2000</b>.
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Ajustes */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        localEnabled={localEnabled}
        setLocalEnabled={setLocalEnabled}
        cloudEnabled={cloudEnabled}
        setCloudEnabled={setCloudEnabled}
        onCloudSave={(pass) => alert(`(demo) guardar nube: ${pass?.length || 0}`)}
        onCloudClear={() => alert('(demo) borrar nube')}
        onLocalClear={clearLocal}
        onExport={exportJson}
        onImport={importJson}
        pronoun={pronoun}
        setPronoun={setPronoun}
        nickname={nickname}
        setNickname={setNickname}
      />

      {/* Onboarding modal */}
      {needsOnboarding && (
        <Onboarding
          pronoun={pronoun}
          setPronoun={setPronoun}
          nickname={nickname}
          setNickname={setNickname}
          // 👇 NUEVO: cuando presiona “Empezar”
          onStart={() => {
            setOnboardingDone(true)
            localStorage.setItem('onboarding_done', '1')
          }}
        />
      )}
    </div>
  )
}
