import { motion } from 'framer-motion'

function Landing({ onStart }) {
  return (
    <section className="rounded-3xl border border-white/60 bg-white/75 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-12">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-rose-500">
        A tiny universe for us
      </p>
      <h1 className="text-balance text-4xl font-bold leading-tight text-slate-800 sm:text-5xl">
        Hey Khushi ❤️, I have something special for you...
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-slate-600 sm:text-lg">
        Built with love by Rishi. Click through this playful journey and let us relive a few sweet
        moments before the big question.
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:shadow-xl"
      >
        Start the Journey
      </motion.button>
    </section>
  )
}

export default Landing
