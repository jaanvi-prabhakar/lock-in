import { AuthView } from "./view"

export default async function AuthPage({ params }: { params: { pathname: string } }) {
    const { pathname } = params
    const redirectTo = pathname === "sign-out" ? "/auth/sign-in" : "/dashboard"
    return <AuthView pathname={pathname} redirectTo={redirectTo} />
} 