import React, { useState } from 'react';
import { getApiUrl } from '../config/api';
import { 
  MapPinIcon, 
  GlobeAltIcon, 
  BuildingOfficeIcon, 
  ShareIcon,
  MagnifyingGlassIcon,
  DocumentArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface LeadSource {
  id: string;
  name: string;
  type: 'google_maps' | 'domain' | 'linkedin' | 'facebook' | 'csv';
  icon: React.ComponentType<any>;
  description: string;
  status: 'active' | 'inactive' | 'premium';
  leadsFound?: number;
  lastSearch?: string;
}

interface SearchResult {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address: string;
  website?: string;
  rating?: number;
  verified: boolean;
  source: string;
}

export default function LeadSources() {
  const [activeTab, setActiveTab] = useState('google_maps');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    radius: '10',
    limit: '100'
  });

  const leadSources: LeadSource[] = [
    {
      id: 'google_maps',
      name: 'Google Maps',
      type: 'google_maps',
      icon: MapPinIcon,
      description: 'Search for businesses by keyword and location',
      status: 'active',
      leadsFound: 1247,
      lastSearch: '2 hours ago'
    },
    {
      id: 'domain',
      name: 'Domain Crawler',
      type: 'domain',
      icon: GlobeAltIcon,
      description: 'Extract leads from website contact pages',
      status: 'active',
      leadsFound: 892,
      lastSearch: '1 day ago'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      type: 'linkedin',
      icon: BuildingOfficeIcon,
      description: 'Get company information from LinkedIn pages',
      status: 'premium',
      leadsFound: 456,
      lastSearch: '3 days ago'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      type: 'facebook',
      icon: ShareIcon,
      description: 'Extract business data from Facebook pages',
      status: 'premium',
      leadsFound: 234,
      lastSearch: '1 week ago'
    },
    {
      id: 'csv',
      name: 'CSV Import',
      type: 'csv',
      icon: DocumentArrowUpIcon,
      description: 'Upload and import leads from CSV files',
      status: 'active',
      leadsFound: 567,
      lastSearch: '2 days ago'
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const response = await fetch(getApiUrl('/lead-sources/google-maps'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      // Error searching Google Maps handled silently
    } finally {
      setIsSearching(false);
    }
  };

  const renderGoogleMapsSearch = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Google Maps Search</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Keyword
            </label>
            <input
              type="text"
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
              placeholder="e.g., pet supplies, restaurants, law firms"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
              placeholder="e.g., New York, NY or 10001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Radius (miles)
            </label>
            <select
              value={searchParams.radius}
              onChange={(e) => setSearchParams({...searchParams, radius: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="5">5 miles</option>
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Results
            </label>
            <select
              value={searchParams.limit}
              onChange={(e) => setSearchParams({...searchParams, limit: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="50">50 results</option>
              <option value="100">100 results</option>
              <option value="200">200 results</option>
              <option value="500">500 results</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchParams.keyword || !searchParams.location}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSearching ? (
              <>
                <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Google Maps
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({searchResults.length} found)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{result.name}</div>
                        {result.website && (
                          <div className="text-sm text-gray-500">{result.website}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.email}</div>
                      <div className="text-sm text-gray-500">{result.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.rating && (
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{result.rating}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.verified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Add to CRM
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Add All to CRM ({searchResults.length} leads)
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderDomainCrawler = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Domain Crawler</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URLs (one per line)
            </label>
            <textarea
              rows={6}
              placeholder="https://example.com&#10;https://another-site.com&#10;https://third-website.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or upload CSV file
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">Drag and drop CSV file here, or click to browse</p>
              <input type="file" accept=".csv" className="hidden" />
            </div>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            Start Crawling
          </button>
        </div>
      </div>
    </div>
  );

  const renderLinkedInSearch = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Premium Feature</h3>
            <p className="mt-1 text-sm text-yellow-700">
              LinkedIn integration is available in our Pro plan. Upgrade to access this feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacebookSearch = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Premium Feature</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Facebook integration is available in our Pro plan. Upgrade to access this feature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCSVImport = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">CSV Import</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <DocumentArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Upload your CSV file</p>
            <p className="text-sm text-gray-600 mb-4">
              Supported formats: CSV, Excel (.xlsx). Maximum file size: 10MB
            </p>
            <input type="file" accept=".csv,.xlsx" className="hidden" />
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              Choose File
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Required CSV Columns:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Company Name (required)</li>
              <li>• Email (optional)</li>
              <li>• Phone (optional)</li>
              <li>• Address (optional)</li>
              <li>• Website (optional)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'google_maps':
        return renderGoogleMapsSearch();
      case 'domain':
        return renderDomainCrawler();
      case 'linkedin':
        return renderLinkedInSearch();
      case 'facebook':
        return renderFacebookSearch();
      case 'csv':
        return renderCSVImport();
      default:
        return renderGoogleMapsSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Lead Sources</h1>
            <p className="mt-1 text-sm text-gray-500">
              Find and import leads from multiple sources
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Source Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {leadSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setActiveTab(source.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === source.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <source.icon className="h-5 w-5 mr-2" />
                    {source.name}
                    {source.status === 'premium' && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pro
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
