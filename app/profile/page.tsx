'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Animation variants for page sections
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function ProfilePage() {
  // Profile state
  const [preview, setPreview] = useState('/images/mario.jpeg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState('YourUsername');
  const [originalName, setOriginalName] = useState('YourUsername');
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection from input
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Common file handling logic
  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Trigger file input click
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle display name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setDisplayName(newName);
    setIsNameChanged(newName !== originalName);
  };

  // Save display name
  const handleNameSave = async () => {
    // Mock API call to save name
    try {
      // Implementation would go here
      // await fetch('/api/profile/name', { method: 'POST', body: JSON.stringify({ name: displayName }) });
      
      // Update original name to reflect saved state
      setOriginalName(displayName);
      setIsNameChanged(false);
      
      // Show success animation or notification
      const successIndicator = document.getElementById('nameSuccessIndicator');
      if (successIndicator) {
        successIndicator.classList.remove('opacity-0');
        successIndicator.classList.add('opacity-100');
        setTimeout(() => {
          successIndicator.classList.remove('opacity-100');
          successIndicator.classList.add('opacity-0');
        }, 2000);
      }
    } catch (error) {
      alert('Failed to save name');
    }
  };

  // Handle image upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        // Success handling
        // To refetch user data, you would typically use a state management system
        // For example with React Query:
        // queryClient.invalidateQueries('userData');
        
        // Display success message
        const uploadSuccessIndicator = document.getElementById('uploadSuccessIndicator');
        if (uploadSuccessIndicator) {
          uploadSuccessIndicator.classList.remove('opacity-0');
          uploadSuccessIndicator.classList.add('opacity-100');
          setTimeout(() => {
            uploadSuccessIndicator.classList.remove('opacity-100');
            uploadSuccessIndicator.classList.add('opacity-0');
          }, 2000);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.main
      className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header className="mb-8" variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Your Profile</h1>
      </motion.header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Profile Picture Section */}
        <motion.section 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          variants={itemVariants}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
            Profile Picture
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <motion.div 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                  <span className="text-white text-xs sm:text-sm">Change Photo</span>
                </div>
              </motion.div>
              
              {/* Upload success indicator */}
              <div 
                id="uploadSuccessIndicator" 
                className="absolute top-0 right-0 bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 transition-opacity duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1">
              <div
                className={`border-2 border-dashed rounded-lg p-4 mb-4 text-center transition-colors duration-200 ${
                  dragActive 
                    ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30" 
                    : "border-gray-300 dark:border-gray-700"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Drag and drop your image here, or
                </p>
                <button 
                  type="button" 
                  onClick={onButtonClick}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Supported formats: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    !selectedFile && "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!selectedFile || isUploading}
                  whileHover={selectedFile ? { scale: 1.03 } : {}}
                  whileTap={selectedFile ? { scale: 0.97 } : {}}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : "Upload Image"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Display Name Section */}
        <motion.section 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          variants={itemVariants}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
            Display Name
          </h2>
          
          <div className="max-w-md">
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What should we call you?
              </label>
              <div className="relative">
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={handleNameChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {/* Success indicator */}
                <div 
                  id="nameSuccessIndicator" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 opacity-0 transition-opacity duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This is how you'll appear to other users
              </p>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                type="button"
                className={`px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  !isNameChanged && "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleNameSave}
                disabled={!isNameChanged}
                whileHover={isNameChanged ? { scale: 1.03 } : {}}
                whileTap={isNameChanged ? { scale: 0.97 } : {}}
              >
                Save Name
              </motion.button>
            </div>
          </div>
        </motion.section>
        
        {/* Additional Profile Information Section */}
        <motion.section 
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          variants={itemVariants}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
            About You
          </h2>
          
          <div className="max-w-md">
            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                placeholder="Tell us a bit about yourself..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <motion.button
                type="button"
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Save Profile
              </motion.button>
            </div>
          </div>
        </motion.section>
      </form>
      
      <motion.footer 
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        variants={itemVariants}
      >
        <p>Your profile is visible to other users on the platform.</p>
      </motion.footer>
    </motion.main>
  );
}