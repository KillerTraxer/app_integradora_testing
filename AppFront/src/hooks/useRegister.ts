import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type RegisterData = {
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type RegisterResponse = {
    message: string;
};

type RegisterError = {
    errors?: Array<{ msg: string }>;
    error?: string;
};

const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
        const response = await axios.post('/register', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data as RegisterError;
        }
        throw error;
    }
};

export const useRegister = () => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data: RegisterResponse) => {
            console.log(data.message); // Imprimir el mensaje de éxito
            // Aquí puedes manejar la redirección o cualquier otra acción después del registro exitoso
        },
        onError: (error: RegisterError) => {
            if ('errors' in error && Array.isArray(error.errors)) {
                console.error('Errores de validación:', error.errors);
            } else if ('error' in error) {
                console.error('Error general:', error.error);
            } else {
                console.error('Error desconocido:', error);
            }
            throw error; // Lanza el error para manejarlo en el componente
        },
    });
};
