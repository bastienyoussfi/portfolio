import { Link } from 'react-router-dom'

interface BlogCardProps {
  title: string
  date: string
  description: string
  slug: string
}

export default function BlogCard({ title, date, description, slug }: BlogCardProps) {
  return (
    <Link to={`/blog/${slug}`} className="blog-card">
      <div className="blog-card__row">
        <div className="blog-card__title">{title}</div>
        <span className="blog-card__divider" />
        <div className="blog-card__date">{date}</div>
      </div>
      <div className="blog-card__desc">{description}</div>
    </Link>
  )
}
