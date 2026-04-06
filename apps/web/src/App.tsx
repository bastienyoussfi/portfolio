import { Routes, Route, Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import ChatHero from '@/components/chat/ChatHero'
import ProjectsPage from '@/components/ProjectsPage'

function Layout({ className }: { className: string }) {
  return (
    <div className={className}>
      <Header />
      <Outlet />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout className="page" />}>
        <Route path="/" element={<ChatHero />} />
      </Route>
      <Route element={<Layout className="page page--scroll" />}>
        <Route path="/projects" element={<ProjectsPage />} />
      </Route>
    </Routes>
  )
}
