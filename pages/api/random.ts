import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        //Try to get a random movie from the database by getting random index
        await serverAuth(req, res);

        const movieCount = await prismadb.movie.count();
        const randomIndex = Math.floor(Math.random() * movieCount);

        const randomMovies = await prismadb.movie.findMany({
            take: 1,
            skip: randomIndex
        });

        return res.status(200).json(randomMovies[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
}