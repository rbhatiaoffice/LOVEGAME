import { useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing'
import LoveGame from './components/LoveGame'
import FinalProposal from './components/FinalProposal'
import FloatingHearts from './components/FloatingHearts'
import MusicToggle from './components/MusicToggle'
import { HEART_TARGET } from './data/gameConfig'

function App() {
  const [phase, setPhase] = useState('landing')
  const [heartsCaught, setHeartsCaught] = useState(0)
  const [yesStatus, setYesStatus] = useState('idle')
  const [yesMessage, setYesMessage] = useState('')

  const fireCelebration = () => {
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.65 } })
    confetti({ particleCount: 70, angle: 55, spread: 60, origin: { x: 0 } })
    confetti({ particleCount: 70, angle: 125, spread: 60, origin: { x: 1 } })
  }

  const handleYes = async () => {
    const logPrefix = '[love-journey-frontend]'
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
    const sendEmailUrl = `${apiBase}/send-email`

    setYesStatus('loading')
    setYesMessage('Sending a love update to Rishi... 💌')
    fireCelebration()

    console.log(`${logPrefix} Yes clicked — sending email request`, {
      apiBase,
      sendEmailUrl,
      viteApiUrlSet: Boolean(import.meta.env.VITE_API_URL),
    })

    try {
      const response = await fetch(sendEmailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'She said YES! 💍',
          proposalAccepted: true,
          answers: [
            {
              question: 'Heart catcher game',
              answer: `Caught ${heartsCaught} / ${HEART_TARGET} hearts`,
            },
          ],
        }),
      })

      let responseBody = null
      try {
        responseBody = await response.json()
      } catch {
        responseBody = { parseError: 'Response was not JSON' }
      }

      console.log(`${logPrefix} email API response`, {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: responseBody,
      })

      if (!response.ok) {
        const detail = responseBody?.details || responseBody?.error || response.statusText
        throw new Error(`Email API failed (${response.status}): ${detail}`)
      }

      setYesStatus('success')
      setYesMessage('Perfect! The email has been sent to Rishi. Forever starts now. ❤️')
    } catch (error) {
      console.error(`${logPrefix} email request failed`, {
        name: error?.name,
        message: error?.message,
        cause: error?.cause,
      })
      setYesStatus('error')
      setYesMessage('You still said yes, but the email failed. Retry once and we are golden. 💕')
    }
  }

  return (
    <main className="app-root relative min-h-screen overflow-hidden text-slate-800">
      <FloatingHearts />
      <MusicToggle />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-6 sm:px-8">
        <p className="text-sm font-semibold tracking-wide text-rose-700/90">
          <span className="text-lg">💕</span> Khushi & Rishi
        </p>
        {phase === 'game' && (
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-fuchsia-700 shadow-sm">
            Game on
          </span>
        )}
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center p-4 pb-10 sm:p-8">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <Landing onStart={() => setPhase('game')} />
            </motion.div>
          )}

          {phase === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <LoveGame
                onScoreChange={setHeartsCaught}
                onComplete={(finalScore) => {
                  setHeartsCaught(finalScore)
                  setPhase('proposal')
                }}
              />
            </motion.div>
          )}

          {phase === 'proposal' && (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-2xl"
            >
              <FinalProposal
                heartsCaught={heartsCaught}
                status={yesStatus}
                message={yesMessage}
                onYes={handleYes}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App
