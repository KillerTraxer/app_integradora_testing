import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, DropdownSection } from "@nextui-org/react";
import { Bell } from "lucide-react"

interface Notification {
    id: number;
    username: string;
    title: string;
    content: string;
    date: Date;
}

export default function NotificationsComponent() {
    const notifications: Notification[] = [
        {
            id: 1,
            username: "John Doe",
            title: "Nueva cita",
            content: "solicito una nueva cita",
            date: new Date(2024, 9, 28)
        },
        {
            id: 2,
            username: "Mario Garcia",
            title: "Nuevo paciente",
            content: "ha creado una nueva cuenta, puedes verla haciendo click",
            date: new Date(2024, 9, 28)
        },
        {
            id: 3,
            username: "Mario Garcia",
            title: "Nuevo paciente",
            content: "ha creado una nueva cuenta, puedes verla haciendo click",
            date: new Date(2024, 9, 28)
        },
        {
            id: 4,
            username: "Mario Garcia",
            title: "Nuevo paciente",
            content: "ha creado una nueva cuenta, puedes verla haciendo click",
            date: new Date(2024, 9, 28)
        },
        {
            id: 5,
            username: "Mario Garcia",
            title: "Nuevo paciente",
            content: "ha creado una nueva cuenta, puedes verla haciendo click",
            date: new Date(2024, 9, 28)
        }
    ];

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <button className="focus:outline-none" type="button">
                    <Bell style={{ width: '24px', height: '24px' }} className="cursor-pointer color-icons hover:text-[#0186D6] focus:text-[#0186D6] active:text-[#317098]" />
                </button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat" className="w-80">
                <DropdownItem className="flex flex-row justify-between" variant="faded">
                    <div className="flex flex-row justify-between gap-8">
                        <p className="font-bold">Notificaciones</p>
                        <p className="font-base text-primary">Marcar como leidas</p>
                    </div>
                </DropdownItem>

                <DropdownSection className="overflow-y-visible overflow-x-hidden max-h-36">
                    {notifications.map((item, index) => (
                        <DropdownItem key={`${item.id}-${index}`} className="h-auto gap-2" showDivider>
                            <div className="flex flex-row gap-4">
                                <div>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="font-normal text-nowrap w-72 overflow-hidden text-ellipsis">{item.username} {item.content}</p>
                                </div>
                            </div>
                        </DropdownItem>
                    ))}
                </DropdownSection>
                <DropdownItem key="seeAll" className="h-10 text-center" color="primary">
                    <p className="font-semibold">Ver todas</p>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
