'use client';
import { usePathname } from 'next/navigation';
import { authClient } from "@/lib/auth-client"; //import the auth client
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Goals', href: '/goals' },
  { name: 'Teams', href: '/teams' },
]

function classNames(...classes: (string | undefined | boolean | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      console.log('Navbar: Checking authentication status...');
      setIsLoading(true);
      try {
        const session = await authClient.getSession();
        console.log('Navbar: Session check result:', !!session, session);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Navbar: Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Add a listener for changes in localStorage to detect sign out in other tabs
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // For debugging
  useEffect(() => {
    console.log('Navbar: Authentication state updated:', { isAuthenticated, isLoading });
  }, [isAuthenticated, isLoading]);

  const handleAuthAction = async () => {
    console.log('Navbar: Auth action clicked, current state:', isAuthenticated);
    if (isAuthenticated) {
      console.log('Navbar: Signing out...');
      await authClient.signOut();
      setIsAuthenticated(false);
      router.push('/auth/sign-in');
    } else {
      console.log('Navbar: Redirecting to sign in...');
      router.push('/auth/sign-in');
    }
  };

  const renderAuthButton = () => {
    if (isLoading) {
      // Show nothing while loading to prevent flashing
      return null;
    }
    
    if (isAuthenticated) {
      return (
        <button
          onClick={handleAuthAction}
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-1.5 px-4 rounded-md transition-colors duration-200 mx-2 flex items-center"
        >
          <span>Log Out</span>
        </button>
      );
    } else {
      return (
        <button
          onClick={handleAuthAction}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-md transition-colors duration-200 mx-2"
        >
          Sign In
        </button>
      );
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <Link
                    href={isAuthenticated ? "/dashboard" : "/"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      alt="Lock-in"
                      src="/images/lock-in.png"
                      className="h-8 w-auto"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        className={classNames(
                          pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Sign In/Log Out Button - Always rendered with the correct state */}
                {renderAuthButton()}

                {/* Profile dropdown - only show if authenticated */}
                {!isLoading && isAuthenticated && (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt=""
                          src="/images/mario.jpeg"
                          className="h-8 w-8 rounded-full"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/profile"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/settings"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}