import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button, Input, Textarea } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react';
import React from "react";
import { Mail, Phone, User2, Users, CheckCircle, Calendar } from 'lucide-react'
import { DatePicker, Form } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import dayjs from 'dayjs';
// import { format } from "@formkit/tempo"
import api from "@/axiosInstance";

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

interface Props {
    onSuccess: () => void;
}

export default function ScheduleForm({ onSuccess }: Props) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };

    const disabledDate = (current: any) => {
        return current.isBefore(dayjs().startOf('day'));
    };

    const onChange = (dateString: any) => {
        const date = dayjs(dateString, 'DD/MM/YYYY HH:mm:ss');
        const isoDate = date.format('YYYY-MM-DDTHH:mm:ss.sssZ');

        // const formattedExpiry = format({
        //     date: isoDate,
        //     format: "DD/MM/YYYY HH:mm A",
        //     tz: "America/Mexico_City"
        // });

        // console.log(formattedExpiry)
        setSelectedDate(isoDate);
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            lastNames: '',
            phone: '',
            email: '',
            motivo: '',
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
            motivo: Yup.string().required('El motivo es requerido'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setSubmitStatus(null);

            try {
                await api.post('/citas/public', {
                    nombre: values.name,
                    apellidos: values.lastNames,
                    telefono: values.phone,
                    email: values.email,
                    fecha: selectedDate,
                    motivo: values.motivo,
                });

                setIsSuccess(true);
                setSelectedDate(null);
                formik.resetForm();
                onSuccess();
            } catch (error: any) {
                setIsSuccess(false);

                if (error.response && error.response.status === 400) {
                    const { errors } = error.response.data;

                    console.log(errors)
                } else {
                    setSubmitStatus("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
                }
            } finally {
                setLoading(false);
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

    return (
        <>
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

                    <Form.Item
                        label={<label style={{ fontSize: 13, paddingLeft: 14 }}>Fecha y hora</label>}
                        className='bg-[#f4f4f5] rounded-xl hover:bg-[#e4e4e7] active:bg-[#e6f1fe]'
                        colon={false}
                        labelCol={{ flex: '100px' }}
                        labelAlign="left"
                    >
                        <DatePicker
                            showTime
                            onChange={onChange}
                            onOk={onOk}
                            size='large'
                            className='w-full'
                            variant='borderless'
                            placeholder='Selecciona una fecha y hora'
                            suffixIcon={<Calendar size={18} />}
                            format='DD/MM/YYYY HH:mm:ss'
                            disabledDate={disabledDate}
                        />
                    </Form.Item>
                    {/* {<p className='text-xs text-danger '>La fecha es necesaria</p>} */}

                    <Textarea
                        id='motivo'
                        name='motivo'
                        label="Motivo"
                        placeholder="Escribe el motivo de tu cita."
                        value={formik.values["motivo" as keyof typeof formik.values]}
                        classNames={{
                            base: "w-full",
                            input: "resize-y min-h-[40px]",
                        }}
                        onChange={formik.handleChange}
                        onBlur={(e) => {
                            formik.handleBlur(e);
                            setFocusedField(null);
                        }}
                        disableAutosize
                        rows={3}
                        color={getInputColor("motivo")}
                        onFocus={() => setFocusedField('motivo')}
                        isInvalid={formik.touched["motivo" as keyof typeof formik.touched] && !!formik.errors["motivo" as keyof typeof formik.errors]}
                        errorMessage={formik.touched["motivo" as keyof typeof formik.touched] && formik.errors["motivo" as keyof typeof formik.errors]}
                    />
                </div>

                <Button isDisabled={isSuccess} isLoading={loading} type="submit" className="w-full p-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-base">
                    <AnimatePresence mode='wait'>
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >

                            </motion.div>
                        )}
                        {!loading && !isSuccess && (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Enviar
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
