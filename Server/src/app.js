import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import pacientesRoutes from "./routes/pacientes.routes.js";
import dentistaRoutes from "./routes/dentista.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import tratamientosRoutes from "./routes/tratamientos.routes.js";
import historiasClinicasRoutes from "./routes/historiasClinicas.routes.js";
import agendaDocRoutes from "./routes/agendaDoc.routes.js";

//CronJobs
import actualizarEstatusCitas from "./cronjobs/citas.cron.js";

actualizarEstatusCitas();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/dentista', dentistaRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/tratamientos', tratamientosRoutes);
app.use('/api/historiasClinicas', historiasClinicasRoutes);
app.use('/api/agendaDoc', agendaDocRoutes);

export default app;