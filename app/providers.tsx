"use client"

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack"
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

import { authClient } from "@/lib/auth-client"

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
        },
    },
})

export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()

    return (
        <QueryClientProvider client={queryClient}>
            <AuthQueryProvider>
                <AuthUIProviderTanstack
                    authClient={authClient}
                    navigate={router.push}
                    replace={router.replace}
                    onSessionChange={router.refresh}
                    LinkComponent={Link}
                >
                    {children}
                    <Toaster />
                </AuthUIProviderTanstack>
            </AuthQueryProvider>
        </QueryClientProvider>
    )
}
