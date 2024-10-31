import { useNavigate } from 'react-router-dom';
import Logo from "../assets/clinic_logo.svg";
import RegisterForm from "@/components/RegisterForm"

export default function RegisterPage() {
    const navigate = useNavigate();

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

                    <div className="lg:w-1/2 pb-10 pl-8 pr-8 lg:pt-10 lg:pr-20 lg:pl-2">
                        <div className="max-w-md mx-auto">
                            <h2 className={`mb-8 text-3xl font-bold text-gray-900 text-center lg:text-center`}>Registro</h2>

                            <RegisterForm />

                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600 font-semibold">
                                    Ya tienes cuenta?{' '}
                                    <a href="/login" className="text-blue-600 hover:underline font-semibold">
                                        Inicia sesión
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
