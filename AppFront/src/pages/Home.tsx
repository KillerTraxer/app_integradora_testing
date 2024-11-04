import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Chart from "react-apexcharts";
import { CalendarClock, UsersRound } from "lucide-react"
import ListOfAppointments from "@/components/ListofAppointments"
import useAuthStore  from '@/store/authStore';

export default function Home() {
    const { auth } = useAuthStore();

    const chartOptions = {
        chart: {
            id: 'basic-line'
        },
        xaxis: {
            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May']
        },
        colors: ['#3087fb']
    }

    const chartSeries = [
        {
            name: 'Citas',
            data: [10, 20, 15, 8, 7]
        }
    ]

    const cardsInfo = [
        {
            title: "Total de citas",
            total: 4,
            icon: CalendarClock
        },
        {
            title: "Total de pacientes",
            total: 3,
            icon: UsersRound,
        }
    ]

    return (
        <div className="lg:pl-6 lg:pr-3 md:pl-6 md:pr-3 pt-3 pl-4 pr-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cardsInfo.map((item, index) => (
                    <Card key={index} className="card-bg pt-4 pb-4 pl-5 pr-5 flex flex-row justify-between items-center">
                        <div>
                            <CardBody>
                                <h1 className="font-semibold text-sm mb-2">{item.title}</h1>
                                <p className="font-normal text-5xl">{item.total}</p>
                            </CardBody>
                        </div>
                        <div>
                            <item.icon className="text-[#3087fb]" size={70} />
                        </div>
                    </Card>
                ))}
                {/* Tarjeta de Total de citas */}


                {/* Tarjeta de Lista */}
                <ListOfAppointments />

                {/* Tarjeta con gráfica */}
                <Card className="card-bg md:col-span-2">
                    <CardHeader className="ml-4 mt-2">
                        <h1 className="font-semibold text-sm">{auth?.user.nombre}</h1>
                    </CardHeader>
                    <CardBody className="h-[300px] overflow-hidden">
                        <Chart
                            options={chartOptions}
                            series={chartSeries}
                            type="area"
                            height="100%"
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}
