import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  BarChart, 
  Filter, 
  Calendar, 
  ChevronDown,
  Search,
  RefreshCw
} from 'lucide-react'
import MainFeature from '../components/MainFeature'

// Mock data for the dashboard
const mockSalesData = {
  totalRevenue: 124580,
  previousRevenue: 98450,
  totalCustomers: 1842,
  previousCustomers: 1650,
  totalProducts: 68,
  previousProducts: 72,
  revenueByMonth: [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 38000 },
    { month: 'Mar', revenue: 45000 },
    { month: 'Apr', revenue: 40000 },
    { month: 'May', revenue: 50000 },
    { month: 'Jun', revenue: 55000 },
    { month: 'Jul', revenue: 48000 },
    { month: 'Aug', revenue: 52000 },
    { month: 'Sep', revenue: 58000 },
    { month: 'Oct', revenue: 62000 },
    { month: 'Nov', revenue: 68000 },
    { month: 'Dec', revenue: 72000 }
  ],
  topProducts: [
    { id: 1, name: 'Premium Subscription', sales: 245, revenue: 24500 },
    { id: 2, name: 'Business Plan', sales: 187, revenue: 28050 },
    { id: 3, name: 'Enterprise Solution', sales: 124, revenue: 37200 },
    { id: 4, name: 'Starter Package', sales: 312, revenue: 15600 },
    { id: 5, name: 'Add-on Services', sales: 89, revenue: 8900 }
  ],
  topSalesReps: [
    { id: 1, name: 'Sarah Johnson', sales: 42, revenue: 63000, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Michael Chen', sales: 38, revenue: 57000, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'Jessica Williams', sales: 35, revenue: 52500, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 4, name: 'David Rodriguez', sales: 31, revenue: 46500, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }
  ]
}

const Home = () => {
  const [salesData, setSalesData] = useState(mockSalesData)
  const [timeRange, setTimeRange] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Calculate percentage changes
  const revenueChange = ((salesData.totalRevenue - salesData.previousRevenue) / salesData.previousRevenue) * 100
  const customersChange = ((salesData.totalCustomers - salesData.previousCustomers) / salesData.previousCustomers) * 100
  const productsChange = ((salesData.totalProducts - salesData.previousProducts) / salesData.previousProducts) * 100
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  // Refresh data
  const refreshData = () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Generate some random fluctuations in the data
      const fluctuation = (base) => base * (0.95 + Math.random() * 0.1)
      
      setSalesData(prev => ({
        ...prev,
        totalRevenue: Math.round(fluctuation(prev.totalRevenue)),
        totalCustomers: Math.round(fluctuation(prev.totalCustomers)),
        totalProducts: Math.round(fluctuation(prev.totalProducts)),
        revenueByMonth: prev.revenueByMonth.map(item => ({
          ...item,
          revenue: Math.round(fluctuation(item.revenue))
        })),
        topProducts: prev.topProducts.map(item => ({
          ...item,
          sales: Math.round(fluctuation(item.sales)),
          revenue: Math.round(fluctuation(item.revenue))
        })),
        topSalesReps: prev.topSalesReps.map(item => ({
          ...item,
          sales: Math.round(fluctuation(item.sales)),
          revenue: Math.round(fluctuation(item.revenue))
        }))
      }))
      
      setIsLoading(false)
    }, 1200)
  }
  
  // Change time range
  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
    refreshData()
  }
  
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Sales Dashboard</h1>
          <p className="text-surface-500 dark:text-surface-400">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center"
            >
              <Filter size={16} className="mr-2" />
              Filters
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-xl shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 z-10"
                >
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-surface-500 dark:text-surface-400 mb-2">Time Period</h3>
                    <div className="space-y-2">
                      {['daily', 'weekly', 'monthly', 'quarterly', 'yearly'].map(period => (
                        <label key={period} className="flex items-center">
                          <input 
                            type="radio" 
                            name="timeRange" 
                            value={period} 
                            checked={timeRange === period}
                            onChange={() => handleTimeRangeChange(period)}
                            className="mr-2 accent-primary"
                          />
                          <span className="text-sm capitalize">{period}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="btn btn-primary flex items-center"
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { 
            title: 'Total Revenue', 
            value: salesData.totalRevenue, 
            change: revenueChange, 
            icon: <DollarSign size={20} />, 
            color: 'from-blue-500 to-indigo-600' 
          },
          { 
            title: 'Total Customers', 
            value: salesData.totalCustomers, 
            change: customersChange, 
            icon: <Users size={20} />, 
            color: 'from-purple-500 to-pink-500' 
          },
          { 
            title: 'Total Products', 
            value: salesData.totalProducts, 
            change: productsChange, 
            icon: <ShoppingBag size={20} />, 
            color: 'from-amber-500 to-orange-600' 
          }
        ].map((card, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">{card.title}</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold mr-2">
                    {card.title.includes('Revenue') 
                      ? formatCurrency(card.value) 
                      : card.value.toLocaleString()}
                  </span>
                  <div className={`flex items-center text-sm ${
                    card.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {card.change >= 0 
                      ? <TrendingUp size={16} className="mr-1" /> 
                      : <TrendingDown size={16} className="mr-1" />
                    }
                    <span>{Math.abs(card.change).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Main Feature */}
      <MainFeature salesData={salesData} />
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Top Products</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {salesData.topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Top Sales Reps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Top Sales Representatives</h2>
          </div>
          <div className="p-6 space-y-6">
            {salesData.topSalesReps.map((rep, index) => (
              <div key={rep.id} className="flex items-center">
                <div className="relative">
                  <img 
                    src={rep.avatar} 
                    alt={rep.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-surface-700"
                  />
                  <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-surface-800 flex items-center justify-center border-2 border-white dark:border-surface-700 text-xs font-bold ${
                    index === 0 ? 'text-amber-500' : index === 1 ? 'text-surface-400' : index === 2 ? 'text-amber-700' : 'text-surface-600'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{rep.name}</h3>
                  <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
                    <span>{rep.sales} sales</span>
                    <span className="mx-2">•</span>
                    <span>{formatCurrency(rep.revenue)}</span>
                  </div>
                </div>
                <div className="w-24 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(rep.revenue / salesData.topSalesReps[0].revenue) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      index === 1 ? 'bg-gradient-to-r from-surface-300 to-surface-400' : 
                      index === 2 ? 'bg-gradient-to-r from-amber-700 to-amber-800' : 
                      'bg-gradient-to-r from-surface-500 to-surface-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home