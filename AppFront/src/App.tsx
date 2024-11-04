import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SchedulePage from './pages/SchedulePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyAccountPage from './pages/VerifyAccountPage'
import Home from "@/pages/Home";
import Layout from "@/pages/Layout"
import { ToastContainer, Bounce } from 'react-toastify';

function App() {

  return (
    <Router>
      <ToastContainer stacked autoClose={4000} transition={Bounce}/>
      <Routes>
        {/* ROUTES WITHOUT SIDEBAR */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/schedule' element={<SchedulePage />} />
        <Route path='/verifyacc' element={<VerifyAccountPage />} />

        {/* ROUTES WITH SIDEBAR */}
        <Route path='/home' element={<Layout><Home /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
