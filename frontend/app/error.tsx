'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="shell page-section">
      <div className="error-state" role="alert">
        <span className="eyebrow">ALGO NO SALIÓ COMO ESPERÁBAMOS</span>
        <h1>No pudimos cargar esta página.</h1>
        <p>Comprueba la conexión con la API e inténtalo de nuevo.</p>
        <button className="button button-primary" type="button" onClick={reset}>Volver a intentar</button>
      </div>
    </section>
  )
}
