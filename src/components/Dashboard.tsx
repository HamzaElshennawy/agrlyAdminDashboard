import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Users, Building, CreditCard, TrendingUp, Activity, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalApartments: number;
  totalTransactions: number;
  totalRevenue: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalApartments: 0,
    totalTransactions: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tickerStatus, setTickerStatus] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersResponse, apartmentsResponse, transactionsResponse, tickerStatusResponse] = await Promise.allSettled([
        apiService.getUsers(),
        apiService.getApartments(),
        apiService.getTransactions(),
        apiService.getTickerHostStatus()
      ]);

      let totalUsers = 0, totalApartments = 0, totalTransactions = 0, totalRevenue = 0;

      if (usersResponse.status === 'fulfilled' && usersResponse.value) {
        totalUsers = Array.isArray(usersResponse.value) ? usersResponse.value.length : 0;
      }

      if (apartmentsResponse.status === 'fulfilled' && apartmentsResponse.value) {
        totalApartments = Array.isArray(apartmentsResponse.value) ? apartmentsResponse.value.length : 0;
      }

      if (transactionsResponse.status === 'fulfilled' && transactionsResponse.value) {
        const transactions = Array.isArray(transactionsResponse.value) ? transactionsResponse.value : [];
        totalTransactions = transactions.length;
        totalRevenue = transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
      }

      if (tickerStatusResponse.status === 'fulfilled') {
        setTickerStatus(tickerStatusResponse.value);
      }

      setStats({ totalUsers, totalApartments, totalTransactions, totalRevenue });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Apartments',
      value: stats.totalApartments.toLocaleString(),
      icon: Building,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Transactions',
      value: stats.totalTransactions.toLocaleString(),
      icon: CreditCard,
      color: 'purple',
      change: '+23%'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'orange',
      change: '+15%'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500 text-blue-50',
    green: 'bg-green-500 text-green-50',
    purple: 'bg-purple-500 text-purple-50',
    orange: 'bg-orange-500 text-orange-50'
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className="text-sm text-green-600 mt-1">{card.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Server</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">TickerQ Service</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                tickerStatus ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {tickerStatus ? 'Running' : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Add New Apartment</div>
              <div className="text-sm text-gray-500">Create a new property listing</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Manage Categories</div>
              <div className="text-sm text-gray-500">Update apartment categories</div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">View Reports</div>
              <div className="text-sm text-gray-500">Generate analytics reports</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}