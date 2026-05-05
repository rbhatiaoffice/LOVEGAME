import { useEffect, useState } from 'react'

function TypewriterText({ text, speed = 22 }) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
    setVisibleText('')
    let index = 0
    const timer = setInterval(() => {
      index += 1
      setVisibleText(text.slice(0, index))
      if (index >= text.length) {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <>{visibleText}</>
}

export default TypewriterText
