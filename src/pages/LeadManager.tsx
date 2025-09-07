import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  TagIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Lead {
  id: string;
  name: string;
  company: string;
  email?: string;
  phone?: string;
  address: string;
  website?: string;
  status: 'new' | 'qualified' | 'contacted' | 'won' | 'lost';
  source: string;
  tags: string[];
  score: number;
  lastContact?: string;
  nextFollowUp?: string;
  notes: string;
  verified: boolean;
  createdAt: string;
}

interface CallLog {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting';
  outcome: 'answered' | 'voicemail' | 'no_answer' | 'busy' | 'email_sent' | 'email_replied';
  notes: string;
  duration?: number;
  timestamp: string;
  nextFollowUp?: string;
}

export default function LeadManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showAddLead, setShowAddLead] = useState(false);
  const [showCallLog, setShowCallLog] = useState(false);
  const [newCallLog, setNewCallLog] = useState({
    type: 'call' as const,
    outcome: 'answered' as const,
    notes: '',
    duration: 0,
    nextFollowUp: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(getApiUrl('/leads'));
      if (response.ok) {
        const result = await response.json();
        // Handle both direct array and object with data property
        if (Array.isArray(result)) {
          setLeads(result);
        } else if (result.data && Array.isArray(result.data)) {
          setLeads(result.data);
        } else {
          // Fallback to empty array if no valid data
          setLeads([]);
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
  };

  const fetchCallLogs = async (leadId: string) => {
    try {
      const response = await fetch(getApiUrl(`/leads/${leadId}/call-logs`));
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCallLogs(data.data);
        }
      }
    } catch (error) {
      // Error fetching call logs handled silently
    }
  };

  useEffect(() => {
    let filtered = Array.isArray(leads) ? leads : [];

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddCallLog = async () => {
    if (selectedLead && newCallLog.notes) {
      try {
        const response = await fetch(getApiUrl(`/leads/${selectedLead.id}/call-logs`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadId: selectedLead.id,
            type: newCallLog.type,
            outcome: newCallLog.outcome,
            notes: newCallLog.notes,
            duration: newCallLog.duration,
            nextFollowUp: newCallLog.nextFollowUp || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCallLogs([data.data, ...callLogs]);
            setNewCallLog({
              type: 'call',
              outcome: 'answered',
              notes: '',
              duration: 0,
              nextFollowUp: ''
            });
            setShowCallLog(false);
          }
        }
      } catch (error) {
        // Error creating call log handled silently
      }
    }
  };

  const todayFollowUps = Array.isArray(leads) ? leads.filter(lead => 
    lead.nextFollowUp && new Date(lead.nextFollowUp).toDateString() === new Date().toDateString()
  ) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Manager</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your leads, track interactions, and schedule follow-ups
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddLead(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Follow-ups Alert */}
        {todayFollowUps.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-800">
                You have {todayFollowUps.length} follow-up calls scheduled for today.
                <button className="ml-2 text-yellow-600 hover:text-yellow-800 underline">
                  View Schedule
                </button>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="contacted">Contacted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Sources</option>
                      <option value="Google Maps">Google Maps</option>
                      <option value="Domain Crawler">Domain Crawler</option>
                      <option value="CSV Import">CSV Import</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(filteredLeads) && filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedLead?.id === lead.id ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                            <div className="flex items-center mt-1">
                              {(lead.tags || []).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1"
                                >
                                  <TagIcon className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                              {lead.score}
                            </span>
                            <StarIcon className="h-4 w-4 text-yellow-400 ml-1" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.source}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            <PhoneIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <EnvelopeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lead Details & Call Logs */}
          <div className="space-y-6">
            {selectedLead ? (
              <>
                {/* Lead Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm text-gray-900">{selectedLead.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company</label>
                      <p className="text-sm text-gray-900">{selectedLead.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{selectedLead.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm text-gray-900">{selectedLead.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{selectedLead.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notes</label>
                      <p className="text-sm text-gray-900">{selectedLead.notes}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setShowCallLog(true)}
                      className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700"
                    >
                      Log Call
                    </button>
                    <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700">
                      Send Email
                    </button>
                  </div>
                </div>

                {/* Call Logs */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Call History</h3>
                  <div className="space-y-4">
                    {Array.isArray(callLogs) && callLogs
                      .filter(log => log.leadId === selectedLead.id)
                      .map((log) => (
                        <div key={log.id} className="border-l-4 border-indigo-400 pl-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {log.type === 'call' ? 'Phone Call' : 'Email'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                          {log.duration && (
                            <p className="text-xs text-gray-500">Duration: {log.duration} minutes</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Log Modal */}
      {showCallLog && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Log Call</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Call Type</label>
                  <select
                    value={newCallLog.type}
                    onChange={(e) => setNewCallLog({...newCallLog, type: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Outcome</label>
                  <select
                    value={newCallLog.outcome}
                    onChange={(e) => setNewCallLog({...newCallLog, outcome: e.target.value as any})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="answered">Answered</option>
                    <option value="voicemail">Voicemail</option>
                    <option value="no_answer">No Answer</option>
                    <option value="busy">Busy</option>
                    <option value="email_sent">Email Sent</option>
                    <option value="email_replied">Email Replied</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={newCallLog.notes}
                    onChange={(e) => setNewCallLog({...newCallLog, notes: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Call notes..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newCallLog.duration}
                    onChange={(e) => setNewCallLog({...newCallLog, duration: parseInt(e.target.value)})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Follow-up</label>
                  <input
                    type="datetime-local"
                    value={newCallLog.nextFollowUp}
                    onChange={(e) => setNewCallLog({...newCallLog, nextFollowUp: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCallLog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCallLog}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Call Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
