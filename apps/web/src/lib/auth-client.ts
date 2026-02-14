import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { getClientApiV1BaseUrl } from "@/lib/api-url"

export const authClient = createAuthClient({
    baseURL: `${getClientApiV1BaseUrl()}/auth`,
    fetchOptions: {
        credentials: "include",
    },
    plugins: [
        adminClient(),
    ]
})

export const { signIn, signUp, useSession } = authClient
