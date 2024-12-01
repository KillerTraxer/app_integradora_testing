import { useState } from 'react'
import { Button } from "@nextui-org/react"
import TratamientoGeneral from "@/components/TratamientoGeneral"
import ConfiguracionTratamiento from "@/components/ConfiguracionTratamiento"
import { useFormik } from 'formik'
import toastSuccess from "@/components/ui/toastSuccess";
import axiosInstanceWithAuth from "@/utils/axiosInstanceWithAuth"
import useAuthStore from "@/store/authStore"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function TratamientoForm({ pacienteInfo, onHide }: any) {
    const { auth, theme } = useAuthStore()
    const [loading, setLoading] = useState(false);
    //@ts-ignore
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [tratamientos, setTratamientos] = useState([
        {
            id: '1',
            general: '',
            fases: [{ id: '1', contenido: '' }],
            configuracion: {
                duracion: { valor: '', unidad: '' },
                horaPreferida: '',
                frecuencia: ''
            }
        }
    ])

    const agregarTratamiento = () => {
        const nuevoId = tratamientos.length + 1
        setTratamientos([...tratamientos, {
            id: nuevoId.toString(),
            general: '',
            fases: [{ id: '1', contenido: '' }],
            configuracion: {
                duracion: { valor: '', unidad: '' },
                horaPreferida: '',
                frecuencia: ''
            }
        }])
    }

    const eliminarTratamiento = (id: string) => {
        const nuevosTratamientos = tratamientos.filter(t => t.id !== id)
        setTratamientos(nuevosTratamientos.map((tratamiento, index) => ({ ...tratamiento, id: (index + 1).toString() })))
    }

    const actualizarTratamiento = (id: string, campo: string, valor: any) => {
        setTratamientos(tratamientos.map(t =>
            t.id === id ? { ...t, [campo]: valor } : t
        ))
    }

    const formatHoraPreferida = (horaPreferida: any) => {
        return horaPreferida.$H + ':' + horaPreferida.$m.toString().padStart(2, '0');
    }

    const formik = useFormik({
        initialValues: {
            tratamientos,
        },
        onSubmit: async () => {
            setLoading(true);
            setSubmitStatus(null);

            const tratamientosFormateados = tratamientos.map(tratamiento => ({
                ...tratamiento,
                configuracion: {
                    ...tratamiento.configuracion,
                    horaPreferida: formatHoraPreferida(tratamiento.configuracion.horaPreferida)
                }
            }));

            try {
                await axiosInstanceWithAuth.post(`/tratamientos`, {
                    dentista: auth?.user._id,
                    paciente: pacienteInfo._id,
                    tratamientos: tratamientosFormateados
                });

                toastSuccess({ message: 'Tratamiento creado exitosamente' });
                setIsDialogOpen(false);
                onHide();
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    const { errors } = error.response.data;

                    console.log(errors)
                    setSubmitStatus(errors);
                } else {
                    setSubmitStatus("Error inesperado en el servidor. Por favor, intenta de nuevo más tarde.");
                }
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className='pb-8'>
            <div className="flex flex-row gap-4 mb-5">
                <h1 className='text-2xl font-semibold mb-4'>Crear tratamiento</h1>

                <Button color="danger" variant="flat" onClick={onHide}>Volver</Button>
                <Button color="primary" variant="flat" onClick={() => setIsDialogOpen(true)}>Guardar tratamiento</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-9">

                <TratamientoGeneral
                    tratamientos={tratamientos}
                    actualizarTratamiento={actualizarTratamiento}
                    eliminarTratamiento={eliminarTratamiento}
                />
                <ConfiguracionTratamiento
                    tratamientos={tratamientos}
                    actualizarTratamiento={actualizarTratamiento}
                />
            </div>

            <Button className='w-full' color='primary' variant='flat' onClick={agregarTratamiento}>Agregar otro tratamiento</Button>

            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent className={`${theme === "dark" ? "bg-[#121e2d]" : "bg-[#fff]"} border-0`}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar creación de tratamiento?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button color="danger" onClick={() => setIsDialogOpen(false)}>
                            No, cancelar
                        </Button>
                        <Button color="primary" variant="flat" isLoading={loading} onClick={() => formik.submitForm()}>
                            Confirmar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
