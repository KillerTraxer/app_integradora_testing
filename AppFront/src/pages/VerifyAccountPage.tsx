import Logo from "../assets/clinic_logo.svg";
import { useNavigate } from 'react-router-dom';
import { Button } from "@nextui-org/react";
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import api from "@/axiosInstance";
import { useEffect, useState } from "react";
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion'

const OTP_RESEND_INTERVAL = 60;

export default function VerifyAccountPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const [sendOTP, setSendOTP] = useState<boolean>(location.state?.sendOTP || false);
    const [timer, setTimer] = useState<number>(OTP_RESEND_INTERVAL);
    const [errorMessages, setErrorMessages] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        const storedTime = localStorage.getItem('otpTimer');
        if (storedTime) {
            const remainingTime = Math.max(0, Math.floor((parseInt(storedTime) - Date.now()) / 1000));
            setTimer(remainingTime);
        } else if (sendOTP && timer === OTP_RESEND_INTERVAL) {
            const endTime = Date.now() + OTP_RESEND_INTERVAL * 1000;
            localStorage.setItem('otpTimer', endTime.toString());
            setTimer(OTP_RESEND_INTERVAL);
            sendOTPRequest();
        }
    }, []);

    useEffect(() => {
        if (timer === 0) {
            localStorage.removeItem('otpTimer');
            return;
        }

        const intervalId = setInterval(() => {
            setTimer(prev => {
                const newTime = prev - 1;
                if (newTime <= 0) {
                    clearInterval(intervalId);
                    localStorage.removeItem('otpTimer');
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer]);

    const startTimer = () => {
        const endTime = Date.now() + OTP_RESEND_INTERVAL * 1000;
        localStorage.setItem('otpTimer', endTime.toString());
        setTimer(OTP_RESEND_INTERVAL);
    };

    const sendOTPRequest = async () => {
        setErrorMessages("");
        try {
            await api.post('/auth/generate-otp', { email });
            startTimer();
            setSendOTP(false); // Reset sendOTP after sending
        } catch (error: any) {
            setTimer(0);
            if (error.response && error.response.status === 400) {
                setErrorMessages(error.response.data.message);
            } else {
                setErrorMessages("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
            }
        }
    };

    const verifyOTPRequest = async (otp: string) => {
        setErrorMessages("");

        try {
            await api.post('/auth/verify-otp', {
                email: email,
                otp: otp
            });
            setSuccessMessage("Cuenta activada con éxito!");
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setErrorMessages(error.response.data.message);
            } else {
                setErrorMessages("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
            }
        }
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

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .length(6, 'El código debe ser de 6 caracteres')
                .required('El código es requerido'),
        }),
        onSubmit: (values) => {
            verifyOTPRequest(values.otp);
        },
    });

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
                        transition={{ duration: 1 }}
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

                    {/* Login form section (right side on large screens, bottom on small screens) */}
                    <div className="lg:w-1/2 pb-10 pl-8 pr-8 lg:pt-10 lg:pr-20 lg:pl-0">
                        <div className="max-w-md mx-auto">
                            <AnimatePresence>
                                {!successMessage ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 1 }}
                                        layout
                                    >
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Activar cuenta</h2>
                                        <p className="text-gray-900 font-extralight text-center">
                                            Ingresa el código que enviamos a{' '}
                                            <span className="text-blue-600 font-light">{email}</span>
                                        </p>

                                        {errorMessages && (
                                            <p className="bg-red-100 text-red-500 p-3 rounded-md mb-4 text-center mt-3 flex flex-col items-center">
                                                {errorMessages}
                                                {errorMessages.includes('El usuario ya ha sido verificado') ? (
                                                    <span className="underline w-fit text-gray-600 font-semibold cursor-pointer" onClick={() => navigate('/login')}>
                                                        Iniciar sesión.
                                                    </span>
                                                ) : null}
                                            </p>
                                        )}

                                        <form onSubmit={formik.handleSubmit} className='mt-4 flex flex-col items-center'>
                                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={formik.values.otp} onChange={formik.handleChange('otp')}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                                    <InputOTPSlot index={1} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                                    <InputOTPSlot index={2} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                                    <InputOTPSlot index={4} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                                    <InputOTPSlot index={5} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                                </InputOTPGroup>
                                            </InputOTP>

                                            {formik.touched.otp && formik.errors.otp ? (
                                                <p className="text-danger text-sm mt-2">{formik.errors.otp}</p>
                                            ) : null}

                                            <Button type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                                                Verificar cuenta
                                            </Button>
                                        </form>

                                        <div className="flex justify-center items-center w-full h-full">
                                            <div className="flex flex-col items-center">
                                                <Button
                                                    variant="light"
                                                    disabled={timer > 0}
                                                    onClick={() => {
                                                        if (timer === 0) {
                                                            sendOTPRequest();
                                                            // startTimer();
                                                        }
                                                    }}
                                                    disableRipple={timer > 0}
                                                    className={`${timer > 0 ? 'cursor-not-allowed' : 'cursor-pointer'} mt-4`}
                                                >
                                                    <p>{timer > 0 ? `Reenviar código (${timer})` : 'Reenviar código'}</p>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 1 }}
                                        layout
                                        onAnimationComplete={() => showConfetti()}
                                    >
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Cuenta creada con éxito!</h2>
                                        <p className="text-gray-900 font-extralight text-center">
                                            Ahora puedes iniciar sesión con tu cuenta.
                                        </p>
                                        <Button onClick={() => navigate('/login', { replace: true, state: {} })} className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                                            Iniciar sesión
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
