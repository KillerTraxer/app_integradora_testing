import { Card, CardHeader, CardBody, Spinner, Chip } from "@nextui-org/react";
import useFetchData from "@/hooks/useFetchData";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es'
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.locale('es')

export default function ListOfAppointmentsAdmin() {
    const { data: citas, isLoading: isLoadingCitas } = useFetchData("/citas", null);
    const { theme } = useAuthStore();
    const navigate = useNavigate();

    let events = [] as any;

    if (!isLoadingCitas) {
        const today = new Date();

        events = citas
            .filter((cita: any) => dayjs(cita.fecha).isSameOrAfter(today, "day") && cita.status !== 'sin realizar' && cita.status !== 'realizada')
            .map((cita: any) => ({
                id: cita._id,
                title: cita.motivo,
                time: dayjs(cita.fecha).format("hh:mm A"),
                color: cita.colorCita,
                date: dayjs(cita.fecha).toDate(),
                status: cita.status
            }));
    }

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

    function EventList() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date: any) => {
            return dayjs(date).format("dddd, D MMMM");
        };

        const categorizeEvents = () => {
            //@ts-ignore
            return events.reduce((acc, event) => {
                if (dayjs(event.date).isSame(today, "day")) {
                    acc.today.push(event)
                } else if (dayjs(event.date).isSame(tomorrow, "day")) {
                    acc.tomorrow.push(event);
                } else {
                    acc.later.push(event)
                }
                return acc
            }, { today: [] as typeof events, tomorrow: [] as typeof events, later: [] as typeof events });
        }

        const categorizedEvents = categorizeEvents()

        const renderEventGroup = (title: any, events: any) => (
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {events.length === 0 ? (
                    <p>No hay citas programadas.</p>
                ) : (
                    events.map((event: any, index: any) => (
                        <div key={index} className="flex items-center shadow-md rounded-md overflow-hidden mb-2 cursor-pointer" onClick={() => navigate(`/citas/${event.id}`)}>
                            <div className={`w-1 h-16 ${event.color}`}></div>
                            <div className="flex-grow p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.time}</p>
                                </div>
                                <div className="text-sm text-right flex flex-col">
                                    <div className="ml-auto">
                                        <Chip color={getStatusColor(event.status)} variant="flat">
                                            {event.status === 'confirmada' ? 'Confirmada' :
                                                event.status === 'realizada' ? 'Completada' :
                                                    event.status === 'cancelada' ? 'Cancelada' :
                                                        event.status === 'sin realizar' ? 'Sin Realizar' : ''}
                                        </Chip>
                                    </div>
                                    <p>{formatDate(event.date)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );

        return (
            <div className="space-y-2">
                {renderEventGroup('Hoy', categorizedEvents.today)}
                {renderEventGroup('Mañana', categorizedEvents.tomorrow)}
                {renderEventGroup('Más tarde', categorizedEvents.later)}
            </div>
        )
    }

    if (isLoadingCitas) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <Card className="card-bg md:row-span-2">
            <CardHeader className="mt-2">
                <h1 className="font-semibold text-sm">Citas en camino</h1>
            </CardHeader>
            <CardBody>
                <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                    {events.length > 0 ? <EventList /> : <p>No hay citas programadas.</p>}
                </div>
            </CardBody>
        </Card>
    )
}
