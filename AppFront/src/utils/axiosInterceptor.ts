import axios from 'axios';

// Configuración inicial de Axios
const instance = axios.create({
    baseURL: process.env.VITE_APP_API_URL,
});

export const setupInterceptors = (
    getAuth: () => any,
    setAuth: (auth: any) => void,
    clearAuth: () => void
) => {
    instance.interceptors.request.use(
        async config => {
            const auth = getAuth();
            const accessToken = auth?.accessToken;

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        error => Promise.reject(error)
    );

    instance.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;

            if ((error.response?.status === 401 || error.response?.status === 400) && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const auth = getAuth();
                    const refreshToken = auth?.refreshToken;

                    if (!refreshToken) {
                        throw new Error('Refresh token no disponible');
                    }

                    const response = await axios.post(`${process.env.VITE_APP_API_URL}/auth/refresh-token`, { refreshToken });

                    console.log(response.data);

                    if (response.data.accessToken) {
                        const newToken = response.data.accessToken;
                        const newAuth = { ...auth };
                        newAuth.accessToken = newToken;
                        setAuth(newAuth);

                        originalRequest.headers.Authorization = `Bearer ${newToken}`;

                        return instance(originalRequest);
                    } else {
                        throw new Error('No se pudo obtener un nuevo token de acceso');
                    }
                } catch (error) {
                    console.error('Error al refrescar el token:', error);
                    clearAuth();
                    window.location.replace('/login');
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );
};

export default instance;