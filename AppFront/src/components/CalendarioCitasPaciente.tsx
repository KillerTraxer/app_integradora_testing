import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { Spinner } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

import useFetchData from '@/hooks/useFetchData'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
const localizer = dayjsLocalizer(dayjs)

const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function CalendarioCitasPaciente() {
    const navigate = useNavigate();
    const { auth } = useAuthStore();
    const { data: citas, isLoading: isLoadingCitas } = useFetchData(`/citas/paciente/${auth?.user._id}`, null);
    const [events, setEvents] = useState([]);
    const [citasLoaded, setCitasLoaded] = useState(false);

    const convertToLocalDate = (date: any) => {
        return dayjs(date).local().toDate()
    }

    // Actualizar los estados cuando se carguen los datos
    useEffect(() => {
        if (!isLoadingCitas) {
            //Establecer eventos
            const citasConfirmadas = citas.filter((cita: any) => cita.status === 'confirmada');
            const convertEvents = (events: any) => {
                return events.map((event: any) => ({
                    ...event,
                    title: event.motivo,
                    start: convertToLocalDate(event.fecha),
                    end: convertToLocalDate(event.fecha),
                    style: {
                        backgroundColor: event.colorCita,
                    },
                }))
            }

            setEvents(convertEvents(citasConfirmadas));

            setCitasLoaded(true);
        }
    }, [citas]);

    const handleSelectEvent = (event: any) => {
        // console.log('Evento seleccionado:', event);
        navigate(`/citas/${event._id}`);
    };

    const getColorHex = (color: any) => {
        switch (color) {
            case 'bg-green-500':
                return '#34C759';
            case 'bg-orange-500':
                return '#FFA07A';
            case 'bg-purple-500':
                return '#7A288A';
            case 'bg-yellow-500':
                return '#F7DC6F';
            case 'bg-blue-200':
                return '#87CEEB';
            case 'bg-red-500':
                return '#FF3737';
            default:
                return '#fff';
        }
    };

    if (isLoadingCitas) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <div>
            {citasLoaded && (
                <DragAndDropCalendar
                    localizer={localizer}
                    events={events}
                    //@ts-ignore
                    startAccessor="start"
                    //@ts-ignore
                    endAccessor="end"
                    style={{ height: 500 }}
                    views={['month', 'week', 'day']}
                    selectable
                    onSelectEvent={(event) => handleSelectEvent(event)}
                    resizable
                    className="p-4 rounded-lg shadow mt-4"
                    popup
                    messages={{
                        next: "Sig",
                        previous: "Ant",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día"
                    }}
                    eventPropGetter={(event: any) => ({
                        style: {
                            backgroundColor: getColorHex(event.colorCita),
                        },
                    })}
                />
            )}
        </div>
    )
}
