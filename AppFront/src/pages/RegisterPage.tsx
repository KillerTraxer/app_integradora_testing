import { AtSign, Lock, Phone, User2, Eye, EyeClosed } from 'lucide-react'
import Logo from "../assets/clinic_logo.svg";
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '@nextui-org/react';
import { useMemo } from 'react';
import { useState } from 'react';
import React from "react";
import api from "@/axiosInstance"

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastNames, setLastNames] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [checked, setChecked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [focusState, setFocusState] = useState({
        name: false,
        lastName: false,
        phone: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const [errorMessages, setErrorMessages] = useState({ nombre: "", apellidos: "", telefono: "", email: "", password: "", confirmPassword: "", msg: "" });
    const [loading, setLoading] = useState(false);

    const validateEmail = (value: any) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

    const isInvalid = useMemo(() => {
        if (email === "") return false;

        return validateEmail(email) ? false : true;
    }, [email]);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const toggleChecked = () => setChecked(!checked);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessages({ nombre: "", apellidos: "", telefono: "", email: "", password: "", confirmPassword: "", msg: "" });
        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                nombre: name,
                apellidos: lastNames,
                telefono: phone,
                email,
                password,
                confirmPassword
            });

            window.alert(response);

            setName('');
            setLastNames('');
            setPhone('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            setErrorMessages({ nombre: "", apellidos: "", telefono: "", email: "", password: "", confirmPassword: "", msg: "" });
        } catch (error: any) {
            console.log(error.response);
            if (error.response && error.response.data.errors) {
                const errors = error.response.data.errors.reduce((acc: any, err: any) => {
                    acc[err.path] = err.msg;
                    return acc;
                }, {});

                // Manejar errores de duplicación separadamente
                if (Array.isArray(errors.msg)) {
                    setErrorMessages(prev => ({ ...prev, msg: errors.msg }));
                } else {
                    setErrorMessages(prev => ({ ...prev, ...errors }));
                }
            } else {
                setErrorMessages({ msg: "Error inesperado en el servidor", nombre: "", apellidos: "", telefono: "", email: "", password: "", confirmPassword: "" });
            }
        } finally {
            setLoading(false);
        }
    }

    console.log(errorMessages);

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

                            {errorMessages.msg && (
                                <div className="bg-[#fcd3d2] mb-4 rounded-md px-5 py-2">
                                    {Array.isArray(errorMessages.msg) ? (
                                        <ul>
                                            {errorMessages.msg.map((msg: any, index: any) => (
                                                <li key={index} className="text-danger-500 mb-1">{msg}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className='text-danger-500'>{errorMessages.msg}</p>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <div className='flex flex-row space-x-8'>
                                        <div className='w-full'>
                                            <Input
                                                id='name'
                                                value={name}
                                                onValueChange={setName}
                                                label="Nombre(s)"
                                                labelPlacement='inside'
                                                type='text'
                                                className={`w-full ${focusState.name ? "text-primary" : "text-black"}`}
                                                size='lg'
                                                placeholder='John'
                                                startContent={
                                                    <User2 className={`${focusState.name && !errorMessages.nombre
                                                        ? "text-primary"
                                                        : (errorMessages.nombre
                                                            ? "text-danger-400"
                                                            : "text-gray-400")}`} size={18} />
                                                }
                                                variant='underlined'
                                                color={`${errorMessages.nombre
                                                    ? "danger"
                                                    : (focusState.name
                                                        ? "primary"
                                                        : "default")}`}
                                                onFocus={() => setFocusState(prev => ({ ...prev, name: true }))}
                                                onBlur={() => setFocusState(prev => ({ ...prev, name: false }))}
                                                errorMessage={errorMessages.nombre}
                                                isInvalid={!!errorMessages.nombre}
                                            />
                                        </div>

                                        <div className='w-full'>
                                            <Input
                                                id='lastName'
                                                value={lastNames}
                                                onValueChange={setLastNames}
                                                label="Apellidos"
                                                labelPlacement='inside'
                                                type='text'
                                                className={`w-full ${focusState.lastName ? "text-primary" : "text-black"}`}
                                                size='lg'
                                                placeholder='Doe'
                                                startContent={
                                                    <User2 className={`${focusState.lastName && !errorMessages.apellidos
                                                        ? "text-primary"
                                                        : (errorMessages.apellidos
                                                            ? "text-danger-400"
                                                            : "text-gray-400")} mb-1`} size={18} />
                                                }
                                                variant='underlined'
                                                color={`${errorMessages.apellidos
                                                    ? "danger"
                                                    : (focusState.lastName
                                                        ? "primary"
                                                        : "default")}`}
                                                onFocus={() => setFocusState(prev => ({ ...prev, lastName: true }))}
                                                onBlur={() => setFocusState(prev => ({ ...prev, lastName: false }))}
                                                errorMessage={errorMessages.apellidos}
                                                isInvalid={!!errorMessages.apellidos}
                                            />

                                        </div>
                                    </div>

                                    <div>
                                        <Input
                                            id='phone'
                                            value={phone}
                                            onValueChange={setPhone}
                                            label="Teléfono"
                                            labelPlacement='inside'
                                            type='phone'
                                            className={`w-full ${focusState.phone ? "text-primary" : "text-black"}`}
                                            size='lg'
                                            placeholder='123-1235356'
                                            startContent={
                                                <Phone className={`${focusState.phone && !errorMessages.telefono
                                                    ? "text-primary"
                                                    : (errorMessages.telefono
                                                        ? "text-danger-400"
                                                        : "text-gray-400")} mb-1`} size={18} />
                                            }
                                            variant='underlined'
                                            color={`${errorMessages.telefono
                                                ? "danger"
                                                : (focusState.phone
                                                    ? "primary"
                                                    : "default")}`}
                                            onFocus={() => setFocusState(prev => ({ ...prev, phone: true }))}
                                            onBlur={() => setFocusState(prev => ({ ...prev, phone: false }))}
                                            errorMessage={errorMessages.telefono}
                                            isInvalid={!!errorMessages.telefono}
                                        />
                                    </div>

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
                                                <AtSign className={`${isInvalid ? "text-danger-400" : (focusState.email && !errorMessages.email ? "text-primary" : (errorMessages.email
                                                    ? "text-danger-400"
                                                    : "text-gray-400"))} mb-0.5`} size={18} />
                                            }
                                            variant='underlined'
                                            onValueChange={setEmail}
                                            color={!isInvalid ? (focusState.email ? "primary" : "default") : "danger"}
                                            onFocus={() => setFocusState(prev => ({ ...prev, email: true }))}
                                            onBlur={() => setFocusState(prev => ({ ...prev, email: false }))}
                                            errorMessage={errorMessages.email}
                                            isInvalid={isInvalid || !!errorMessages.email}
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
                                                <Lock className={`${focusState.password && !errorMessages.password
                                                    ? "text-primary"
                                                    : (errorMessages.password
                                                        ? "text-danger-400"
                                                        : "text-gray-400")} mb-1`} size={18} />
                                            }
                                            endContent={
                                                <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                                    {isVisible ? (
                                                        <EyeClosed className={`${focusState.password && !errorMessages.password
                                                            ? "text-primary"
                                                            : (errorMessages.password
                                                                ? "text-danger-400"
                                                                : "text-gray-400")} mb-1`} size={18} />
                                                    ) : (
                                                        <Eye className={`${focusState.password && !errorMessages.password
                                                            ? "text-primary"
                                                            : (errorMessages.password
                                                                ? "text-danger-400"
                                                                : "text-gray-400")} mb-1`} size={18} />
                                                    )}
                                                </button>
                                            }
                                            variant='underlined'
                                            color={`${errorMessages.password
                                                ? "danger"
                                                : (focusState.password
                                                    ? "primary"
                                                    : "default")}`}
                                            onValueChange={setPassword}
                                            onFocus={() => setFocusState(prev => ({ ...prev, password: true }))}
                                            onBlur={() => setFocusState(prev => ({ ...prev, password: false }))}
                                            errorMessage={errorMessages.password}
                                            isInvalid={!!errorMessages.password}
                                        />
                                    </div>

                                    <div>
                                        <Input
                                            value={confirmPassword}
                                            id='confirmPassword'
                                            type={isVisible2 ? 'text' : 'password'}
                                            className={`w-full ${focusState.confirmPassword ? "text-primary" : "text-black"}`}
                                            label="Confirmar contraseña"
                                            labelPlacement='inside'
                                            size='lg'
                                            placeholder='Escribe de nuevo tu contraseña'
                                            startContent={
                                                <Lock className={`${focusState.confirmPassword && !errorMessages.confirmPassword
                                                    ? "text-primary"
                                                    : (errorMessages.confirmPassword
                                                        ? "text-danger-400"
                                                        : "text-gray-400")} mb-1`} size={18} />
                                            }
                                            endContent={
                                                <button className="focus:outline-none" type="button" onClick={() => setIsVisible2(!isVisible2)} aria-label="toggle password visibility">
                                                    {isVisible2 ? (
                                                        <EyeClosed className={`${focusState.confirmPassword && !errorMessages.confirmPassword
                                                            ? "text-primary"
                                                            : (errorMessages.confirmPassword
                                                                ? "text-danger-400"
                                                                : "text-gray-400")} mb-1`} size={18} />
                                                    ) : (
                                                        <Eye className={`${focusState.confirmPassword && !errorMessages.confirmPassword
                                                            ? "text-primary"
                                                            : (errorMessages.confirmPassword
                                                                ? "text-danger-400"
                                                                : "text-gray-400")} mb-1`} size={18} />
                                                    )}
                                                </button>
                                            }
                                            variant='underlined'
                                            color={`${errorMessages.confirmPassword
                                                ? "danger"
                                                : (focusState.confirmPassword
                                                    ? "primary"
                                                    : "default")}`}
                                            onValueChange={setConfirmPassword}
                                            onFocus={() => setFocusState(prev => ({ ...prev, confirmPassword: true }))}
                                            onBlur={() => setFocusState(prev => ({ ...prev, confirmPassword: false }))}
                                            errorMessage={errorMessages.confirmPassword}
                                            isInvalid={!!errorMessages.confirmPassword}
                                        />
                                    </div>
                                </div>

                                <Checkbox className='mt-3' color='primary' onClick={toggleChecked}>
                                    <p className="font-extralight text-sm ml-1 flex-grow">
                                        He leído y acepto los{' '}
                                        <a href="#" className="text-blue-600 hover:underline font-semibold">
                                            Terminos y Condiciones.
                                        </a>
                                    </p>
                                </Checkbox>

                                <Button isDisabled={!checked} isLoading={loading} type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                                    {loading ? "Cargando" : "Crear cuenta"}
                                </Button>
                            </form>

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
