import { User, Spinner, Button, Textarea } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import { useState } from "react";
import { BookHeart, ClipboardList } from "lucide-react"
import HistorialClinicoForm from "@/components/HistorialClinicoForm";

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
    const params = useParams();
    const idCita = params.id || '';
    const { data: appointmentDetails, isLoading: isLoadingDetails } = useFetchData(`/citas/${idCita}`, null);
    const { data: patientInfo, isLoading: isLoadingPatientInfo } = useFetchData(`/pacientes/${appointmentDetails?.paciente}`, null, undefined, !isLoadingDetails && appointmentDetails !== null);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [observaciones, setObservaciones] = useState('');
    const [showHistorialForm, setShowHistorialForm] = useState(false);

    const handleHideHistorialForm = () => {
        setShowHistorialForm(false);
    };

    if (isLoadingDetails || isLoadingPatientInfo) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <>
            {showHistorialForm ? (
                <HistorialClinicoForm pacienteInfo={patientInfo} onHide={handleHideHistorialForm} motivo={appointmentDetails?.motivo} />
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
                        >
                            Crear historial clínico
                        </Button>

                        <Button variant="flat" color="primary" startContent={(<div><ClipboardList size={22} /></div>)}>
                            Crear tratamiento
                        </Button>
                    </div>



                    <Textarea
                        id='observaciones'
                        name='observaciones'
                        label={(<p className="text-gray-400 font-light text-base">Observaciones para la cita</p>)}
                        labelPlacement="outside"
                        placeholder="Escribe tus observaciones."
                        value={observaciones}
                        classNames={{
                            base: "w-full",
                            input: "resize-y min-h-[80px]",
                        }}
                        onChange={(e) => setObservaciones(e.target.value)}
                        onBlur={() => {
                            setFocusedField(null);
                        }}
                        rows={4}
                        color={focusedField === "observaciones" ? "primary" : "default"}
                        onFocus={() => setFocusedField('observaciones')}
                    />

                    <div className="flex justify-end mt-5 mb-5">
                        <Button variant="flat" color="primary">
                            Finalizar cita
                        </Button>
                    </div>
                </>
            )}
        </>
    )
}
