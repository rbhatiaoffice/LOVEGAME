import { useEffect, useRef, useState } from 'react'

const MUSIC_FILE = '/music/romantic-bollywood.mp3.mp3'

function MusicToggle() {
  const [isOn, setIsOn] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(MUSIC_FILE)
    audio.preload = 'auto'
    audio.loop = true
    audio.volume = 0.3
    audio.addEventListener('error', () => {
      setStatusMessage('Music file not found. Expected /public/music/romantic-bollywood.mp3.mp3')
    })
    audioRef.current = audio
    return () => {
      audio.pause()
    }
  }, [])

  const toggleMusic = async () => {
    if (!audioRef.current) return
    if (isOn) {
      audioRef.current.pause()
      setIsOn(false)
      return
    }

    try {
      await audioRef.current.play()
      setIsOn(true)
      setStatusMessage('Playing romantic background music.')
    } catch {
      setIsOn(false)
      setStatusMessage('Tap again after page interaction, or check the music file path.')
    }
  }

  return (
    <div className="absolute right-4 top-4 z-20 flex max-w-72 flex-col items-end gap-2">
      <button
        onClick={toggleMusic}
        className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm sm:text-sm"
      >
        {isOn ? 'Music: On 🎶' : 'Music: Off 🔇'}
      </button>
      {statusMessage ? (
        <p className="rounded-lg bg-white/80 px-3 py-2 text-right text-[11px] text-slate-600 shadow-sm backdrop-blur-sm">
          {statusMessage}
        </p>
      ) : null}
    </div>
  )
}

export default MusicToggle
