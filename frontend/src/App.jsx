import { useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing'
import QuestionCard from './components/QuestionCard'
import FinalProposal from './components/FinalProposal'
import FloatingHearts from './components/FloatingHearts'
import MusicToggle from './components/MusicToggle'
import { storySteps } from './data/storySteps'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answerLog, setAnswerLog] = useState([])
  const [yesStatus, setYesStatus] = useState('idle')
  const [yesMessage, setYesMessage] = useState('')

  const isFinalStep = currentStep >= storySteps.length
  const currentQuestion = storySteps[currentStep]

  const memoryText = useMemo(() => {
    if (answerLog.length === 0) return 'Our story starts with one click and a million smiles.'
    const lastChoice = answerLog[answerLog.length - 1]
    return `Latest chapter unlocked: "${lastChoice}" ✨`
  }, [answerLog])

  const handleChoice = (choiceLabel) => {
    setAnswerLog((prev) => [...prev, choiceLabel])
    setCurrentStep((prev) => prev + 1)
  }

  const fireCelebration = () => {
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.65 } })
    confetti({ particleCount: 70, angle: 55, spread: 60, origin: { x: 0 } })
    confetti({ particleCount: 70, angle: 125, spread: 60, origin: { x: 1 } })
  }

  const handleYes = async () => {
    setYesStatus('loading')
    setYesMessage('Sending a love update to Rishi... 💌')
    fireCelebration()

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/send-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: 'She said YES! 💍',
            text: 'Khushi accepted your proposal!',
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Email API request failed')
      }

      setYesStatus('success')
      setYesMessage('Perfect! The email has been sent to Rishi. Forever starts now. ❤️')
    } catch {
      setYesStatus('error')
      setYesMessage('You still said yes, but the email failed. Retry once and we are golden. 💕')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-fuchsia-100 to-violet-100 text-slate-800">
      <FloatingHearts />
      <MusicToggle />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <Landing onStart={() => setHasStarted(true)} />
            </motion.div>
          ) : isFinalStep ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45 }}
              className="w-full"
            >
              <FinalProposal status={yesStatus} message={yesMessage} onYes={handleYes} />
            </motion.div>
          ) : (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -48 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <QuestionCard
                step={currentQuestion}
                stepCount={currentStep + 1}
                totalSteps={storySteps.length}
                memoryText={memoryText}
                onChoose={handleChoice}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App
