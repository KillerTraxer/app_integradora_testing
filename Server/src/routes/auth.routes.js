import { Router } from "express";
import Paciente from "../models/pacientes.model.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

const route = Router();

route.post(
    "/register",
    [
        //Validaciones de entrada
        body("nombre")
            .notEmpty().withMessage("El nombre es obligatorio."),
        body("apellidos")
            .notEmpty().withMessage("Los apellidos son obligatorios."),
        body("telefono")
            .isMobilePhone("es-MX")
            .withMessage("El teléfono debe ser un número válido."),
        body("email")
            .isEmail().withMessage("El email debe ser válido.")
            .bail()
            .normalizeEmail(),
        body("password")
            .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres.")
            .bail()
            // .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one digit and one special character")
            // .withMessage("La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.")
            .custom((value, { req }) => {
                if (!req.body.confirmPassword) {
                    throw new Error("Es necesario confirmar la contraseña.");
                }
                if (value !== req.body.confirmPassword) {
                    throw new Error("Las contraseñas no coinciden.");
                }
                return true;
            }),
        body("confirmPassword")
            .custom((value, { req }) => {
                if (!req.body.password) {
                    throw new Error("Es necesario ingresar una contraseña para confirmar.");
                }
                if (value !== req.body.password) {
                    throw new Error("Las contraseñas no coinciden.");
                }
                return true;
            }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), fields: Object.keys(errors.mapped()).join(', ') });
        }

        const { nombre, apellidos, telefono, email, password, confirmPassword } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
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
            if (error.code === 11000) {
                const duplicateErrors = {};
            
                if (error.keyPattern.email) {
                    duplicateErrors.email = "El email ya está en uso.";
                }
                if (error.keyPattern.telefono) {
                    duplicateErrors.telefono = "El teléfono ya está en uso.";
                }
            
                return res.status(400).json({ errors: duplicateErrors });
            }
            console.error("Error al crear el usuario:", error);
            res.status(500).json({ errors: [{ msg: "Error al crear el usuario." }] });
        }
    }
);

route.post("/login", (req, res) => { });

export default route;
