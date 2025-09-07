import React, { useState } from 'react';
import { 
  PlusIcon,
  QrCodeIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface WhatsAppCampaign {
  id: string;
  name: string;
  message: string;
  status: 'draft' | 'sending' | 'paused' | 'completed' | 'stopped';
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  failed: number;
  createdAt: string;
  scheduledFor?: string;
}

interface WhatsAppConfig {
  id: string;
  name: string;
  type: 'qr' | 'api';
  status: 'connected' | 'disconnected' | 'error';
  phoneNumber: string;
  lastUsed: string;
  dailyLimit: number;
  sentToday: number;
}

export default function WhatsAppOutreach() {
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [whatsappConfigs, setWhatsappConfigs] = useState<WhatsAppConfig[]>([]);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<WhatsAppConfig | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    message: '',
    recipients: '',
    scheduledFor: '',
    config: ''
  });

  React.useEffect(() => {
    // Mock data
    const mockCampaigns: WhatsAppCampaign[] = [
      {
        id: '1',
        name: 'Pet Store Follow-up',
        message: 'Hi {{name}}, thanks for your interest in our pet supplies. Would you like to schedule a call to discuss bulk pricing?',
        status: 'completed',
        recipients: 25,
        sent: 25,
        delivered: 23,
        read: 18,
        replied: 8,
        failed: 2,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'Restaurant Equipment',
        message: 'Hello {{name}}, I have a special offer on commercial kitchen equipment for {{company}}. Interested?',
        status: 'sending',
        recipients: 50,
        sent: 15,
        delivered: 14,
        read: 9,
        replied: 3,
        failed: 1,
        createdAt: '2024-01-16'
      }
    ];

    const mockConfigs: WhatsAppConfig[] = [
      {
        id: '1',
        name: 'Business WhatsApp',
        type: 'qr',
        status: 'connected',
        phoneNumber: '+1-555-0123',
        lastUsed: '2024-01-16T10:30:00Z',
        dailyLimit: 100,
        sentToday: 15
      },
      {
        id: '2',
        name: 'Flexa Wapi API',
        type: 'api',
        status: 'connected',
        phoneNumber: '+1-555-0124',
        lastUsed: '2024-01-16T09:15:00Z',
        dailyLimit: 500,
        sentToday: 45
      }
    ];

    setCampaigns(mockCampaigns);
    setWhatsappConfigs(mockConfigs);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfigStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WhatsApp Outreach</h1>
              <p className="mt-1 text-sm text-gray-500">
                Send bulk WhatsApp messages and manage your campaigns
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowQRCode(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <QrCodeIcon className="h-4 w-4 mr-2" />
                Connect WhatsApp
              </button>
              <button
                onClick={() => setShowCreateCampaign(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* WhatsApp Configs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {whatsappConfigs.map((config) => (
            <div key={config.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-500">{config.phoneNumber}</p>
                  <p className="text-xs text-gray-400">
                    {config.type === 'qr' ? 'QR Code Connection' : 'API Connection'}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfigStatusColor(config.status)}`}>
                  {config.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Daily Limit</span>
                  <span className="text-gray-900">{config.dailyLimit}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Sent Today</span>
                  <span className="text-gray-900">{config.sentToday}</span>
                </div>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(config.sentToday / config.dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <p className="mt-1 text-sm text-yellow-700">
                WhatsApp has strict anti-spam policies. Use bulk messaging responsibly and ensure you have proper consent from recipients.
                Consider using the official WhatsApp Business API for better deliverability.
              </p>
            </div>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">WhatsApp Campaigns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Read
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Replies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{campaign.message}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.recipients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.delivered}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.read}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.replied}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create WhatsApp Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Pet Store Follow-up"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message Template</label>
                  <textarea
                    value={newCampaign.message}
                    onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Hi {{name}}, thanks for your interest in our services. Would you like to schedule a call?"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use {{name}}, {{company}} for personalization
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipients</label>
                    <select
                      value={newCampaign.recipients}
                      onChange={(e) => setNewCampaign({...newCampaign, recipients: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select recipient list</option>
                      <option value="25">Pet Store Leads (25)</option>
                      <option value="50">Restaurant Leads (50)</option>
                      <option value="30">Law Firm Leads (30)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Config</label>
                    <select
                      value={newCampaign.config}
                      onChange={(e) => setNewCampaign({...newCampaign, config: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select WhatsApp</option>
                      <option value="business">Business WhatsApp</option>
                      <option value="api">Flexa Wapi API</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Schedule (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newCampaign.scheduledFor}
                    onChange={(e) => setNewCampaign({...newCampaign, scheduledFor: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateCampaign(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Connect WhatsApp</h3>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <QrCodeIcon className="h-32 w-32 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">QR Code will appear here</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your WhatsApp mobile app to connect your business account.
                </p>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
