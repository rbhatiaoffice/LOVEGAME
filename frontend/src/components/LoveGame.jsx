import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  HEART_LIFETIME_MS,
  HEART_SPAWN_MS,
  HEART_TARGET,
  MAX_VISIBLE_HEARTS,
} from '../data/gameConfig'

const HEART_EMOJIS = ['💕', '💖', '💗', '💝', '❤️', '🩷']

function LoveGame({ onComplete, onScoreChange }) {
  const [score, setScore] = useState(0)
  const [hearts, setHearts] = useState([])
  const [playing, setPlaying] = useState(false)
  const [won, setWon] = useState(false)
  const nextId = useRef(0)

  const removeHeart = useCallback((id) => {
    setHearts((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const spawnHeart = useCallback(() => {
    const id = nextId.current++
    const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
    const x = 8 + Math.random() * 76
    const y = 10 + Math.random() * 68

    setHearts((prev) => {
      const next = [...prev, { id, emoji, x, y }]
      return next.length > MAX_VISIBLE_HEARTS ? next.slice(-MAX_VISIBLE_HEARTS) : next
    })

    window.setTimeout(() => removeHeart(id), HEART_LIFETIME_MS)
  }, [removeHeart])

  useEffect(() => {
    if (!playing || won) return undefined
    spawnHeart()
    const interval = window.setInterval(spawnHeart, HEART_SPAWN_MS)
    return () => window.clearInterval(interval)
  }, [playing, won, spawnHeart])

  const catchHeart = (heart) => {
    removeHeart(heart.id)
    setScore((prev) => {
      const next = prev + 1
      onScoreChange?.(next)
      if (next >= HEART_TARGET && !won) {
        setWon(true)
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
        window.setTimeout(() => onComplete(next), 900)
      }
      return next
    })
  }

  const progress = Math.min(100, (score / HEART_TARGET) * 100)

  return (
    <section className="game-shell overflow-hidden rounded-[2rem] border border-white/50 bg-white/85 shadow-2xl backdrop-blur-md">
      <div className="game-grid">
        <aside className="game-sidebar border-b border-rose-100/80 p-6 sm:border-b-0 sm:border-r sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-fuchsia-500">
            Mini game
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">
            Catch the hearts, Khushi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Tap every floating heart before it fades. Collect {HEART_TARGET} to unlock the spicy
            questions — then the surprise.
          </p>

          <div className="mt-6">
            <div className="flex items-end justify-between text-sm font-medium text-slate-600">
              <span>Progress</span>
              <span className="text-rose-600">
                {score} / {HEART_TARGET}
              </span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-rose-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          {!playing && !won && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPlaying(true)}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-5 py-3 text-base font-semibold text-white shadow-lg"
            >
              Start catching 💕
            </motion.button>
          )}

          {playing && !won && (
            <p className="mt-6 rounded-xl bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-800">
              Hearts disappear fast — keep those taps ready!
            </p>
          )}

          {won && (
            <p className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              You did it! Spicy questions loading… 🌶️✨
            </p>
          )}
        </aside>

        <div className="game-arena relative min-h-[320px] flex-1 bg-gradient-to-br from-rose-50/90 via-white to-violet-50/80 p-4 sm:min-h-[420px] sm:p-6">
          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <span className="text-5xl">💗</span>
              <p className="max-w-xs text-sm text-slate-500">
                Press start — hearts will pop up here for you to catch.
              </p>
            </div>
          )}

          <AnimatePresence>
            {playing &&
              hearts.map((heart) => (
                <motion.button
                  key={heart.id}
                  type="button"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => catchHeart(heart)}
                  className="heart-token absolute select-none text-4xl sm:text-5xl"
                  style={{ left: `${heart.x}%`, top: `${heart.y}%` }}
                  aria-label="Catch heart"
                >
                  {heart.emoji}
                </motion.button>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default LoveGame
