import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Checkbox } from '@nextui-org/react'
import dayjs from 'dayjs'

interface EventModalProps {
    isOpen: boolean
    onClose: () => void
    onAddEvent: (event: any) => void
    onDeleteEvent: (event: any) => void
    onUpdateEvent: (event: any) => void
    initialDate: any
    workHours: any
    event: any;
}

export default function EventModalComponent({ isOpen, onClose, onAddEvent, initialDate, workHours, onDeleteEvent, onUpdateEvent, event }: EventModalProps) {
    const [title, setTitle] = useState(event ? event.title : '');
    const [startDate, setStartDate] = useState(event ? dayjs(event.start) : initialDate);
    const [endDate, setEndDate] = useState(event ? dayjs(event.end) : initialDate);
    const [isAllDay, setIsAllDay] = useState(event ? event.allDay : false);

    useEffect(() => {
        // Update state based on props
        setTitle(event?.title || '');
        setStartDate(dayjs(event?.start || initialDate));
        setEndDate(dayjs(event?.end || initialDate));
        setIsAllDay(event?.allDay || false);
    }, [event, initialDate]);

    const handleAllDayChange = (checked: any) => {
        setIsAllDay(checked)
        if (checked) {
            setStartDate(dayjs(startDate).startOf('day'))
            setEndDate(dayjs(endDate).endOf('day'))
        } else {
            const [startHour, startMinute] = workHours.start.split(':').map(Number)
            const [endHour, endMinute] = workHours.end.split(':').map(Number)
            setStartDate(dayjs(startDate).hour(startHour).minute(startMinute))
            setEndDate(dayjs(endDate).hour(endHour).minute(endMinute))
        }
    }

    const handleCreateEvent = (e: any) => {
        e.preventDefault()
        const newEvent = {
            title,
            start: startDate.toDate(),
            end: endDate.toDate(),
            allDay: isAllDay,
        }

        onAddEvent(newEvent);
        resetForm()
    }

    const handleUpdateEvent = (e: any) => {
        e.preventDefault()
        const newEvent = {
            ...event,
            title,
            start: startDate.toDate(),
            end: endDate.toDate(),
            allDay: isAllDay,
        }

        onUpdateEvent(newEvent);
        resetForm()
    }

    const resetForm = () => {
        setTitle('')
        setStartDate(initialDate)
        setEndDate(initialDate)
        setIsAllDay(false)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className='card-bg'>
            <ModalContent>
                <ModalHeader>{event ? 'Editar evento' : 'Agregar evento'}</ModalHeader>
                <ModalBody>
                    <form onSubmit={event ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
                        <Input
                            label="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Consulta, Vacaciones, etc."
                        />
                        <Input
                            label="Fecha y hora de inicio"
                            type="datetime-local"
                            value={dayjs(startDate).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => setStartDate(dayjs(e.target.value))}
                        />
                        <Input
                            label="Fecha y hora de fin"
                            type="datetime-local"
                            value={dayjs(endDate).format("YYYY-MM-DDTHH:mm")}
                            onChange={(e) => setEndDate(dayjs(e.target.value))}
                        />
                        <Checkbox
                            isSelected={isAllDay}
                            onValueChange={handleAllDayChange}
                        >
                            Todo el día
                        </Checkbox>
                    </form>
                </ModalBody>
                <ModalFooter className='flex'>
                    {event && (
                        <Button color="danger" variant='flat' onClick={() => onDeleteEvent(event._id)}>
                            Eliminar
                        </Button>
                    )}

                    <div className='ml-auto'>
                        <Button color="default" onClick={onClose} variant='flat' className='mr-3'>
                            Cancelar
                        </Button>
                        <Button onClick={event ? handleUpdateEvent : handleCreateEvent} isDisabled={!title || !startDate || !endDate} variant='flat' color="primary">
                            {event ? 'Editar' : 'Agregar'}
                        </Button>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
