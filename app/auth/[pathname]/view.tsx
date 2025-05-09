"use client"

import { AuthCard } from "@daveyplate/better-auth-ui"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const validPaths = ["sign-in", "sign-up", "sign-out", "reset-password", "verify"]

export function AuthView({ pathname, redirectTo }: { pathname: string, redirectTo?: string }) {
    const router = useRouter()

    useEffect(() => {
        if (!validPaths.includes(pathname)) {
            router.push("/auth/sign-in")
        }
        router.refresh()
    }, [pathname, router])

    if (!validPaths.includes(pathname)) {
        return null
    }

    return (
        <main className="flex grow flex-col items-center justify-center gap-3 p-4">
            <AuthCard pathname={pathname} redirectTo={redirectTo} />
        </main>
    )
}
