import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Share2, 
  BarChart2, 
  LineChart, 
  PieChart,
  Info
} from 'lucide-react'

// Mock chart data
const generateChartData = (salesData, selectedRegion, selectedProduct) => {
  // Filter by region and product if selected
  const filteredData = salesData.revenueByMonth.map(item => ({
    ...item,
    revenue: item.revenue * (
      selectedRegion === 'all' ? 1 : 
      selectedRegion === 'north' ? 0.4 : 
      selectedRegion === 'south' ? 0.3 : 
      selectedRegion === 'east' ? 0.2 : 
      0.1
    ) * (
      selectedProduct === 'all' ? 1 :
      selectedProduct === 'subscription' ? 0.5 :
      selectedProduct === 'services' ? 0.3 :
      0.2
    )
  }))
  
  return {
    months: filteredData.map(item => item.month),
    revenue: filteredData.map(item => item.revenue),
    target: filteredData.map(item => item.revenue * 1.2) // Target is 20% above actual
  }
}

const MainFeature = ({ salesData }) => {
  const [chartType, setChartType] = useState('bar')
  const [dateRange, setDateRange] = useState('year')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [showTooltip, setShowTooltip] = useState(false)
  const [chartData, setChartData] = useState(null)
  
  // Update chart data when filters change
  useEffect(() => {
    setChartData(generateChartData(salesData, selectedRegion, selectedProduct))
  }, [salesData, selectedRegion, selectedProduct])
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  // Calculate total revenue from filtered data
  const totalRevenue = chartData ? chartData.revenue.reduce((sum, val) => sum + val, 0) : 0
  const totalTarget = chartData ? chartData.target.reduce((sum, val) => sum + val, 0) : 0
  const percentOfTarget = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-lg font-semibold mr-2">Revenue Analysis</h2>
            <div className="relative">
              <button 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              >
                <Info size={16} />
              </button>
              
              <AnimatePresence>
                {showTooltip && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute left-0 top-6 w-64 p-3 bg-white dark:bg-surface-800 rounded-lg shadow-soft dark:shadow-none border border-surface-200 dark:border-surface-700 z-10 text-sm"
                  >
                    This chart shows revenue performance against targets. Use the filters to analyze by region, product, or time period.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
              <button 
                onClick={() => setChartType('bar')}
                className={`p-2 ${
                  chartType === 'bar' 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <BarChart2 size={18} />
              </button>
              <button 
                onClick={() => setChartType('line')}
                className={`p-2 ${
                  chartType === 'line' 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <LineChart size={18} />
              </button>
              <button 
                onClick={() => setChartType('pie')}
                className={`p-2 ${
                  chartType === 'pie' 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <PieChart size={18} />
              </button>
            </div>
            
            <div className="flex items-center rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden bg-white dark:bg-surface-800">
              <span className="pl-3">
                <Calendar size={16} className="text-surface-400" />
              </span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm appearance-none"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-400">
                <ChevronDown size={16} />
              </div>
            </div>
            
            <button className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700">
              <Download size={18} />
            </button>
            
            <button className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="select"
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Product Category</label>
              <select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="select"
              >
                <option value="all">All Products</option>
                <option value="subscription">Subscriptions</option>
                <option value="services">Services</option>
                <option value="hardware">Hardware</option>
              </select>
            </div>
            
            <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
              <h3 className="font-medium mb-3">Performance Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-500 dark:text-surface-400">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentOfTarget}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-surface-500 dark:text-surface-400">Target</span>
                    <span className="font-medium">{formatCurrency(totalTarget)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-500 dark:text-surface-400">Progress</span>
                    <span className={`font-medium ${
                      percentOfTarget >= 90 ? 'text-green-500' : 
                      percentOfTarget >= 70 ? 'text-amber-500' : 
                      'text-red-500'
                    }`}>
                      {percentOfTarget.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="lg:col-span-3">
            {chartData && (
              <div className="h-80 relative">
                {chartType === 'bar' && (
                  <div className="h-full flex items-end space-x-2">
                    {chartData.months.map((month, index) => (
                      <div key={month} className="flex-1 flex flex-col items-center">
                        <div className="w-full relative flex flex-col items-center">
                          {/* Target line */}
                          <div 
                            className="absolute w-full border-t-2 border-dashed border-surface-300 dark:border-surface-600"
                            style={{ 
                              bottom: `${(chartData.target[index] / Math.max(...chartData.target)) * 100}%` 
                            }}
                          />
                          
                          {/* Actual bar */}
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${(chartData.revenue[index] / Math.max(...chartData.target)) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                            className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t-lg"
                            style={{ maxWidth: '30px', margin: '0 auto' }}
                          />
                        </div>
                        <span className="text-xs mt-2 text-surface-500 dark:text-surface-400">{month}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {chartType === 'line' && (
                  <div className="h-full relative">
                    {/* Background grid */}
                    <div className="absolute inset-0 grid grid-cols-1 grid-rows-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-t border-surface-200 dark:border-surface-700" />
                      ))}
                    </div>
                    
                    {/* Chart lines */}
                    <svg className="w-full h-full" viewBox={`0 0 ${chartData.months.length * 50} 200`} preserveAspectRatio="none">
                      {/* Target line */}
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        d={`M ${chartData.target.map((value, i) => `${i * 50 + 25},${200 - (value / Math.max(...chartData.target)) * 180}`).join(' L ')}`}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      
                      {/* Actual line */}
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        d={`M ${chartData.revenue.map((value, i) => `${i * 50 + 25},${200 - (value / Math.max(...chartData.target)) * 180}`).join(' L ')}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      {chartData.revenue.map((value, i) => (
                        <motion.circle
                          key={i}
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                          cx={i * 50 + 25}
                          cy={200 - (value / Math.max(...chartData.target)) * 180}
                          fill="#3b82f6"
                          stroke="#fff"
                          strokeWidth="2"
                        />
                      ))}
                    </svg>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6">
                      {chartData.months.map((month, i) => (
                        <span key={i} className="text-xs text-surface-500 dark:text-surface-400">{month}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {chartType === 'pie' && (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-64 h-64 relative">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <motion.circle
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: percentOfTarget / 100 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray="251.2"
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="12"
                          className="dark:stroke-surface-700"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{percentOfTarget.toFixed(1)}%</span>
                        <span className="text-sm text-surface-500 dark:text-surface-400">of target</span>
                      </div>
                    </div>
                    
                    <div className="ml-8">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                          <span className="text-sm">Actual: {formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-surface-300 dark:bg-surface-700 mr-2"></div>
                          <span className="text-sm">Target: {formatCurrency(totalTarget)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MainFeature