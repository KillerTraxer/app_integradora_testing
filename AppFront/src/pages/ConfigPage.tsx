import { Button, Divider } from "@nextui-org/react";
import { Edit2 } from "lucide-react";
import EditInfoForm from "@/components/EditInfoForm";
import ChangeImgComponent from "@/components/ChangeImgComponent";

export default function ConfigPage() {

    return (
        <div>
            <h1 className='text-2xl font-semibold'>Configuración de perfil</h1>
            <p className='font-light mb-8'>Administra tu información personal y configuración de cuenta</p>

            {/* PICTURE SETTINGS */}
            <div className="flex flex-col space-y-4 w-fit mb-7">
                <ChangeImgComponent />
            </div>

            {/* INPUTS */}
            <h2 className="text-xl font-semibold mb-4">Información personal</h2>
            <EditInfoForm />

            <Divider />

            <div className="space-y-3 mt-5">
                <h3 className="text-xl font-semibold">Seguridad</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Contraseña</p>
                        <p className="font-extralight">••••••••</p>
                    </div>
                    <Button variant="light" onClick={() => alert("Redirigiendo a la página de cambio de contraseña...")}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Cambiar contraseña
                    </Button>
                </div>
            </div>

        </div>
    )
}
