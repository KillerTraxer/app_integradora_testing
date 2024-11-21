import AgendaDoc from "../models/agendaDoc.model.js";

export const getEventos = async (req, res) => {
    try {
        const eventos = await AgendaDoc.find().select('eventos');
        res.json(eventos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
}

export const postEventos = async (req, res) => {
    try {
        const { agendaDocId, title, fechaInicio, fechaFin, allDay } = req.body;
        const agendaDoc = await AgendaDoc.findById(agendaDocId);
        if (!agendaDoc) {
            return res.status(404).json({ message: 'Agenda no encontrada' });
        }
        const evento = { title, fechaInicio, fechaFin, allDay };
        agendaDoc.eventos.push(evento);
        await agendaDoc.save();
        res.json(agendaDoc.eventos[agendaDoc.eventos.length - 1]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al agregar evento' });
    }
}

export const putEventos = async (req, res) => {
    try {
        const agendaDocId = req.params.agendaDocId;
        const updatedEvent = req.params.updatedEvent
        const { title, fechaInicio, fechaFin, allDay } = req.body;
        const agendaDoc = await AgendaDoc.findById(agendaDocId);
        if (!agendaDoc) {
            return res.status(404).json({ message: 'Agenda no encontrada' });
        }
        const evento = agendaDoc.eventos.find((evento) => evento._id.toString() === updatedEvent);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        evento.title = title;
        evento.fechaInicio = fechaInicio;
        evento.fechaFin = fechaFin;
        evento.allDay = allDay;
        await agendaDoc.save();
        res.json(evento);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
}

export const deleteEventos = async (req, res) => {
    try {
        const agendaDocId = req.params.agendaDocId;
        const eventId = req.params.eventId;

        const agendaDoc = await AgendaDoc.findById(agendaDocId);
        if (!agendaDoc) {
            return res.status(404).json({ message: 'Agenda no encontrada' });
        }
        const evento = agendaDoc.eventos.find((evento) => evento._id.toString() === eventId);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        agendaDoc.eventos.pull(evento);
        await agendaDoc.save();
        res.json(agendaDoc.eventos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
}

export const getAgenda = async (req, res) => {
    try {
        const dentistaId = req.params.dentistaId;
        const agenda = await AgendaDoc.findOne({ dentista: dentistaId });

        if (!agenda) {
            return res.status(404).json({ message: 'Agenda no encontrada' });
        }

        res.json(agenda);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener agenda' });
    }
}

export const putAgenda = async (req, res) => {
    try {
        const agendaDocId = req.params.agendaDocId;

        const { workingDays, workHours, appointmentInterval } = req.body;

        const agendaDoc = await AgendaDoc.findById(agendaDocId);

        if (!agendaDoc) {
            return res.status(404).json({ message: 'Agenda no encontrada' });
        }

        agendaDoc.diasTrabajo = workingDays;
        agendaDoc.horario = workHours;
        agendaDoc.intervaloCitas = appointmentInterval;

        await agendaDoc.save();
        res.json(agendaDoc);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar agenda' });
    }
}

export const crearAgendaPorDefecto = async (req, res) => {
    try {
        const dentistaId = req.params.dentistaId;
        const agenda = new AgendaDoc({
            dentista: dentistaId,
            diasTrabajo: [
                { dia: 0, activo: false }, // Domingo
                { dia: 1, activo: true },  // Lunes
                { dia: 2, activo: true },  // Martes
                { dia: 3, activo: true },  // Miércoles
                { dia: 4, activo: true },  // Jueves
                { dia: 5, activo: true },  // Viernes
                { dia: 6, activo: false }  // Sábado
            ],
            horario: {
                inicio: "09:00",
                fin: "20:00"
            },
            intervalos: {
                duracion: 60,
            },
            eventos: []
        });
        await agenda.save();
        res.json(agenda);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear agenda por defecto" });
    }
};