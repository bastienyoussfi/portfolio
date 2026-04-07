import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getTechIcon } from '@/utils/techIcons'

interface ProjectCardProps {
  title: string
  year: number
  description: string
  href?: string
  image?: string
  technologies?: string[]
}

const springConfig = { damping: 25, stiffness: 250 }
const MAX_VISIBLE_AVATARS = 3

export default function ProjectCard({ title, year, description, href, image, technologies }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(0)
  const rotate = useMotionValue(-12.5)

  const mouseXSpring = useSpring(x, springConfig)
  const mouseYSpring = useSpring(y, springConfig)
  const springScale = useSpring(scale, springConfig)
  const springRotate = useSpring(rotate, springConfig)

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

  const visibleTechs = technologies?.slice(0, MAX_VISIBLE_AVATARS) ?? []
  const overflowCount = (technologies?.length ?? 0) - MAX_VISIBLE_AVATARS

  const content = (
    <>
      {image && (
        <motion.img
          src={image}
          alt=""
          className="list-card__hover-img"
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
      <div className="list-card__row">
        <div className="list-card__title">{title}</div>
        {visibleTechs.length > 0 && (
          <div className="list-card__techs">
            {visibleTechs.map((tech) => {
              const { icon, initials } = getTechIcon(tech)
              return (
                <Avatar key={tech} className="size-5">
                  <AvatarImage
                    src={icon || undefined}
                    alt={tech}
                    className="border border-[var(--card)] bg-[var(--card)] p-0.5"
                  />
                  <AvatarFallback className="text-[8px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )
            })}
            {overflowCount > 0 && (
              <div className="list-card__techs-overflow">
                +{overflowCount}
              </div>
            )}
          </div>
        )}
        <span className="list-card__divider" />
        <div className="list-card__date">{year}</div>
      </div>
      <div className="list-card__desc">{description}</div>
    </>
  )

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="list-card"
        onMouseMove={image ? handleMouseMove : undefined}
        onMouseEnter={image ? handleMouseEnter : undefined}
        onMouseLeave={image ? handleMouseLeave : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className="list-card"
      onMouseMove={image ? handleMouseMove : undefined}
      onMouseEnter={image ? handleMouseEnter : undefined}
      onMouseLeave={image ? handleMouseLeave : undefined}
    >
      {content}
    </div>
  )
}
