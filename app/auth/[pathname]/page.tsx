import { AuthView } from "./view"
import { Suspense } from "react"

export default async function AuthPage({ params }: { params: { pathname: string } }) {
    return (
        <Suspense>
            <AuthView 
                pathname={params.pathname} 
                redirectTo={params.pathname === "sign-out" ? "/auth/sign-in" : "/dashboard"} 
            />
        </Suspense>
    )
} 