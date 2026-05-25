import { motion } from 'framer-motion'
import TypewriterText from './TypewriterText'

function QuestionCard({ step, stepCount, totalSteps, memoryText, onChoose }) {
  const progress = Math.round((stepCount / totalSteps) * 100)

  return (
    <div className="question-layout">
      <motion.aside
        key={`aside-${stepCount}`}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel-dark p-6 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          Moment {stepCount}
        </p>
        <p className="font-serif mt-2 text-5xl font-bold text-[#ffd89b]">{progress}%</p>
        <p className="mt-1 text-sm text-white/60">of our sky journey</p>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ffd89b] to-[#7eb8e8]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="mt-8 text-sm italic leading-relaxed text-white/75">
          <TypewriterText text={step.storyLine} speed={18} />
        </p>
      </motion.aside>

      <motion.div
        key={`main-${stepCount}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sm:p-8"
      >
        <h2 className="font-serif text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          {step.question}
        </h2>

        <ul className="mt-6 flex flex-col gap-3">
          {step.options.map((option, i) => (
            <motion.li
              key={option.label}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <button type="button" onClick={() => onChoose(option.label)} className="choice-pill">
                <span className="mr-2 font-semibold text-sky-mid">{String.fromCharCode(65 + i)}.</span>
                {option.label}
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="love-whisper mt-6">{memoryText}</div>
      </motion.div>
    </div>
  )
}

export default QuestionCard
