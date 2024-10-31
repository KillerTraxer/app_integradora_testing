import { Router } from "express";
import Paciente from "../models/pacientes.model.js";
import bcrypt from "bcrypt";

const route = Router();

route.post(
    "/register", async (req, res) => {
        const { nombre, apellidos, telefono, email, password, confirmPassword } = req.body;

        if (!nombre || !apellidos || !telefono || !email || !password || !confirmPassword) {
            return res.status(400).json({ errorFields: "Todos los campos son obligatorios" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await Paciente.findOne({ email });
            const phoneUsed = await Paciente.findOne({ telefono });

            const errors = [];

            if (existingUser) {
                errors.push({ field: 'email', message: "El email ya está en uso." });
            }

            if (phoneUsed) {
                errors.push({ field: 'telefono', message: "El teléfono ya está en uso." });
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    type: 'duplicate',
                    errors
                });
            }

            const newPatient = new Paciente({
                nombre,
                apellidos,
                telefono,
                email,
                password: hashedPassword,
            });

            await newPatient.save();
            res.status(201).json({ message: "Usuario creado exitosamente" });
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            res.status(500).json({ error: "Error al crear el usuario." });
        }
    }
);

route.post("/login", (req, res) => { });

export default route;
