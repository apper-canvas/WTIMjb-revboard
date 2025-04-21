import { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, DollarSign, ShoppingCart, Clock } from 'lucide-react';
import Chart from 'react-apexcharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Summary cards data
  const summaryData = [
    {
      title: 'Total Revenue',
      value: '$48,234',
      change: 12.5,
      positive: true,
      icon: <DollarSign size={20} />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: 8.2,
      positive: true,
      icon: <ShoppingCart size={20} />,
      color: 'bg-purple-500',
    },
    {
      title: 'New Customers',
      value: '432',
      change: -3.8,
      positive: false,
      icon: <Users size={20} />,
      color: 'bg-amber-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.42%',
      change: 2.1,
      positive: true,
      icon: <TrendingUp size={20} />,
      color: 'bg-green-500',
    },
  ];

  // Sales trend chart options
  const salesChartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#6366F1', '#A855F7'],
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.3,
        opacityTo: 0.1,
      },
    },
    grid: {
      borderColor: '#E2E8F0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#94A3B8',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#94A3B8',
          fontSize: '12px',
        },
        formatter: (value) => `$${value}k`,
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20,
      labels: {
        colors: '#94A3B8',
      },
    },
  };

  const salesChartSeries = [
    {
      name: 'Current Year',
      data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 95, 110, 140],
    },
    {
      name: 'Previous Year',
      data: [11, 32, 45, 32, 34, 52, 41, 80, 96, 140, 30, 100],
    },
  ];

  // Regional performance chart
  const regionChartOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa'],
    legend: {
      position: 'bottom',
      fontFamily: 'Inter, sans-serif',
      labels: {
        colors: '#94A3B8',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 500,
              color: '#64748B',
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 700,
              color: '#334155',
              formatter: (val) => `$${val}k`,
            },
            total: {
              show: true,
              label: 'Total Revenue',
              fontSize: '14px',
              fontWeight: 700,
              color: '#64748B',
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `$${total}k`;
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const regionChartSeries = [44, 55, 30, 22, 16];

  // Recent activities data
  const recentActivities = [
    {
      id: 1,
      title: 'New sale order #1234',
      time: '2 hours ago',
      amount: '$1,430.00',
      type: 'sale',
    },
    {
      id: 2,
      title: 'New customer registered',
      time: '3 hours ago',
      user: 'Emily Davis',
      type: 'customer',
    },
    {
      id: 3,
      title: 'Payment received #4321',
      time: '5 hours ago',
      amount: '$2,800.00',
      type: 'payment',
    },
    {
      id: 4,
      title: 'Product restock completed',
      time: '1 day ago',
      product: 'Widget XL Pro',
      type: 'inventory',
    },
    {
      id: 5,
      title: 'Marketing campaign launched',
      time: '2 days ago',
      campaign: 'Summer Sale 2023',
      type: 'marketing',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-white">Analytics</h1>
          <p className="text-surface-500 dark:text-surface-400">Monitor your business performance and insights</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="inline-flex p-1 bg-surface-100 dark:bg-surface-800 rounded-lg">
            {['7d', '30d', '90d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-surface-700 text-surface-800 dark:text-white shadow-sm'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{item.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-surface-800 dark:text-white">{item.value}</h3>
                <div className={`flex items-center mt-2 ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {item.positive ? (
                    <ArrowUpRight size={16} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={16} className="mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(item.change)}%</span>
                  <span className="text-xs text-surface-500 dark:text-surface-400 ml-1">vs last period</span>
                </div>
              </div>
              <div className={`${item.color} p-3 rounded-lg text-white`}>
                {item.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-surface-800 dark:text-white">Sales Trend</h3>
            <div className="inline-flex items-center space-x-2">
              <div className="inline-flex items-center">
                <span className="w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
                <span className="text-xs text-surface-600 dark:text-surface-400">Current</span>
              </div>
              <div className="inline-flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                <span className="text-xs text-surface-600 dark:text-surface-400">Previous</span>
              </div>
            </div>
          </div>
          <Chart
            options={salesChartOptions}
            series={salesChartSeries}
            type="area"
            height={350}
          />
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-surface-800 dark:text-white mb-6">Regional Performance</h3>
          <Chart
            options={regionChartOptions}
            series={regionChartSeries}
            type="donut"
            height={350}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold text-surface-800 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-surface-100 dark:divide-surface-700">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-start">
              <div className="mr-4 mt-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-surface-800 dark:text-white font-medium">{activity.title}</p>
                <div className="flex items-center mt-1">
                  <p className="text-surface-500 dark:text-surface-400 text-sm">{activity.time}</p>
                  {activity.amount && (
                    <span className="ml-4 text-sm font-medium text-primary">{activity.amount}</span>
                  )}
                  {activity.user && (
                    <span className="ml-4 text-sm font-medium text-surface-600 dark:text-surface-300">{activity.user}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-700 rounded-b-xl">
          <button className="text-primary hover:text-primary-600 transition-colors text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;