import { useState } from 'react'
import { motion } from 'framer-motion'

function randomPosition() {
  return {
    x: Math.floor(Math.random() * 160) - 80,
    y: Math.floor(Math.random() * 120) - 60,
  }
}

function FinalProposal({ status, message, onYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })

  const moveNoButton = () => {
    setNoPosition(randomPosition())
  }

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-2xl backdrop-blur-sm sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-500">Final Chapter</p>
      <h2 className="mt-3 text-balance text-3xl font-bold text-slate-800 sm:text-5xl">
        Khushi, will you marry me? 💍
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-slate-600">
        You are my favorite person, my daily smile, and my forever home. Let us make every chapter
        even cuter together.
      </p>

      <div className="relative mx-auto mt-8 flex h-36 max-w-md items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.96 }}
          disabled={status === 'loading'}
          onClick={onYes}
          className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition disabled:opacity-70"
        >
          {status === 'loading' ? 'Sending...' : 'Yes ❤️'}
        </motion.button>

        <motion.button
          animate={{ x: noPosition.x, y: noPosition.y }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          onMouseEnter={moveNoButton}
          onClick={moveNoButton}
          className="rounded-full border border-fuchsia-200 bg-white px-6 py-3 font-semibold text-fuchsia-600 shadow-sm"
        >
          No 😜
        </motion.button>
      </div>

      {message && (
        <p
          className={`mx-auto mt-4 max-w-xl rounded-xl px-4 py-3 text-sm ${
            status === 'error' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {message}
        </p>
      )}
    </section>
  )
}

export default FinalProposal
