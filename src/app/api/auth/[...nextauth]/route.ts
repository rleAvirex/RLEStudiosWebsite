import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      id: 'magic-code',
      name: 'Magic Code',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null

        const email = credentials.email.trim().toLowerCase()
        const code = credentials.code.trim()

        // Find a valid, non-expired code
        const record = await db.verificationCode.findFirst({
          where: {
            email,
            code,
            expiresAt: { gt: new Date() },
          },
        })

        if (!record) return null

        // Delete the code after use (one-time)
        await db.verificationCode.delete({ where: { id: record.id } })

        // Find or create user
        let user = await db.user.findUnique({ where: { email } })
        if (!user) {
          user = await db.user.create({
            data: { email },
          })
        }

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
