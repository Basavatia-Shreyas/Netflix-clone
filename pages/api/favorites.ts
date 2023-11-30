import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        //Get the current user
        const { currentUser } = await serverAuth(req, res);

        //Search prisma for all of user's favorite movies by ID
        const favoriteMovies = await prismadb.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds,
                }
            }
        });

        //Return the favorite movies 
        return res.status(200).json(favoriteMovies);
    } catch (error) {
        //Catch and log any errors
        console.log(error);
        return res.status(400).end();
    }
}