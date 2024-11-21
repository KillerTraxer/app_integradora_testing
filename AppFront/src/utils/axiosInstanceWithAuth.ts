import instance from "@/utils/axiosInterceptor";
import waitForAuth from "@/utils/waitForAuth";

interface AxiosConfig {
    [key: string]: any;
}

const axiosInstanceWithAuth = {
    get: async (url: string, config?: AxiosConfig) => {
        await waitForAuth();
        return instance.get(url, config);
    },
    post: async (url: string, data: any, config?: AxiosConfig) => {
        await waitForAuth();
        return instance.post(url, data, config);
    },
    put: async (url: string, data: any, config?: AxiosConfig) => {
        await waitForAuth();
        return instance.put(url, data, config);
    },
    delete: async (url: string, config?: AxiosConfig) => {
        await waitForAuth();
        return instance.delete(url, config);
    },
};

export default axiosInstanceWithAuth;