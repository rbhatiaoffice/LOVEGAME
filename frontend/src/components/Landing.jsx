import { motion } from 'framer-motion'

function Landing({ onStart }) {
  return (
    <section className="landing-shell overflow-hidden rounded-[2rem] border border-white/50 bg-white/80 shadow-2xl backdrop-blur-md">
      <div className="landing-grid">
        <div className="landing-hero bg-gradient-to-br from-rose-100/80 via-fuchsia-50 to-violet-100/70 p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
            Made for you
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
            Hey Khushi ❤️
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            Rishi built a tiny world just for you. Play a quick heart-catching game, then see what
            he has been saving for the finish.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-6 p-8 sm:p-12">
          <ul className="space-y-4 text-sm text-slate-600 sm:text-base">
            <li className="flex gap-3">
              <span className="text-xl" aria-hidden>
                🎮
              </span>
              <span>
                <strong className="text-slate-800">Catch the hearts</strong> — tap them before they
                fade away.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl" aria-hidden>
                ✨
              </span>
              <span>
                <strong className="text-slate-800">Unlock the surprise</strong> — win the game to
                open the final chapter.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-xl" aria-hidden>
                💍
              </span>
              <span>
                <strong className="text-slate-800">One special question</strong> — waiting at the
                end, just for you.
              </span>
            </li>
          </ul>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl sm:w-auto sm:self-start"
          >
            Play the game 💕
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default Landing
