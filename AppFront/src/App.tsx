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
import PrivateRoute from '@/routes/PrivateRoute';
import PublicRoute from "@/routes/PublicRoute";
import { useEffect } from 'react';
import ConfigPage from './pages/ConfigPage'

//! REGISTRO DE SERVICE WORKER
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return (
    <Router>
      <ToastContainer stacked autoClose={4000} transition={Bounce} />
      <Routes>
        {/* ROUTES WITHOUT SIDEBAR */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path='/schedule' element={<PublicRoute><SchedulePage /></PublicRoute>} />
        <Route path='/verifyacc' element={<PublicRoute><VerifyAccountPage /></PublicRoute>} />

        {/* ROUTES WITH SIDEBAR */}
        <Route path='/home' element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
        <Route path='/configuracion' element={<Layout><ConfigPage /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
