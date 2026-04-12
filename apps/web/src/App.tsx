import { Routes, Route, Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatHero from '@/components/chat/ChatHero'
import ProjectsPage from '@/components/ProjectsPage'
import BlogPage from '@/components/BlogPage'
import BlogPostPage from '@/components/BlogPostPage'
import ProjectPostPage from '@/components/ProjectPostPage'
import ContactModal from '@/components/ContactModal'
import { ContactModalProvider } from '@/hooks/useContactModal'

function Layout({ className }: { className: string }) {
  return (
    <div className={className}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ContactModalProvider>
      <Routes>
        <Route element={<Layout className="page" />}>
          <Route path="/" element={<ChatHero />} />
        </Route>
        <Route element={<Layout className="page page--scroll" />}>
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectPostPage />} />
        </Route>
        <Route element={<Layout className="page page--scroll" />}>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Route>
      </Routes>
      <ContactModal />
    </ContactModalProvider>
  )
}
