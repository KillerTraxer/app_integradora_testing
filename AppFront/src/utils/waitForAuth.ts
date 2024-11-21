import useAuthStore from "@/store/authStore";

const waitForAuth = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        const auth = useAuthStore.getState().auth;
        if (!auth) throw new Error('Estado de autenticación no válido');
    } catch (error) {
        console.error('Error al verificar estado de autenticación:', error);
    }
};

export default waitForAuth;