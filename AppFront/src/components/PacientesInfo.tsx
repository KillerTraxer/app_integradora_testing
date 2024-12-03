import { useParams } from "react-router-dom";
import useFetchData from "@/hooks/useFetchData";
import { User, Spinner, Button, Chip } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { BookHeart, ClipboardList } from "lucide-react"
import HistorialClinicoForm from "@/components/HistorialClinicoForm";
import TratamientoForm from "@/components/TratamientoForm";
import { useNavigate } from "react-router-dom";
import ListofAppointmentsUser from "./ListofAppointmentsUser";

export default function PacientesInfo() {
    const navigate = useNavigate();
    const params = useParams();
    const idPaciente = params.id || '';
    const [reload, setReload] = useState(false);
    const [fecha, setFecha] = useState('');
    const [showHistorialForm, setShowHistorialForm] = useState(false);
    const [showTratamientoForm, setShowTratamientoForm] = useState(false);
    const { data: patientInfo, isLoading: isLoadingPatientInfo } = useFetchData(`/pacientes/${idPaciente}`, null);
    const { data: hasHistorial, isLoading: isLoadingHistorial } = useFetchData(`/historiasClinicas/paciente/${idPaciente}`, null, reload, !isLoadingPatientInfo && patientInfo !== null);
    const { data: hasTreatment, isLoading: isLoadingTreatments } = useFetchData(`/tratamientos/paciente/${idPaciente}`, null, reload, !isLoadingPatientInfo && patientInfo !== null);

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
        if (!isLoadingPatientInfo) {
            setReload(false);
        }
    }, [isLoadingPatientInfo]);

    useEffect(() => {
        if (!hasHistorial) return;
        const fechaNacimiento = `${hasHistorial.fechaNacimiento.year}-${hasHistorial.fechaNacimiento.month.toString().padStart(2, '0')}-${hasHistorial.fechaNacimiento.day.toString().padStart(2, '0')}`;
        setFecha(fechaNacimiento);
    }, [hasHistorial]);

    if (isLoadingPatientInfo) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    console.log(hasTreatment)

    return (
        <>
            {showHistorialForm ? (
                <HistorialClinicoForm fecha={fecha} hasHistorial={hasHistorial} onCreateHistorial={handleChangeReload} pacienteInfo={patientInfo} onHide={handleHideHistorialForm} />
            ) : showTratamientoForm ? (
                <TratamientoForm pacienteInfo={patientInfo} onHide={handleHideTratamientoForm} hasTreatment={hasTreatment} onCreateTratamiento={handleChangeReload} isLoadingTreatments={isLoadingTreatments} />
            ) : (
                <div className="pb-10">
                    <div className="flex flex-row gap-4 mb-4">
                        <h1 className='text-2xl font-semibold'>Información del paciente</h1>

                        <Button variant="flat" color="danger" onClick={() => navigate(-1)}>
                            Volver
                        </Button>
                    </div>


                    <User
                        avatarProps={{ radius: "lg", src: undefined }}
                        description={(
                            <p className="w-44 text-nowrap overflow-hidden text-ellipsis text-sm">{patientInfo.email}</p>
                        )}
                        name={(
                            <div className="flex flex-row gap-4">
                                <p className="w-44 text-nowrap overflow-hidden text-ellipsis text-lg">{patientInfo.nombre} {patientInfo.apellidos}</p>
                                <Chip color={`${patientInfo.status === 'sin tratamiento' ? 'warning' : 'success'}`} variant="flat" className="">{patientInfo.status}</Chip>
                            </div>
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
                            isDisabled={patientInfo.status === 'sin tratamiento'}
                        >
                            Ver historial clinico
                        </Button>

                        <Button
                            variant="flat"
                            color="primary"
                            startContent={(<div><ClipboardList size={22} /></div>)}
                            onClick={() => setShowTratamientoForm(true)}
                            isLoading={isLoadingHistorial}
                            isDisabled={patientInfo.status === 'sin tratamiento'}
                        >
                            Ver tratamientos
                        </Button>

                    </div>

                    <ListofAppointmentsUser patientId={idPaciente} />
                </div>
            )}
        </>
    )
}
