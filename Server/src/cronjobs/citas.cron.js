import cron from "node-cron"
import Citas from "../models/citas.model.js";
import AgendaDoc from "../models/agendaDoc.model.js";
import dayjs from 'dayjs';

const actualizarEstatusCitas = async () => {
    // Código para ejecutar inmediatamente al iniciar el servidor
    await ejecutarLogicaDeCron();

    // Luego programa el cron job regular
    cron.schedule('0 * * * *', ejecutarLogicaDeCron);
};

const ejecutarLogicaDeCron = async () => {

    try {
        const citas = await Citas.find({ status: 'confirmada' });

        for (const cita of citas) {
            const fechaActual = dayjs();
            const fechaCita = dayjs(cita.fecha);

            const siguienteCita = await Citas.findOne({
                // dentista: cita.dentista,
                fecha: { $gt: cita.fecha }
            }).sort({ fecha: 1 });

            if (siguienteCita) {
                const fechaSiguienteCita = dayjs(siguienteCita.fecha);

                if (fechaActual.isAfter(fechaSiguienteCita) && fechaActual.isAfter(fechaCita)) {
                    await Citas.findByIdAndUpdate(cita._id, { status: 'sin realizar' });
                    console.log('Estatus actualizado');
                }
            } else {
                const dentista = await AgendaDoc.findOne({ dentista: cita.dentista });

                const [horaFin, minutoFin] = dentista.horario.fin.split(':');
                const horaFinDayjs = fechaCita.hour(horaFin).minute(minutoFin).second(0);

                if (fechaActual.isAfter(fechaCita) && fechaActual.isAfter(horaFinDayjs)) {
                    await Citas.findByIdAndUpdate(cita._id, { status: 'sin realizar' });
                    console.log(`Cita ${cita._id} marcada como "sin realizar" por horario de cierre.`);

                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default actualizarEstatusCitas;

