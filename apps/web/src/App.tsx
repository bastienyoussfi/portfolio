import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import ChatHero from '@/components/chat/ChatHero'
import ProjectsPage from '@/components/ProjectsPage'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="page">
            <Header />
            <ChatHero />
          </div>
        }
      />
      <Route
        path="/projects"
        element={
          <div className="page page--scroll">
            <Header />
            <ProjectsPage />
          </div>
        }
      />
    </Routes>
  )
}
