import { useEffect, useState } from 'react'

function TypewriterText({ text, speed = 22 }) {
  return <TypewriterTextInstance key={`${text}-${speed}`} text={text} speed={speed} />
}

function TypewriterTextInstance({ text, speed }) {
  const [visibleText, setVisibleText] = useState('')

  useEffect(() => {
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
