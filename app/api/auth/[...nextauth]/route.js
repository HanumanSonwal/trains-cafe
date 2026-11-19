import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/app/models/user";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        await dbConnect();

        const email = String(credentials?.email || "").trim();
        const user =
          (await User.findOne({ email })) || (await User.findOne({ email: email.toLowerCase() }));
        if (!user) {
          throw new Error("No user found with this email");
        }
        if (user.active === false) {
          throw new Error("This account is switched off. Please contact the admin.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: (user.permissions || []).map((p) => ({ name: p.name, level: p.level })),
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // a staff member's access is re-checked at least once a day
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.uid;
      session.user.permissions = token.permissions || [];
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.uid = user.id;
        token.permissions = user.permissions || [];
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
