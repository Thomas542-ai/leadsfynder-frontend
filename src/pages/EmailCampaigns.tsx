import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';
import { 
  PlusIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ReplyIcon,
  PaperAirplaneIcon,
  CogIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'stopped';
  recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  replied: number;
  bounced: number;
  createdAt: string;
  scheduledFor?: string;
  template: string;
}

interface SMTPConfig {
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  dailyLimit: number;
  sentToday: number;
  lastUsed: string;
}

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [smtpConfigs, setSmtpConfigs] = useState<SMTPConfig[]>([]);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showSMTPConfig, setShowSMTPConfig] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    template: '',
    recipients: '',
    scheduledFor: '',
    smtpConfig: ''
  });

  useEffect(() => {
    fetchCampaigns();
    fetchSMTPConfigs();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(getApiUrl('/campaigns/email'));
      if (response.ok) {
        const result = await response.json();
        // Handle both direct array and object with data property
        if (Array.isArray(result)) {
          setCampaigns(result);
        } else if (result.data && Array.isArray(result.data)) {
          setCampaigns(result.data);
        } else {
          // Fallback to empty array if no valid data
          setCampaigns([]);
        }
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    }
  };

  const fetchSMTPConfigs = async () => {
    try {
      const response = await fetch(getApiUrl('/campaigns/smtp'));
      if (response.ok) {
        const result = await response.json();
        // Handle both direct array and object with data property
        if (Array.isArray(result)) {
          setSmtpConfigs(result);
        } else if (result.data && Array.isArray(result.data)) {
          setSmtpConfigs(result.data);
        } else {
          // Fallback to empty array if no valid data
          setSmtpConfigs([]);
        }
      }
    } catch (error) {
      console.error('Error fetching SMTP configs:', error);
      setSmtpConfigs([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <PlayIcon className="h-4 w-4" />;
      case 'paused': return <PauseIcon className="h-4 w-4" />;
      case 'stopped': return <StopIcon className="h-4 w-4" />;
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleCreateCampaign = async () => {
    if (newCampaign.name && newCampaign.subject && newCampaign.template) {
      try {
        const response = await fetch(getApiUrl('/campaigns/email'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newCampaign.name,
            subject: newCampaign.subject,
            template: newCampaign.template,
            recipients: parseInt(newCampaign.recipients) || 0,
            scheduledFor: newCampaign.scheduledFor || undefined,
            smtpConfig: newCampaign.smtpConfig
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCampaigns([data.data, ...campaigns]);
            setNewCampaign({
              name: '',
              subject: '',
              template: '',
              recipients: '',
              scheduledFor: '',
              smtpConfig: ''
            });
            setShowCreateCampaign(false);
          }
        }
      } catch (error) {
        // Error creating campaign handled silently
      }
    }
  };

  const handleCampaignAction = (campaignId: string, action: string) => {
    if (Array.isArray(campaigns)) {
      setCampaigns(campaigns.map(campaign => {
        if (campaign.id === campaignId) {
          return { ...campaign, status: action as any };
        }
        return campaign;
      }));
    }
  };

  const getOpenRate = (campaign: Campaign) => {
    return campaign.delivered > 0 ? ((campaign.opened / campaign.delivered) * 100).toFixed(1) : '0';
  };

  const getReplyRate = (campaign: Campaign) => {
    return campaign.delivered > 0 ? ((campaign.replied / campaign.delivered) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create and manage your email outreach campaigns
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSMTPConfig(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                SMTP Settings
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
        {/* SMTP Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {smtpConfigs.map((config) => (
            <div key={config.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-500">{config.provider}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  config.status === 'active' ? 'bg-green-100 text-green-800' :
                  config.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                }`}>
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
                      className="bg-indigo-600 h-2 rounded-full" 
                      style={{ width: `${(config.sentToday / config.dailyLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Email Campaigns</h3>
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
                    Open Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reply Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(campaigns) && campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        <span className="ml-1">{campaign.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.recipients}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.delivered}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOpenRate(campaign)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getReplyRate(campaign)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => handleCampaignAction(campaign.id, 'sending')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        {campaign.status === 'sending' && (
                          <>
                            <button
                              onClick={() => handleCampaignAction(campaign.id, 'paused')}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <PauseIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCampaignAction(campaign.id, 'stopped')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <StopIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {campaign.status === 'paused' && (
                          <button
                            onClick={() => handleCampaignAction(campaign.id, 'sending')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedCampaign(campaign)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                  <input
                    type="text"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Q1 Pet Supplies Outreach"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                  <input
                    type="text"
                    value={newCampaign.subject}
                    onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Premium Pet Food Solutions for Your Store"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Template</label>
                  <textarea
                    value={newCampaign.template}
                    onChange={(e) => setNewCampaign({...newCampaign, template: e.target.value})}
                    rows={8}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Hi {{first_name}},&#10;&#10;I hope this email finds you well. I wanted to reach out regarding...&#10;&#10;Best regards,&#10;{{sender_name}}"
                  />
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
                      <option value="50">Pet Supplies Leads (50)</option>
                      <option value="100">Restaurant Leads (100)</option>
                      <option value="75">Law Firm Leads (75)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SMTP Config</label>
                    <select
                      value={newCampaign.smtpConfig}
                      onChange={(e) => setNewCampaign({...newCampaign, smtpConfig: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select SMTP</option>
                      <option value="gmail">Gmail Business</option>
                      <option value="sendgrid">SendGrid Production</option>
                      <option value="mailgun">Mailgun Backup</option>
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
                  onClick={handleCreateCampaign}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
