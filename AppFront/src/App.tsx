import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SchedulePage from './pages/SchedulePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from "@/pages/Home";
import Layout from "@/pages/Layout"

function App() {

  return (
    <Router>
      <Routes>
        {/* ROUTES WITHOUT SIDEBAR */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/schedule' element={<SchedulePage />} />

        {/* ROUTES WITH SIDEBAR */}
        <Route path='/home' element={<Layout><Home /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
