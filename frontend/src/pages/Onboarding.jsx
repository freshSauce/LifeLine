import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const OPTIONS = ['ella', 'él', 'ellx', 'otro']

function Overlay({ children }) {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">{children}</div>,
    document.body
  )
}

export default function Onboarding({ pronoun, setPronoun, nickname, setNickname, onStart }) {
  const validPronoun =
    pronoun &&
    (pronoun !== 'otro' || (pronoun === 'otro' && !OPTIONS.includes(pronoun))) // si eligió “otro”, debe escribir algo

  return (
    <Overlay>
      <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-white dark:bg-black/40">
        <CardContent className="space-y-4 p-6">
          <div className="text-lg font-semibold text-slate-900 dark:text-gray-100">Bienvenida/o/x 🌿</div>
          <div className="text-sm text-slate-700 dark:text-gray-300">¿Con qué pronombres te identificas?</div>

          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((p) => (
              <Button
                key={p}
                variant={pronoun === p ? 'default' : 'secondary'}
                onClick={() => setPronoun(p)}
              >
                {p}
              </Button>
            ))}
          </div>

          {pronoun === 'otro' && (
            <Input
              autoFocus
              placeholder="Escribe tus pronombres"
              onChange={(e) => setPronoun(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 items-end gap-2 sm:grid-cols-2">
            <div>
              <label className="text-sm">Apodo (opcional)</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Cómo te llamo aquí"
              />
            </div>
            <Button
              onClick={() => {
                // marca finalizado solo aquí
                onStart?.()
              }}
              // solo habilita si hay pronombre válido
              disabled={!validPronoun}
            >
              Empezar
            </Button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Privacidad por defecto: tus datos viven en tu dispositivo y puedes borrarlos cuando quieras desde Ajustes.
            Al continuar, aceptas la <a className="text-slate-700" href="/privacy">política de privacidad y consentimiento</a>.

          </div>
        </CardContent>
      </Card>
    </Overlay>
  )
}

Onboarding.propTypes = {
  pronoun: PropTypes.string.isRequired,
  setPronoun: PropTypes.func.isRequired,
  nickname: PropTypes.string,
  setNickname: PropTypes.func.isRequired,
  onStart: PropTypes.func, // <- nuevo
}
