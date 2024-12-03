import { useState } from 'react'
import { Button, Spinner } from "@nextui-org/react"
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

export default function TratamientoForm({ hasTreatment, pacienteInfo, onHide, onCreateTratamiento, isLoadingTreatments }: any) {
    const { auth, theme } = useAuthStore()
    const [loading, setLoading] = useState(false);
    //@ts-ignore
    const [submitStatus, setSubmitStatus] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    console.log(hasTreatment)

    const [tratamientos, setTratamientos] = useState(
        hasTreatment && hasTreatment.length > 0
            ? hasTreatment.map((tratamiento: any) => ({
                id: tratamiento._id,
                general: tratamiento.general,
                fases: tratamiento.fases,
                configuracion: tratamiento.configuracion,
            }))
            : [
                {
                    id: "1",
                    general: "",
                    fases: [{ id: "1", contenido: "" }],
                    configuracion: {
                        duracion: { valor: "", unidad: "" },
                        horaPreferida: "",
                        frecuencia: "",
                    },
                },
            ]
    );

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
        const nuevosTratamientos = tratamientos.filter((t: any) => t.id !== id)
        setTratamientos(nuevosTratamientos.map((tratamiento: any, index: any) => ({ ...tratamiento, id: (index + 1).toString() })))
    }

    const actualizarTratamiento = (id: string, campo: string, valor: any) => {
        setTratamientos(tratamientos.map((t: any) =>
            t.id === id ? { ...t, [campo]: valor } : t
        ))
    }

    const formatHoraPreferida = (horaPreferida: any) => {
        if (typeof horaPreferida === 'string') {
            return horaPreferida;
        } else {
            return horaPreferida.$H + ':' + horaPreferida.$m.toString().padStart(2, '0');
        }
    }

    const colores = [
        'bg-green-500',
        'bg-orange-500',
        'bg-purple-500',
        'bg-yellow-500',
        'bg-blue-200',
        'bg-red-500',
    ];

    const generarCitas = (tratamientos: any[]) => {
        //@ts-ignore
        const citas = [];

        tratamientos.forEach((tratamiento) => {
            const duracion = tratamiento.configuracion.duracion.valor;
            const frecuencia = tratamiento.configuracion.frecuencia;
            const horaPreferida = tratamiento.configuracion.horaPreferida;

            const fechaInicio = new Date();
            //this was added
            fechaInicio.setDate(fechaInicio.getDate() + frecuencia);
            fechaInicio.setHours(0, 0, 0, 0);

            for (let i = 0; i < duracion; i++) {
                const fechaCita = new Date(fechaInicio);
                fechaCita.setDate(fechaCita.getDate() + i * frecuencia);
                fechaCita.setHours(horaPreferida.split(":")[0], horaPreferida.split(":")[1], 0, 0);
                const motivo = `Cita ${i + 1}: ${tratamiento.general}`;
                const colorCita = colores[Math.floor(Math.random() * colores.length)];

                citas.push({
                    paciente: pacienteInfo._id,
                    dentista: auth?.user._id,
                    fecha: fechaCita.toISOString(),
                    status: 'confirmada',
                    tratamientoCita: tratamiento._id,
                    motivo: motivo,
                    colorCita: colorCita
                });
            }
        });

        //@ts-ignore
        return citas;
    };

    const formik = useFormik({
        initialValues: {
            tratamientos,
        },
        onSubmit: async () => {
            setLoading(true);
            setSubmitStatus(null);

            const tratamientosFormateados = tratamientos.map((tratamiento: any) => ({
                _id: tratamiento.id,
                general: tratamiento.general,
                fases: tratamiento.fases,
                configuracion: {
                    ...tratamiento.configuracion,
                    horaPreferida: formatHoraPreferida(tratamiento.configuracion.horaPreferida)
                }
            }));

            const citas = generarCitas(tratamientosFormateados);

            if (hasTreatment.length > 0) {
                try {
                    tratamientosFormateados.forEach((tratamiento: any) => {
                        axiosInstanceWithAuth.put(`/tratamientos/${tratamiento._id}`, tratamiento);
                    });

                    toastSuccess({ message: 'Tratamiento actualizado exitosamente' });
                    setIsDialogOpen(false);
                    onHide();
                    onCreateTratamiento();
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
            } else {
                try {
                    await axiosInstanceWithAuth.post(`/tratamientos`, {
                        dentista: auth?.user._id,
                        paciente: pacienteInfo._id,
                        tratamientos: tratamientosFormateados,
                        citas
                    });

                    toastSuccess({ message: 'Tratamiento creado exitosamente' });
                    setIsDialogOpen(false);
                    onHide();
                    onCreateTratamiento();
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
            }
        },
    });

    if (isLoadingTreatments) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

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
