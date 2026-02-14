import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL!}/api/v1/auth`,
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        adminClient(),
    ]
})

export const { signIn, signUp, useSession } = authClient
