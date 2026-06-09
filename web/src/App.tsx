import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AppDetail from './pages/AppDetail'
import Submit from './pages/Submit'
import About from './pages/About'
import Privacy from './pages/Privacy'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/app/:id" element={<AppDetail />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
