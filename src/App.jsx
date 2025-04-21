import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Sun, Moon, BarChart3, User, Settings, PieChart, Home as HomeIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import Teams from './pages/Teams'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import NotFound from './pages/NotFound'

function App() {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { icon: <HomeIcon size={20} />, label: "Dashboard", path: "/" },
    { icon: <BarChart3 size={20} />, label: "Analytics", path: "/analytics" },
    { icon: <PieChart size={20} />, label: "Reports", path: "/reports" },
    { icon: <User size={20} />, label: "Team", path: "/teams" },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" }
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-16 lg:w-64 h-screen bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 transition-all duration-300">
        <div className="p-4 flex items-center justify-center lg:justify-start">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <h1 className="ml-2 text-xl font-bold text-surface-800 dark:text-white hidden lg:block">Sales Analytics</h1>
          </motion.div>
        </div>
        
        <nav className="flex-1 mt-6">
          <ul className="space-y-2 px-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20' 
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="w-1 h-6 bg-primary rounded-full ml-auto hidden lg:block"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center lg:justify-between p-3 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
          >
            <span className="flex-shrink-0">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </span>
            <span className="ml-3 font-medium hidden lg:block">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App