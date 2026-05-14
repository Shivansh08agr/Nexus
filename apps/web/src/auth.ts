import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { syncUserWithDatabase } from "./lib/api/users";

export const config: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 1. Move the sync logic directly into the JWT token generation
    async jwt({ token, user, account }) {
      // The 'account' and 'user' objects are ONLY present on the exact moment of login
      if (account?.provider === 'google' && user?.email && user?.name && account.providerAccountId) {
        try {
          const data: any = await syncUserWithDatabase(
            user.email,
            user.name,
            account.providerAccountId,
            user.image
          );
          
          // Bake the database ID directly into the encrypted token
          token.id = data.syncUser.id; 
        } catch (error) {
          console.error('Failed to sync user during login:', error);
        }
      }
      return token;
    },
    
    // 2. Expose the ID from the token down to the browser session
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);