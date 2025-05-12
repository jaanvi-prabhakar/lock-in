'use client';

import { useParams } from 'next/navigation';
import { AuthView } from './view';
import { Suspense } from 'react';

export default function AuthPage() {
  const params = useParams();
  const pathname = typeof params?.pathname == 'string' ? params.pathname : 'sign-in';
  const redirectTo = pathname == 'signout' ? '/auth/sign-in' : '/dashboard';

  return (
    <Suspense>
      <AuthView pathname={pathname} redirectTo={redirectTo} />
    </Suspense>
  );
}
