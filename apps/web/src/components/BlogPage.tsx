import { blog } from '@/data'
import BlogCard from '@/components/ui/blog-cards'

export default function BlogPage() {
  return (
    <main className="blog-page">
      <div className="blog-page__header">
        <h1 className="blog-page__title">
          Written <strong>thoughts.</strong>
        </h1>
        <p className="blog-page__subtitle">
          Ideas, reflections & notes.
        </p>
      </div>
      <div className="blog-list">
        {blog.map((post) => (
          <BlogCard
            key={post.id}
            title={post.title}
            date={post.displayDate}
            description={post.excerpt}
            slug={post.slug}
          />
        ))}
      </div>
    </main>
  )
}
