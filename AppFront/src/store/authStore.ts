import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthData {
    message: string;
    user: {
        _id: string;
        nombre: string;
        apellidos: string;
        telefono: string;
        email: string;
        password: string;
        verified: boolean;
        rol: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        refreshToken: string;
        status: string;
        theme: 'light' | 'dark';
    };
    accessToken: string;
    refreshToken: string;
}

interface AuthStore {
    auth: AuthData | null;
    isLoggedIn: boolean;
    theme: 'light' | 'dark';
    setAuth: (auth: AuthData) => void;
    clearAuth: () => void;
    setIsLogged: (isLogged: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            auth: null,
            isLoggedIn: false,
            theme: 'light',
            setAuth: (auth) => set({ auth }),
            clearAuth: () => {
                const currentTheme = get().theme;
                set({ auth: null, isLoggedIn: false, theme: currentTheme });
            },
            setIsLogged: (isLoggedIn) => set({ isLoggedIn }),
            setTheme: (theme) => {
                const currentAuth = get().auth;
                if (currentAuth) {
                    const newAuth = { ...currentAuth };
                    newAuth.user.theme = theme;
                    set({ auth: newAuth, theme });
                } else {
                    set({ theme: 'light' });
                }
            },
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useAuthStore;