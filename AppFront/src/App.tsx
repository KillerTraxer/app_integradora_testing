import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer, Bounce, toast } from 'react-toastify';
import PrivateRoute from '@/routes/PrivateRoute';
import PublicRoute from "@/routes/PublicRoute";
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import { setupInterceptors } from './utils/axiosInterceptor';
import { requestFCMToken, onMessageListener } from "@/utils/firebaseUtil"
import api from "@/axiosInstance"

import Home from "@/pages/Home";
import Layout from "@/pages/Layout"
import ScheduleInfoPage from '@/pages/ScheduleInfoPage'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import VerifyAccountPage from '@/pages/VerifyAccountPage'
import ConfigPage from '@/pages/ConfigPage'
import AgendaPage from "@/pages/AgendaPage"
import CitasPage from "@/pages/CitasPage"
import PacientesPage from "@/pages/PacientesPage"
import CitasDetallesPage from "@/pages/CitasDetallesPage"
import CitaIniciadaPage from "@/pages/CitaIniciadaPage"
import CalendarioCitasPage from "@/pages/CalendarioCitasPage"

//! REGISTRO DE SERVICE WORKER
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);
        })
        .catch((error) => {
          console.error('Error al registrar el Service Worker:', error);
        });
    }
  }, []);

  const { setAuth, clearAuth, auth } = useAuthStore();

  useEffect(() => {
    setupInterceptors(
      () => useAuthStore.getState().auth,
      setAuth,
      clearAuth
    );
  }, []);

  const fetchFCMToken = async () => {
    try {
      const token = await requestFCMToken();
      //@ts-ignore
      localStorage.setItem('fcmToken', token);
    } catch (error) {
      console.error('Error al obtener el token FCM:', error);
    }
  };

  useEffect(() => {
    const pathname = window.location.pathname;
    if (
      pathname.includes('/home') ||
      pathname.includes('/configuracion') ||
      pathname.includes('/agenda') ||
      pathname.includes('/citas') ||
      pathname.includes('/pacientes')
    ) {
      fetchFCMToken();
    }
  }, []);

  useEffect(() => {
    if (auth && auth.accessToken) {
      const saveFCMToken = async () => {
        try {
          const token = localStorage.getItem('fcmToken');
          if (token && token !== undefined) {
            await api.post('/auth/save-fcm-token', { token, userId: auth?.user._id });
          }
        } catch (error) {
          console.error('Error al guardar el token FCM:', error);
        }
      };
      saveFCMToken();
    }
  }, [auth]);

  onMessageListener().then((payload: any) => {
    toast.info(
      <div>
        <p className='font-semibold text-base text-[#e8e8e8]'>{payload.notification.title}</p>
        <p className='font-normal text-sm text-[#e8e8e8]'>{payload.notification.body}</p>
      </div>,
      { position: "bottom-right", theme: "colored" }
    );
  }).catch(err => console.error("error: ", err))

  return (
    <Router>
      <ToastContainer autoClose={4000} transition={Bounce} />
      <Routes>
        {/* ROUTES WITHOUT SIDEBAR */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path='/schedule' element={<PublicRoute><ScheduleInfoPage /></PublicRoute>} />
        <Route path='/verifyacc' element={<PublicRoute><VerifyAccountPage /></PublicRoute>} />

        {/* ROUTES WITH SIDEBAR */}
        <Route path='/home' element={<PrivateRoute><Layout><Home /></Layout></PrivateRoute>} />
        <Route path='/configuracion' element={<PrivateRoute><Layout><ConfigPage /></Layout></PrivateRoute>} />
        <Route path='/agenda' element={<PrivateRoute><Layout><AgendaPage /></Layout></PrivateRoute>} />
        <Route path='/citas' element={<PrivateRoute><Layout><CitasPage /></Layout></PrivateRoute>} />
        <Route path="/citas/:id" element={<PrivateRoute><Layout><CitasDetallesPage /></Layout></PrivateRoute>} />
        <Route path='/cita/iniciada/:id' element={<PrivateRoute><Layout><CitaIniciadaPage /></Layout></PrivateRoute>} />
        <Route path='/pacientes' element={<PrivateRoute><Layout><PacientesPage /></Layout></PrivateRoute>} />
        <Route path='/calendario' element={<PrivateRoute><Layout><CalendarioCitasPage /></Layout></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
