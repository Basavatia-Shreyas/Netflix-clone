import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';

import useCurrentUser from "@/hooks/userCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
    movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
    const { mutate: mutateFavorites } = useFavorites();
    const { data: currentUser, mutate } = useCurrentUser();

    //Check if the movieId is already in the user's favorite's list
    const isFavorite = useMemo(() => {
        //List of user's favorite movies as IDs
        const list = currentUser?.favoriteIds || [];

        //Returns true or false if movieID is in the list of favorties
        return list.includes(movieId);
    }, [currentUser, movieId]);

    //Toggle whether the movie is or isn't in favorites
    const toggleFavorites = useCallback(async () => {
        let response;

        if (isFavorite) {
            //If the movie is in favorites, delete it from favorites list
            response = await axios.delete('/api/favorite', { data: { movieId }});
        } else {
            //If the movie isn't in favorites, add it to the favorites list
            response = await axios.post('/api/favorite', { movieId });
        }

        //UpdatedFavoriteIds is the list of favorieIds after toggling
        const updatedFavoriteIds = response?.data?.favoriteIs;

        //Spread the current user and update the user's favorites to the new list
        mutate({
            ...currentUser,
            favoriteIds: updatedFavoriteIds
        });

        mutateFavorites();

    }, [movieId, isFavorite, currentUser, mutate, mutateFavorites]);
    
    //Change the icon from check to plus depending if the movie is a favorite
    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div
        onClick={toggleFavorites}
        className="
            cursor-pointer
            group/item
            w-6
            h-6
            lg:w-10
            lg:h-10
            border-white
            border-2
            rounded-full
            flex
            justify-center
            items-center
            transition
            hover:border-natural-300
        ">
            <Icon className = 'text-white' size={25}/>
        </div>
    )
}

export default FavoriteButton;