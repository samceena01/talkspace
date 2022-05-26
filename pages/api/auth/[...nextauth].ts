import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findByLogin, UserCredential } from "../_db";

export default NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { type: "text", label: "Username", placeholder: "johndoe" },
        password: { type: "password", label: "Password" },
      },
      authorize: async (credentials) => {
        const user = await findByLogin({ ...credentials } as UserCredential);

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
});
