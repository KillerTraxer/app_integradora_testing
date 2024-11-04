import { useNavigate } from 'react-router-dom';
import Logo from "../assets/clinic_logo.svg";
import ScheduleForm from "@/components/ScheduleForm"
import { motion, AnimatePresence } from 'framer-motion'
import { Phone } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@nextui-org/react"
import confetti from 'canvas-confetti';

export default function SchedulePage() {
    const navigate = useNavigate();

    const [isSuccess, setIsSuccess] = useState(false);

    const handleSuccess = () => {
        setIsSuccess(true);
    };

    const showConfetti = () => {
        showSuccessConfetti();
    };

    const showSuccessConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    console.log(isSuccess);

    return (
        <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-1/2 translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-12 translate-y-20"></div>

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden z-10">
                <div className="flex flex-col lg:flex-row">
                    <motion.div
                        className="lg:w-1/2 pl-12 pt-12 pr-12 pb-8 flex flex-col items-center justify-center relative"
                        key="logoImg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        layout
                    >
                        <div className="relative z-10 lg:w-48 lg:h-48 w-28 h-28 bg-gray-900 rounded-full flex items-center justify-center">
                            <div className="relative lg:w-48 lg:h-48">
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="object-contain cursor-pointer"
                                    onClick={() => navigate('/')}
                                    title='Volver al inicio'
                                />
                            </div>
                        </div>
                    </motion.div>

                    <div className="lg:w-1/2 pb-6 pl-8 pr-8 lg:pt-5 lg:pr-20 lg:pl-2">
                        <div className="max-w-md mx-auto">
                            <AnimatePresence>
                                {!isSuccess ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        layout
                                    >
                                        <h2 className={`mb-4 text-3xl font-bold text-gray-900 text-center lg:text-center`}>Agendar cita</h2>

                                        <div className="text-gray-900 font-extralight text-center flex flex-col items-center">
                                            Llama a nuestro numero y agenda una cita{' '}
                                            <div className='flex flex-row gap-2 justify-center mt-2 align-items-center'>
                                                <Phone className="w-5 h-5 text-blue-600 stroke-1 mt-0.5" />
                                                <span className="text-blue-600 font-light">618-123-456</span>
                                            </div>
                                        </div>

                                        <div className="relative flex py-3 items-center">
                                            <div className="flex-grow border-t border-blue-600"></div>
                                            <span className="flex-shrink mx-4 text-blue-600">O</span>
                                            <div className="flex-grow border-t border-blue-600"></div>
                                        </div>

                                        <p className='text-gray-900 font-extralight mb-4'>Llena nuestro formulario</p>

                                        <ScheduleForm onSuccess={handleSuccess} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        layout
                                        onAnimationComplete={() => showConfetti()}
                                    >
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Cita agendada con éxito!</h2>
                                        <p className="text-gray-900 font-semibold">
                                            Mandamos la información de tu cita a tu correo electrónico.
                                        </p>

                                        <p className="text-gray-900 font-extralight mt-8">Si quieres llevar un seguimiento de tu cita, ver tus tratamientos, te recomendamos que crees una cuenta.</p>
                                        <Button onClick={() => navigate('/register', { replace: true })} className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                                            Crear cuenta
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
