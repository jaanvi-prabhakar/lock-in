import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import { AuthView } from "./view"

export function generateStaticParams() {
    return Object.values(authViewPaths).map((pathname) => ({ pathname }))
}

export default function AuthPage({ params }: { params: { pathname: string } }) {
    const { pathname } = params

    const redirectTo = pathname === "sign-out" ? "/auth/sign-in" : undefined

    return <AuthView pathname={pathname} redirectTo={redirectTo} />
}