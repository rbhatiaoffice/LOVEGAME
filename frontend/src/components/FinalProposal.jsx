import { useState } from 'react'
import { motion } from 'framer-motion'
import { HEART_TARGET } from '../data/gameConfig'

function randomPosition() {
  return {
    x: Math.floor(Math.random() * 160) - 80,
    y: Math.floor(Math.random() * 120) - 60,
  }
}

function FinalProposal({ heartsCaught, status, message, onYes }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })

  const moveNoButton = () => {
    setNoPosition(randomPosition())
  }

  return (
    <section className="proposal-card rounded-[2rem] border border-white/60 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-md sm:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-500">
        You won the game
      </p>
      <p className="mt-2 text-sm text-rose-600">
        {heartsCaught} hearts caught — mission complete 💕
      </p>

      <h2 className="mt-4 text-balance text-3xl font-bold text-slate-800 sm:text-5xl">
        Khushi, will you marry me? 💍
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-slate-600">
        You are my favorite person, my daily smile, and my forever home. Every heart you caught
        is one more reason I choose you — in every chapter, forever.
      </p>

      <div className="relative mx-auto mt-10 flex h-36 max-w-md items-center justify-center gap-4">
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
          className={`mx-auto mt-6 max-w-xl rounded-xl px-4 py-3 text-sm ${
            status === 'error' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-6 text-xs text-slate-400">Built with love by Rishi · target was {HEART_TARGET} hearts</p>
    </section>
  )
}

export default FinalProposal
