import { useState } from "react"
import { Avatar, Button, Tooltip, Spinner } from "@nextui-org/react";
import { Camera, X } from "lucide-react";

export default function ChangeImgComponent() {
    const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg?height=100&width=100")
    const [isUploading, setIsUploading] = useState(false)
    const [isNewImageSelected, setIsNewImageSelected] = useState(false)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setIsUploading(true)
            setTimeout(() => {
                setAvatarUrl(URL.createObjectURL(file))
                setIsUploading(false)
                setIsNewImageSelected(true)
            }, 1500)
        }
    }

    const handleImageSave = () => {
        // Here you would typically upload the image to your server
        console.log('Saving image:', avatarUrl)
        setIsNewImageSelected(false)
    }

    const handleImageDelete = () => {
        setAvatarUrl("/placeholder.svg?height=100&width=100")
        setIsNewImageSelected(false)
    }

    return (
        <>
            <div className="relative">
                {isNewImageSelected && (
                    <Tooltip content="Eliminar imagen" placement="left" showArrow={true} color="danger">
                        <Button
                            isIconOnly
                            color="danger"
                            variant="flat"
                            size="sm"
                            className="absolute -top-5 -left-3 z-10"
                            onClick={handleImageDelete}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Tooltip>
                )}
                <Avatar
                    isBordered
                    className="h-24 w-24"
                    src={isUploading ? undefined : avatarUrl}
                    showFallback
                    fallback={
                        isUploading ? (
                            <Spinner color="current" size="lg" />
                        ) : (
                            null
                        )
                    }
                />
                <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 left-16 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
                >
                    <Camera className="h-4 w-4" />
                    <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>
            </div>
            <p className="text-sm font-extralight">Haz clic en el ícono de cámara para cambiar tu foto</p>
            {isNewImageSelected && (
                <Button color="primary" variant="flat" onClick={handleImageSave}>
                    Guardar imagen
                </Button>
            )}
        </>
    )
}
