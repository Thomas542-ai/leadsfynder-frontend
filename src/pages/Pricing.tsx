import React, { useState } from 'react';
import { 
  CheckIcon,
  XMarkIcon,
  StarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: string[];
  limits: {
    leads: number;
    emails: number;
    verifications: number;
    users: number;
  };
  isPopular?: boolean;
  addOns?: {
    name: string;
    price: number;
    description: string;
  }[];
}

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [showBillingModal, setShowBillingModal] = useState(false);

  const plans: Plan[] = [
    {
      id: 'frontend',
      name: 'Front-End Plan',
      price: billingPeriod === 'yearly' ? 270 : 27,
      period: billingPeriod,
      description: 'Perfect for small businesses and freelancers getting started with lead generation',
      features: [
        'Search caps (1,000 leads/month)',
        'Basic filters and sorting',
        'CSV export functionality',
        'SMTP email sending',
        '100 email verifier credits',
        'Google Maps integration',
        'Domain crawler',
        'Basic CRM features',
        'Email support'
      ],
      limits: {
        leads: 1000,
        emails: 500,
        verifications: 100,
        users: 1
      }
    },
    {
      id: 'pro',
      name: 'Pro Unlimited',
      price: billingPeriod === 'yearly' ? 670 : 67,
      period: billingPeriod,
      description: 'Advanced features for growing businesses with high-volume lead generation needs',
      features: [
        'Unlimited lead searches',
        'Advanced filters and AI scoring',
        '5,000 email verifier credits/month',
        'Priority SMTP delivery',
        'LinkedIn integration',
        'Facebook page scraper',
        'Advanced CRM with call logs',
        'WhatsApp bulk messaging',
        'Follow-up automation',
        'Priority support',
        'API access'
      ],
      limits: {
        leads: -1,
        emails: -1,
        verifications: 5000,
        users: 3
      },
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingPeriod === 'yearly' ? 1990 : 199,
      period: billingPeriod,
      description: 'Complete solution for agencies and large organizations',
      features: [
        'Everything in Pro Unlimited',
        'Unlimited email verifications',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
        'Custom training sessions',
        'Advanced analytics & reporting',
        'Team collaboration tools',
        'Custom API endpoints',
        'SLA guarantee',
        'Phone support'
      ],
      limits: {
        leads: -1,
        emails: -1,
        verifications: -1,
        users: -1
      }
    }
  ];

  const addOns = [
    {
      name: 'AI Personalization',
      price: billingPeriod === 'yearly' ? 290 : 29,
      description: 'AI-powered email subject lines and personalization'
    },
    {
      name: 'Multi-Channel Outreach',
      price: billingPeriod === 'yearly' ? 390 : 39,
      description: 'WhatsApp API, SMS (Twilio/MSG91), LinkedIn helper'
    },
    {
      name: 'Reports Suite',
      price: billingPeriod === 'yearly' ? 290 : 29,
      description: 'SEO/Business/Accessibility reports and analytics'
    },
    {
      name: 'Agency Features',
      price: billingPeriod === 'yearly' ? 590 : 59,
      description: 'Sub-accounts, role permissions, activity logs, white-label'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowBillingModal(true);
  };

  const getSavings = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 10; // 2 months free
    return monthlyPrice * 12 - yearlyPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan for your lead generation needs. All plans include our core features with no hidden fees.
            </p>
            
            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="mx-3 relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Save 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                plan.isPopular ? 'ring-2 ring-indigo-500 scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-500 text-white">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-lg text-gray-500">/{plan.period === 'yearly' ? 'year' : 'month'}</span>
                </div>
                {billingPeriod === 'yearly' && (
                  <p className="mt-2 text-sm text-green-600">
                    Save ${getSavings(plan.price === 270 ? 27 : plan.price === 670 ? 67 : 199)}/year
                  </p>
                )}
              </div>

              <div className="mt-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.isPopular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                  <ArrowRightIcon className="inline-block h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Add-ons</h2>
            <p className="mt-4 text-lg text-gray-600">
              Enhance your plan with these powerful add-ons
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">{addon.name}</h3>
                <p className="mt-2 text-gray-600 text-sm">{addon.description}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-gray-900">${addon.price}</span>
                  <span className="text-gray-500">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
                </div>
                <button className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Add to Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Feature Comparison</h2>
            <p className="mt-4 text-lg text-gray-600">
              Compare all features across our plans
            </p>
          </div>
          
          <div className="mt-12 overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Front-End</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Pro Unlimited</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'Lead Searches', frontend: '1,000/month', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Email Verifications', frontend: '100/month', pro: '5,000/month', enterprise: 'Unlimited' },
                  { feature: 'Email Sends', frontend: '500/month', pro: 'Unlimited', enterprise: 'Unlimited' },
                  { feature: 'Google Maps Integration', frontend: '✓', pro: '✓', enterprise: '✓' },
                  { feature: 'LinkedIn Integration', frontend: '✗', pro: '✓', enterprise: '✓' },
                  { feature: 'WhatsApp Messaging', frontend: '✗', pro: '✓', enterprise: '✓' },
                  { feature: 'API Access', frontend: '✗', pro: '✓', enterprise: '✓' },
                  { feature: 'White-label', frontend: '✗', pro: '✗', enterprise: '✓' },
                  { feature: 'Dedicated Support', frontend: '✗', pro: '✗', enterprise: '✓' }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.frontend}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.pro}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="mt-12 space-y-8">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
              },
              {
                question: "What happens if I exceed my limits?",
                answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional credits to continue using the service."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied, contact us for a full refund."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start."
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Modal */}
      {showBillingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Your Purchase</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ${plans.find(p => p.id === selectedPlan)?.price}/{billingPeriod === 'yearly' ? 'year' : 'month'}
                  </p>
                </div>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Credit Card
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    PayPal
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Razorpay / UPI
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Secure payment processing
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowBillingModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
