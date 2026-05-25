const STARS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 11) % 35}%`,
  delay: `${(i % 5) * 0.6}s`,
  size: i % 7 === 0 ? 3 : 2,
}))

const CLOUDS = [
  { w: 180, h: 60, left: '5%', top: '58%', delay: '0s' },
  { w: 220, h: 70, left: '55%', top: '62%', delay: '-8s' },
  { w: 140, h: 50, left: '75%', top: '48%', delay: '-14s' },
]

function SkyBackdrop() {
  return (
    <div className="sky-canvas" aria-hidden>
      {STARS.map((star) => (
        <span
          key={star.id}
          className="sky-star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
      {CLOUDS.map((cloud, i) => (
        <span
          key={i}
          className="sky-cloud"
          style={{
            width: cloud.w,
            height: cloud.h,
            left: cloud.left,
            top: cloud.top,
            animationDelay: cloud.delay,
          }}
        />
      ))}
    </div>
  )
}

export default SkyBackdrop
