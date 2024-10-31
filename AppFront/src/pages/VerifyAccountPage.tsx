import Logo from "../assets/clinic_logo.svg";
import { useNavigate } from 'react-router-dom';
import { Button } from "@nextui-org/react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function VerifyAccountPage() {
    const navigate = useNavigate();

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
            console.log('OTP enviado:', values.otp);
        },
    });

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
                    <div className="lg:w-1/2 pb-10 pl-8 pr-8 lg:pt-10 lg:pr-20 lg:pl-0">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center lg:text-center">Activar cuenta</h2>

                            <p className="text-gray-900 font-extralight text-center">
                                Ingresa el código que enviamos a{' '}
                                <span className="text-blue-600 font-light">test@gmail.com</span>
                            </p>

                            <form onSubmit={formik.handleSubmit} className='mt-4 flex flex-col items-center'>
                                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={formik.values.otp} onChange={formik.handleChange('otp')}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} hasError={formik.touched.otp && formik.errors.otp ? true : false} />
                                        <InputOTPSlot index={1} hasError={formik.touched.otp && formik.errors.otp ? true : false}/>
                                        <InputOTPSlot index={2} hasError={formik.touched.otp && formik.errors.otp ? true : false}/>
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} hasError={formik.touched.otp && formik.errors.otp ? true : false}/>
                                        <InputOTPSlot index={4} hasError={formik.touched.otp && formik.errors.otp ? true : false}/>
                                        <InputOTPSlot index={5} hasError={formik.touched.otp && formik.errors.otp ? true : false}/>
                                    </InputOTPGroup>
                                </InputOTP>

                                {formik.touched.otp && formik.errors.otp ? (
                                    <p className="text-danger text-sm mt-2">{formik.errors.otp}</p>
                                ) : null}

                                <Button type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                                    Verificar cuenta
                                </Button>
                            </form>

                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 font-semibold cursor-pointer">
                                    Reenviar código
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
