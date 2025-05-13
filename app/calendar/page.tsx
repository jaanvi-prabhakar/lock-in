'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, endOfWeek, addDays, isToday, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, isSameMonth, parseISO, addMonths, subMonths, isWithinInterval, differenceInDays } from 'date-fns';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { v4 as uuidv4 } from 'uuid';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Check, 
  Clock, 
  CalendarDays, 
  LayoutGrid, 
  ListChecks, 
  Flag, 
  Award, 
  Star,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';

// Type definitions
interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  category?: string;
  column?: string; // for drag-and-drop
}

interface Goal {
  id: string;
  title: string;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: number;
  completed: boolean;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface ColumnsState {
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}

// Animation variants
const calendarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const taskVariants = {
  hidden: { opacity: 0, height: 0, y: -10 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    y: 0,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 }
  }
};

// Generate a UUID for new tasks
const generateId = () => {
  return uuidv4();
};

// Format time from minutes to hours and minutes
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

// Get difficulty color
const getDifficultyColor = (difficulty: Task['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
    case 'hard':
      return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
  }
};

// Default columns for the board view
const initialColumns: ColumnsState = {
  columns: {
    'to-do': {
      id: 'to-do',
      title: 'To Do',
      taskIds: []
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: []
    },
    'completed': {
      id: 'completed',
      title: 'Completed',
      taskIds: []
    }
  },
  columnOrder: ['to-do', 'in-progress', 'completed']
};

