import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface BlogCardProps {
  title: string
  date: string
  description: string
  slug: string
  image?: string | null
}

const springConfig = { damping: 25, stiffness: 250 }

export default function BlogCard({ title, date, description, slug, image }: BlogCardProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(0)
  const rotate = useMotionValue(-12.5)

  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)
  const springScale = useSpring(scale, springConfig)
  const springRotate = useSpring(rotate, springConfig)

  // Map normalized mouse position to percentage-based offsets
  // Keep image on the right side (60%-70%) and vertically centered (40%-60%)
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["70%", "60%"])
  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseEnter = () => {
    scale.set(1)
    rotate.set(12.5)
  }

  const handleMouseLeave = () => {
    scale.set(0)
    rotate.set(-12.5)
  }

  return (
    <Link
      ref={ref}
      to={`/blog/${slug}`}
      className="blog-card"
      onMouseMove={image ? handleMouseMove : undefined}
      onMouseEnter={image ? handleMouseEnter : undefined}
      onMouseLeave={image ? handleMouseLeave : undefined}
    >
      {image && (
        <motion.img
          src={image}
          alt=""
          className="blog-card__hover-img"
          style={{
            top,
            left,
            translateX: "-50%",
            translateY: "-50%",
            scale: springScale,
            rotate: springRotate,
          }}
        />
      )}
      <div className="blog-card__row">
        <div className="blog-card__title">{title}</div>
        <span className="blog-card__divider" />
        <div className="blog-card__date">{date}</div>
      </div>
      <div className="blog-card__desc">{description}</div>
    </Link>
  )
}
