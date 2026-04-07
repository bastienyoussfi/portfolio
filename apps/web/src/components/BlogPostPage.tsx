import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blog } from '@/data'
import blogContent from '@/content/blog'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blog.find((p) => p.slug === slug)
  const content = slug ? blogContent[slug] : undefined

  if (!post || !content) {
    return (
      <main className="blog-post">
        <Link to="/blog" className="blog-post__back">
          &larr; Back to blog
        </Link>
        <h1 className="blog-post__title">Post not found</h1>
      </main>
    )
  }

  return (
    <main className="blog-post">
      <Link to="/blog" className="blog-post__back">
        &larr; Back to blog
      </Link>

      <header className="blog-post__header">
        <h1 className="blog-post__title">{post.title}</h1>
        <p className="blog-post__meta">
          {post.displayDate} &middot; {post.readTimeMinutes} min read
        </p>
      </header>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="blog-post__hero"
        />
      )}

      <div className="blog-post__body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>

      <div className="blog-post__tags">
        {post.tags.map((tag) => (
          <span key={tag} className="pill">{tag}</span>
        ))}
      </div>
    </main>
  )
}
