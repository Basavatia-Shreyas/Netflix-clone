import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

const useFavorites = () => {
    //Get all the favorites using the api favorites route
    const { data, error, isLoading, mutate } = useSWR('/api/favorites', fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    //Return the data
    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default useFavorites;