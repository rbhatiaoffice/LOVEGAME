import { useState } from 'react'
import { motion } from 'framer-motion'

function randomPosition() {
  return {
    x: Math.floor(Math.random() * 140) - 70,
    y: Math.floor(Math.random() * 100) - 50,
  }
}

function FinalProposal({ status, message, onYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })

  const moveNoButton = () => setNoPosition(randomPosition())

  return (
    <div className="proposal-stage">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel-dark p-8 sm:p-12"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#ffd89b]">
          The last page
        </p>

        <h2 className="font-serif mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
          Khushi,
          <br />
          will you marry me?
        </h2>

        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/85">
          Under every sky we will ever see, my answer is the same — I love you, completely. Be my
          forever, my home, my always.
        </p>

        <div className="relative mx-auto mt-10 flex min-h-[7rem] max-w-sm flex-wrap items-center justify-center gap-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            disabled={status === 'loading'}
            onClick={onYes}
            className="btn-primary disabled:opacity-70"
          >
            {status === 'loading' ? 'Sending…' : 'Yes, forever 💍'}
          </motion.button>

          <motion.button
            type="button"
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            onMouseEnter={moveNoButton}
            onFocus={moveNoButton}
            onClick={moveNoButton}
            className="btn-ghost"
          >
            No 😜
          </motion.button>
        </div>

        {message && (
          <p
            className={`mx-auto mt-6 max-w-md rounded-xl px-4 py-3 text-sm ${
              status === 'error'
                ? 'bg-amber-500/20 text-amber-100'
                : 'bg-white/10 text-white/90'
            }`}
          >
            {message}
          </p>
        )}
      </motion.div>

      <p className="mt-6 text-center text-sm text-white/50">
        Built with all of Rishi&apos;s love · your sky, your story
      </p>
    </div>
  )
}

export default FinalProposal
