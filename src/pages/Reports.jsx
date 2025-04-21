import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, subDays, subMonths } from 'date-fns'
import Chart from 'react-apexcharts'
import { 
  Calendar,
  Download,
  Filter,
  ChevronDown,
  RefreshCw,
  Layers,
  ShoppingBag,
  Users,
  UserRound,
  BarChart3,
  FileText
} from 'lucide-react'

// Mock data for the reports
const mockReportsData = {
  // Sales data over time with different time granularity
  salesOverTime: {
    daily: Array(30).fill().map((_, i) => ({
      date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
      revenue: 5000 + Math.floor(Math.random() * 8000),
      transactions: 80 + Math.floor(Math.random() * 120),
      customers: 50 + Math.floor(Math.random() * 100)
    })),
    weekly: Array(12).fill().map((_, i) => ({
      date: `Week ${i + 1}`,
      revenue: 30000 + Math.floor(Math.random() * 40000),
      transactions: 500 + Math.floor(Math.random() * 700),
      customers: 300 + Math.floor(Math.random() * 500)
    })),
    monthly: Array(12).fill().map((_, i) => ({
      date: format(subMonths(new Date(), 11 - i), 'MMM yyyy'),
      revenue: 120000 + Math.floor(Math.random() * 180000),
      transactions: 2000 + Math.floor(Math.random() * 3000),
      customers: 1200 + Math.floor(Math.random() * 1800)
    }))
  },

  // Product performance data
  productPerformance: [
    { id: 1, name: 'Premium Subscription', sales: 1245, revenue: 124500, growth: 15.2, category: 'Subscription' },
    { id: 2, name: 'Business Plan', sales: 987, revenue: 148050, growth: 8.7, category: 'Subscription' },
    { id: 3, name: 'Enterprise Solution', sales: 624, revenue: 187200, growth: 22.4, category: 'Enterprise' },
    { id: 4, name: 'Starter Package', sales: 1312, revenue: 65600, growth: -5.8, category: 'Starter' },
    { id: 5, name: 'Add-on Services', sales: 489, revenue: 48900, growth: 12.3, category: 'Services' },
    { id: 6, name: 'Consulting Hours', sales: 356, revenue: 71200, growth: 18.6, category: 'Services' },
    { id: 7, name: 'Data Migration', sales: 215, revenue: 43000, growth: 4.2, category: 'Services' },
    { id: 8, name: 'Training', sales: 432, revenue: 34560, growth: -2.1, category: 'Training' }
  ],

  // Sales rep performance
  repPerformance: [
    { id: 1, name: 'Sarah Johnson', quota: 120000, actual: 163000, deals: 42, avgDealSize: 3881, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 2, name: 'Michael Chen', quota: 120000, actual: 137000, deals: 38, avgDealSize: 3605, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 3, name: 'Jessica Williams', quota: 100000, actual: 112500, deals: 35, avgDealSize: 3214, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 4, name: 'David Rodriguez', quota: 100000, actual: 96500, deals: 31, avgDealSize: 3113, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 5, name: 'Emily Wang', quota: 80000, actual: 98200, deals: 29, avgDealSize: 3386, avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' },
    { id: 6, name: 'Robert Kim', quota: 80000, actual: 75400, deals: 24, avgDealSize: 3142, avatar: 'https://images.unsplash.com/photo-1542178243-bc20204b769f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80' }
  ],

  // Customer analytics
  customerAnalytics: {
    acquisitionSources: [
      { source: 'Organic Search', count: 1245, percentage: 32 },
      { source: 'Direct', count: 875, percentage: 22 },
      { source: 'Referral', count: 654, percentage: 17 },
      { source: 'Social Media', count: 498, percentage: 13 },
      { source: 'Email', count: 387, percentage: 10 },
      { source: 'Other', count: 245, percentage: 6 }
    ],
    retentionRate: [
      { month: 'Jan', rate: 94.2 },
      { month: 'Feb', rate: 93.8 },
      { month: 'Mar', rate: 95.1 },
      { month: 'Apr', rate: 94.5 },
      { month: 'May', rate: 93.2 },
      { month: 'Jun', rate: 94.8 },
      { month: 'Jul', rate: 95.3 },
      { month: 'Aug', rate: 94.7 },
      { month: 'Sep', rate: 95.8 },
      { month: 'Oct', rate: 96.2 },
      { month: 'Nov', rate: 96.5 },
      { month: 'Dec', rate: 96.8 }
    ],
    customerSegments: [
      { segment: 'Enterprise', count: 245, revenue: 735000, avgValue: 3000 },
      { segment: 'Mid-Market', count: 587, revenue: 1174000, avgValue: 2000 },
      { segment: 'Small Business', count: 1432, revenue: 1718400, avgValue: 1200 },
      { segment: 'Startup', count: 873, revenue: 698400, avgValue: 800 }
    ]
  }
}

const Reports = () => {
  const [reportType, setReportType] = useState('sales')
  const [timeRange, setTimeRange] = useState('monthly')
  const [dateFilter, setDateFilter] = useState('last12Months')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [reportsData, setReportsData] = useState(mockReportsData)

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
      
      // Clone and update the data with small fluctuations for simulation
      const updatedData = JSON.parse(JSON.stringify(reportsData))
      
      // Update sales over time data
      Object.keys(updatedData.salesOverTime).forEach(period => {
        updatedData.salesOverTime[period] = updatedData.salesOverTime[period].map(item => ({
          ...item,
          revenue: Math.round(fluctuation(item.revenue)),
          transactions: Math.round(fluctuation(item.transactions)),
          customers: Math.round(fluctuation(item.customers))
        }))
      })
      
      // Update product performance
      updatedData.productPerformance = updatedData.productPerformance.map(product => ({
        ...product,
        sales: Math.round(fluctuation(product.sales)),
        revenue: Math.round(fluctuation(product.revenue)),
        growth: parseFloat((product.growth * (0.9 + Math.random() * 0.2)).toFixed(1))
      }))
      
      // Update rep performance
      updatedData.repPerformance = updatedData.repPerformance.map(rep => ({
        ...rep,
        actual: Math.round(fluctuation(rep.actual)),
        deals: Math.round(fluctuation(rep.deals)),
        avgDealSize: Math.round(fluctuation(rep.avgDealSize))
      }))
      
      setReportsData(updatedData)
      setIsLoading(false)
    }, 1200)
  }

  // Sales Summary Report Content
  const SalesSummaryReport = () => {
    const salesData = reportsData.salesOverTime[timeRange]
    
    const chartOptions = {
      chart: {
        type: 'area',
        toolbar: {
          show: true
        },
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748b'
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#4f46e5', '#8b5cf6', '#f59e0b'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: salesData.map(item => item.date),
        labels: {
          rotate: -45,
          rotateAlways: false
        }
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return formatCurrency(value);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return formatCurrency(value);
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    }
    
    const series = [
      {
        name: 'Revenue',
        data: salesData.map(item => item.revenue)
      }
    ]
    
    return (
      <div className="space-y-6">
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Revenue Over Time</h2>
          </div>
          <div className="p-6">
            <Chart 
              options={chartOptions}
              series={series}
              type="area"
              height={350}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Detailed Sales Data</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Customers</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Avg. Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {salesData.map((period, index) => (
                  <tr key={index} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{period.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(period.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {period.transactions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {period.customers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {formatCurrency(period.revenue / period.transactions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
  // Product Performance Report Content
  const ProductPerformanceReport = () => {
    const productData = reportsData.productPerformance
    
    // Calculate total revenue for percentage calculations
    const totalRevenue = productData.reduce((total, product) => total + product.revenue, 0)
    
    // Chart for product categories
    const categoryData = productData.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = 0
      }
      acc[product.category] += product.revenue
      return acc
    }, {})
    
    const pieChartOptions = {
      chart: {
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748b'
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      },
      labels: Object.keys(categoryData),
      colors: ['#4f46e5', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 768,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        y: {
          formatter: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
    
    const pieSeries = Object.values(categoryData)
    
    // Chart for product growth
    const growthChartOptions = {
      chart: {
        type: 'bar',
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748b'
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '70%',
          colors: {
            ranges: [{
              from: -100,
              to: 0,
              color: '#f87171'
            }, {
              from: 0,
              to: 100,
              color: '#4ade80'
            }]
          }
        }
      },
      dataLabels: {
        formatter: function(val) {
          return val + "%";
        }
      },
      xaxis: {
        categories: productData.slice(0, 5).map(product => product.name),
        labels: {
          formatter: function(val) {
            return val + "%";
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '12px'
          }
        }
      }
    }
    
    const growthSeries = [{
      name: 'Growth',
      data: productData.slice(0, 5).map(product => product.growth)
    }]
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold">Revenue by Category</h2>
            </div>
            <div className="p-6">
              <Chart 
                options={pieChartOptions}
                series={pieSeries}
                type="pie"
                height={300}
              />
            </div>
          </div>
          
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold">Top 5 Products Growth Rate</h2>
            </div>
            <div className="p-6">
              <Chart 
                options={growthChartOptions}
                series={growthSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Product Performance Details</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">% of Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {productData.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {product.sales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {((product.revenue / totalRevenue) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.growth >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {product.growth >= 0 ? '+' : ''}{product.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
  // Sales Rep Performance Report Content
  const RepPerformanceReport = () => {
    const repData = reportsData.repPerformance
    
    // Chart for quota attainment
    const quotaChartOptions = {
      chart: {
        type: 'bar',
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748b'
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          borderRadius: 4
        }
      },
      colors: ['#4f46e5', '#d1d5db'],
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: repData.map(rep => rep.name.split(' ')[0]), // First name only for readability
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return formatCurrency(value);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return formatCurrency(value);
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    }
    
    const quotaSeries = [
      {
        name: 'Actual',
        data: repData.map(rep => rep.actual)
      },
      {
        name: 'Quota',
        data: repData.map(rep => rep.quota)
      }
    ]
    
    return (
      <div className="space-y-6">
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Quota Attainment by Rep</h2>
          </div>
          <div className="p-6">
            <Chart 
              options={quotaChartOptions}
              series={quotaSeries}
              type="bar"
              height={350}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Sales Representative Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Sales Rep</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Deals Closed</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Quota</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actual</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">% Attained</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Avg Deal Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {repData.map((rep) => (
                  <tr key={rep.id} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={rep.avatar} alt={rep.name} className="w-8 h-8 rounded-full mr-3" />
                        <div className="font-medium">{rep.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {rep.deals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(rep.quota)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {formatCurrency(rep.actual)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (rep.actual / rep.quota) >= 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      }`}>
                        {((rep.actual / rep.quota) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      {formatCurrency(rep.avgDealSize)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
  
  // Customer Analytics Report Content
  const CustomerAnalyticsReport = () => {
    const customerData = reportsData.customerAnalytics
    
    // Chart for customer acquisition sources
    const acquisitionChartOptions = {
      chart: {
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748b'
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      },
      labels: customerData.acquisitionSources.map(source => source.source),
      colors: ['#4f46e5', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#64748b'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 768,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        y: {
          formatter: function(value) {
            return value + " customers";
          }
        }
      }
    }
    
    const acquisitionSeries = customerData.acquisitionSources.map(source => source.count)
    
    // Chart for retention rate
    const retentionChartOptions = {
      chart: {
        type: 'line',
        fontFamily: 'Inter, sans-serif',
        foreColor: '#64748b'
      },
      theme: {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#4f46e5'],
      xaxis: {
        categories: customerData.retentionRate.map(item => item.month)
      },
      yaxis: {
        min: 90,
        max: 100,
        labels: {
          formatter: function(val) {
            return val.toFixed(1) + "%";
          }
        }
      },
      markers: {
        size: 5
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val.toFixed(1) + "%";
          }
        }
      }
    }
    
    const retentionSeries = [{
      name: 'Retention Rate',
      data: customerData.retentionRate.map(item => item.rate)
    }]
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold">Customer Acquisition Sources</h2>
            </div>
            <div className="p-6">
              <Chart 
                options={acquisitionChartOptions}
                series={acquisitionSeries}
                type="donut"
                height={300}
              />
            </div>
          </div>
          
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h2 className="text-lg font-semibold">Monthly Customer Retention Rate</h2>
            </div>
            <div className="p-6">
              <Chart 
                options={retentionChartOptions}
                series={retentionSeries}
                type="line"
                height={300}
              />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold">Customer Segments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Customers</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Avg. Customer Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">% of Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {customerData.customerSegments.map((segment, index) => {
                  const totalRevenue = customerData.customerSegments.reduce((total, seg) => total + seg.revenue, 0)
                  return (
                    <tr key={index} className="hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{segment.segment}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {segment.count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(segment.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {formatCurrency(segment.avgValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        {((segment.revenue / totalRevenue) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Report tabs with icons
  const reportTypes = [
    { id: 'sales', name: 'Sales Summary', icon: <BarChart3 size={16} /> },
    { id: 'products', name: 'Product Performance', icon: <ShoppingBag size={16} /> },
    { id: 'reps', name: 'Rep Performance', icon: <Users size={16} /> },
    { id: 'customers', name: 'Customer Analytics', icon: <UserRound size={16} /> }
  ]

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Sales Reports</h1>
          <p className="text-surface-500 dark:text-surface-400">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="flex items-center flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center"
            >
              <Calendar size={16} className="mr-2" />
              {dateFilter === 'last7Days' ? 'Last 7 Days' : 
               dateFilter === 'last30Days' ? 'Last 30 Days' : 
               dateFilter === 'last12Months' ? 'Last 12 Months' : 'Custom Range'}
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
                    <h3 className="font-medium text-sm text-surface-500 dark:text-surface-400 mb-2">Date Range</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'last7Days', label: 'Last 7 Days' },
                        { id: 'last30Days', label: 'Last 30 Days' },
                        { id: 'last12Months', label: 'Last 12 Months' },
                        { id: 'customRange', label: 'Custom Range' }
                      ].map(range => (
                        <label key={range.id} className="flex items-center">
                          <input 
                            type="radio" 
                            name="dateRange" 
                            value={range.id} 
                            checked={dateFilter === range.id}
                            onChange={() => setDateFilter(range.id)}
                            className="mr-2 accent-primary"
                          />
                          <span className="text-sm">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => {}}
              className="btn btn-outline flex items-center"
            >
              <Filter size={16} className="mr-2" />
              More Filters
            </button>
          </div>
          
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="btn btn-primary flex items-center"
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button className="btn btn-outline flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Report Type Selection */}
      <div className="mb-6">
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 p-1 -mx-1">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                reportType === type.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
              }`}
            >
              <span className="mr-2">{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Time Range Selection (Only for Sales Summary) */}
      {reportType === 'sales' && (
        <div className="mb-6">
          <div className="card p-4 flex items-center space-x-4">
            <div className="text-sm font-medium">Time Granularity:</div>
            <div className="flex space-x-2">
              {['daily', 'weekly', 'monthly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    timeRange === period
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 font-medium'
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Report Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reportType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {reportType === 'sales' && <SalesSummaryReport />}
          {reportType === 'products' && <ProductPerformanceReport />}
          {reportType === 'reps' && <RepPerformanceReport />}
          {reportType === 'customers' && <CustomerAnalyticsReport />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Reports