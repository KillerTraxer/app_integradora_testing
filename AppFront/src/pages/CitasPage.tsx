import CitasforUser from '@/components/CitasforUser'
import CitasforAdmin from '@/components/CitasforAdmin'
import useAuthStore from "@/store/authStore"

export default function CitasPage() {
    const { auth } = useAuthStore()

    return (
        <>
            {auth?.user.rol === "dentista" ? (
                <CitasforAdmin />
            ) : (
                <CitasforUser />
            )}
        </>
    )
}
