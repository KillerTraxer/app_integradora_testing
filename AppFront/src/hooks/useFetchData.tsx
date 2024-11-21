import { useState, useEffect } from 'react';
import axiosInstanceWithAuth from '@/utils/axiosInstanceWithAuth';

const useFetchData = (endpoint: any, initialData: any, refresh?: boolean, wait?: boolean) => {
    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstanceWithAuth.get(endpoint);
            setData(response.data);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (wait === undefined || wait === true) {
            fetchData();
        }
    }, [endpoint, refresh, wait]);

    return { data, isLoading, error };
};

export default useFetchData;