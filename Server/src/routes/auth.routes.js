import { Router } from "express";
import Paciente from "../models/pacientes.model.js";
import Dentista from "../models/dentista.model.js";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import { addMinute } from "@formkit/tempo";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import firebaseAdmin from "../firebase.js";

const { firestore } = firebaseAdmin;

const secretKey = process.env.JWT_SECRET;

const route = Router();

const userGmail = process.env.USER_GMAIL;
const passAppGmail = process.env.PASS_APP_GMAIL;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: userGmail,
        pass: passAppGmail,
    },
});

route.post("/register", async (req, res) => {
    const { nombre, apellidos, telefono, email, password, confirmPassword } = req.body;

    if (
        !nombre ||
        !apellidos ||
        !telefono ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        return res
            .status(400)
            .json({ errorFields: "Todos los campos son obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await Paciente.findOne({ email });
        const phoneUsed = await Paciente.findOne({ telefono });

        const errors = [];

        if (existingUser) {
            errors.push({ field: "email", message: "El email ya está en uso." });
        }

        if (phoneUsed) {
            errors.push({
                field: "telefono",
                message: "El teléfono ya está en uso.",
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                type: "duplicate",
                errors,
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

        const pacienteId = newPatient._id.toString();

        const pacienteRef = firestore.collection('pacientes').doc(pacienteId);
        await pacienteRef.set({
            nombre,
            apellidos,
            telefono,
            email,
        });
        res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ error: "Error al crear el usuario." });
    }
});

route.post("/generate-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ errorFields: "El email es obligatorio" });
    }

    let user = await Paciente.findOne({ email });

    //!(BACKEND SECURITY) Verificar si el usuario ya ha sido verificado
    if (user && user.verified) {
        return res.status(400).json({ message: "El usuario ya ha sido verificado" });
    }

    //!(BACKEND SECURITY) Verificar si el usuario existe
    if (!user) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }

    //!(BACKEND SECURITY) Verificar si ya existe un OTP y si aún no ha expirado
    // if (user && user.otpExpiry && new Date() < new Date(user.otpExpiry)) {
    //     return res.status(429).json({
    //         message: "Ya has solicitado un código OTP. Por favor, espera 5 minutos antes de solicitar otro."
    //     });
    // }

    // Generar un secreto único para el usuario
    const secret = speakeasy.generateSecret({ length: 20 });

    // Generar OTP basado en el secreto
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
    });

    const otpExpiry = addMinute(new Date(), 5); // OTP expira en 5 minutos

    user = await Paciente.findOneAndUpdate(
        { email },
        { otpSecret: secret.base32, otpExpiry },
        { new: true, upsert: true }
    );

    try {
        transporter.sendMail({
            from: 'Dental Care <no-reply@dentalcare.com>',
            to: user.email,
            subject: `${otp} es tu código de verificación`,
            html: `
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h2>Dental Care</h2>
                    <h1>Código de verificación</h1>
                    <p>Ingresa el siguiente código de verificación cuando se le solicite:</p>
                    <h1>${otp}</h1>
                    <p>Este código expirará en 5 minutos.</p>
                    <p>Si no solicitaste este código, puedes ignorar este correo electrónico.</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Error al enviar el OTP:", error);
        return res.status(500).json({ error: "Error al enviar el OTP." });
    }

    res.json({ message: "OTP generado y enviado", otp });
});

route.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res
            .status(400)
            .json({ errorFields: "Todos los campos son obligatorios" });
    }

    try {
        let user = await Paciente.findOne({ email });

        //!(BACKEND SECURITY) Verificar si el usuario ya ha sido verificado
        if (user && user.verified) {
            return res.status(400).json({ message: "El usuario ya ha sido verificado" });
        }

        //!(BACKEND SECURITY) Verificar si el usuario existe
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        //!(BACKEND SECURITY) Verificar si el OTP tiene 6 dígitos
        if (otp.length !== 6) {
            return res.status(400).json({ message: "El código de verificación debe tener 6 dígitos" });
        }

        // Verificar el OTP
        const isValid = speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: "base32",
            token: otp,
            window: 5,
        });

        if (isValid) {
            if (user && user.otpExpiry && new Date() > new Date(user.otpExpiry)) {
                return res.status(400).json({ message: "El código de verificación ha expirado" });
            }
        } else {
            return res.status(400).json({ message: "El código de verificación no es válido" });
        }

        // Actualizar el usuario en la base de datos
        user = await Paciente.findOneAndUpdate(
            { email },
            {
                verified: true,
                $unset: { otpSecret: "", otpExpiry: "" },
            },
            { new: true, upsert: true }
        );

        res.json({ message: "Usuario verificado" });
    } catch (error) {
        console.error("Error al verificar OTP:", error);
        res.status(500).json({ message: "Error al verificar OTP." });
    }
});

route.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ errorFields: "Todos los campos son obligatorios" });
    }

    try {
        let user = await Dentista.findOne({ email });

        if (!user) {
            user = await Paciente.findOne({ email });
        }

        if (!user) {
            return res.status(400).json({ message: "No existe ningún usuario con ese email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "El email o la contraseña son incorrectas" });
        }

        //Validar si el usuario esta validado
        if (!user.verified) {
            return res.status(400).json({ message: "El usuario no ha sido verificado" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            secretKey,
            { expiresIn: "1h" } // El token expira en 1 hora
        );

        const refreshToken = uuidv4();
        await user.updateOne({ refreshToken })

        // Enviar la información del usuario y el token
        res.json({
            message: "Inicio de sesión exitoso",
            user,
            accessToken: token,
            refreshToken
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión." });
    }
});

route.post("/refresh-token", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res
            .status(400)
            .json({ errorFields: "El token de refresco es obligatorio" });
    }

    try {
        let user = await Dentista.findOne({ refreshToken });

        if (!user) {
            user = await Paciente.findOne({ refreshToken });
        }

        if (!user) {
            return res.status(400).json({ message: "No existe ningún usuario con ese token" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            secretKey,
            { expiresIn: "1h" } // El token expira en 1 hora
        );

        res.json({
            message: "Token actualizado",
            accessToken: token,
        });
    } catch (error) {
        console.error("Error al actualizar el token:", error);
        res.status(500).json({ message: "Error al actualizar el token." });
    }
});

route.post("/save-fcm-token", async (req, res) => {
    const { token, userId } = req.body;

    if (!token || !userId) {
        return res
            .status(400)
            .json({ errorFields: "Todos los campos son obligatorios" });
    }
    
    if (token === "undefined") {
        return
    }

    try {
        const pacienteRef = firestore.collection('pacientes').doc(userId.toString());
        const dentistaRef = firestore.collection('dentistas').doc(userId.toString());

        const pacienteDoc = await pacienteRef.get();
        const dentistaDoc = await dentistaRef.get();

        if (pacienteDoc.exists) {
            const existingTokens = pacienteDoc.get('fcmTokens') || [];
            if (existingTokens.includes(token)) {
                return res.json({ message: "Token FCM ya guardado" });
            }
            existingTokens.push(token);
            await pacienteRef.update({ fcmTokens: existingTokens });
        } else if (dentistaDoc.exists) {
            const existingTokens = dentistaDoc.get('fcmTokens') || [];
            if (existingTokens.includes(token)) {
                return res.json({ message: "Token FCM ya guardado" });
            }
            existingTokens.push(token);
            await dentistaRef.update({ fcmTokens: existingTokens });
        }

        res.json({ message: "Token FCM guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar el token FCM:", error);
        res.status(500).json({ message: "Error al guardar el token FCM." });
    }
})

export default route;
