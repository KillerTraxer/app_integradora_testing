import { Card, CardHeader, CardBody } from "@nextui-org/react";

export default function ListOfAppointments() {
    const events = [
        { title: 'Mario Castañeda', time: '9:00 AM', color: 'bg-green-500', date: new Date(2024, 9, 28) },
        { title: 'Mariana Morales', time: '12:00 PM', color: 'bg-orange-500', date: new Date(2024, 9, 28) },
        { title: 'Jose Garcia Duarte', time: '2:00 PM', color: 'bg-purple-500', date: new Date(2024, 9, 28) },
        { title: 'Erick Meraz Solis', time: '9:00 AM', color: 'bg-yellow-500', date: new Date(2024, 9, 29) },
        { title: 'Fernando Buarciaga', time: '10:00 AM', color: 'bg-blue-200', date: new Date(2024, 9, 29) },
        { title: 'Luis Cabrera', time: '1:00 PM', color: 'bg-red-500', date: new Date(2024, 10, 1) },
    ]

    function EventList() {
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const formatDate = (date: any) => {
            return date.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
        }

        const categorizeEvents = () => {
            return events.reduce((acc, event) => {
                if (event.date.toDateString() === today.toDateString()) {
                    acc.today.push(event)
                } else if (event.date.toDateString() === tomorrow.toDateString()) {
                    acc.tomorrow.push(event)
                } else {
                    acc.later.push(event)
                }
                return acc
            }, { today: [] as typeof events, tomorrow: [] as typeof events, later: [] as typeof events })
        }

        const categorizedEvents = categorizeEvents()

        const renderEventGroup = (title: any, events: any) => (
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                {events.map((event: any, index: any) => (
                    <div key={index} className="flex items-center shadow-sm rounded-md overflow-hidden mb-2 cursor-pointer">
                        <div className={`w-1 h-16 ${event.color}`}></div>
                        <div className="flex-grow p-3 flex justify-between items-center">
                            <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-gray-500">{event.time}</div>
                            </div>
                            <div className="text-sm text-gray-500 text-right">
                                {formatDate(event.date)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )

        return (
            <div className="space-y-2">
                {renderEventGroup('Hoy', categorizedEvents.today)}
                {renderEventGroup('Mañana', categorizedEvents.tomorrow)}
                {renderEventGroup('Más tarde', categorizedEvents.later)}
            </div>
        )
    }

    return (
        <Card className="card-bg md:row-span-2">
            <CardHeader className="mt-2">
                <h1 className="font-semibold text-sm">Citas en camino</h1>
            </CardHeader>
            <CardBody>
                <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                    <EventList />
                </div>
            </CardBody>
        </Card>
    )
}
