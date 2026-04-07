interface BlogCardProps {
  title: string
  date: string
  description: string
}

export default function BlogCard({ title, date, description }: BlogCardProps) {
  return (
    <div className="blog-card">
      <div className="blog-card__row">
        <div className="blog-card__title">{title}</div>
        <span className="blog-card__divider" />
        <div className="blog-card__date">{date}</div>
      </div>
      <div className="blog-card__desc">{description}</div>
    </div>
  )
}
