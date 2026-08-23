function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#main-content">__APP_NAME__</a>
      </header>
      <main id="main-content">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">Vite Static template</p>
          <h1 id="page-title">__APP_NAME__</h1>
          <p className="description">__APP_DESCRIPTION__</p>
          <p>
            Deadline-Driven Lightweight SDD keeps a 24-hour MVP focused: settle the
            smallest complete experience before implementation, then retain every
            quality gate.
          </p>
          <a className="primary-action" href="#first-step">
            View the first step
          </a>
        </section>

        <section id="first-step" className="next-step" aria-labelledby="next-step-title">
          <h2 id="next-step-title">Start with the requirement input</h2>
          <p>
            Settle <code>docs/init-mvp-spec.md</code> with Claude Code, set its status
            to <code>CONFIRMED</code>, then ask Claude Code to read the file and
            implement it.
          </p>
        </section>
      </main>
      <footer>
        <p>Scope first. Quality stays.</p>
      </footer>
    </>
  )
}

export default App
