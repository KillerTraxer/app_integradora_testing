import { useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers'
import { MinusIcon, GripVertical } from 'lucide-react'

interface Fase {
    id: string
    contenido: string
}

function SortableItem({ fase, index, actualizarFase, eliminarFase, mostrarEliminarFase, activeFase }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: fase.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <li ref={setNodeRef} style={style} className="p-2 rounded flex items-center mb-2">
            <div {...attributes} {...listeners} className={`mr-2 cursor-${activeFase && activeFase.id === fase.id ? 'grabbing' : 'grab'}`}>
                <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            <Input
                label={`Fase ${index + 1}`}
                value={fase.contenido}
                onChange={(e) => actualizarFase(fase.id, e.target.value)}
                className="flex-grow mr-2"
            />

            {mostrarEliminarFase && (
                <Button
                    isIconOnly
                    color="danger"
                    aria-label="Eliminar fase"
                    variant="light"
                    onClick={() => eliminarFase(fase.id)}
                >
                    <MinusIcon className="h-4 w-4" />
                </Button>
            )}
        </li>
    )
}

export default function TratamientoGeneral({ tratamientos, actualizarTratamiento, eliminarTratamiento }: any) {
    const [activeFase, setActiveFase] = useState<Fase | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent, tratamientoId: string) => {
        const { active } = event
        const tratamiento = tratamientos.find((t: any) => t.id === tratamientoId)
        setActiveFase(tratamiento?.fases.find((f: any) => f.id === active.id) || null)
    }

    const handleDragEnd = (event: DragEndEvent, tratamientoId: string) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const tratamiento = tratamientos.find((t: any) => t.id === tratamientoId)
            if (tratamiento) {
                const oldIndex = tratamiento.fases.findIndex((f: any) => f.id === active.id)
                const newIndex = tratamiento.fases.findIndex((f: any) => f.id === over?.id)

                const newFases = arrayMove(tratamiento.fases, oldIndex, newIndex)
                actualizarTratamiento(tratamientoId, 'fases', newFases)

                setTimeout(() => {
                    const updatedFases = newFases.map((fase: any, index: any) => ({ ...fase, id: (index + 1).toString() }))
                    actualizarTratamiento(tratamientoId, 'fases', updatedFases)
                }, 500)
            }
        }

        setActiveFase(null)
    }

    const agregarFase = (tratamientoId: string) => {
        const tratamiento = tratamientos.find((t: any) => t.id === tratamientoId)
        if (tratamiento) {
            const nuevoId = tratamiento.fases.length + 1
            actualizarTratamiento(
                tratamientoId,
                'fases',
                [...tratamiento.fases, { id: nuevoId.toString(), contenido: '' }]
            )
        }
    }

    const eliminarFase = (tratamientoId: string, faseId: string) => {
        const tratamiento = tratamientos.find((t: any) => t.id === tratamientoId)
        if (tratamiento) {
            const nuevasFases = tratamiento.fases.filter((f: any) => f.id !== faseId).map((fase: any, index: any) => ({ ...fase, id: (index + 1).toString() }))
            actualizarTratamiento(tratamientoId, 'fases', nuevasFases)
        }
    }

    return (
        <div>
            {tratamientos.map((tratamiento: any, index: any) => (
                <div key={tratamiento.id} className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Tratamiento {index + 1}</h2>
                    <Input
                        label="Tratamiento general"
                        placeholder='Ej. Tratamiento odontológico'
                        value={tratamiento.general}
                        onChange={(e) => actualizarTratamiento(tratamiento.id, 'general', e.target.value)}
                        className="mb-4"
                    />
                    <h2 className="text-lg font-semibold">Fases del tratamiento</h2>
                    <p className='font-light mb-2'>Arrastre y suelte las fases para cambiar el orden</p>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={(event) => handleDragStart(event, tratamiento.id)}
                        onDragEnd={(event) => handleDragEnd(event, tratamiento.id)}
                        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                    >
                        <div className="max-h-[270px] overflow-y-auto">
                            <SortableContext items={tratamiento.fases.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
                                {tratamiento.fases.map((fase: any, faseIndex: any) => (
                                    <SortableItem
                                        key={fase.id}
                                        fase={fase}
                                        index={faseIndex}
                                        actualizarFase={(faseId: string, nuevoContenido: string) => {
                                            const nuevasFases = tratamiento.fases.map((f: any) =>
                                                f.id === faseId ? { ...f, contenido: nuevoContenido } : f
                                            )
                                            actualizarTratamiento(tratamiento.id, 'fases', nuevasFases)
                                        }}
                                        eliminarFase={(faseId: string) => eliminarFase(tratamiento.id, faseId)}
                                        mostrarEliminarFase={tratamiento.fases.length > 1}
                                        activeFase={activeFase}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </DndContext>
                    <Button onClick={() => agregarFase(tratamiento.id)} className="mt-2" variant='flat' color='primary'>Agregar fase</Button>
                    {tratamientos.length > 1 && (
                        <Button color="danger" variant='flat' onClick={() => eliminarTratamiento(tratamiento.id)} className="mt-2 ml-2">Eliminar tratamiento</Button>
                    )}
                </div>
            ))}
        </div>
    )
}
