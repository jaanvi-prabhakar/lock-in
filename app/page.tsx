'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Target, Calendar, Star } from 'lucide-react';
import Footer from '@/components/Footer';

// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const featureVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  }
};

// hero background animation
const backgroundVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: [0, 0.05, 0.1, 0.05, 0.1],
    scale: 1,
    transition: { 
      opacity: {
        repeat: Infinity,
        duration: 8,
        repeatType: "reverse" 
      },
      scale: {
        duration: 1
      }
    }
  }
};

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // we're still checking authentication but NOT automatically redirecting
    const check = async () => {
      // This just sets mounted to true, no authentication check or redirect
    };
    check();
  }, []);

  // Features list for the homepage
  const features = [
    { 
      title: "Set Meaningful Goals", 
      description: "Create personalized goals with deadlines, priority levels, and custom reminders.",
      icon: <Target className="h-6 w-6 text-blue-500" /> 
    },
    { 
      title: "Build Lasting Habits", 
      description: "Track daily habits with our proven system based on behavioral psychology.",
      icon: <Calendar className="h-6 w-6 text-blue-500" /> 
    },
    { 
      title: "Team Accountability", 
      description: "Join teams to stay motivated and compete in friendly productivity challenges.",
      icon: <Shield className="h-6 w-6 text-blue-500" /> 
    },
    { 
      title: "Earn Rewards", 
      description: "Unlock achievements and earn XP as you make progress towards your goals.",
      icon: <Star className="h-6 w-6 text-blue-500" /> 
    }
  ];

  if (!mounted) {
    return null; // Prevent flash of unauthenticated content
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="relative flex-grow flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden px-4 sm:px-6 py-16 md:py-18">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          variants={backgroundVariants}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:mix-blend-overlay"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:mix-blend-overlay"></div>
        </motion.div>
        
        <div className="container max-w-6xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Hero content */}
            <motion.div className="text-center lg:text-left" variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 leading-tight">
                Build habits that <span className="relative">
                  <span className="relative z-10 text-blue-700 dark:text-blue-400">last</span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200 dark:text-blue-900 z-0" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" fill="currentColor" />
                  </svg>
                </span>
              </h1>
              
              <motion.p 
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
                variants={itemVariants}
              >
                Your personal productivity companion that helps you build better habits, achieve your goals, and stay motivated through team accountability.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
                variants={itemVariants}
              >
                <Link href="/auth/sign-in">
                  <motion.button
                    className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transform transition-all duration-200 shadow-lg hover:shadow-xl w-64 sm:w-auto justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.button>
                </Link>
                
                <Link href="/auth/sign-up">
                  <motion.button
                    className="inline-flex items-center bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-6 py-4 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transform transition-all duration-200 w-64 sm:w-auto justify-center"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right column - Hero image or mockup */}
            <motion.div 
              className="relative flex justify-center lg:justify-end"
              variants={itemVariants}
            >
              <div className="relative w-full max-w-md">
                {/* App mockup/screenshot */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-bold text-lg">Daily Habits</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monday, May 12</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm py-1 px-3 rounded-full font-medium">
                        4/6 Complete
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { name: "Morning Meditation", complete: true },
                        { name: "Read for 30 minutes", complete: true },
                        { name: "Workout Session", complete: true },
                        { name: "Write Journal", complete: true },
                        { name: "Study Programming", complete: false },
                        { name: "Plan Tomorrow", complete: false }
                      ].map((habit, i) => (
                        <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className={`w-5 h-5 rounded-full flex-shrink-0 border-2 mr-3 ${
                            habit.complete 
                              ? "bg-green-500 border-green-500 flex items-center justify-center" 
                              : "border-gray-300 dark:border-gray-600"
                          }`}>
                            {habit.complete && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${habit.complete ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                            {habit.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Daily Progress</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-300 dark:bg-yellow-500/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-purple-300 dark:bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: "2s" }}></div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Down arrow */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => {
            const featuresSection = document.getElementById('features');
            featuresSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How Lock-in Helps You Succeed</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our science-backed approach combines goal setting, habit tracking, and social accountability to help you stay consistent.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                variants={featureVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                custom={index}
              >
                <div className="flex items-start">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            variants={itemVariants}
          >
            <Link href="/auth/sign-up">
              <motion.button
                className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transform transition-all duration-200 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up to Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials or Stats Section (Optional) */}
      <section className="py-16 bg-blue-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Thousands of Productive Users</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our users have built over 50,000 habits and completed more than 1 million check-ins.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
          >
            {[
              { number: "93%", label: "of users build lasting habits" },
              { number: "78%", label: "increase in goal completion" },
              { number: "4.2x", label: "higher consistency rate" },
              { number: "12+", label: "days longer habit streaks" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm text-center"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</h3>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.05"></stop>
                <stop offset="100%" stopColor="#fff" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,0 C300,180 600,100 900,250 L1200,1000 L0,1000 Z" fill="url(#grad1)"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Habits?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Start building better habits today with Lock-in's powerful tracking and accountability features.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/sign-in">
                <motion.button
                  className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transform transition-all duration-200 shadow-xl w-64 sm:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
              
              <Link href="/auth/sign-up">
                <motion.button
                  className="inline-flex items-center bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transform transition-all duration-200 w-64 sm:w-auto justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up Free
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </motion.div>
  );
}