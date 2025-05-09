'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-6">Welcome to Lock-in</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your personal productivity companion for building better habits and achieving your goals.
        </p>
        <Link
          href="/auth/sign-in"
          className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
