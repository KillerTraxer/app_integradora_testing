import { Mail, Lock, Phone, User2, Eye, EyeClosed, Users, CheckCircle } from 'lucide-react'
import { Button, Input, Checkbox } from '@nextui-org/react';
import { useState } from 'react';
import React from "react";
import api from "@/axiosInstance"
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'

export default function RegisterForm() {
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [duplicateErrors, setDuplicateErrors] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            lastNames: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'El nombre solo puede contener letras y acentos')
                .required('El nombre es requerido'),
            lastNames: Yup.string()
                .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Los apellidos solo pueden contener letras y acentos')
                .required('Los apellidos son requeridos'),
            phone: Yup.string().matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos').required('El teléfono es requerido'),
            email: Yup.string().email('Email inválido').required('El email es requerido'),
            password: Yup.string().min(8, 'La contraseña debe tener al menos 8 caracteres').required('La contraseña es requerida'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
                .required('Confirma tu contraseña'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setDuplicateErrors([]);
            setSubmitStatus(null);

            try {
                await api.post('/auth/register', {
                    nombre: values.name,
                    apellidos: values.lastNames,
                    telefono: values.phone,
                    email: values.email,
                    password: values.password,
                    confirmPassword: values.confirmPassword
                });

                setIsSuccess(true);
                formik.resetForm();
            } catch (error: any) {
                setIsSuccess(false);

                if (error.response && error.response.status === 400) {
                    const { errors } = error.response.data;

                    const errorMessages = errors.map((err: any) => err.message);
                    setDuplicateErrors(errorMessages);
                } else {
                    setSubmitStatus("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
                }
            } finally {
                setLoading(false);
            }

        },
    })

    const toggleChecked = () => setChecked(!checked);

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

    const renderInput = (fieldName: string, label: string, icon: React.ReactNode, type: string = "text") => (
        <Input
            id={fieldName}
            name={fieldName}
            label={label}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            type={type}
            value={formik.values[fieldName as keyof typeof formik.values]}
            onChange={formik.handleChange}
            onBlur={(e) => {
                formik.handleBlur(e);
                setFocusedField(null);
            }}
            onFocus={() => setFocusedField(fieldName)}
            isInvalid={formik.touched[fieldName as keyof typeof formik.touched] && !!formik.errors[fieldName as keyof typeof formik.errors]}
            errorMessage={formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors]}
            startContent={React.cloneElement(icon as React.ReactElement, { className: getIconColor(fieldName), size: 18 })}
            color={getInputColor(fieldName)}
        />
    )

    const renderPasswordInput = (fieldName: string, label: string, isVisible: boolean, setIsVisible: (value: boolean) => void) => (
        <Input
            id={fieldName}
            name={fieldName}
            label={label}
            placeholder={`Ingresa tu ${label.toLowerCase()}`}
            type={isVisible ? "text" : "password"}
            value={formik.values[fieldName as keyof typeof formik.values]}
            onChange={formik.handleChange}
            onBlur={(e) => {
                formik.handleBlur(e);
                setFocusedField(null);
            }}
            onFocus={() => setFocusedField(fieldName)}
            isInvalid={formik.touched[fieldName as keyof typeof formik.touched] && !!formik.errors[fieldName as keyof typeof formik.errors]}
            errorMessage={formik.touched[fieldName as keyof typeof formik.touched] && formik.errors[fieldName as keyof typeof formik.errors]}
            startContent={<Lock className={getIconColor(fieldName)} size={18} />}
            endContent={
                <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)} aria-label="toggle password visibility">
                    {isVisible ? (
                        <EyeClosed className={getIconColor(fieldName)} size={18} />
                    ) : (
                        <Eye className={getIconColor(fieldName)} size={18} />
                    )}
                </button>
            }
            color={getInputColor(fieldName)}
        />
    )

    return (
        <>
            {duplicateErrors.length > 0 && (
                <ul className="bg-red-100 text-red-500 px-4 py-2 rounded-md mb-4 list-disc list-inside">
                    {duplicateErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}

            {submitStatus && (
                <p className="bg-red-100 text-red-500 p-3 rounded-md mb-4">
                    {submitStatus}
                </p>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div className="space-y-4">
                    <div className='flex flex-row space-x-8'>
                        <div className='w-full'>
                            {renderInput("name", "Nombre", <User2 />)}
                        </div>

                        <div className='w-full'>
                            {renderInput("lastNames", "Apellidos", <Users />)}
                        </div>
                    </div>

                    {renderInput("phone", "Teléfono", <Phone />)}
                    {renderInput("email", "Email", <Mail />)}
                    {renderPasswordInput("password", "Contraseña", isPasswordVisible, setIsPasswordVisible)}
                    {renderPasswordInput("confirmPassword", "Confirmar Contraseña", isConfirmPasswordVisible, setIsConfirmPasswordVisible)}
                </div>

                <div className='flex flex-row items-center mt-4'>
                    <Checkbox color='primary' onClick={toggleChecked} />
                    <p className="font-extralight text-sm ml-1 flex-grow">
                        He leído y acepto los{' '}
                        <a href="#" className="text-blue-600 hover:underline font-semibold">
                            Terminos y Condiciones.
                        </a>
                    </p>
                </div>

                <Button isDisabled={!checked || isSuccess} isLoading={loading} type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                    <AnimatePresence mode='wait'>
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                Enviando...
                            </motion.div>
                        )}
                        {!loading && !isSuccess && (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Registrarse
                            </motion.div>
                        )}
                        {!loading && isSuccess && (
                            <motion.div
                                key="success"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 flex items-center justify-center"
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
