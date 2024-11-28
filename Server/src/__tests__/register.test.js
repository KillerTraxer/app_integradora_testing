import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app';  // Tu aplicación Express
import Paciente from "../models/pacientes.model.js";
import mongoose from 'mongoose';

beforeAll(async () => {
    // Conectar a la base de datos de prueba
    const dbUri = `mongodb+srv://erick3041210064:JCdT6X1EFTaFgL6E@consultoriodental.wseso.mongodb.net/?retryWrites=true&w=majority&appName=consultorioDental`;
    await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Desconectar después de las pruebas
afterAll(async () => {
    await mongoose.disconnect();
});

describe("Flujo de registro y verificación de usuario", () => {
    let testUser; // Almacena el usuario creado para las pruebas
    let otp; // Almacena el OTP generado

    afterAll(async () => {
        // Limpia la base de datos eliminando el usuario de prueba
        if (testUser) {
            await Paciente.deleteOne({ email: testUser.email });
        }
        await mongoose.disconnect(); // Desconecta la base de datos
    });

    it("Debería registrar un nuevo usuario", async () => {
        console.log("Iniciando registro de usuario...");
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                nombre: "UsuarioTest",
                apellidos: "TestApellido",
                telefono: "1234567890",
                email: "test@example.com",
                password: "password123",
                confirmPassword: "password123",
            });

        console.log("Respuesta del servidor para registro:", response.body);

        expect(response.status).toBe(201); // Verifica el estado de éxito
        expect(response.body.message).toBe("Usuario creado exitosamente");

        // Verifica que el usuario esté en la base de datos
        testUser = await Paciente.findOne({ email: "test@example.com" });
        expect(testUser).toBeDefined(); // Asegúrate de que se creó el usuario
    });

    it("Debería generar un OTP para el usuario", async () => {
        console.log("Solicitando generación de OTP...");
        const response = await request(app)
            .post("/api/auth/generate-otp")
            .send({
                email: "test@example.com",
            });

        console.log("Respuesta del servidor para OTP:", response.body);

        expect(response.status).toBe(200); // Verifica el estado de éxito
        expect(response.body.message).toBe("OTP generado y enviado");
        expect(response.body.otp).toBeDefined(); // Asegúrate de que el OTP se genere

        otp = response.body.otp; // Guarda el OTP para usarlo más adelante
        console.log("OTP generado:", otp);
    });

    it("Debería verificar el OTP y marcar el usuario como verificado", async () => {
        console.log("Verificando OTP...");
        const response = await request(app)
            .post("/api/auth/verify-otp")
            .send({
                email: "test@example.com",
                otp, // Usa el OTP generado anteriormente
            });

        console.log("Respuesta del servidor para verificación de OTP:", response.body);

        expect(response.status).toBe(200); // Verifica el estado de éxito
        expect(response.body.message).toBe("Usuario verificado");

        // Verifica que el usuario ahora esté marcado como verificado
        const verifiedUser = await Paciente.findOne({ email: "test@example.com" });
        expect(verifiedUser.verified).toBe(true);
    });
});