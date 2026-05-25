import { motion } from 'framer-motion'

function Landing({ onStart }) {
  return (
    <div className="hero-layout">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel-dark p-8 sm:p-10"
      >
        <span className="hero-badge">Khushi&apos;s favorite color</span>
        <h1 className="font-serif mt-6 text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          A sky painted
          <br />
          <span className="text-[#ffd89b]">just for you</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
          Hi Khushi — Rishi built this little world where every question is a love note, every
          answer reaches his heart, and the last page holds something he has waited to ask you.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
          <span className="rounded-lg bg-white/10 px-3 py-1.5">9 moments</span>
          <span className="rounded-lg bg-white/10 px-3 py-1.5">Romantic & funny</span>
          <span className="rounded-lg bg-white/10 px-3 py-1.5">One forever question</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="glass-panel flex flex-col justify-center p-8 sm:p-10"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-horizon">From Rishi</p>
        <blockquote className="font-serif mt-4 text-2xl leading-snug text-ink sm:text-3xl">
          &ldquo;You are the sky I look up to — calm, endless, and the most beautiful part of my
          day.&rdquo;
        </blockquote>
        <p className="mt-6 text-ink-soft leading-relaxed">
          Walk through each chapter at your pace. Pick the answers that feel true — he wants you to
          feel loved, seen, and sure that his heart is entirely yours.
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="btn-primary mt-8 w-full sm:w-auto"
        >
          Open your sky diary
          <span aria-hidden>→</span>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Landing
