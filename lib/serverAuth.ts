import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from '@/lib/prismadb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";

//We are using session to get all the information about a user
//We will reuse this to check if we are logged in
const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession( req, res, authOptions );

    //Check if session exists
    if (!session?.user?.email) {
        throw new Error('Not signed in session');
    }

    //Get current user from email from session
    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email
        }
    });

    //Check if user exists
    if (!currentUser) {
        throw new Error("Not signed in");
    }

    return { currentUser };
};

export default serverAuth;