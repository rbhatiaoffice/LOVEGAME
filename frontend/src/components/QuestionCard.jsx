import { motion } from 'framer-motion'
import TypewriterText from './TypewriterText'

function QuestionCard({ step, stepCount, totalSteps, memoryText, onChoose }) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500">
        Chapter {stepCount} of {totalSteps}
      </p>
      <h2 className="mt-3 text-pretty text-2xl font-bold leading-snug text-slate-800 sm:text-3xl">
        {step.question}
      </h2>
      <p className="mt-4 text-sm text-slate-500 sm:text-base">
        <TypewriterText text={step.storyLine} />
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {step.options.map((option) => (
          <motion.button
            key={option.label}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChoose(option.label)}
            className="rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-fuchsia-50 px-4 py-3 text-left font-medium text-slate-700 shadow-sm transition hover:border-rose-200 hover:shadow-md"
          >
            <span>{option.label}</span>
          </motion.button>
        ))}
      </div>

      <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{memoryText}</p>
    </section>
  )
}

export default QuestionCard
