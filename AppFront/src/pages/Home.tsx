import HomeAdmin from "@/components/HomeAdmin"
import HomeUser from "@/components/HomeUser"
import useAuthStore from "@/store/authStore"


export default function Home() {
    const { auth } = useAuthStore()

    return (
        <div>
            {auth?.user.rol === "dentista" ? (
                <HomeAdmin />
            ) : (
                <HomeUser />
            )}
        </div>
    )
}
