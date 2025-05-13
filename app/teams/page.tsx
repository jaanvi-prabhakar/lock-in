'use client';

import { useState, useEffect } from 'react';
import { createTeam, joinTeam } from '@/actions/teams';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Users, Award, Zap, Share2 } from 'lucide-react';
import Footer from '@/components/Footer';

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

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

export default function TeamsPage() {
  // State
  const [createError, setCreateError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('team');
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Mock data
  const teamMembers = [
    { name: 'Audrey', xp: 1250, avatar: '/api/placeholder/50/50' },
    { name: 'Xiaochen', xp: 980, avatar: '/api/placeholder/50/50' },
    { name: 'Jaanvi', xp: 860, avatar: '/api/placeholder/50/50' },
  ];

  const leaderboard = [
    { team: 'Lock-In Legends', xp: 3090, rank: 1 },
    { team: 'Code Crushers', xp: 2890, rank: 2 },
    { team: 'Bug Slayers', xp: 2700, rank: 3 },
    { team: 'Syntax Savants', xp: 2450, rank: 4 },
    { team: 'Debugging Dynamos', xp: 2100, rank: 5 },
  ];

  const totalTeamXP = teamMembers.reduce((sum, member) => sum + member.xp, 0);
  const teamGoalXP = 5000;
  const progressPercentage = Math.min(100, Math.round((totalTeamXP / teamGoalXP) * 100));

  // Auto-reset success messages
  useEffect(() => {
    if (createSuccess) {
      const timer = setTimeout(() => setCreateSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [createSuccess]);

  useEffect(() => {
    if (joinSuccess) {
      const timer = setTimeout(() => setJoinSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [joinSuccess]);

  // Copy invite code to clipboard
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode || 'ABC123');
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Form handlers
  async function handleCreateTeam(formData) {
    setIsCreating(true);
    setCreateError('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (teamName.trim().length < 3) {
        setCreateError('Team name must be at least 3 characters');
        return;
      }
      
      // Mock successful response
      const mockInviteCode = 'TEAM' + Math.random().toString(36).substring(2, 7).toUpperCase();
      setInviteCode(mockInviteCode);
      setCreateSuccess(true);
      
      // Reset form
      setTeamName('');
    } catch (error) {
      setCreateError('An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleJoinTeam(formData) {
    setIsJoining(true);
    setJoinError('');
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (teamCode.trim().length < 5) {
        setJoinError('Invalid team code format');
        return;
      }
      
      // Simulate successful join (70% chance)
      if (Math.random() > 0.3) {
        setJoinSuccess(true);
        // Reset form
        setTeamCode('');
      } else {
        setJoinError('Team not found or code is invalid');
      }
    } catch (error) {
      setJoinError('An unexpected error occurred');
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8 max-w-6xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header className="mb-8 text-center" variants={itemVariants}>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Team Up & Level Up</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Create or join a team to collaborate, compete, and climb the leaderboard together.
        </p>
      </motion.header>

      {/* Mobile Tabs Navigation */}
      <motion.div 
        className="flex mb-6 border-b md:hidden" 
        variants={itemVariants}
      >
        <button 
          className={`flex-1 py-3 text-center font-medium border-b-2 ${
            activeTab === 'team' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('team')}
        >
          Your Team
        </button>
        <button 
          className={`flex-1 py-3 text-center font-medium border-b-2 ${
            activeTab === 'create' 
              ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('create')}
        >
          Create/Join
        </button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Team Details & Stats - Hidden on mobile if not active tab */}
        <motion.div 
          className={`md:col-span-2 space-y-6 ${activeTab !== 'team' ? 'hidden md:block' : ''}`}
          variants={itemVariants}
        >
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Lock-In Legends
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Invite Code</p>
                  <div className="flex items-center mt-1">
                    <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded font-mono text-sm">
                      {inviteCode || "ABC123"}
                    </code>
                    <motion.button
                      className="ml-2 p-1 text-gray-500 hover:text-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={copyInviteCode}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </motion.button>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Rank</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">#1</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium flex items-center">
                    <Zap className="mr-1 h-4 w-4 text-yellow-500" />
                    Team XP Progress
                  </h3>
                  <span className="text-sm font-medium">
                    {totalTeamXP} / {teamGoalXP} XP
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <motion.div
                    className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
                    style={{ width: `${progressPercentage}%` }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {progressPercentage >= 10 && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {progressPercentage}%
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <motion.button
                  className="px-4 py-2 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center transition-colors duration-200"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Invite Friends
                </motion.button>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Next Milestone: <span className="font-medium">5,000 XP</span>
                </p>
              </div>
            </div>
          </motion.section>
          
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Team Members
            </h2>
            
            <ul className="space-y-3">
              <AnimatePresence>
                {teamMembers.map((member, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mr-3">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">
                        <Zap className="h-4 w-4" />
                      </span>
                      <span className="font-mono">{member.xp.toLocaleString()} XP</span>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.section>
          
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Global Leaderboard
            </h2>
            
            <div className="overflow-hidden">
              <ul className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <motion.li 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.team === 'Lock-In Legends' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 font-medium' 
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01, x: 5 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                        index === 0 ? 'bg-yellow-100 text-yellow-600' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {entry.rank}
                      </div>
                      <span>{entry.team}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-mono">{entry.xp.toLocaleString()} XP</span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>
        </motion.div>
        
        {/* Create/Join Forms - Hidden on mobile if not active tab */}
        <motion.div 
          className={`space-y-6 ${activeTab !== 'create' ? 'hidden md:block' : ''}`}
          variants={itemVariants}
        >
          {/* Create Team Form */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create a New Team</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateTeam(); }} className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Name
                </label>
                <Input
                  id="teamName"
                  name="teamName"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                  placeholder="Enter a creative team name"
                  className="w-full transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Min. 3 characters, be creative!</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: createSuccess ? 1 : 0, 
                  height: createSuccess ? 'auto' : 0 
                }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md border border-green-200 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-300 flex items-center text-sm font-medium">
                    <Check className="mr-1.5 h-4 w-4" />
                    Team created successfully!
                  </p>
                  
                  <div className="mt-2 flex items-center">
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Share this code with friends to invite them:
                    </p>
                    <code className="ml-2 bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono">
                      {inviteCode}
                    </code>
                    <motion.button
                      className="ml-1 p-1 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 rounded-full focus:outline-none"
                      onClick={copyInviteCode}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {codeCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              {createError && (
                <motion.p 
                  className="text-red-500 text-sm flex items-center" 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {createError}
                </motion.p>
              )}
              
              <motion.button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                disabled={isCreating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : "Create Team"}
              </motion.button>
            </form>
          </motion.section>

          {/* Join Team Form */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Join Existing Team</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleJoinTeam(); }} className="space-y-4">
              <div>
                <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Team Invite Code
                </label>
                <Input
                  id="teamCode"
                  name="teamCode"
                  type="text"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  required
                  placeholder="Enter team invite code"
                  className="w-full font-mono transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">Ask your team leader for the code</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: joinSuccess ? 1 : 0, 
                  height: joinSuccess ? 'auto' : 0 
                }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-md border border-green-200 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-300 flex items-center text-sm font-medium">
                    <Check className="mr-1.5 h-4 w-4" />
                    You've successfully joined the team!
                  </p>
                </div>
              </motion.div>
              
              {joinError && (
                <motion.p 
                  className="text-red-500 text-sm flex items-center" 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {joinError}
                </motion.p>
              )}
              
              <motion.button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
                disabled={isJoining}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isJoining ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </>
                ) : "Join Team"}
              </motion.button>
            </form>
          </motion.section>
          
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800"
            variants={itemVariants}
          >
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Why join a team?</h3>
            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Earn XP faster with team multipliers</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Unlock exclusive team challenges and rewards</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 mr-1.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Compete on the global leaderboard for prizes</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
}