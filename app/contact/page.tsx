'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Send, 
  User, 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Info, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import Footer from '@/components/Footer';

// Form field interface
interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  // Form states
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<FormFields>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Focus states for animation
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Animation for notification
  const [notificationVisible, setNotificationVisible] = useState(false);
  
  // Reset form when submission is successful
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
  
  // Email service setup
  // To use this, you'll need to sign up at EmailJS.com and get your service ID, template ID, and public key
  const SERVICE_ID = "service_w71gi5d";  // Replace with your EmailJS service ID
  const TEMPLATE_ID = "template_3mlmrec"; // Replace with your EmailJS template ID
  const PUBLIC_KEY = "Gyrow7IYwUcPkR0q2"; // Replace with your EmailJS public key
  
  // Handle form submission
  const onSubmit = async (data: FormFields) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Prepare the template parameters
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: 'act245@cornell.edu', // This will be used in the EmailJS template
      };
      
      // Send the email using EmailJS
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      
      if (response.status === 200) {
        setSubmitSuccess(true);
        setNotificationVisible(true);
        reset(); // Reset the form on success
        
        // Hide the notification after 5 seconds
        setTimeout(() => {
          setNotificationVisible(false);
        }, 5000);
      } else {
        throw new Error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Failed to send message. Please try again or contact us directly at act245@cornell.edu');
      setNotificationVisible(true);
      
      // Hide the error notification after 5 seconds
      setTimeout(() => {
        setNotificationVisible(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset the form
  const resetForm = () => {
    reset();
    setSubmitSuccess(false);
    setSubmitError(null);
  };
  
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
  
  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.2 }
    }
  };
  
  // Get field label with animation
  const FieldLabel = ({ name, label }: { name: string, label: string }) => (
    <label 
      htmlFor={name} 
      className={`block text-sm font-medium transition-all duration-300 ${
        focusedField === name 
          ? 'text-blue-600 dark:text-blue-400 transform -translate-y-1' 
          : 'text-gray-700 dark:text-gray-300'
      }`}
    >
      {label}
    </label>
  );
  
  // Form error message component
  const ErrorMessage = ({ message }: { message: string | undefined }) => (
    message ? (
      <motion.p 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
      >
        <AlertCircle className="h-3 w-3 mr-1" />
        {message}
      </motion.p>
    ) : null
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions about Lock-in? We'd love to hear from you and help you stay on track with your goals.
            </p>
          </motion.div>
          
          {/* Notification */}
          <AnimatePresence>
            {notificationVisible && (
              <motion.div 
                className={`fixed top-6 right-6 max-w-sm p-4 rounded-lg shadow-lg z-50 ${
                  submitSuccess ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 
                    'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
                }`}
                variants={notificationVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-start">
                  {submitSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${
                      submitSuccess ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                    }`}>
                      {submitSuccess ? 'Message sent successfully!' : 'Error sending message'}
                    </h3>
                    <p className={`mt-1 text-sm ${
                      submitSuccess ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}>
                      {submitSuccess 
                        ? 'Thanks for reaching out! We\'ll get back to you soon.' 
                        : submitError || 'Something went wrong. Please try again.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ml-3 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={() => setNotificationVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Form Container */}
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 sm:p-8 md:p-10 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 border border-gray-200 dark:border-gray-700"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitSuccess ? (
                // Success message
                <motion.div
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-6"
                  >
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Thanks for reaching out. We'll get back to you as soon as possible.
                  </p>
                  
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Name field */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <FieldLabel name="name" label="Your Name" />
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={`h-5 w-5 ${
                          errors.name ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        className={`py-3 px-4 pl-10 block w-full rounded-md bg-gray-50 dark:bg-gray-700 border ${
                          errors.name 
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        } shadow-sm focus:ring-2 focus:ring-opacity-50 transition duration-200 dark:text-white`}
                        placeholder="John Doe"
                        {...register('name', { 
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Name is too short' }
                        })}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <ErrorMessage message={errors.name?.message} />
                  </motion.div>
                  
                  {/* Email field */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <FieldLabel name="email" label="Your Email" />
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 ${
                          errors.email ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className={`py-3 px-4 pl-10 block w-full rounded-md bg-gray-50 dark:bg-gray-700 border ${
                          errors.email 
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        } shadow-sm focus:ring-2 focus:ring-opacity-50 transition duration-200 dark:text-white`}
                        placeholder="john.doe@example.com"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <ErrorMessage message={errors.email?.message} />
                  </motion.div>
                  
                  {/* Subject field */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <FieldLabel name="subject" label="Subject" />
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Info className={`h-5 w-5 ${
                          errors.subject ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <input
                        id="subject"
                        type="text"
                        className={`py-3 px-4 pl-10 block w-full rounded-md bg-gray-50 dark:bg-gray-700 border ${
                          errors.subject 
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        } shadow-sm focus:ring-2 focus:ring-opacity-50 transition duration-200 dark:text-white`}
                        placeholder="Question about Lock-in"
                        {...register('subject', { 
                          required: 'Subject is required',
                          minLength: { value: 3, message: 'Subject is too short' }
                        })}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <ErrorMessage message={errors.subject?.message} />
                  </motion.div>
                  
                  {/* Message field */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <FieldLabel name="message" label="Your Message" />
                    <div className="mt-1 relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <MessageSquare className={`h-5 w-5 ${
                          errors.message ? 'text-red-400' : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <textarea
                        id="message"
                        rows={5}
                        className={`py-3 px-4 pl-10 block w-full rounded-md bg-gray-50 dark:bg-gray-700 border ${
                          errors.message 
                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        } shadow-sm focus:ring-2 focus:ring-opacity-50 transition duration-200 dark:text-white`}
                        placeholder="I'd like to know more about..."
                        {...register('message', { 
                          required: 'Message is required',
                          minLength: { value: 10, message: 'Message is too short' }
                        })}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                    <ErrorMessage message={errors.message?.message} />
                  </motion.div>
                  
                  {/* Submit button */}
                  <motion.div variants={itemVariants} className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-4 w-4" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}