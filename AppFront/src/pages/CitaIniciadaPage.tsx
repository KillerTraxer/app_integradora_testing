import { User, Spinner, Button, Textarea, Tooltip, Chip } from "@nextui-org/react";
import { useParams, useNavigate } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import { useState, useEffect } from "react";
import { BookHeart, ClipboardList } from "lucide-react"
import HistorialClinicoForm from "@/components/HistorialClinicoForm";
import TratamientoForm from "@/components/TratamientoForm";
import useAuthStore from "@/store/authStore";
import axiosInstanceWithAuth from "@/utils/axiosInstanceWithAuth";
import toastSuccess from "@/components/ui/toastSuccess";

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Set the locale to Spanish
dayjs.locale('es')

export default function CitaIniciadaPage() {
    const { theme } = useAuthStore();
    const params = useParams();
    const idCita = params.id || '';
    const { data: appointmentDetails, isLoading: isLoadingDetails } = useFetchData(`/citas/${idCita}`, null);
    const { data: patientInfo, isLoading: isLoadingPatientInfo } = useFetchData(`/pacientes/${appointmentDetails?.paciente}`, null, undefined, !isLoadingDetails && appointmentDetails !== null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const [showHistorialForm, setShowHistorialForm] = useState(false);
    const [showTratamientoForm, setShowTratamientoForm] = useState(false);
    const [reload, setReload] = useState(false);
    const { data: hasHistorial, isLoading: isLoadingHistorial } = useFetchData(`/historiasClinicas/paciente/${appointmentDetails?.paciente}`, null, reload, !isLoadingDetails && appointmentDetails !== null);
    const { data: hasTreatment, isLoading: isLoadingTreatments } = useFetchData(`/tratamientos/paciente/${appointmentDetails?.paciente}`, null, reload, !isLoadingDetails && appointmentDetails !== null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [fecha, setFecha] = useState('');

    const handleHideHistorialForm = () => {
        setShowHistorialForm(false);
    };

    const handleHideTratamientoForm = () => {
        setShowTratamientoForm(false);
    };

    const handleChangeReload = () => {
        setReload(true);
    }

    useEffect(() => {
        if (!isLoadingDetails) {
            setReload(false);
        }
    }, [isLoadingDetails]);

    const terminarCita = async () => {
        setIsLoading(true);
        try {
            await axiosInstanceWithAuth.patch(`/citas/terminar/${idCita}`, { status: 'realizada', observaciones: observaciones });
            setIsLoading(false);
            toastSuccess({ message: 'Cita terminada exitosamente' });
            navigate(`/citas/${idCita}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!hasHistorial) return;
        const fechaNacimiento = `${hasHistorial.fechaNacimiento.year}-${hasHistorial.fechaNacimiento.month.toString().padStart(2, '0')}-${hasHistorial.fechaNacimiento.day.toString().padStart(2, '0')}`;
        setFecha(fechaNacimiento);
    }, [hasHistorial]);

    if (isLoadingDetails || isLoadingPatientInfo || isLoadingHistorial || isLoadingTreatments) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    console.log(hasTreatment);

    return (
        <>
            {showHistorialForm ? (
                <HistorialClinicoForm fecha={fecha} hasHistorial={hasHistorial} onCreateHistorial={handleChangeReload} pacienteInfo={patientInfo} onHide={handleHideHistorialForm} motivo={appointmentDetails?.motivo} />
            ) : showTratamientoForm ? (
                <TratamientoForm pacienteInfo={patientInfo} onHide={handleHideTratamientoForm} hasTreatment={hasTreatment} onCreateTratamiento={handleChangeReload} isLoadingTreatments={isLoadingTreatments} />
            ) : (
                <>
                    <div className="flex flex-row gap-3 mb-4 items-center">
                        <h1 className='text-2xl font-semibold'>Cita en Curso</h1>
                        <p className="font-semibold mt-1">{dayjs(appointmentDetails?.fecha).format('DD/MM/YYYY')}</p>
                    </div>


                    <User
                        avatarProps={{ radius: "lg", src: undefined }}
                        description={(
                            <p className="w-44 text-nowrap overflow-hidden text-ellipsis text-sm">{patientInfo.email}</p>
                        )}
                        name={(
                            <p className="w-44 text-nowrap overflow-hidden text-ellipsis text-lg">{patientInfo.nombre} {patientInfo.apellidos}</p>
                        )}
                    />

                    <div className="flex flex-row items-center gap-4 flex-wrap mb-5 mt-5">
                        <Button
                            className="flex"
                            variant="flat"
                            color="primary"
                            startContent={(<div><BookHeart size={22} /></div>)}
                            onClick={() => setShowHistorialForm(true)}
                            isLoading={isLoadingHistorial}
                        >
                            Crear historial clínico
                        </Button>

                        {!hasHistorial ? (
                            <Tooltip content="No puedes crear un tratamiento sin un historial clínico." placement="right" showArrow={true} color="primary">
                                <Chip
                                    variant="flat"
                                    className={`${theme === "dark" ? "bg-[#0f213b] text-[#536d8e] hover:bg-[#0f213b]" : "bg-[#d5e4f8] text-[#769bc6] hover:bg-[#d5e4f8]"} flex cursor-default justify-center gap-3 py-5 px-4 font-semibold rounded-xl text-base`}
                                    startContent={(<div><ClipboardList size={22} /></div>)}
                                >
                                    Crear tratamiento
                                </Chip>
                            </Tooltip>
                        ) : (
                            <Button
                                variant="flat"
                                color="primary"
                                startContent={(<div><ClipboardList size={22} /></div>)}
                                onClick={() => setShowTratamientoForm(true)}
                                isLoading={isLoadingHistorial}
                            >
                                Crear tratamiento
                            </Button>
                        )}

                    </div>



                    <Textarea
                        id='observaciones'
                        name='observaciones'
                        label={(<p className="text-gray-500 font-light text-base">Observaciones de la cita</p>)}
                        labelPlacement="outside"
                        placeholder="Escribe tus observaciones."
                        value={observaciones}
                        classNames={{
                            base: "w-full",
                            input: "resize-y min-h-[80px]",
                            inputWrapper: "input-custom"
                        }}
                        onChange={(e) => setObservaciones(e.target.value)}
                        onBlur={() => {
                            setFocusedField(null);
                        }}
                        rows={4}
                        color={focusedField === "observaciones" ? "primary" : "default"}
                        onFocus={() => setFocusedField('observaciones')}
                    />

                    <div className="flex flex-row justify-between mt-14 space-x-4">
                        <Button variant="flat" color="danger" onClick={() => navigate(-1)} isLoading={isLoading}>
                            Volver
                        </Button>

                        <Button variant="flat" color="primary" onClick={terminarCita} isLoading={isLoading}>
                            Finalizar cita
                        </Button>
                    </div>
                </>
            )}
        </>
    )
}
