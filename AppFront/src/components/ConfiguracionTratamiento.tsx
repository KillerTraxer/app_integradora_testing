import { Input, Select, SelectItem, Spinner } from "@nextui-org/react"
import { TimePicker, ConfigProvider, Form } from "antd";
import useFetchData from "@/hooks/useFetchData"
import useAuthStore from "@/store/authStore"
import { Clock } from "lucide-react"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function ConfiguracionTratamiento({ tratamientos, actualizarTratamiento }: any) {
    const { auth, theme } = useAuthStore()
    const { data: agendaDoc, isLoading: isLoadingAgendaDoc } = useFetchData(`/agendaDoc/${auth?.user._id}`, null);

    const datePickerTheme = {
        components: {
            DatePicker: {
                colorBgContainer: theme === 'dark' ? '#27272a' : '#ffffff',
                colorBgElevated: theme === 'dark' ? '#27272a' : '#ffffff',
                colorText: theme === 'dark' ? '#fff' : '#000000',
                colorTextPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
                cellHoverBg: theme === "dark" ? '#1f1f1f' : "#f5f5f5",
                controlItemBgActive: theme === "dark" ? '#3b3b42' : '#e6f4ff', // Color de fondo cuando está seleccionado
                colorIcon: theme === "dark" ? "#fff" : "#a9a9a9", // Color de los iconos (flechas)
                colorIconHover: theme === "dark" ? "#fff" : "#1f1f1f", // Color de los iconos en hover
                colorTextHeading: theme === "dark" ? "#fff" : '#1f1f1f', // Color del texto del encabezado (mes/año)
            },
        },
    };

    const disabledTime = () => {
        //@ts-ignore
        if (!agendaDoc || !agendaDoc.horario) return {
            disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
            disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i)
        };

        //@ts-ignore
        const [startHour, startMinute] = agendaDoc.horario.inicio.split(':').map(Number);
        //@ts-ignore
        const [endHour, endMinute] = agendaDoc.horario.fin.split(':').map(Number);

        const disabledHours = () => {
            const hours = [];
            for (let i = 0; i < 24; i++) {
                if (i < startHour || i > endHour) {
                    hours.push(i);
                }
            }
            return hours;
        };

        const disabledMinutes = (selectedHour: any) => {
            const minutes = [];
            for (let i = 0; i < 60; i++) {
                if (
                    (selectedHour === startHour && i < startMinute) ||
                    (selectedHour === endHour && i > endMinute)
                ) {
                    minutes.push(i);
                }
            }
            return minutes;
        };

        return {
            disabledHours,
            disabledMinutes
        };
    };

    if (isLoadingAgendaDoc) return (
        <div className="flex items-center justify-center">
            <Spinner size='lg' />
        </div>
    );

    return (
        <div>
            {tratamientos.map((tratamiento: any, index: any) => (
                <div key={tratamiento.id} className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Configuración del Tratamiento {index + 1}</h2>
                    <div className="mb-4 flex items-end gap-2">
                        <Input
                            label="Duración estimada"
                            type="number"
                            value={tratamiento.configuracion.duracion.valor}
                            onChange={(e) => actualizarTratamiento(tratamiento.id, 'configuracion', {
                                ...tratamiento.configuracion,
                                duracion: { ...tratamiento.configuracion.duracion, valor: e.target.value }
                            })}
                            className="flex-grow"
                        />
                        <Select
                            value={tratamiento.configuracion.duracion.unidad}
                            onChange={(e) => actualizarTratamiento(tratamiento.id, 'configuracion', {
                                ...tratamiento.configuracion,
                                duracion: { ...tratamiento.configuracion.duracion, unidad: e.target.value }
                            })}
                            className="w-1/3"
                            label="Unidad"
                        >
                            <SelectItem key="semanas" value="semanas">Semanas</SelectItem>
                            <SelectItem key="meses" value="meses">Meses</SelectItem>
                        </Select>
                    </div>
                    <ConfigProvider theme={datePickerTheme}>
                        <Form.Item
                            className={`input-date-bg rounded-xl flex relative p-2`}
                        >
                            <TimePicker
                                value={tratamiento.configuracion.horaPreferida}
                                onChange={(dateString: any) => {
                                    const date = dayjs(dateString, 'DD/MM/YYYY HH:mm:ss');
                                    actualizarTratamiento(tratamiento.id, 'configuracion', {
                                        ...tratamiento.configuracion,
                                        horaPreferida: date
                                    })
                                }}
                                disabledTime={disabledTime}
                                placeholder="Hora preferida"
                                className='w-full border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                format="HH:mm"
                                minuteStep={agendaDoc?.intervaloCitas?.duracion}
                                size='large'
                                variant='borderless'
                                suffixIcon={<Clock size={18} />}
                                popupClassName="date-picker-popup"
                            />
                        </Form.Item>
                    </ConfigProvider>
                    <Input
                        label="Frecuencia (días)"
                        type="number"
                        value={tratamiento.configuracion.frecuencia}
                        onChange={(e) => actualizarTratamiento(tratamiento.id, 'configuracion', {
                            ...tratamiento.configuracion,
                            frecuencia: e.target.value
                        })}
                    />
                </div>
            ))}
        </div>
    )
}