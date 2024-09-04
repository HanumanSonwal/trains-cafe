import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const userData = await User.findOne({ email: credentials.email });
        if (userData && bcrypt.compareSync(credentials.password, userData.password)) {
          return userData;
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 1 * 24 * 60 * 60, //Session max age in seconds
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      user = token.user;
      return Promise.resolve(session);
    },
    async redirect({ url, baseUrl }) {
      //Add ur own logic
      // if (url.startsWith("/auth/role")) {
      //   return "/auth/role";
      // }
      // return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
});
