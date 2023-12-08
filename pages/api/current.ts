import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }

        //Reusing serverAuth to check if user exists
        const { currentUser } = await serverAuth(req, res);

        return res.status(200).json(currentUser);
    } catch (error) {
        //If serverAuth throws an error, it will be caught here 
        console.log(error);
        return res.status(500).end();
    }
}