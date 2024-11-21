import useFetchData from "@/hooks/useFetchData";
import { useParams } from "react-router-dom";
import { Spinner, Chip, Button, Divider, Tooltip } from "@nextui-org/react";
import { Calendar, Clock, User, FileText, Edit2, BookUser } from 'lucide-react'
import useAuthStore from "@/store/authStore";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)

// Set the locale to Spanish
dayjs.locale('es')

export default function CitasDetallesComponent() {
    const params = useParams();
    const idCita = params.id || '';
    const { auth, theme } = useAuthStore();
    const { data: appointmentDetails, isLoading: isLoadingDetails } = useFetchData(`/citas/${idCita}`, null);
    const { data: patientInfo, isLoading: isLoadingPatientInfo } = useFetchData(`/pacientes/${appointmentDetails?.paciente}`, null, undefined, !isLoadingDetails && appointmentDetails !== null);
    const { data: dentistaInfo, isLoading: isLoadingDentistaInfo } = useFetchData(`/dentista/${appointmentDetails?.dentista}`, null, undefined, !isLoadingDetails && appointmentDetails !== null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmada':
                return 'success'
            case 'realizada':
                return 'primary'
            case 'cancelada':
                return 'danger'
            case 'sin realizar':
                return 'warning'
            default:
                return 'primary'
        }
    }

    if (isLoadingDetails || isLoadingPatientInfo || isLoadingDentistaInfo) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center mb-6 gap-5">
                <h1 className='text-2xl font-semibold'>Detalles de la cita</h1>
                <div className="flex items-center space-x-3">
                    <Chip color={getStatusColor(appointmentDetails.status)} variant="flat">
                        {appointmentDetails.status === 'confirmada' ? 'Confirmada' :
                            appointmentDetails.status === 'realizada' ? 'Completada' :
                                appointmentDetails.status === 'cancelada' ? 'Cancelada' :
                                    appointmentDetails.status === 'sin realizar' ? 'Sin Realizar' : ''}
                    </Chip>
                    {appointmentDetails.status !== "realizada" && (
                        <Button isIconOnly variant="flat" className="h-8" aria-label="Editar cita">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <Divider className="my-4" />

            <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center space-x-3">
                    <User className="h-6 w-6 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Paciente</p>
                        <p className="text-lg font-semibold">{patientInfo.nombre} {patientInfo.apellidos}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <BookUser className="h-6 w-6 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Dentista</p>
                        <p className="text-lg font-semibold">{dentistaInfo.nombre} {dentistaInfo.apellidos}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Fecha</p>
                        <p className="text-lg font-semibold">
                            {dayjs(appointmentDetails.fecha).format('dddd, D [de] MMMM [del] YYYY')}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-gray-400" />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Hora</p>
                        <p className="text-lg font-semibold">
                            {dayjs(appointmentDetails.fecha).format('HH:mm A')}
                        </p>
                    </div>
                </div>
            </div>

            <Divider className="my-6" />

            <div className="flex items-start space-x-3">
                <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Motivo</p>
                    <p className="text-lg font-semibold">{appointmentDetails.motivo}</p>
                </div>
            </div>

            <div className="flex flex-row justify-between mt-14 space-x-4">
                {appointmentDetails.status === "confirmada" && (
                    <Button color="danger" variant="flat">Cancelar cita</Button>
                )}

                {appointmentDetails.status === "confirmada" && auth?.user.rol === "dentista" && (
                    <div>
                        {dayjs(appointmentDetails.fecha).diff(dayjs(), 'minute') <= 5 ? (
                            <Button
                                color="primary"
                                variant="flat"
                                isDisabled={false}
                            >
                                Iniciar Cita
                            </Button>
                        ) : (
                            <Tooltip content="No puedes iniciar la cita hasta que llegue la fecha programada." placement="right" showArrow={true} color="primary">
                                <Chip
                                    variant="flat"
                                    className={`${theme === "dark" ? "bg-[#0f213b] text-[#536d8e] hover:bg-[#0f213b]" : "bg-[#d5e4f8] text-[#769bc6] hover:bg-[#d5e4f8]"} mb-5 flex cursor-default justify-center gap-3 py-5 font-semibold rounded-xl text-base`}
                                >
                                    Iniciar Cita
                                </Chip>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        </>

    )
}