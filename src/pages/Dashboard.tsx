import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getApiUrl } from '../config/api';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalLeads: number;
  verifiedLeads: number;
  emailsSent: number;
  emailsOpened: number;
  repliesReceived: number;
  callsScheduled: number;
  todayFollowUps: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'lead_added' | 'email_sent' | 'call_scheduled' | 'follow_up';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    verifiedLeads: 0,
    emailsSent: 0,
    emailsOpened: 0,
    repliesReceived: 0,
    callsScheduled: 0,
    todayFollowUps: 0,
    conversionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [leadsResponse, campaignsResponse, revenueResponse] = await Promise.all([
        fetch(getApiUrl('/analytics/leads')),
        fetch(getApiUrl('/analytics/campaigns')),
        fetch(getApiUrl('/analytics/revenue'))
      ]);

      // Combine analytics data into dashboard stats
      const dashboardStats = {
        totalLeads: 0,
        totalCampaigns: 0,
        totalRevenue: 0,
        conversionRate: 0
      };

      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        if (leadsData.success && leadsData.data) {
          dashboardStats.totalLeads = leadsData.data.totalLeads || 0;
        }
      }

      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        if (campaignsData.success && campaignsData.data) {
          dashboardStats.totalCampaigns = campaignsData.data.totalCampaigns || 0;
        }
      }

      if (revenueResponse.ok) {
        const revenueData = await revenueResponse.json();
        if (revenueData.success && revenueData.data) {
          dashboardStats.totalRevenue = revenueData.data.totalRevenue || 0;
        }
      }

      setStats(dashboardStats);

      // Set mock recent activity since we don't have an activity endpoint
      setRecentActivity([
        {
          id: '1',
          type: 'lead',
          message: 'New lead added: John Doe',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          type: 'campaign',
          message: 'Email campaign sent to 100 recipients',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          type: 'conversion',
          message: 'Lead converted to customer',
          timestamp: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        totalLeads: 0,
        totalCampaigns: 0,
        totalRevenue: 0,
        conversionRate: 0
      });
      setRecentActivity([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900">Loading dashboard...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to access the dashboard</h1>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Leads',
      value: (stats.totalLeads || 0).toLocaleString(),
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Verified Leads',
      value: (stats.verifiedLeads || 0).toLocaleString(),
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Emails Sent',
      value: (stats.emailsSent || 0).toLocaleString(),
      icon: EnvelopeIcon,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Replies Received',
      value: (stats.repliesReceived || 0).toLocaleString(),
      icon: PhoneIcon,
      color: 'bg-orange-500',
      change: '+23%'
    },
    {
      title: 'Today\'s Follow-ups',
      value: (stats.todayFollowUps || 0).toLocaleString(),
      icon: ClockIcon,
      color: 'bg-red-500',
      change: 'Urgent'
    },
    {
      title: 'Conversion Rate',
      value: `${(stats.conversionRate || 0).toFixed(1)}%`,
      icon: ChartBarIcon,
      color: 'bg-indigo-500',
      change: '+2.1%'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.firstName || 'User'}! Here's your lead generation overview.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Add New Lead
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Start Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      ) : (

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    stat.change.includes('+') ? 'text-green-600' : 
                    stat.change === 'Urgent' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPinIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Google Maps Search</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <EnvelopeIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Email Campaign</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <PhoneIcon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">WhatsApp Bulk</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserGroupIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Import CSV</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Follow-ups Alert */}
        {stats.todayFollowUps > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-800">
                You have {stats.todayFollowUps} follow-up calls scheduled for today. 
                <button className="ml-2 text-yellow-600 hover:text-yellow-800 underline">
                  View Schedule
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
