import { Checkbox, Input, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axiosInstanceWithAuth from '@/utils/axiosInstanceWithAuth';
import toastSuccess from "@/components/ui/toastSuccess";
import toastError from "@/components/ui/toastError";

const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
];

interface WorkingDaysConfigProps {
    workingDays: any
    setWorkingDays: any
    workHours: any
    setWorkHours: any
    appointmentInterval: any
    setAppointmentInterval: any
    agendaDocId: any
}

export default function WorkingDaysConfig({ workingDays, setWorkingDays, workHours, setWorkHours, appointmentInterval, setAppointmentInterval, agendaDocId }: WorkingDaysConfigProps) {
    // Estados locales para manejar los valores originales y cambios
    const [originalState, setOriginalState] = useState({
        workingDays,
        workHours,
        appointmentInterval,
    });

    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        // Detectar cambios y mostrar botones
        const isChanged =
            JSON.stringify(originalState.workingDays) !== JSON.stringify(workingDays) ||
            JSON.stringify(originalState.workHours) !== JSON.stringify(workHours) ||
            originalState.appointmentInterval !== appointmentInterval;
        setShowButtons(isChanged);
    }, [workingDays, workHours, appointmentInterval, originalState]);

    const toggleDay = (day: number) => {
        const updatedWorkingDays = workingDays.map((workingDay: any) => {
            if (workingDay.dia === day) {
                return { ...workingDay, activo: !workingDay.activo };
            }
            return workingDay;
        });
        setWorkingDays(updatedWorkingDays);
    };

    const handleCancel = () => {
        // Restaurar valores originales
        setWorkingDays(originalState.workingDays);
        setWorkHours(originalState.workHours);
        setAppointmentInterval(originalState.appointmentInterval);
    };

    const handleSave = async () => {
        try {
            const data = {
                workingDays: workingDays.map((day: any) => ({ dia: day.dia, activo: day.activo })),
                workHours: {
                    inicio: workHours.start,
                    fin: workHours.end
                },
                appointmentInterval: {
                    duracion: appointmentInterval
                },
            }

            const response = await axiosInstanceWithAuth.put(`/agendaDoc/update/${agendaDocId}`, data);
            console.log(response)

            setOriginalState({
                workingDays,
                workHours,
                appointmentInterval,
            });
            setShowButtons(false); // Ocultar los botones
            toastSuccess({ message: "Configuración guardada con éxito!" });
        } catch (error) {
            toastError({ message: "Error al actualizar agenda", secondaryMessage: "Intente nuevamente" });
        }
    }

    return (
        <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
                {daysOfWeek.map(({ value, label }) => (
                    <div key={value} className="flex items-center">
                        <Checkbox
                            isSelected={workingDays.find((day: any) => day.dia === value).activo}
                            onValueChange={() => toggleDay(value)}
                        >
                            {label}
                        </Checkbox>
                    </div>
                ))}
            </div>
            <div className="flex gap-4 mb-4">
                <div>
                    <Input
                        label="Hora de inicio"
                        type="time"
                        value={workHours.start}
                        onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
                    />
                </div>
                <div>
                    <Input
                        label="Hora de fin"
                        type="time"
                        value={workHours.end}
                        onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
                    />
                </div>
            </div>
            <div>
                <Input
                    label="Intervalo entre citas (minutos)"
                    type="number"
                    value={appointmentInterval.toString()}
                    onChange={(e) => setAppointmentInterval(Number(e.target.value))}
                    min={15}
                    step={15}
                />
            </div>
            {showButtons && (
                <div className="flex gap-4 mt-4">
                    <Button onPress={handleSave} color="primary" variant="flat">
                        Guardar cambios
                    </Button>
                    <Button onPress={handleCancel} color="danger" variant="flat">
                        Cancelar
                    </Button>
                </div>
            )}
        </div>
    )
}
