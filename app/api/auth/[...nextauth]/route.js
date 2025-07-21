// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import axios from "axios";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         otp: { label: "OTP", type: "text" },
//         //role: { label: "Role", type: "text" }, // Important
//       },
//       async authorize(credentials) {
//         try {
//           const res = await axios.post(
//             `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/verify-otp`,
//             credentials,
//             { withCredentials: true }
//           );

//           if (res.data.token) {
//             return {
//               accessToken: res.data.token,
//               ...res.data.user,
//             };
//           }

//           throw new Error("Invalid OTP");
//         } catch (err) {
//           throw new Error(err.response?.data?.message || "Authentication failed");
//         }
//       },
//     }),
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.user = {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           redirect: user.redirect,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.user = token.user;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };




import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "PublicUser",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account/login`,
            credentials,
            { withCredentials: true }
          );
      
          const user = res.data?.data;
          if (user && user.token) {
            return {
              ...user,
              accessToken: user.token,
            };
          }
      
          throw new Error("Login failed");
        } catch (err) {
          const data = err?.response?.data;
      
          if (data?.type === "account_locked") {
            const time = new Date(data.unlockTime).toLocaleTimeString();
            throw new Error(`Account locked. Try again at ${time}`);
          }
      
          if (data?.type === "invalid_password") {
            const left = data.attemptsLeft ?? "unknown";
            throw new Error(`Wrong password. ${left} attempt(s) left.`);
          }
      
          throw new Error(
            data?.message || data?.err || "Login failed. Please try again."
          );
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };