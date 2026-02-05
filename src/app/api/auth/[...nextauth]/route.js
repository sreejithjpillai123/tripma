import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from 'fs';
import path from 'path';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Read users dynamically to get the latest data
                const dataFilePath = path.join(process.cwd(), 'data', 'users.json');
                const fileData = fs.readFileSync(dataFilePath, 'utf8');
                const users = JSON.parse(fileData);

                // Find user with matching credentials
                const user = users.find(u =>
                    u.email === credentials.email &&
                    u.password === credentials.password
                );

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return { id: user.id, name: user.name, email: user.email };
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;
                }
            }
        })
    ],
    // Optional: Add custom pages if you want to override default NextAuth pages, 
    // but for now we are using our own modal calling signIn directly.
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
