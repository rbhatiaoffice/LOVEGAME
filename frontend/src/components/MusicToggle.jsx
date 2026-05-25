import { useEffect, useRef, useState } from 'react'

const MUSIC_FILE = '/music/romantic-bollywood.mp3.mp3'

function MusicToggle() {
  const [isOn, setIsOn] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(MUSIC_FILE)
    audio.preload = 'auto'
    audio.loop = true
    audio.volume = 0.28
    audioRef.current = audio
    return () => audio.pause()
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
    } catch {
      setIsOn(false)
    }
  }

  return (
    <button type="button" onClick={toggleMusic} className="music-chip" aria-pressed={isOn}>
      {isOn ? '♪ On' : '♪ Music'}
    </button>
  )
}

export default MusicToggle
