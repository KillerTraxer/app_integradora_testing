import cron from "node-cron"
import Citas from "../models/citas.model.js";
import AgendaDoc from "../models/agendaDoc.model.js";
import dayjs from 'dayjs';

const actualizarEstatusCitas = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const citas = await Citas.find({ status: 'confirmada' });

            for (const cita of citas) {
                const fechaActual = dayjs();
                const fechaCita = dayjs(cita.fecha);

                const siguienteCita = await Citas.findOne({
                    fecha: { $gt: cita.fecha }
                }).sort({ fecha: 1 });

                if (siguienteCita) {
                    if (fechaActual.isAfter(fechaCita)) {
                        await Citas.findByIdAndUpdate(cita._id, { status: 'realizada' });
                        console.log('Estatus actualizado');
                    }
                } else {
                    const dentista = await AgendaDoc.findOne({ dentista: cita.dentista });

                    const [horaFin, minutoFin] = dentista.horario.fin.split(':');
                    const horaFinDayjs = fechaCita.hour(horaFin).minute(minutoFin).second(0);

                    if (fechaActual.isAfter(fechaCita) && fechaActual.isAfter(horaFinDayjs)) {
                        await Citas.findByIdAndUpdate(cita._id, { status: 'sin realizar' });
                        console.log('Estatus actualizado');
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
}

export default actualizarEstatusCitas;

