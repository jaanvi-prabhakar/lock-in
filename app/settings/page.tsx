"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Animation variants for sections
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
    }
  }
};

// Animation variants for form elements
const listItem = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export default function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false
  });
  
  // Toggle handler for notification settings
  const toggleNotification = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle theme change
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    // Here you would normally apply the theme to your app
  };

  // Simulated password change dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  // Confirmation dialog for account deletion
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  return (
    <motion.main
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm"
    >
      <header className="mb-8">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white"
          variants={fadeInUp}
        >
          Settings
        </motion.h1>
      </header>

      <motion.section 
        className="mb-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
        variants={fadeInUp}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-600">
          Account
        </h2>
        <div className="space-y-4">
          <motion.div variants={listItem} className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Email</span>
            <span className="font-medium">your.email@example.com</span>
          </motion.div>
          
          <motion.div variants={listItem} className="flex justify-end">
            <button 
              onClick={() => setShowPasswordDialog(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Change password
            </button>
          </motion.div>
          
          <motion.div variants={listItem} className="flex justify-end">
            <button 
              onClick={() => setShowDeleteConfirmation(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              Delete account
            </button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="mb-8 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
        variants={fadeInUp}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-600">
          Notifications
        </h2>
        <div className="space-y-4">
          <motion.label variants={listItem} className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Email me XP updates</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={notifications.emailUpdates}
                onChange={() => toggleNotification('emailUpdates')}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${notifications.emailUpdates ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${notifications.emailUpdates ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </motion.label>
          
          <motion.label variants={listItem} className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700 dark:text-gray-300">Push notifications for check-ins</span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={notifications.pushNotifications}
                onChange={() => toggleNotification('pushNotifications')}
              />
              <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${notifications.pushNotifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${notifications.pushNotifications ? 'transform translate-x-6' : ''}`}></div>
            </div>
          </motion.label>
        </div>
      </motion.section>

      <motion.section 
        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
        variants={fadeInUp}
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-600">
          Preferences
        </h2>
        <div className="space-y-4">
          <motion.div variants={listItem} className="flex items-center justify-between">
            <label htmlFor="theme-select" className="text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="relative">
              <select
                id="theme-select"
                value={theme}
                onChange={handleThemeChange}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input 
                  type="password" 
                  id="current-password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input 
                  type="password" 
                  id="new-password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  id="confirm-password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                >
                  Update Password
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteConfirmation && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Delete Account</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
              >
                Delete My Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.main>
  );
}