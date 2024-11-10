import { Calendar, Home, Users, Clock, MenuIcon } from "lucide-react"
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

// Menu items.
const items = [
    {
        title: "Inicio",
        url: "/home",
        icon: Home,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Citas",
        url: "#",
        icon: Clock,
    },
    {
        title: "Pacientes",
        url: "#",
        icon: Users,
    },
]

export function AppSidebar() {
    const { toggleSidebar } = useSidebar();

    return (
        <motion.div initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}>
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
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="text-lg text-[#5E6E82] hover:text-[#0186D6] focus:text-[#0186D6] active:text-[#317098] font-medium">
                                            <a href={item.url} className="gap-4">
                                                <item.icon style={{ width: '19px', height: '19px' }} className="color-icons" />
                                                <span className="color-icons">{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </motion.div>
    )
}
