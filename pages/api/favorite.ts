import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

//Add or remove favorites
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        //Add the movie to user's favorites if req.method is POST
        if(req.method === 'POST'){
            //Get the current user
            const { currentUser } = await serverAuth(req, res);
            
            //Get the movieId from the request
            const { movieId } = req.body;

            //Find the movie with the given movieId
            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                }
            });

            //Make sure the movie with the movieId exists
            if (!existingMovie) {
                throw new Error('Invalid ID');
            }

            //Add the movie to the user's list of favoriteIds
            const user = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: {
                        push: movieId,
                    }
                }
            });

            return res.status(200).json(user);
        }

        //Remove the movie from user's favorites if req.method is DELETE
        if (req.method === 'DELETE') {
            //Get the current user
            const { currentUser } = await serverAuth(req, res);

            //Get the movieId that will be removed
            const { movieId } = req.body;

            //Find the movie with the movieId
            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId
                }
            });

            //Make sure the movie exists
            if (!existingMovie) {
                throw new Error("Invalid ID");
            }

            //Create a new list of favorite's without the movieId
            const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

            //Update the user's favorites list to use the list without movieId
            const updatedUser = await prismadb.user.update({
                where: {
                    email: currentUser.email || '',
                },
                data: {
                    favoriteIds: updatedFavoriteIds,
                }
            });

            //Return the updated user
            return res.status(200).json(updatedUser);
        }

        //Do this is res.method is neither POST or DELETE
        return res.status(405).end();

    } catch (error) {
        //Catch the error is there is any
        console.log(error);
        return res.status(400).end();
    }
}