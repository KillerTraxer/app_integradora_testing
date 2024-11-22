import { Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import Chart from "react-apexcharts";
import { CalendarClock, UsersRound } from "lucide-react"
import ListofAppointmentsAdmin from "@/components/ListofAppointmentsAdmin"
import useFetchData from '@/hooks/useFetchData';

export default function HomeAdmin() {
    const { data: totalCitas, isLoading: isLoadingCitas } = useFetchData('/citas/count', 0);
    const { data: totalPacientes, isLoading: isLoadingPacientes } = useFetchData('/pacientes/count', 0);

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
            total: isLoadingCitas ? <Spinner /> : totalCitas.total,
            icon: CalendarClock
        },
        {
            title: "Total de pacientes",
            total: isLoadingPacientes ? <Spinner /> : totalPacientes.total,
            icon: UsersRound,
        }
    ]

    if (isLoadingCitas || isLoadingPacientes) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cardsInfo.map((item, index) => (
                <Card key={index} className="card-bg pt-4 pb-4 pl-5 pr-5 flex flex-row justify-between items-center">
                    <div>
                        <CardBody>
                            <h1 className="font-semibold text-sm mb-2">{item.title}</h1>
                            <div className="font-normal text-5xl">{item.total}</div>
                        </CardBody>
                    </div>
                    <div>
                        <item.icon className="text-[#3087fb]" size={70} />
                    </div>
                </Card>
            ))}
            {/* Tarjeta de Total de citas */}


            {/* Tarjeta de Lista */}
            <ListofAppointmentsAdmin />

            {/* Tarjeta con gráfica */}
            <Card className="card-bg md:col-span-2">
                <CardHeader className="ml-4 mt-2">
                    <h1 className="font-semibold text-sm">Gráfica de citas por mes</h1>
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
    )
}
