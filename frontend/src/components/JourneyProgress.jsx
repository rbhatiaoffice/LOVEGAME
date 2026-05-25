function JourneyProgress({ phase, questionStep, totalSteps }) {
  const steps = [
    { id: 'start', label: 'Begin' },
    ...Array.from({ length: totalSteps }, (_, i) => ({
      id: `q-${i}`,
      label: `Moment ${i + 1}`,
    })),
    { id: 'finale', label: 'Forever' },
  ]

  const activeIndex =
    phase === 'landing'
      ? 0
      : phase === 'questions'
        ? questionStep + 1
        : phase === 'proposal'
          ? steps.length - 1
          : 0

  return (
    <>
      <nav className="journey-rail" aria-label="Journey progress">
        <p className="journey-rail-title">Your sky path</p>
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const isDone = index < activeIndex
          return (
            <div
              key={step.id}
              className={`rail-step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
            >
              <span className="rail-dot" />
              <span>{step.label}</span>
            </div>
          )
        })}
      </nav>

      <div className="mobile-progress" role="progressbar" aria-valuenow={activeIndex} aria-valuemin={0} aria-valuemax={steps.length - 1}>
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={`mobile-progress-segment ${index === activeIndex ? 'is-active' : ''} ${index < activeIndex ? 'is-done' : ''}`}
            title={step.label}
          />
        ))}
      </div>
    </>
  )
}

export default JourneyProgress
