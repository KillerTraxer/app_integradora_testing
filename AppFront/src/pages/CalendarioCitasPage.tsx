import CalendarioCitasPaciente from "@/components/CalendarioCitasPaciente"
import CalendarioCitasAdmin from "@/components/CalendarioCitasAdmin"
import useAuthStore from "@/store/authStore"

export default function CalendarioCitasPage() {
    const { auth } = useAuthStore();

    return (
        <div>
            {auth?.user.rol === 'paciente' ? <CalendarioCitasPaciente /> : <CalendarioCitasAdmin />}
        </div>
    )
}
