import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Lock-in</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Lock-in. All rights reserved.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Built by Audrey, Xiaochen, and Jaanvi with love!</p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
              Terms
            </Link>
            <Link href="/help" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
              Help
            </Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}