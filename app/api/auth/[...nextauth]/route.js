import nextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = nextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRETE
        })
    ],
    async session({session}) {
        const userSession = await User.findOne({
            email: session.user.email
        })
        session.user.id = userSession._id.toString();

        return session;
    },
    async signIn({profile}) {
        try {
            await connectToDB();

            //check if a user already exists
            const userExists = await User.findOne({email: profile.email})

            //if not, create a new user
            if(!userExists){
                await User.create({
                    email: profile.email,
                    username: profile.name.replace(" ", "").toLowercase(),
                    image: profile.picture
                })
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
            
        }
    }
})
export {handler as GET, handler as POST};