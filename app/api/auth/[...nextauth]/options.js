import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const options = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      profile(profile) {
        console.log("Profile Github", profile);

        let userRole = "Github User";
        if (profile?.email === "brahmin00011@gmail.com") {
          userRole = "Admin";
        }

        return {
          ...profile,
          image: profile.avatar_url,
          role: userRole,
        };
      },
      clientId: process.env.Github_id,
      clientSecret: process.env.Github_Secret,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google", profile);

        let userRole = "Google User";
        if (profile.email === "gautams4code@gmail.com") {
          userRole = "Admin";
        }

        return {
          ...profile,
          image: profile.picture,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.Google_id,
      clientSecret: process.env.Google_Secret,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        console.log(token.role);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
