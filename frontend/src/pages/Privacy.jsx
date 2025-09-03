import React from 'react'
import { Button } from '@/components/ui/button'

const Section = ({ id, title, children, defaultOpen = true }) => (
  <details id={id} open={defaultOpen} className="group border border-slate-200 dark:border-gray-700 rounded-xl">
    <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between gap-3">
      <span className="font-semibold text-slate-900 dark:text-gray-100">{title}</span>
      <span className="text-slate-500 dark:text-gray-400 text-sm group-open:hidden">ver más</span>
      <span className="text-slate-500 dark:text-gray-400 text-sm hidden group-open:inline">ver menos</span>
    </summary>
    <div className="px-4 pb-4 text-sm text-slate-700 dark:text-gray-300 space-y-3">
      {children}
    </div>
  </details>
)

export default function Privacy() {
  const date = new Date().toLocaleDateString()

  const goBack = () => {
    if (window.history.length > 1) window.history.back()
    else window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-slate-200 dark:border-gray-700">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 dark:text-gray-100">Política de Privacidad & Consentimiento</h1>
          <Button variant="secondary" className="text-xs" onClick={goBack}>Volver</Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Intro */}
        <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-gray-400">Última actualización: {date}</p>
          <p className="mt-3 text-slate-800 dark:text-gray-200">
            Gracias por confiar en este espacio seguro. Aquí explicamos de forma clara cómo tratamos tu información
            y qué puedes esperar del servicio.
          </p>
        </div>

        {/* Índice */}
        <nav className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="font-semibold text-slate-900 dark:text-gray-100 mb-2">Contenido</div>
          <ol className="list-decimal ml-5 text-sm text-slate-700 dark:text-gray-300 grid md:grid-cols-2 gap-y-1">
            <li><a className="underline hover:no-underline" href="#proposito">Propósito</a></li>
            <li><a className="underline hover:no-underline" href="#datos">Qué datos se recogen</a></li>
            <li><a className="underline hover:no-underline" href="#almacen">Dónde se guardan</a></li>
            <li><a className="underline hover:no-underline" href="#acceso">Quién accede</a></li>
            <li><a className="underline hover:no-underline" href="#derechos">Tus derechos</a></li>
            <li><a className="underline hover:no-underline" href="#limitaciones">Limitaciones y riesgos</a></li>
            <li><a className="underline hover:no-underline" href="#crisis">En caso de crisis</a></li>
            <li><a className="underline hover:no-underline" href="#contacto">Contacto</a></li>
          </ol>
        </nav>

        {/* Secciones */}
        <Section id="proposito" title="1. Propósito">
          <p>
            Este servicio ofrece un <b>lugar anónimo y seguro</b> para desahogarte y recibir acompañamiento emocional básico.
            No es terapia psicológica ni sustituye atención profesional o médica.
            Las respuestas son generadas por un modelo de lenguaje (IA).
          </p>
        </Section>

        <Section id="datos" title="2. Qué datos se recogen">
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <b>Identificador anónimo</b> generado en tu dispositivo (p. ej., <code>anon_user_id</code>) para mantener continuidad.
            </li>
            <li>
              <b>Opcional</b>: pronombres y apodo, solo para dirigirte con cercanía.
            </li>
            <li>
              <b>Conversaciones</b>: por defecto se guardan en tu dispositivo. Si activas respaldo en nube, se cifran de extremo a extremo con una contraseña
              que solo tú conoces (el servidor no puede leerlas).
            </li>
          </ul>
        </Section>

        <Section id="almacen" title="3. Dónde se guardan">
          <ul className="list-disc ml-5 space-y-1">
            <li><b>Local</b>: en tu navegador (localStorage).</li>
            <li>
              <b>Nube (opcional)</b>: copias cifradas. Si pierdes tu contraseña, no podremos recuperar tu contenido (diseño por privacidad).
            </li>
          </ul>
        </Section>

        <Section id="acceso" title="4. Quién accede">
          <p>
            Nadie más que tú. El equipo de desarrollo no lee tus conversaciones. Si eliges la nube, el contenido permanece cifrado de forma que
            el servidor no puede descifrarlo sin tu contraseña.
          </p>
        </Section>

        <Section id="derechos" title="5. Tus derechos">
          <ul className="list-disc ml-5 space-y-1">
            <li><b>Borrar</b> tu historial local y/o respaldos en nube desde Ajustes, en cualquier momento.</li>
            <li><b>Exportar</b> tus datos a un archivo <code>.json</code>.</li>
            <li><b>Desactivar</b> el guardado en local o la nube cuando quieras.</li>
          </ul>
        </Section>

        <Section id="limitaciones" title="6. Limitaciones y riesgos">
          <ul className="list-disc ml-5 space-y-1">
            <li>La IA puede cometer errores o no ser adecuada para casos clínicos.</li>
            <li>Este servicio no ofrece diagnósticos ni recomendaciones médicas.</li>
            <li>En crisis, prioriza buscar ayuda profesional y recursos de emergencia.</li>
          </ul>
        </Section>

        <Section id="crisis" title="7. En caso de crisis">
          <p>
            Si estás en riesgo inmediato o piensas en hacerte daño, por favor detén la conversación y busca ayuda de inmediato:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li><b>Emergencias México:</b> 911</li>
            <li><b>Línea de la Vida (24/7):</b> 800 911 2000</li>
          </ul>
          <p className="mt-1">No estás solo/a. Pedir ayuda está bien 💙.</p>
        </Section>

        <Section id="contacto" title="8. Contacto" defaultOpen={false}>
          <p>
            Si tienes dudas sobre esta política o quieres hacernos comentarios, puedes escribir al equipo del proyecto.
            (En pilotos tempranos quizá no haya correo dedicado: puedes enlazar un repositorio o formulario).
          </p>
        </Section>

        {/* Footer simple */}
        <div className="pb-10 text-center text-xs text-slate-500 dark:text-gray-400">
          © {new Date().getFullYear()} Espacio Seguro. Todos los derechos reservados.
        </div>
      </main>
    </div>
  )
}
