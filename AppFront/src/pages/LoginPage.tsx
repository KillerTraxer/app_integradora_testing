import { AtSign, Lock, Eye, EyeClosed } from 'lucide-react'
import Logo from "../assets/clinic_logo.svg";
import { useNavigate } from 'react-router-dom';
import { Button, Input } from "@nextui-org/react";
import { useState } from 'react';

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [focusState, setFocusState] = useState({
        email: false,
        password: false
    });

    const toggleVisibility = () => setIsVisible(!isVisible);


    return (
        <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-1/2 translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-12 translate-y-20"></div>

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden z-10">
                <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 pl-12 pt-12 pr-12 pb-8 flex flex-col items-center justify-center relative">
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
                    </div>

                    {/* Login form section (right side on large screens, bottom on small screens) */}
                    <div className="lg:w-1/2 pb-10 pl-8 pr-8 lg:pt-10 lg:pr-20 lg:pl-2">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center lg:text-center">Iniciar Sesión</h2>

                            <form>
                                <div className="space-y-2">
                                    <div>
                                        <Input
                                            value={email}
                                            id='email'
                                            label="Email"
                                            labelPlacement='inside'
                                            type='email'
                                            className={`w-full ${focusState.email ? "text-primary" : "text-black"}`}
                                            size='lg'
                                            placeholder='johndoe@gmail.com'
                                            startContent={
                                                <AtSign className={`${focusState.email ? "text-primary" : "text-gray-400"} mb-0.5`} size={18} />
                                            }
                                            variant='underlined'
                                            onValueChange={setEmail}
                                            color={focusState.email ? "primary" : "default"}
                                            errorMessage="Ingresa un correo valido"
                                            onFocus={() => setFocusState(prev => ({ ...prev, email: true }))}
                                            onBlur={() => setFocusState(prev => ({ ...prev, email: false }))}
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            value={password}
                                            id='password'
                                            type={isVisible ? 'text' : 'password'}
                                            className={`w-full ${focusState.password ? "text-primary" : "text-black"}`}
                                            label="Contraseña"
                                            labelPlacement='inside'
                                            size='lg'
                                            placeholder='Escribe tu contraseña'
                                            startContent={
                                                <Lock className={`${focusState.password ? "text-primary" : "text-gray-400"} mb-1`} size={18} />
                                            }
                                            endContent={
                                                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                                    {isVisible ? (
                                                        <EyeClosed className={`${focusState.password ? "text-primary" : "text-gray-400"}`} size={18} />
                                                    ) : (
                                                        <Eye className={`${focusState.password ? "text-primary" : "text-gray-400"}`} size={18} />
                                                    )}
                                                </button>
                                            }
                                            variant='underlined'
                                            color='primary'
                                            onValueChange={setPassword}
                                            onFocus={() => setFocusState(prev => ({ ...prev, password: true }))}
                                            onBlur={() => setFocusState(prev => ({ ...prev, password: false }))}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 text-right">
                                    <a href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:underline">
                                        Olvidaste tu contraseña?
                                    </a>
                                </div>

                                <Button type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                                    Ingresar
                                </Button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600 font-semibold">
                                    No tienes cuenta?{' '}
                                    <a href="/register" className="text-blue-600 hover:underline font-semibold">
                                        Crea una
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