export default function CalendarPage() {
  // State variables
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'board'>('week');
  const [tasks, setTasks] = useState<{ [key: string]: Task }>({});
  const [columns, setColumns] = useState<ColumnsState>(initialColumns);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  
  // New task form state
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    difficulty: 'medium',
    duration: 30,
    completed: false,
    category: 'work'
  });

  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Task management functions
  const openTaskModal = (task?: Task) => {
    if (task) {
      setSelectedTask(task);
      setNewTask(task);
    } else {
      setSelectedTask(null);
      setNewTask({
        title: '',
        description: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        difficulty: 'medium',
        duration: 30,
        completed: false,
        category: 'work'
      });
    }
    setShowTaskModal(true);
    setIsCreatingTask(!task);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveTask = () => {
    if (!newTask.title) {
      setError('Title is required');
      return;
    }

    const taskId = selectedTask?.id || generateId();
    const updatedTask: Task = {
      id: taskId,
      title: newTask.title || '',
      description: newTask.description || '',
      date: newTask.date || format(selectedDate, 'yyyy-MM-dd'),
      completed: newTask.completed || false,
      difficulty: newTask.difficulty as Task['difficulty'] || 'medium',
      duration: newTask.duration || 30,
      category: newTask.category || 'work',
      column: newTask.column || 'to-do'
    };

    setTasks(prev => ({
      ...prev,
      [taskId]: updatedTask
    }));

    if (!selectedTask) {
      setColumns(prev => ({
        ...prev,
        columns: {
          ...prev.columns,
          'to-do': {
            ...prev.columns['to-do'],
            taskIds: [...prev.columns['to-do'].taskIds, taskId]
          }
        }
      }));
    }

    setShowTaskModal(false);
    setError(null);
  };

  const deleteTask = (taskId: string) => {
    const { [taskId]: deletedTask, ...remainingTasks } = tasks;
    setTasks(remainingTasks);

    setColumns(prev => {
      const newColumns = { ...prev.columns };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          taskIds: newColumns[columnId].taskIds.filter(id => id !== taskId)
        };
      });
      return { ...prev, columns: newColumns };
    });

    setShowTaskModal(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        completed: !prev[taskId].completed
      }
    }));

    // Move task to completed column if completed, or back to to-do if uncompleted
    const task = tasks[taskId];
    if (!task.completed) {
      setColumns(prev => {
        const sourceColumn = Object.values(prev.columns).find(col => 
          col.taskIds.includes(taskId)
        );
        const sourceColumnId = sourceColumn?.id || 'to-do';

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumnId]: {
              ...prev.columns[sourceColumnId],
              taskIds: prev.columns[sourceColumnId].taskIds.filter(id => id !== taskId)
            },
            completed: {
              ...prev.columns.completed,
              taskIds: [...prev.columns.completed.taskIds, taskId]
            }
          }
        };
      });
    }
  };

  // Calendar helper functions
  const getMonthWeeks = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const firstWeekStart = startOfWeek(start, { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(end, { weekStartsOn: 1 });
    
    const weeks = [];
    let currentDay = firstWeekStart;
    
    while (currentDay <= lastWeekEnd) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(currentDay);
        currentDay = addDays(currentDay, 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  };

  const getTasksByDate = () => {
    const tasksByDate: { [key: string]: Task[] } = {};
    
    Object.values(tasks).forEach(task => {
      const dateKey = task.date;
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    });
    
    return tasksByDate;
  };

  // Week view rendering
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = [];
    let day = weekStart;
    
    while (day <= weekEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    const tasksByDate = getTasksByDate();
    
    return (
      <div className="space-y-4">
        {days.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = tasksByDate[dateKey] || [];
          
          return (
            <motion.div
              key={dateKey}
              className={`p-4 rounded-lg ${
                isToday(day)
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'bg-white dark:bg-gray-800'
              }`}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-lg font-medium ${
                  isToday(day) ? 'text-blue-800 dark:text-blue-300' : ''
                }`}>
                  {format(day, 'EEEE, MMM d')}
                </h3>
                <motion.button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setSelectedDate(day);
                    openTaskModal();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
              
              <div className="space-y-2">
                {dayTasks.map(task => (
                  <motion.div
                    key={task.id}
                    className={`p-3 rounded-lg ${
                      task.completed
                        ? 'bg-gray-50 dark:bg-gray-700/50'
                        : getDifficultyColor(task.difficulty)
                    }`}
                    variants={taskVariants}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openTaskModal(task)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
                        }`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(task.duration)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id);
                          }}
                          className={`p-1 rounded-full ${
                            task.completed
                              ? 'text-green-500 dark:text-green-400'
                              : 'text-gray-400 hover:text-green-500 dark:hover:text-green-400'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {dayTasks.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                    No tasks scheduled
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Render the month view
  const renderMonthView = () => {
    const weeks = getMonthWeeks();
    const tasksByDate = getTasksByDate();
    
    return (
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <motion.div
              key={index}
              className="p-2 font-medium text-sm text-gray-700 dark:text-gray-300"
              variants={itemVariants}
            >
              {day}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="grid grid-cols-1 gap-1"
          variants={calendarVariants}
        >
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((day, dayIndex) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayTasks = tasksByDate[dateKey] || [];
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = isSameDay(day, selectedDate);
                
                return (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`min-h-[100px] p-2 rounded-lg cursor-pointer ${
                      isToday(day) 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 font-semibold' 
                        : isCurrentMonth 
                          ? 'bg-white dark:bg-gray-800' 
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500'
                    } ${
                      isSelected
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                    variants={itemVariants}
                    onClick={() => {
                      setSelectedDate(day);
                      setNewTask({
                        ...newTask,
                        date: format(day, 'yyyy-MM-dd')
                      });
                    }}
                    whileHover={isCurrentMonth ? { scale: 1.02 } : {}}
                  >
                    <div className="text-right">
                      <span className={`text-sm ${isToday(day) ? 'font-semibold' : ''}`}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    
                    <div className="mt-1">
                      {dayTasks.slice(0, 2).map(task => (
                        <motion.div
                          key={task.id}
                          className={`px-2 py-1 mb-1 rounded text-xs truncate ${
                            task.completed 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : getDifficultyColor(task.difficulty)
                          }`}
                          whileHover={{ scale: 1.02 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTaskModal(task);
                          }}
                        >
                          {task.title}
                        </motion.div>
                      ))}
                      
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          + {dayTasks.length - 2} more
                        </div>
                      )}
                      
                      {dayTasks.length === 0 && isCurrentMonth && (
                        <div 
                          className="h-8 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(day);
                            setNewTask({
                              ...newTask,
                              date: format(day, 'yyyy-MM-dd')
                            });
                            openTaskModal();
                          }}
                        >
                          <Plus className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    );
  };
  
  // Render the board view (kanban style)
  const renderBoardView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {columns.columnOrder.map(columnId => {
          const column = columns.columns[columnId];
          const columnTasks = column.taskIds.map(taskId => tasks[taskId]).filter(Boolean);
          
          return (
            <div key={columnId} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <span className={`
                  w-3 h-3 rounded-full mr-2
                  ${columnId === 'to-do' ? 'bg-blue-500' : 
                    columnId === 'in-progress' ? 'bg-yellow-500' : 
                    'bg-green-500'}
                `}></span>
                {column.title}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({columnTasks.length})
                </span>
              </h3>
              
              <div className="space-y-2">
                {columnTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    className="p-3 rounded-lg shadow-sm bg-white dark:bg-gray-700 cursor-pointer"
                    whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onClick={() => openTaskModal(task)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {task.description || 'No description'}
                        </p>
                      </div>
                      <div 
                        className={`flex-shrink-0 w-3 h-3 rounded-full ${
                          task.difficulty === 'easy' ? 'bg-green-500' :
                          task.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(parseISO(task.date), 'MMM d')}
                        <Clock className="h-3 w-3 mx-1 ml-2" />
                        {formatTime(task.duration)}
                      </div>
                      
                      <div className="flex space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openTaskModal(task);
                          }}
                          className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskCompletion(task.id);
                          }}
                          className={`p-1 ${
                            task.completed 
                              ? 'text-green-500 dark:text-green-400' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400'
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm italic">
                    No tasks yet
                  </div>
                )}
                
                {columnId === 'to-do' && (
                  <motion.button
                    className="w-full mt-2 p-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => openTaskModal()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </motion.button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Task Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Organize, prioritize, and track your tasks
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'week' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setViewMode('week')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <CalendarDays className="h-4 w-4 inline-block mr-1" />
              Week
            </motion.button>
            
            <motion.button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'month' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setViewMode('month')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Calendar className="h-4 w-4 inline-block mr-1" />
              Month
            </motion.button>
            
            <motion.button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                viewMode === 'board' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setViewMode('board')}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <LayoutGrid className="h-4 w-4 inline-block mr-1" />
              Board
            </motion.button>
          </div>
        </div>
        
        {(viewMode === 'week' || viewMode === 'month') && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <motion.button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={goToPrevious}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
                
                <h2 className="text-xl font-semibold mx-4">
                  {viewMode === 'week' 
                    ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
                    : format(currentDate, 'MMMM yyyy')
                  }
                </h2>
                
                <motion.button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={goToNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
              
              <div className="flex items-center">
                <motion.button
                  className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg font-medium"
                  onClick={goToToday}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Today
                </motion.button>
                
                <motion.button
                  className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center"
                  onClick={() => openTaskModal()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Task
                </motion.button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode + currentDate.toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {viewMode === 'week' ? renderWeekView() : renderMonthView()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        
        {viewMode === 'board' && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Task Board</h2>
              
              <motion.button
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center"
                onClick={() => openTaskModal()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </motion.button>
            </div>
            
            <AnimatePresence>
              <motion.div
                key="board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderBoardView()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        
        {/* Task Summary Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-blue-700 dark:text-blue-300">To Do</h3>
                <span className="bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs font-medium">
                  {columns.columns['to-do'].taskIds.length}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Tasks waiting to be started
              </p>
              
              <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(columns.columns['to-do'].taskIds.length / Math.max(Object.keys(tasks).length, 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                ></motion.div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-yellow-700 dark:text-yellow-300">In Progress</h3>
                <span className="bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs font-medium">
                  {columns.columns['in-progress'].taskIds.length}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Tasks being worked on
              </p>
              
              <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(columns.columns['in-progress'].taskIds.length / Math.max(Object.keys(tasks).length, 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                ></motion.div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-green-700 dark:text-green-300">Completed</h3>
                <span className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs font-medium">
                  {columns.columns['completed'].taskIds.length}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Tasks successfully finished
              </p>
              
              <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(columns.columns['completed'].taskIds.length / Math.max(Object.keys(tasks).length, 1)) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {isCreatingTask ? 'New Task' : 'Edit Task'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowTaskModal(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Task description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newTask.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={newTask.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min={5}
                      step={5}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={newTask.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={newTask.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="work">Work</option>
                    <option value="learning">Learning</option>
                    <option value="practice">Practice</option>
                    <option value="career">Career</option>
                    <option value="research">Research</option>
                  </select>
                </div>
                
                {!isCreatingTask && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="completed"
                      name="completed"
                      checked={newTask.completed}
                      onChange={(e) => setNewTask({...newTask, completed: e.target.checked})}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="completed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Mark as completed
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-6">
                {selectedTask ? (
                  <motion.button
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium flex items-center"
                    onClick={() => deleteTask(selectedTask.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </motion.button>
                ) : (
                  <div></div> // Empty div to maintain layout
                )}
                
                <motion.button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  onClick={saveTask}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}