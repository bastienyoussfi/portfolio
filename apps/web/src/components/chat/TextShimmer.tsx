interface TextShimmerProps {
  children: string
  duration?: number
  spread?: number
  className?: string
}

export default function TextShimmer({
  children,
  duration = 3,
  spread = 20,
  className = '',
}: TextShimmerProps) {
  return (
    <span
      className={`text-shimmer ${className}`}
      style={{
        '--shimmer-duration': `${duration}s`,
        '--shimmer-spread': `${spread}%`,
      } as React.CSSProperties}
    >
      {children}
    </span>
  )
}
