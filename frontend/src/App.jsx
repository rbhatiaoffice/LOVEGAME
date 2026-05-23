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
    const lastChoice = answerLog[answerLog.length - 1].answer
    return `Latest chapter unlocked: "${lastChoice}" ✨`
  }, [answerLog])

  const handleChoice = (choiceLabel) => {
    const step = storySteps[currentStep]
    setAnswerLog((prev) => [
      ...prev,
      { question: step.question, answer: choiceLabel },
    ])
    setCurrentStep((prev) => prev + 1)
  }

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
          answers: answerLog,
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
