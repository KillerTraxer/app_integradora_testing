import { Calendar, Home, Users, Clock, MenuIcon, CalendarHeart } from "lucide-react"
import { Image } from "@nextui-org/image";
import LogoWthBg from "@/assets/LogoWthBg.svg"
import { motion } from "framer-motion"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

import useAuthStore from "@/store/authStore"
import { useNavigate } from "react-router-dom"

// Menu items.
const itemsAdmin = [
    {
        title: "Inicio",
        url: "/home",
        icon: Home,
    },
    {
        title: "Calendario",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Citas",
        url: "/citas",
        icon: Clock,
    },
    {
        title: "Pacientes",
        url: "/pacientes",
        icon: Users,
    },
];

const itemsUser = [
    {
        title: "Inicio",
        url: "/home",
        icon: Home,
    },
    {
        title: "Calendario",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Historial de citas",
        url: "/citas",
        icon: Clock,
    },
    {
        title: "Tratamientos",
        url: "#",
        icon: CalendarHeart,
    },
]

export function AppSidebar() {
    const navigate = useNavigate();
    const { toggleSidebar } = useSidebar();
    const { auth } = useAuthStore();

    const getMenuItems = (rol: any) => {
        switch (rol) {
            case "dentista":
                return itemsAdmin;
            default:
                return itemsUser;
        }
    };

    return (
        <motion.div>
            <Sidebar collapsible="offcanvas" variant="inset">
                <SidebarContent>
                    <SidebarGroup>
                        <div className="flex flex-row items-center relative pl-2 pt-1">
                            <Image
                                width={40}
                                alt="Logo clinic"
                                src={LogoWthBg}
                            />
                            <SidebarGroupLabel className="text-2xl text-[#0186D6] font-bold">Dental Care</SidebarGroupLabel>

                            <button className="focus:outline-none ml-7 hover:text-[#0186D6] text-[#5E6E82] lg:hidden md:hidden" type="button" onClick={toggleSidebar}>
                                <MenuIcon style={{ width: '24px', height: '24px' }} />
                            </button>
                        </div>
                        <SidebarGroupContent className="pt-4 pl-3">
                            <SidebarMenu className="space-y-2">
                                {getMenuItems(auth?.user.rol).map((item) => {
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild className="text-lg text-[#5E6E82] hover:text-[#0186D6] focus:text-[#0186D6] active:text-[#317098] font-medium">
                                                <div className="gap-4 cursor-pointer" onClick={() => navigate(item.url)}>
                                                    <item.icon style={{ width: '19px', height: '19px' }} className="color-icons" />
                                                    <span className="color-icons">{item.title}</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </motion.div>
    )
}
