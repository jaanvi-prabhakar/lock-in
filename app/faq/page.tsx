'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

export default function FAQPage() {
  // FAQ data
  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: "What makes Lock-in different from the 47 other productivity apps on my phone?",
      answer: "Unlike those other 47 apps collecting digital dust on your home screen, Lock-in doesn't just track tasks—it builds actual habits. Think of us as the gym buddy who still shows up even when you text 'maybe tomorrow,' not the fitness app that sends you guilt-trips disguised as notifications. We're in the business of sustainable progress, not temporary motivation highs."
    },
    {
      id: 2,
      question: "Which page would you recommend for me to look through?",
      answer: "Definitely this one, the most important part of the site. You get to interact with me, learn about the team and what this site aims to be."
    },
    {
      id: 3,
      question: "How did this site come to be?",
      answer: "Our team of three wanted to create Duolingo but for productivity and Lock-in was born!"
    },
    {
      id: 4,
      question: "Who would you like to thank?",
      answer: "Thank you to Ludwig Schubert, our professor for CS 5356, for teaching us and guiding us through the world of full-stack development. His mentorship has been invaluable, especially for those of us who had never worked with these technologies before. \\o/"
    },
    {
      id: 5,
      question: "How do I get started with Lock-in?",
      answer: "Getting started is easy! Simply create an account, set a productivity goal, and commit to regular check-ins. The platform will guide you through creating a personalized plan based on your needs. Remember, consistency is key to building lasting habits, so start with manageable goals and build from there."
    }
  ];
  
  // Track opened FAQ items
  const [openItems, setOpenItems] = useState<number[]>([]);
  
  // Toggle FAQ item
  const toggleItem = (id: number) => {
    setOpenItems(prevOpenItems => 
      prevOpenItems.includes(id) 
        ? prevOpenItems.filter(itemId => itemId !== id) 
        : [...prevOpenItems, id]
    );
  };
  
  // Check if an item is open
  const isItemOpen = (id: number) => openItems.includes(id);
  
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
  
  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
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
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about Lock-in below.
            </p>
          </motion.div>
          
          {/* FAQ Items */}
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-200 dark:border-gray-700"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {faqItems.map((item) => (
              <motion.div 
                key={item.id}
                variants={itemVariants}
                className={`border-b border-gray-200 dark:border-gray-700 ${
                  item.id === faqItems.length ? 'border-b-0' : ''
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="py-5 w-full flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </span>
                  <span className="ml-6 flex-shrink-0">
                    {isItemOpen(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </span>
                </button>
                
                <AnimatePresence>
                  {isItemOpen(item.id) && (
                    <motion.div
                      key={`content-${item.id}`}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 pr-12">
                        <p className="text-base text-gray-700 dark:text-gray-300">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Still have questions card */}
          <motion.div 
            className="mt-10 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-start sm:items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Still have questions?
                </h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  If you can't find the answer you're looking for, feel free to reach out through our feedback form or contact the development team directly.
                </p>
                <div className="mt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Back to Home Link */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}