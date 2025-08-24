import React from 'react'
import PropTypes from 'prop-types'
import { Check, XCircle, Bot, User } from 'lucide-react'

function linkify(text = '') {
  const urlRegex = /((https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?)/gi
  return text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      const href = part.startsWith('http') ? part : `https://${part}`
      return (
        <a key={i} href={href} target="_blank" rel="noreferrer" className="underline decoration-slate-400 break-words">
          {part}
        </a>
      )
    }
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

function formatTime(ts) {
  if (!ts) return ''
  const d = typeof ts === 'number' ? new Date(ts) : ts
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatBubble({
  role,
  content = '',
  ts,
  status = 'sent',
  showTimestamp = true,
  showAvatar = true,
  onRetry,
  maxWidthPct = 88,
  className,
  ...rest
}) {
  const isAssistant = role === 'assistant'
  const isTyping = status === 'typing'
  const container = `flex w-full gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`
  const bubble = `px-3 py-2 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
    isAssistant
      ? 'bg-white text-slate-900 border border-slate-200'
      : 'bg-emerald-50 text-slate-900 border border-emerald-100'
  }`
  const meta = `mt-1 flex items-center gap-2 text-[11px] text-slate-500 ${isAssistant ? 'justify-start' : 'justify-end'}`
  const avatarAssist = 'mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700'
  const avatarUser   = 'mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-200 text-emerald-800'
  const wrapperStyle = { maxWidth: `${maxWidthPct}%` }

  return (
    <div className={container} {...rest}>
      {showAvatar && isAssistant && (
        <div aria-hidden className={avatarAssist}>
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={`flex flex-col ${className || ''}`} style={wrapperStyle}>
        <div className={`${bubble} fade-in-up`} role="status" aria-live={isTyping ? 'polite' : 'off'}>
          {isTyping ? (
            <span className="inline-flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
              </span>
              Escribiendo…
            </span>
          ) : (
            linkify(content)
          )}
        </div>

        {(showTimestamp || status === 'error' || status === 'delivered') && (
          <div className={meta}>
            {showTimestamp && <span>{formatTime(ts)}</span>}
            {status === 'delivered' && (
              <span className="inline-flex items-center gap-1">
                <Check className="h-3 w-3" /> entregado
              </span>
            )}
            {status === 'error' && (
              <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 text-red-600 hover:underline">
                <XCircle className="h-3 w-3" />
                reintentar
              </button>
            )}
          </div>
        )}
      </div>

      {showAvatar && !isAssistant && (
        <div aria-hidden className={avatarUser}>
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

ChatBubble.propTypes = {
  role: PropTypes.oneOf(['assistant', 'user']).isRequired,
  content: PropTypes.string,
  ts: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]),
  status: PropTypes.oneOf(['sent', 'delivered', 'error', 'typing']),
  showTimestamp: PropTypes.bool,
  showAvatar: PropTypes.bool,
  onRetry: PropTypes.func,
  maxWidthPct: PropTypes.number,
  className: PropTypes.string,
}
