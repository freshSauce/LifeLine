import React, { useRef, useState } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Settings, Upload, Download, X } from 'lucide-react'
import PropTypes from 'prop-types'


const PRONOUNS = ['ella', 'él', 'ellx', 'otro']

export default function SettingsPanel({
  open,
  onClose,
  localEnabled,
  setLocalEnabled,
  cloudEnabled,
  setCloudEnabled,
  onCloudSave,
  onCloudClear,
  onLocalClear,
  onExport,
  onImport,
  pronoun,
  setPronoun,
  nickname,
  setNickname,
}) {
  const [passphrase, setPassphrase] = useState('')
  const fileRef = useRef(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-xl">
        <CardContent className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Ajustes</h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="gap-1">
              <X className="h-4 w-4" />
              Cerrar
            </Button>
          </div>

          <section className="space-y-3">
            <h3 className="font-medium">Identidad y trato</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm">Pronombres</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRONOUNS.map((p) => (
                    <Button
                      key={p}
                      variant={pronoun === p ? 'default' : 'secondary'}
                      className="text-xs"
                      onClick={() => setPronoun(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                {pronoun === 'otro' && (
                  <Input
                    className="mt-2"
                    placeholder="Escribe tus pronombres"
                    onChange={(e) => setPronoun(e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="text-sm">Apodo (opcional)</label>
                <Input
                  placeholder="Cómo te llamo aquí"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-medium">Privacidad</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm">Guardar historial en este dispositivo</span>
              <Button
                variant={localEnabled ? 'default' : 'secondary'}
                className="text-xs"
                onClick={() => setLocalEnabled(!localEnabled)}
              >
                {localEnabled ? 'Activado' : 'Desactivado'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Respaldo cifrado en la nube (beta)</span>
              <Button
                variant={cloudEnabled ? 'default' : 'secondary'}
                className="text-xs"
                onClick={() => setCloudEnabled(!cloudEnabled)}
              >
                {cloudEnabled ? 'Activado' : 'Desactivado'}
              </Button>
            </div>

            {cloudEnabled && (
              <div className="grid items-end gap-2 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-sm">Frase de acceso (no la pierdas)</label>
                  <Input
                    type="password"
                    placeholder="mín. 8 caracteres"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                </div>
                <Button onClick={() => onCloudSave(passphrase)} disabled={passphrase.length < 8}>
                  Guardar en nube
                </Button>
              </div>
            )}
          </section>

          <section className="grid gap-2 sm:grid-cols-3">
            <Button variant="secondary" onClick={onLocalClear}>Borrar historial local</Button>
            <Button variant="secondary" onClick={onCloudClear}>Borrar respaldo nube</Button>
            <Button
              variant="destructive"
              onClick={() => { onLocalClear(); onCloudClear() }}
            >
              Borrar todo
            </Button>
          </section>

          <section className="grid gap-2 sm:grid-cols-2">
            <Button onClick={onExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar .json
            </Button>

            <div>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) onImport(f)
                }}
              />
              <Button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 w-full">
                <Upload className="h-4 w-4" />
                Importar .json
              </Button>
            </div>
          </section>

          <p className="text-xs text-gray-500">
            ⚠️ Este espacio no sustituye atención profesional. Si estás en crisis, llama al <b>911</b> o a la <b>Línea de la Vida: 800 911 2000</b>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

SettingsPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  localEnabled: PropTypes.bool.isRequired,
  setLocalEnabled: PropTypes.func.isRequired,
  cloudEnabled: PropTypes.bool.isRequired,
  setCloudEnabled: PropTypes.func.isRequired,
  onCloudSave: PropTypes.func.isRequired,
  onCloudClear: PropTypes.func.isRequired,
  onLocalClear: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  pronoun: PropTypes.string.isRequired,
  setPronoun: PropTypes.func.isRequired,
  nickname: PropTypes.string,
  setNickname: PropTypes.func.isRequired,
}