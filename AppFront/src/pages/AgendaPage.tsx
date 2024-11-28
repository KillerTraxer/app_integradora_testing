import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useState, useCallback, useEffect, useRef } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import WorkingDaysConfig from "@/components/WorkingDaysConfig"
import EventModalComponent from "@/components/EventModalComponent"
import useAuthStore from "@/store/authStore"
import useFetchData from "@/hooks/useFetchData"
import { Spinner } from "@nextui-org/react"
import axiosInstanceWithAuth from "@/utils/axiosInstanceWithAuth"
import toastSuccess from "@/components/ui/toastSuccess";
import toastError from "@/components/ui/toastError";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
const localizer = dayjsLocalizer(dayjs)

const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function AgendaPage() {
    const { theme, auth } = useAuthStore();
    const { data: agendaDoc, isLoading: isLoadingAgenda } = useFetchData(`/agendaDoc/${auth?.user._id}`, null);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const eventsRef = useRef(events);

    useEffect(() => {
        eventsRef.current = events;
    }, [events]);

    // Estados iniciales
    const [workingDays, setWorkingDays] = useState([]);
    const [workingDaysOriginal, setWorkingDaysOriginal] = useState([]);
    const [workHours, setWorkHours] = useState({ start: '09:00', end: '18:00' });
    const [appointmentInterval, setAppointmentInterval] = useState(60);
    const [agendaLoaded, setAgendaLoaded] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const convertToLocalDate = (date: any) => {
        return dayjs(date).local().toDate()
    }

    const convertToUTCString = (date: any) => {
        return dayjs(date).utc().format()
    }

    // Actualizar los estados cuando se carguen los datos
    useEffect(() => {
        if (agendaDoc) {
            //Extraer días laborales activos
            const activeDays = agendaDoc.diasTrabajo
                .filter((day: any) => day.activo)
                .map((day: any) => day.dia);

            setWorkingDays(activeDays);

            const workingDays = agendaDoc.diasTrabajo.map((day: any) => ({
                dia: day.dia,
                activo: day.activo,
            }));

            setWorkingDaysOriginal(workingDays);

            // Establecer horarios laborales
            setWorkHours({
                start: agendaDoc.horario.inicio,
                end: agendaDoc.horario.fin
            });

            // Establecer intervalo de citas
            setAppointmentInterval(agendaDoc.intervaloCitas.duracion);

            //Establecer eventos
            const convertEvents = (events: any) => {
                return events.map((event: any) => ({
                    ...event,
                    start: convertToLocalDate(event.fechaInicio),
                    end: convertToLocalDate(event.fechaFin),
                }))
            }

            setEvents(convertEvents(agendaDoc.eventos));

            setAgendaLoaded(true);
        }
    }, [agendaDoc]);

    const handleSelectSlot = ({ start }: { start: any }) => {
        const selectedDayjs = dayjs(start);
        if (isWorkingDay(start)) {
            setSelectedDate(selectedDayjs);
            setIsModalOpen(true);
        }
    };

    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(false);
    };

    const handleAddEvent = async (newEvent: any) => {
        try {
            const response = await axiosInstanceWithAuth.post(`/agendaDoc/eventos`, {
                agendaDocId: agendaDoc._id,
                title: newEvent.title,
                fechaInicio: newEvent.start,
                fechaFin: newEvent.end,
                allDay: newEvent.allDay,
            });

            const eventData = {
                title: response.data.title,
                fechaInicio: response.data.fechaInicio,
                fechaFin: response.data.fechaFin,
                start: convertToLocalDate(response.data.fechaInicio),
                end: convertToLocalDate(response.data.fechaFin),
                allDay: response.data.allDay,
                _id: response.data._id
            };

            //@ts-ignore
            setEvents(prevEvents => [...prevEvents, eventData]);
            setIsModalOpen(false);

            toastSuccess({ message: 'Evento creado con éxito' });
        } catch (error) {
            toastError({ message: 'Error al crear el evento', secondaryMessage: "Intente nuevamente" });
        }
    }

    const handleDeleteEvent = async (eventId: string) => {
        try {
            await axiosInstanceWithAuth.delete(`/agendaDoc/eventos/${agendaDoc._id}/${eventId}`);
            //@ts-ignore
            setEvents(events.filter((event) => event._id !== eventId));
            setIsModalOpen(false);
            setSelectedEvent(null);

            toastSuccess({ message: 'Evento eliminado con éxito' });
        } catch (error) {
            console.error(error);
            toastError({ message: 'Error al eliminar el evento', secondaryMessage: "Intente nuevamente" });
        }
    };

    const handleUpdateEvent = async (updatedEvent: any) => {
        try {
            const response = await axiosInstanceWithAuth.put(`/agendaDoc/eventos/${agendaDoc._id}/${updatedEvent._id}`, {
                title: updatedEvent.title,
                fechaInicio: convertToUTCString(updatedEvent.start),
                fechaFin: convertToUTCString(updatedEvent.end),
                allDay: updatedEvent.allDay,
            })

            //@ts-ignore
            const updatedEventData = {
                ...response.data,
                start: convertToLocalDate(response.data.fechaInicio),
                end: convertToLocalDate(response.data.fechaFin),
            }

            //@ts-ignore
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    //@ts-ignore
                    event._id === updatedEvent._id ? updatedEventData : event
                )
            );

            setSelectedEvent(null);
            setIsModalOpen(false);
            toastSuccess({ message: 'Evento actualizado con éxito' });
        } catch (error) {
            console.error(error);
            toastError({ message: 'Error al actualizar el evento', secondaryMessage: "Intente nuevamente" });
        }
    };

    const isWorkingDay = (date: any) => {
        //@ts-ignore
        return workingDays.includes(dayjs(date).day())
    }

    const moveEvent = useCallback(
        //@ts-ignore
        ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
            const { allDay } = event
            if (!allDay && droppedOnAllDaySlot) {
                event.allDay = true
            }
            if (allDay && !droppedOnAllDaySlot) {
                event.allDay = false;
            }

            const updatedEvent = { ...event, start, end, allDay: event.allDay };
            updatedEvent._id = event._id;

            if (agendaLoaded) {
                handleUpdateEvent(updatedEvent);
            }
        },
        [setEvents, agendaLoaded]
    )

    const resizeEvent = useCallback(
        //@ts-ignore
        ({ event, start, end }) => {
            //@ts-ignore
            setEvents((prev) => {
                const existing = prev.find((ev: any) => ev.id === event.id) ?? {}
                const filtered = prev.filter((ev: any) => ev.id !== event.id)
                return [...filtered, { ...existing, start, end }]
            })
        },
        [setEvents]
    );

    if (isLoadingAgenda) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <div className='pb-8'>
            <h1 className='text-2xl font-semibold mb-6'>Agenda laboral</h1>
            <p className='font-medium mb-3'>Configurar horario laboral</p>

            {agendaLoaded && (
                <WorkingDaysConfig
                    workingDays={workingDaysOriginal}
                    setWorkingDays={setWorkingDaysOriginal}
                    workHours={workHours}
                    setWorkHours={setWorkHours}
                    appointmentInterval={appointmentInterval}
                    setAppointmentInterval={setAppointmentInterval}
                    agendaDocId={agendaDoc?._id}
                />
            )}

            <p className='font-medium'>Calendario laboral</p>
            <p className='font-light mb-3'>Agrega eventos a tu calendario y estos se sincronizarán con tu agenda laboral</p>

            {agendaLoaded && (
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
                    onSelectSlot={handleSelectSlot}
                    onEventDrop={moveEvent}
                    onEventResize={resizeEvent}
                    onSelectEvent={handleSelectEvent}
                    resizable
                    className="p-4 rounded-lg shadow mt-4 rbc-calendar"
                    //@ts-ignore
                    dayPropGetter={(date) => {
                        if (!isWorkingDay(date)) {
                            return {
                                className: theme === "dark" ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600',
                                style: {
                                    backgroundColor: theme === "dark" ? '#212f4d' : '#f3f4f6',
                                }
                            }
                        }
                    }}
                    min={dayjs().set('hour', parseInt(workHours.start.split(':')[0])).set('minute', parseInt(workHours.start.split(':')[1])).toDate()}
                    max={dayjs().set('hour', parseInt(workHours.end.split(':')[0])).set('minute', parseInt(workHours.end.split(':')[1])).toDate()}
                    popup
                    messages={{
                        next: "Sig",
                        previous: "Ant",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día"
                    }}
                />
            )}


            <EventModalComponent
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddEvent={handleAddEvent}
                onDeleteEvent={handleDeleteEvent}
                onUpdateEvent={(updatedEvent) => handleUpdateEvent(updatedEvent)}
                initialDate={selectedDate}
                workHours={workHours}
                event={selectedEvent}
            />

        </div>
    )
}