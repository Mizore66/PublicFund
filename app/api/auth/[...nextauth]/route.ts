import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/lib/mongodb"
import User from "@/models/user"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()

        // Find user by email and explicitly select the password field
        const user = await User.findOne({ email: credentials.email }).select("+password")

        if (!user) {
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Return user without password
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          walletAddress: user.walletAddress,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          kycStatus: user.kycStatus,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.walletAddress = user.walletAddress
        token.role = user.role
        token.isEmailVerified = user.isEmailVerified
        token.kycStatus = user.kycStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.walletAddress = token.walletAddress
        session.user.role = token.role
        session.user.isEmailVerified = token.isEmailVerified
        session.user.kycStatus = token.kycStatus
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

