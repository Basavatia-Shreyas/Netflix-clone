import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    try {
        // Unpack the email, name, password from the request
        const { email, name, password } = req.body;

        // Check if the email is already registered
        const existingUser = await prismadb.user.findUnique({
            where: {
                email: email,
            }
        });

        // Email taken if email is already registered
        if(existingUser) {
            return res.status(422).json({ error: "Email taken "});
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create a new user in the database with the provied info
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: "",
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(400).end()
    }
}