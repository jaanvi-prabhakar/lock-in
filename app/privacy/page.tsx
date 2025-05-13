'use client';

import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Last updated: May 12, 2025
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-200 dark:border-gray-700"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="prose prose-blue max-w-none dark:prose-invert">
              {/* Introduction */}
              <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Welcome to Lock-in! We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.
                </p>
              </motion.section>
              
              {/* Information We Collect */}
              <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
                
                <div className="ml-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Personal Information</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    We may collect the following personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>Name and contact information</li>
                    <li>Cornell Tech email address</li>
                    <li>Academic information</li>
                    <li>Profile information</li>
                    <li>User-generated content</li>
                  </ul>
                </div>
                
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Usage Data</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    We automatically collect information about how you interact with our platform, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited</li>
                    <li>Time spent on pages</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </motion.section>
              
              {/* How We Use Your Information */}
              <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Provide and maintain our services</li>
                  <li>Improve user experience</li>
                  <li>Communicate with you about platform updates</li>
                  <li>Ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </motion.section>
              
              {/* Data Security */}
              <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </motion.section>
              
              {/* Your Rights */}
              <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Your Rights</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of communications</li>
                </ul>
              </motion.section>
              
              {/* Contact Us */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Contact Us</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:act245@cornell.edu" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">act245@cornell.edu</a>.
                </p>
              </motion.section>
            </div>
          </motion.div>
          
          {/* Back to Home Link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <a 
              href="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}