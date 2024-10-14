import express from "express";
import morgan from "morgan";

import pacientesRoutes from "./routes/pacientes.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(pacientesRoutes);

export default app;