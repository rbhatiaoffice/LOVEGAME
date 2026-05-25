import { useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import SkyBackdrop from './components/SkyBackdrop'
import JourneyProgress from './components/JourneyProgress'
import Landing from './components/Landing'
import QuestionCard from './components/QuestionCard'
import FinalProposal from './components/FinalProposal'
import MusicToggle from './components/MusicToggle'
import { romanticSteps } from './data/romanticSteps'

const loveNotes = [
  'Every answer you pick reminds me why you are my forever.',
  'You are the reason I smile at my phone like an idiot.',
  'I would choose you in every timeline, every universe.',
  'Your happiness is literally my favorite hobby.',
  'You make ordinary days feel like our own little fairytale.',
  'I am not perfect — but loving you? I am world-class at that.',
  'You are my home, my peace, and my favorite adventure.',
  'Thank you for being you. I love you more than words can carry.',
  'You are proof that the best things in life are not things — they are you.',
]

function App() {
  const [phase, setPhase] = useState('landing')
  const [questionStep, setQuestionStep] = useState(0)
  const [answerLog, setAnswerLog] = useState([])
  const [yesStatus, setYesStatus] = useState('idle')
  const [yesMessage, setYesMessage] = useState('')

  const currentQuestion = romanticSteps[questionStep]

  const memoryText = useMemo(() => {
    if (answerLog.length === 0) {
      return 'Rishi built this sky because loving you is the truest thing he has ever known. ☁️💙'
    }
    const note = loveNotes[Math.min(answerLog.length - 1, loveNotes.length - 1)]
    const last = answerLog[answerLog.length - 1].answer
    return `${note} — You chose: "${last}"`
  }, [answerLog])

  const handleChoice = (choiceLabel) => {
    const step = romanticSteps[questionStep]
    setAnswerLog((prev) => [...prev, { question: step.question, answer: choiceLabel }])
    const next = questionStep + 1
    if (next >= romanticSteps.length) {
      setPhase('proposal')
    } else {
      setQuestionStep(next)
    }
  }

  const fireCelebration = () => {
    confetti({ particleCount: 200, spread: 110, origin: { y: 0.6 }, colors: ['#7eb8e8', '#ffd89b', '#ffffff'] })
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#3d7ab8', '#ffd89b'] })
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#3d7ab8', '#ffd89b'] })
  }

  const handleYes = async () => {
    const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
    setYesStatus('loading')
    setYesMessage('Sending your yes to Rishi… 💌')
    fireCelebration()

    try {
      const response = await fetch(`${apiBase}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'She said YES! 💍',
          proposalAccepted: true,
          answers: answerLog,
        }),
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(body?.details || body?.error || response.statusText)
      }
      setYesStatus('success')
      setYesMessage('Your yes reached Rishi. Forever starts now. ❤️')
    } catch {
      setYesStatus('error')
      setYesMessage('You still said yes — try sending again once. Rishi already knows. 💕')
    }
  }

  return (
    <>
      <SkyBackdrop />
      <div className="app-frame">
        <header className="app-topbar">
          <div>
            <p className="font-serif text-lg font-semibold text-white sm:text-xl">
              Khushi <span className="text-white/40">×</span> Rishi
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">A sky for you</p>
          </div>
          <MusicToggle />
        </header>

        <div className="app-body">
          <JourneyProgress
            phase={phase}
            questionStep={questionStep}
            totalSteps={romanticSteps.length}
          />

          <main className="stage">
            <AnimatePresence mode="wait">
              {phase === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <Landing onStart={() => setPhase('questions')} />
                </motion.div>
              )}

              {phase === 'questions' && currentQuestion && (
                <motion.div
                  key={`q-${questionStep}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="w-full"
                >
                  <QuestionCard
                    step={currentQuestion}
                    stepCount={questionStep + 1}
                    totalSteps={romanticSteps.length}
                    memoryText={memoryText}
                    onChoose={handleChoice}
                  />
                </motion.div>
              )}

              {phase === 'proposal' && (
                <motion.div
                  key="proposal"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="w-full"
                >
                  <FinalProposal status={yesStatus} message={yesMessage} onYes={handleYes} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  )
}

export default App
