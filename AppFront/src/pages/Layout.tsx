import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react"
import HeaderComponent from "@/components/HeaderComponent";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(true)

    return (
        <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={open}>
            <AppSidebar />
            <div className="relative w-0">
                <SidebarTrigger className={`mt-[1.6rem] ${!open ? "ml-5" : "lg:ml-2 md:ml-2 ml-4"} hover:text-[#0186D6] text-[#5E6E82]`} />
            </div>

            <HeaderComponent />

            <main className="h-[100vh] w-full pt-16 mr-3">
                <div className="lg:pl-6 lg:pr-3 md:pl-6 md:pr-3 pt-3 pl-4 pr-3 lg:pb-0 pb-10">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
