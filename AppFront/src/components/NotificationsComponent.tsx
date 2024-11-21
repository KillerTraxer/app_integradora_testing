import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, DropdownSection, Badge } from "@nextui-org/react";
import { Bell } from "lucide-react"
import { useState, useEffect } from "react";
import { db, collection, onSnapshot, query, where, orderBy, getDocs, updateDoc } from "@/utils/firebaseUtil"
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

interface Notification {
    id: number;
    username: string;
    title: string;
    content: string;
    date: Date;
    nombre: string;
    cita: string;
}

export default function NotificationsComponent() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newNotification, setNewNotification] = useState(false);
    const [newNotificationCount, setNewNotificationCount] = useState(0);
    const { auth } = useAuthStore();
    const [loading, setLoading] = useState(true);

    // const notificationsRef = collection(db, 'notificaciones');

    useEffect(() => {
        const q = query(collection(db, "notificaciones"),
            where("usuario", "==", auth?.user._id),
            orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (loading) {
                setLoading(false);
            }

            try {

                //@ts-ignore
                setNotifications(snapshot.docs.map(doc => ({
                    id: doc.id,
                    cita: doc.get('cita'),
                    content: doc.get('content') || 'Sin contenido',
                    date: new Date(doc.get('date')),
                    nombre: doc.get('nombre'),
                    status: doc.get('status') || 'new',
                    title: doc.get('title') || 'Sin título'
                })));

                setNewNotification(snapshot.docs.some(doc => doc.get('status') === 'new'));
                setNewNotificationCount(snapshot.docs.filter(doc => doc.get('status') === 'new').length);
            } catch (error) {
                console.error('Error al obtener notificaciones:', error);
            }
        });

        return () => unsubscribe();
    }, [db, loading]);

    const markAllAsRead = async () => {
        if (!auth?.user || !auth.user._id) return;

        try {
            const q = query(
                collection(db, "notificaciones"),
                where("usuario", "==", auth.user._id),
                orderBy('date', 'desc')
            );

            const snapshot = await getDocs(q);

            snapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    status: 'read'
                });
            });

            setNewNotification(false); // Marca como leídas todas las notificaciones
        } catch (error) {
            console.error('Error marcando como leídas:', error);
        }
    };

    const handleMarkAsRead = () => {
        markAllAsRead();
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <button
                    className="focus:outline-none"
                    type="button"
                    onClick={handleMarkAsRead}
                >
                    <Badge isInvisible={!newNotification} content={newNotificationCount} color="primary" shape="circle">
                        <Bell style={{ width: '24px', height: '24px' }} className="cursor-pointer color-icons hover:text-[#0186D6] focus:text-[#0186D6] active:text-[#317098]" />
                    </Badge>
                </button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Profile Actions" variant="flat" className="w-80">
                <DropdownItem className="flex flex-row justify-between" variant="faded">
                    <div className="flex flex-row justify-between gap-8">
                        <p className="font-bold">Notificaciones</p>
                        {/* <p className="font-base text-primary">Marcar como leidas</p> */}
                    </div>
                </DropdownItem>

                <DropdownSection className="overflow-y-visible overflow-x-hidden max-h-36">
                    {notifications.length === 0 ? (
                        <DropdownItem className="h-auto gap-2" showDivider>
                            <div className="flex flex-row gap-4 justify-center">
                                <div>
                                    <p className="font-normal text-wrap w-fit overflow-hidden text-gray-500 text-ellipsis">Sin notificaciones...</p>
                                </div>
                            </div>
                        </DropdownItem>
                    ) : (
                        notifications.map((item, index) => (
                            <DropdownItem key={`${item.id}-${index}`} className="h-auto gap-2" showDivider onClick={() => navigate(`/citas/${item.cita}`)}>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <Avatar
                                            isBordered
                                            as="button"
                                            className="transition-transform"
                                            src={undefined}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.title}</p>
                                        <p className="font-normal text-wrap w-fit overflow-hidden text-gray-500 text-ellipsis">{item.nombre} {item.content}</p>
                                    </div>
                                </div>
                            </DropdownItem>
                        ))
                    )}
                </DropdownSection>
                <DropdownItem key="seeAll" className="h-10 text-center" color="primary">
                    <p className="font-semibold">Ver todas</p>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
