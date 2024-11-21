import ListofAppointmentsUser from "@/components/ListofAppointmentsUser"
import ScheduleForm from "@/components/ScheduleForm"
import { useState } from "react"

export default function HomeUser() {
    const [newAppointmentCreated, setNewAppointmentCreated] = useState(false);

    const handleNewAppointment = () => {
        setNewAppointmentCreated(true);
    };

    const handleResetNewAppointmentCreated = () => {
        setNewAppointmentCreated(false);
    };

    return (
        <div>
            <ScheduleForm onNewAppointment={handleNewAppointment} />
            <ListofAppointmentsUser newAppointmentCreated={newAppointmentCreated} onResetNewAppointmentCreated={handleResetNewAppointmentCreated} />
        </div>
    )
}
