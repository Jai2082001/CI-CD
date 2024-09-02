import NextAuth from "next-auth"
import { authOptions as Options } from "../../../lib/auth"

const handler = NextAuth(Options)

export { handler as GET, handler as POST }