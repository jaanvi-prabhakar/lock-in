import { AuthView } from "./view"

export default function AuthPage({ params }: { params: { pathname: string } }) {
    const { pathname } = params
    const redirectTo = pathname === "sign-out" ? "/auth/sign-in" : undefined
    return <AuthView pathname={pathname} redirectTo={redirectTo} />
} 