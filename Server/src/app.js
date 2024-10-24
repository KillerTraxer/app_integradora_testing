import express from "express";
import morgan from "morgan";

import pacientesRoutes from "./routes/pacientes.routes.js";
import dentistaRoutes from "./routes/dentista.routes.js";
import citasRoutes from "./routes/citas.routes.js";
import tratamientosRoutes from "./routes/tratamientos.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(pacientesRoutes);
app.use(dentistaRoutes);
app.use(citasRoutes);
app.use(tratamientosRoutes);

export default app;