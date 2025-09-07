import React, { useState } from 'react';
import { 
  UserGroupIcon,
  CreditCardIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  usage: {
    leads: number;
    emails: number;
    calls: number;
  };
}

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    leads: number;
    emails: number;
    verifications: number;
  };
  isActive: boolean;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalLeads: number;
  totalEmails: number;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalLeads: 0,
    totalEmails: 0
  });
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    features: '',
    leadsLimit: '',
    emailsLimit: '',
    verificationsLimit: ''
  });

  React.useEffect(() => {
    // Mock data
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        plan: 'Pro Unlimited',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-16',
        usage: { leads: 1247, emails: 456, calls: 23 }
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        plan: 'Front-End',
        status: 'active',
        createdAt: '2024-01-12',
        lastLogin: '2024-01-15',
        usage: { leads: 892, emails: 234, calls: 12 }
      },
      {
        id: '3',
        name: 'Mike Davis',
        email: 'mike@example.com',
        plan: 'Front-End',
        status: 'inactive',
        createdAt: '2024-01-14',
        lastLogin: '2024-01-13',
        usage: { leads: 567, emails: 123, calls: 8 }
      }
    ];

    const mockPlans: Plan[] = [
      {
        id: '1',
        name: 'Front-End Plan',
        price: 27,
        features: ['Search caps', 'Basic filters', 'CSV export', 'SMTP send', '100 verifier credits'],
        limits: { leads: 1000, emails: 500, verifications: 100 },
        isActive: true
      },
      {
        id: '2',
        name: 'Pro Unlimited',
        price: 67,
        features: ['Unlimited searches', 'Advanced filters', '5k verifier credits/mo', 'Priority support'],
        limits: { leads: -1, emails: -1, verifications: 5000 },
        isActive: true
      },
      {
        id: '3',
        name: 'Enterprise',
        price: 199,
        features: ['Everything in Pro', 'White-label', 'API access', 'Dedicated support'],
        limits: { leads: -1, emails: -1, verifications: -1 },
        isActive: true
      }
    ];

    const mockStats: SystemStats = {
      totalUsers: 1247,
      activeUsers: 892,
      totalRevenue: 45678,
      monthlyRevenue: 12345,
      totalLeads: 56789,
      totalEmails: 23456
    };

    setUsers(mockUsers);
    setPlans(mockPlans);
    setSystemStats(mockStats);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePlan = () => {
    if (newPlan.name && newPlan.price) {
      const plan: Plan = {
        id: Date.now().toString(),
        name: newPlan.name,
        price: parseFloat(newPlan.price),
        features: newPlan.features.split('\n').filter(f => f.trim()),
        limits: {
          leads: parseInt(newPlan.leadsLimit) || -1,
          emails: parseInt(newPlan.emailsLimit) || -1,
          verifications: parseInt(newPlan.verificationsLimit) || -1
        },
        isActive: true
      };

      setPlans([...plans, plan]);
      setNewPlan({
        name: '',
        price: '',
        features: '',
        leadsLimit: '',
        emailsLimit: '',
        verificationsLimit: ''
      });
      setShowCreatePlan(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CreditCardIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${systemStats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalLeads.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">New user registered: john@example.com</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Plan upgraded: sarah@example.com to Pro Unlimited</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Payment failed: mike@example.com</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Users Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.plan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>Leads: {user.usage.leads}</div>
                  <div>Emails: {user.usage.emails}</div>
                  <div>Calls: {user.usage.calls}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.lastLogin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pricing Plans</h3>
        <button
          onClick={() => setShowCreatePlan(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
                <p className="text-sm text-gray-500">per month</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="text-sm text-gray-500 space-y-1">
                <div>Leads: {plan.limits.leads === -1 ? 'Unlimited' : plan.limits.leads.toLocaleString()}</div>
                <div>Emails: {plan.limits.emails === -1 ? 'Unlimited' : plan.limits.emails.toLocaleString()}</div>
                <div>Verifications: {plan.limits.verifications === -1 ? 'Unlimited' : plan.limits.verifications.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">
                Edit
              </button>
              <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700">
                {plan.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'plans':
        return renderPlans();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage users, plans, and system settings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
                { id: 'users', name: 'Users', icon: UserGroupIcon },
                { id: 'plans', name: 'Plans', icon: CreditCardIcon },
                { id: 'settings', name: 'Settings', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      {/* Create Plan Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Plan</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                  <input
                    type="text"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Premium Plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
                  <input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
                  <textarea
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({...newPlan, features: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Unlimited searches&#10;Advanced filters&#10;Priority support&#10;API access"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Leads Limit</label>
                    <input
                      type="number"
                      value={newPlan.leadsLimit}
                      onChange={(e) => setNewPlan({...newPlan, leadsLimit: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emails Limit</label>
                    <input
                      type="number"
                      value={newPlan.emailsLimit}
                      onChange={(e) => setNewPlan({...newPlan, emailsLimit: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Verifications Limit</label>
                    <input
                      type="number"
                      value={newPlan.verificationsLimit}
                      onChange={(e) => setNewPlan({...newPlan, verificationsLimit: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="-1 for unlimited"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreatePlan(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
