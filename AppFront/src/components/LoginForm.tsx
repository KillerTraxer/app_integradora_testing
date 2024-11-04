import { Mail, Lock, Eye, EyeClosed, CheckCircle } from 'lucide-react'
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from "@/axiosInstance"
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '@/store/authStore';

export default function RegisterForm() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const { setAuth, setIsLogged } = useAuthStore();

    const navigate = useNavigate();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email inválido').required('El email es requerido'),
            password: Yup.string().required('La contraseña es requerida'),
        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            setErrorMessages('');
            setEmail(values.email)

            try {
                const response = await api.post('/auth/login', {
                    email: values.email,
                    password: values.password,
                });

                const authData = response.data;
                setAuth(authData);
                setIsLogged(true);

                setIsSuccess(true);
                formik.resetForm();
            } catch (error: any) {
                setIsSuccess(false);

                if (error.response && error.response.status === 400) {
                    setErrorMessages(error.response.data.message);
                } else {
                    setErrorMessages("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
                }
            } finally {
                setIsLoading(false);
            }

        },
    });

    const getInputColor = (fieldName: string) => {
        if (focusedField === fieldName) {
            return formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors] ? "danger" : "primary";
        }
        return "default";
    }

    const getIconColor = (fieldName: string) => {
        if (focusedField === fieldName) {
            return formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors] ? 'text-danger' : 'text-primary';
        }
        return formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors] ? 'text-danger' : 'text-gray-400';
    }

    return (
        <>
            {errorMessages && (
                <p className="bg-red-100 text-red-500 p-3 rounded-md mb-4 text-center mt-3 flex flex-col items-center">
                    {errorMessages}
                    {errorMessages.includes('El usuario no ha sido verificado') ? (
                        <span
                            className="underline w-fit text-gray-600 font-semibold cursor-pointer"
                            onClick={() => navigate('/verifyacc', { state: { email: email, sendOTP: true } })}
                        >
                            Verificar ahora.
                        </span>
                    ) : null}
                </p>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <Input
                            value={formik.values['email' as keyof typeof formik.values]}
                            id='email'
                            label="Email"
                            labelPlacement='inside'
                            type='email'
                            placeholder='Ingresa tu email'
                            startContent={
                                <Mail className={`${getIconColor('email')}`} size={18} />
                            }
                            onChange={formik.handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={(e) => {
                                setFocusedField(null);
                                formik.handleBlur(e)
                            }}
                            color={getInputColor('email')}
                            isInvalid={formik.touched['email' as keyof typeof formik.touched] && !!formik.errors['email' as keyof typeof formik.errors]}
                            errorMessage={formik.touched['email' as keyof typeof formik.touched] && formik.errors['email' as keyof typeof formik.errors]}
                        />
                    </div>

                    <div>
                        <Input
                            value={formik.values['password' as keyof typeof formik.values]}
                            id='password'
                            type={isVisible ? 'text' : 'password'}
                            label="Contraseña"
                            labelPlacement='inside'
                            placeholder='Ingresa tu contraseña'
                            startContent={
                                <Lock className={`${getIconColor('password')} mb-0.5`} size={18} />
                            }
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? (
                                        <EyeClosed className={getIconColor("password")} size={18} />
                                    ) : (
                                        <Eye className={getIconColor("password")} size={18} />
                                    )}
                                </button>
                            }
                            color={getInputColor('password')}
                            onChange={formik.handleChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={(e) => {
                                setFocusedField(null);
                                formik.handleBlur(e)
                            }}
                            isInvalid={formik.touched['password' as keyof typeof formik.touched] && !!formik.errors['password' as keyof typeof formik.errors]}
                            errorMessage={formik.touched['password' as keyof typeof formik.touched] && formik.errors['password' as keyof typeof formik.errors]}
                        />
                    </div>
                </div>

                <div className="mt-4 text-right">
                    <a href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                        Olvidaste tu contraseña?
                    </a>
                </div>

                <Button isDisabled={isSuccess} isLoading={isLoading} type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                    <AnimatePresence mode='wait'>
                        {isLoading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                            </motion.div>
                        )}
                        {!isLoading && !isSuccess && (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Ingresar
                            </motion.div>
                        )}
                        {!isLoading && isSuccess && (
                            <motion.div
                                key="success"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 flex items-center justify-center"
                                onAnimationComplete={() => {
                                    navigate('/home');
                                }}
                            >
                                <CheckCircle className="text-white" size={24} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </form>
        </>
    )
}
