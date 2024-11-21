import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Select, SelectItem, Avatar, Spinner, Tooltip, Chip } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import { Calendar, CirclePlus } from 'lucide-react'
import { DatePicker, Form, ConfigProvider } from 'antd';
import useAuthStore from "@/store/authStore"
import useFetchData from "@/hooks/useFetchData"
import axiosInstanceWithAuth from "@/utils/axiosInstanceWithAuth"
import toastSuccess from "@/components/ui/toastSuccess";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function ScheduleForm({ onNewAppointment }: any) {
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { theme, auth } = useAuthStore();
    const { data: listaDentistas, isLoading: isLoadingDentistas } = useFetchData("/dentista", null);
    const [dentistaId, setDentistaId] = useState(null);
    const [agendaDoc, setAgendaDoc] = useState(null);
    const [loadingAgendaDoc, setLoadingAgendaDoc] = useState(false);
    const [newCita, setNewCita] = useState(false);
    const [hasConfirmedAppointment, setHasConfirmedAppointment] = useState(false);
    const [loadingHasConfirmedAppointment, setLoadingHasConfirmedAppointment] = useState(true);
    const { data: citasForMe, isLoading: isLoadingCitasForMe } = useFetchData(`/citas/paciente/${auth?.user._id}`, null, newCita);
    const [citasConfirmadas, setCitasConfirmadas] = useState([]);
    const { data: citas, isLoading: isLoadingCitas } = useFetchData(`/citas`, null);

    useEffect(() => {
        if (!isLoadingCitas) {
            const citasConfirmadas = citas?.filter((cita: any) => cita.status === "confirmada") || [];
            setCitasConfirmadas(citasConfirmadas);
        }
    }, [isLoadingCitas, citas]);

    const disabledDate = (current: any) => {
        //@ts-ignore
        if (!agendaDoc || !agendaDoc.diasTrabajo) return () => false;

        const currentDay = dayjs(current).day();
        const today = dayjs()

        //@ts-ignore
        let isDisabledBySchedule = !agendaDoc.diasTrabajo.some(dia => dia.dia === currentDay && dia.activo);

        //@ts-ignore
        const eventsOnDay = agendaDoc.eventos.filter(event =>
            dayjs(event.fechaInicio).isSame(dayjs(current), 'day') &&
            dayjs(event.fechaFin).isSame(dayjs(current), 'day')
        );

        if (eventsOnDay.length > 0 && eventsOnDay.every((event: any) => event.allDay)) {
            isDisabledBySchedule = true;
        }

        if (dayjs(current).isBefore(today, 'day') || dayjs(current).isSame(today, 'day')) {
            isDisabledBySchedule = true;
        }

        return isDisabledBySchedule;
    };

    const disabledTime = (date: any) => {
        //@ts-ignore
        if (!agendaDoc || !agendaDoc.horario) return {
            disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
            disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i)
        };

        //@ts-ignore
        const [startHour, startMinute] = agendaDoc.horario.inicio.split(':').map(Number);
        //@ts-ignore
        const [endHour, endMinute] = agendaDoc.horario.fin.split(':').map(Number);

        //@ts-ignore
        const eventos = agendaDoc.eventos || [];

        const isTimeBooked = (hour: any, minute: any) => {
            //@ts-ignore
            const isEventBooked = eventos.some((event: any) => {
                const eventStart = dayjs(event.fechaInicio);
                const eventEnd = dayjs(event.fechaFin);
                const selectedDateTime = dayjs(date).hour(hour).minute(minute);

                return selectedDateTime.isBetween(eventStart, eventEnd, null, '[)');
            });

            const isCitaBooked = citasConfirmadas.some((cita: any) => {
                const citaDateTime = dayjs(cita.fecha);
                return date.isSame(citaDateTime, 'day') &&
                    hour === citaDateTime.hour() &&
                    minute === citaDateTime.minute();
            });

            return isCitaBooked || isEventBooked;
        };

        const disabledHours = () => {
            const hours = [];
            for (let i = 0; i < 24; i++) {
                if (i < startHour || i > endHour || Array.from({ length: 60 }, (_, m) => isTimeBooked(i, m)).every(Boolean)) {
                    hours.push(i);
                }
            }
            return hours;
        };

        const disabledMinutes = (selectedHour: any) => {
            const minutes = [];
            for (let i = 0; i < 60; i++) {
                if (
                    (selectedHour === startHour && i < startMinute) ||
                    (selectedHour === endHour && i > endMinute) ||
                    isTimeBooked(selectedHour, i)
                ) {
                    minutes.push(i);
                }
            }
            return minutes;
        };

        return {
            disabledHours,
            disabledMinutes
        };
    };

    const fetchAgendaDoc = async () => {
        setLoadingAgendaDoc(true);
        try {
            const response = await axiosInstanceWithAuth.get(`/agendaDoc/${dentistaId}`);
            setAgendaDoc(response.data);
        } catch (err: any) {
            console.log(err);
        } finally {
            setLoadingAgendaDoc(false);
        }
    }

    useEffect(() => {
        if (dentistaId) {
            fetchAgendaDoc();
        }
    }, [dentistaId]);

    const colores = [
        'bg-green-500',
        'bg-orange-500',
        'bg-purple-500',
        'bg-yellow-500',
        'bg-blue-200',
        'bg-red-500',
    ];

    const colorCita = colores[Math.floor(Math.random() * colores.length)];

    const formik = useFormik({
        initialValues: {
            fecha: '',
            motivo: '',
            dentista: '',
        },
        validationSchema: Yup.object({
            fecha: Yup.string().required('La fecha es requerida'),
            motivo: Yup.string().required('El motivo es requerido'),
            dentista: Yup.string().required('El dentista es requerido'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setSubmitStatus(null);

            try {
                await axiosInstanceWithAuth.post(`/citas/${auth?.user._id}`, {
                    dentistaId: values.dentista,
                    fecha: selectedDate,
                    motivo: values.motivo,
                    status: 'confirmada',
                    colorCita
                });

                setSelectedDate(null);
                formik.resetForm();

                onClose();
                toastSuccess({ message: 'Cita agendada exitosamente' });
                onNewAppointment();
                setNewCita(true);
            } catch (error: any) {
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

    const datePickerTheme = {
        components: {
            DatePicker: {
                colorBgContainer: theme === 'dark' ? '#27272a' : '#ffffff',
                colorBgElevated: theme === 'dark' ? '#27272a' : '#ffffff',
                colorText: theme === 'dark' ? '#fff' : '#000000',
                colorTextPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
                cellHoverBg: theme === "dark" ? '#1f1f1f' : "#f5f5f5",
                controlItemBgActive: theme === "dark" ? '#3b3b42' : '#e6f4ff', // Color de fondo cuando está seleccionado
                colorIcon: theme === "dark" ? "#fff" : "#a9a9a9", // Color de los iconos (flechas)
                colorIconHover: theme === "dark" ? "#fff" : "#1f1f1f", // Color de los iconos en hover
                colorTextHeading: theme === "dark" ? "#fff" : '#1f1f1f', // Color del texto del encabezado (mes/año)
            },
        },
    };

    useEffect(() => {
        const checkHasConfirmedAppointment = async () => {
            setLoadingHasConfirmedAppointment(true);
            try {
                const hasConfirmed = !isLoadingCitasForMe && citasForMe !== null && citasForMe.length > 0 && citasForMe.some((cita: any) => cita.status === 'confirmada');
                setHasConfirmedAppointment(hasConfirmed);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingHasConfirmedAppointment(false);
            }
        };
        checkHasConfirmedAppointment();
    }, [citasForMe, isLoadingCitasForMe]);

    return (
        <>
            {loadingHasConfirmedAppointment ? (
                <Spinner />
            ) : (
                hasConfirmedAppointment ? (
                    <Tooltip content="No puedes agendar una cita si ya tienes una confirmada" placement="right" showArrow={true} color="primary">
                        <Chip
                            variant="flat"
                            className={`${theme === "dark" ? "bg-[#0f213b] text-[#536d8e] hover:bg-[#0f213b]" : "bg-[#d5e4f8] text-[#769bc6] hover:bg-[#d5e4f8]"} mb-5 flex cursor-default justify-center gap-3 px-9 py-5 font-semibold rounded-lg text-base`}
                            startContent={<CirclePlus className={`${theme === 'dark' ? 'text-[#536d8e]' : 'text-[#769bc6]'}`} />}
                        >
                            Agendar cita
                        </Chip>
                    </Tooltip>
                ) : (
                    <Button
                        className="w-52 mb-5 flex justify-center gap-3 px-3 font-semibold rounded-lg text-base"
                        variant="flat"
                        color='primary'
                        startContent={<CirclePlus />}
                        onPress={onOpen}
                    >
                        Agendar cita
                    </Button>
                )
            )}

            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className="card-bg"
                hideCloseButton
                size="xl"
                placement='center'
                onClose={() => {
                    onClose();
                    formik.resetForm();
                    setSubmitStatus(null);
                    setAgendaDoc(null);
                    setDentistaId(null);
                    setFocusedField(null);
                    setSelectedDate(null);
                }}
                isDismissable={!loading}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Agendar cita</ModalHeader>
                            <ModalBody>
                                {submitStatus && (
                                    <p className={`${theme === "dark" ? "bg-[#3b1d36]" : "bg-[#fdd0df]"} p-3 rounded-md mb-4`} style={{ color: theme === "dark" ? "#ef4444" : "#68102e" }}>
                                        {submitStatus}
                                    </p>
                                )}

                                <form onSubmit={formik.handleSubmit}>
                                    <div className="space-y-4">
                                        <Select
                                            items={listaDentistas}
                                            label="Dentistas"
                                            placeholder="Elige a tu dentista"
                                            name="dentista"
                                            id='dentista'
                                            isInvalid={formik.touched["dentista" as keyof typeof formik.touched] && !!formik.errors["dentista" as keyof typeof formik.errors]}
                                            errorMessage={formik.touched["dentista" as keyof typeof formik.touched] && formik.errors["dentista" as keyof typeof formik.errors]}
                                            color={getInputColor('dentista')}
                                            value={formik.values.dentista}
                                            onChange={formik.handleChange}
                                            onBlur={(e) => {
                                                formik.handleBlur(e);
                                                setFocusedField(null);
                                            }}
                                            onFocus={() => setFocusedField('dentista')}
                                            onSelectionChange={(dentista: any) => {
                                                formik.setFieldValue('dentista', dentista);
                                                setDentistaId(dentista.currentKey);
                                            }}

                                            classNames={{
                                                label: "group-data-[filled=true]:mb-4",
                                                trigger: "min-h-16",
                                                listboxWrapper: "max-h-[400px]",
                                            }}
                                            listboxProps={{
                                                itemClasses: {
                                                    base: [
                                                        "rounded-md",
                                                        "text-default-500",
                                                        "transition-opacity",
                                                        "data-[hover=true]:text-foreground",
                                                        "data-[hover=true]:bg-default-100",
                                                        "dark:data-[hover=true]:bg-default-50",
                                                        "data-[selectable=true]:focus:bg-default-50",
                                                        "data-[pressed=true]:opacity-70",
                                                        "data-[focus-visible=true]:ring-default-500",
                                                    ],
                                                },
                                            }}
                                            renderValue={(items) => {
                                                return items.map((item) => (
                                                    <div key={item.key} className="flex items-center gap-2">
                                                        <Avatar
                                                            alt={item?.props?.nombre}
                                                            className="flex-shrink-0"
                                                            size="sm"
                                                            src={undefined}
                                                        />
                                                        <div className="flex flex-col">
                                                            <span>{item?.props?.value.nombre}</span>
                                                            <span className="text-default-500 text-tiny">{item?.props?.value?.email}</span>
                                                        </div>
                                                    </div>
                                                ));
                                            }}
                                        >
                                            {isLoadingDentistas ? (
                                                <SelectItem key={"loading"} value="loading">Cargando dentistas...</SelectItem>
                                            ) : (
                                                listaDentistas.map((dentista: any) => (
                                                    //@ts-ignore
                                                    <SelectItem aria-label='lista-dentistas' key={dentista._id} value={{ id: dentista._id, nombre: dentista.nombre, email: dentista.email }}>
                                                        <div className="flex gap-2 items-center">
                                                            <Avatar alt={dentista.nombre} className="flex-shrink-0" size="sm" src={undefined} />
                                                            <div className="flex flex-col">
                                                                <span className="text-small">{dentista.nombre}</span>
                                                                <span className="text-tiny text-default-400">{dentista.email}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            )}
                                        </Select>


                                        <ConfigProvider theme={datePickerTheme}>
                                            <Form.Item
                                                label={<label style={{ fontSize: 12, paddingLeft: 14 }} className={`${formik.errors.fecha ? "text-danger" : "input-date-label"} font-normal`}>Fecha y hora</label>}
                                                className={`${formik.errors.fecha ? theme === "dark" ? "bg-[#310413]" : "bg-[#fee7ef]" : "input-date-bg"} rounded-xl flex relative`}
                                                colon={false}
                                                labelCol={{ flex: '100px' }}
                                                labelAlign="left"
                                                id='fecha'
                                                name='fecha'
                                            >
                                                {loadingAgendaDoc ? (
                                                    <Spinner />
                                                ) : (
                                                    <DatePicker
                                                        value={selectedDate}
                                                        disabled={agendaDoc === null ? true : false}
                                                        showTime={{ format: 'HH:mm' }}
                                                        onChange={(dateString: any) => {
                                                            const date = dayjs(dateString, 'DD/MM/YYYY HH:mm:ss');
                                                            const isoDate = date.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                                                            setSelectedDate(isoDate);
                                                            formik.setFieldValue('fecha', isoDate);
                                                        }}
                                                        //@ts-ignore
                                                        minuteStep={agendaDoc?.intervaloCitas?.duracion}
                                                        //@ts-ignore
                                                        disabledDate={disabledDate}
                                                        disabledTime={disabledTime}
                                                        size='large'
                                                        className='w-full border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                                        variant='borderless'
                                                        placeholder='Selecciona una fecha y hora'
                                                        suffixIcon={<Calendar size={18} />}
                                                        format='DD/MM/YYYY HH:mm'
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                                                        popupClassName="date-picker-popup"
                                                    />
                                                )}
                                            </Form.Item>
                                        </ConfigProvider>

                                        {formik.errors.fecha && (
                                            <p className='text-xs' style={{ color: "#f31260" }}>{formik.errors.fecha}</p>
                                        )}

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
                                            rows={2}
                                            color={getInputColor("motivo")}
                                            onFocus={() => setFocusedField('motivo')}
                                            isInvalid={formik.touched["motivo" as keyof typeof formik.touched] && !!formik.errors["motivo" as keyof typeof formik.errors]}
                                            errorMessage={formik.touched["motivo" as keyof typeof formik.touched] && formik.errors["motivo" as keyof typeof formik.errors]}
                                        />
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="font-semibold rounded-lg text-base" color='danger' variant='flat' onPress={() => { onClose(); formik.resetForm(); setSubmitStatus(null); setAgendaDoc(null); setDentistaId(null); setFocusedField(null); }}>
                                    Cerrar
                                </Button>
                                <Button isLoading={loading} onPress={() => formik.handleSubmit()} className="font-semibold rounded-lg text-base" variant='flat' color='primary' type="submit">
                                    Agendar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
