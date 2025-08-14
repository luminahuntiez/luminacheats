import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const extended = token as JWT & { discordId?: string };
      if (account && profile) {
        const prof = profile as { id?: string };
        if (prof?.id) extended.discordId = prof.id;
      }
      return extended;
    },
    async session({ session, token }) {
      const t = token as JWT & { discordId?: string };
      (session as typeof session & { discordId?: string }).discordId = t.discordId;
      return session as typeof session & { discordId?: string };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


