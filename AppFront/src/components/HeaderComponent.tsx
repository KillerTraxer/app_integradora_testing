import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react";
import { Settings, CalendarRange, LogOut, Sun, Moon } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react";
import NotificationsComponent from "./NotificationsComponent";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function HeaderComponent() {
    const { auth, clearAuth, theme, setTheme } = useAuthStore();
    const navigate = useNavigate();
    const controls = useAnimation()

    const handleIconClick = () => {
        if (!auth?.user) return;
        const newTheme = auth?.user.theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        controls.start({
            rotate: 360,
            transition: { duration: 0.3 }
        }).then(() => {
            controls.set({ rotate: 0 })
        })
    };

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const handleLogout = () => {
        clearAuth();
        //?Redirect to login but don't refresh the page
        // navigate('/login');
        //*Redirect to login and refresh the page
        window.location.replace('/login');
    };

    return (
        <motion.div className="absolute top-0 right-0 flex flex-row gap-6">
            <div className="pt-7">
                <button className="focus:outline-none" type="button" onClick={handleIconClick}>
                    <motion.div animate={controls}>
                        {theme === 'dark' ? (
                            <Moon style={{ width: '24px', height: '24px' }} className="cursor-pointer color-icons hover:text-[#0186D6] focus:text-[#0186D6] active:text-[#317098]" />
                        ) : (
                            <Sun style={{ width: '24px', height: '24px' }} className="cursor-pointer color-icons hover:text-[#0186D6] focus:text-[#0186D6] active:text-[#317098]" />
                        )}
                    </motion.div>
                </button>
            </div>

            <div className="pt-7">
                <NotificationsComponent />
            </div>

            <div className="mt-5 mr-7">
                {auth?.user.rol === "dentista" ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                src=""
                                showFallback
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="shadow" >
                            <DropdownItem key="profile" className="h-14 gap-2 cursor-default" disableAnimation isReadOnly>
                                <p className="font-semibold">Hola!</p>
                                <p className="font-semibold">{auth?.user.nombre}</p>
                            </DropdownItem>
                            <DropdownItem
                                key="settings"
                                startContent={<Settings size={20} strokeWidth={1.5} />}
                                onClick={() => navigate('/configuracion')}
                            >
                                Configuración
                            </DropdownItem>
                            <DropdownItem
                                key="analytics"
                                startContent={<CalendarRange size={20} strokeWidth={1.5} />}
                                onClick={() => navigate('/agenda')}
                            >
                                Agenda
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                startContent={<LogOut size={20} strokeWidth={1.5} />}
                                onClick={() => handleLogout()}
                            >
                                Salir
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                src=""
                                showFallback
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="shadow" >
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Hola!</p>
                                <p className="font-semibold">{auth?.user.nombre}</p>
                            </DropdownItem>
                            <DropdownItem
                                key="settings"
                                startContent={<Settings size={20} strokeWidth={1.5} />}
                                onClick={() => navigate('/configuracion')}
                            >
                                Configuración
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                startContent={<LogOut size={20} strokeWidth={1.5} />}
                                onClick={() => handleLogout()}
                            >
                                Salir
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </div>
        </motion.div>
    )
}
