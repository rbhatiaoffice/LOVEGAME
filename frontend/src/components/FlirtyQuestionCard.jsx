import { motion } from 'framer-motion'
import TypewriterText from './TypewriterText'

function FlirtyQuestionCard({ step, stepCount, totalSteps, onChoose }) {
  return (
    <section className="flirty-card overflow-hidden rounded-[2rem] border border-rose-200/60 bg-white/85 shadow-2xl backdrop-blur-md">
      <div className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-fuchsia-50 px-6 py-4 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-600">
          Spicy chapter {stepCount} of {totalSteps} 🌶️
        </p>
        <p className="mt-1 text-sm text-rose-600/90">For Khushi’s eyes only — answer like nobody’s watching 😏</p>
      </div>

      <div className="p-6 sm:p-10">
        <h2 className="text-pretty text-2xl font-bold leading-snug text-slate-800 sm:text-3xl">
          {step.question}
        </h2>
        <p className="mt-4 text-sm italic text-slate-500 sm:text-base">
          <TypewriterText text={step.storyLine} />
        </p>

        <div className="mt-6 grid gap-3">
          {step.options.map((option) => (
            <motion.button
              key={option.label}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChoose(option.label)}
              className="rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50 to-fuchsia-50/80 px-5 py-4 text-left font-medium text-slate-700 shadow-sm transition hover:border-fuchsia-300 hover:shadow-md"
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FlirtyQuestionCard
