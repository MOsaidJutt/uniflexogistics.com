import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/server/db'
import { loginSchema } from '@/lib/validations/auth'

// Dummy hash used to keep bcrypt.compare timing constant when user is not found.
// Prevents email-enumeration via response timing.
const DUMMY_HASH = '$2a$12$LHoTmFGWNxULQZpRFTJzAOHPKQSM7O3YnHVBpKijM9VDhSRi4k7Ei'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/crm/login',
  },
  providers: [
    // Staff login for the Uniflex Global Logistics CRM. Queries CrmStaff,
    // not a storefront User table — this app has no customer accounts at all.
    Credentials({
      id: 'crm-login',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const staff = await db.crmStaff.findUnique({
          where: { email: email.toLowerCase() },
        })

        // Always run bcrypt.compare to prevent email enumeration via timing.
        const hash = staff?.passwordHash ?? DUMMY_HASH
        const valid = await bcrypt.compare(password, hash)

        if (!staff || !valid || !staff.isActive) return null

        return {
          id: staff.id,
          email: staff.email,
          name: staff.name,
          userType: 'crm' as const,
          crmRole: staff.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = 'crm'
        token.crmRole = user.crmRole
        token.sessionEnd = Date.now() + 30 * 24 * 60 * 60 * 1000
      }
      if (token.id) {
        // Re-check active status on every refresh so a deactivated staffer is cut off promptly,
        // and refresh name/role too so an admin edit (e.g. renaming staff) shows up without
        // requiring the staffer to log out and back in.
        const staff = await db.crmStaff.findUnique({
          where: { id: token.id as string },
          select: { isActive: true, name: true, role: true },
        })
        if (!staff?.isActive) return null
        token.name = staff.name
        token.crmRole = staff.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.sessionEnd = token.sessionEnd as number
        session.user.userType = 'crm'
        session.user.crmRole = token.crmRole as string
      }
      return session
    },
  },
})
