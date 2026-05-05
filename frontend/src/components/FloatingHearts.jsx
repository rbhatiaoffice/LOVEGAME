function FloatingHearts() {
  const hearts = ['💗', '💕', '💖', '💘', '💓', '💞']

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((heart, index) => (
        <span
          key={heart}
          className="floating-heart absolute text-2xl opacity-30"
          style={{
            left: `${10 + index * 15}%`,
            animationDelay: `${index * 1.2}s`,
            animationDuration: `${8 + index * 0.8}s`,
          }}
        >
          {heart}
        </span>
      ))}
    </div>
  )
}

export default FloatingHearts
