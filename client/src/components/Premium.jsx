import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const tierDetails = [
  {
    key: 'basic',
    name: 'Basic',
    price: 4.99,
    features: [
      'Private feminist chat room',
      'Exclusive premium badge',
      'Early access to new features',
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'All Basic features',
      'Priority customer support',
      'Exclusive content & resources',
      'Community events & workshops',
      'Advanced analytics and insights',
      'Custom themes and personalization',
      'Download content for offline reading',
    ],
  },
  {
    key: 'vip',
    name: 'VIP',
    price: 19.99,
    features: [
      'All Premium features',
      'Exclusive mentorship program',
      'Advanced search and filtering',
      'Priority content creation',
      'Monthly feminist book club',
      'Exclusive webinars and workshops',
    ],
  },
];

const Premium = () => {
  const { isAuthenticated, isPremium, premiumTier, upgradePremium, createPaymentSession, checkPaymentStatus } = useAuth();
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState('');
  const [selectedTier, setSelectedTier] = useState('premium');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check payment status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      const result = await checkPaymentStatus();
      if (result) {
        if (result.success) {
          setPaySuccess(result.message);
          setPayError('');
        } else {
          setPayError(result.error);
          setPaySuccess('');
        }
      }
    };
    
    checkStatus();
  }, [checkPaymentStatus]);

  const features = [
    {
      title: "Private Chat Room",
      description: "Connect with feminists worldwide in our exclusive, moderated chat room.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "Premium Badge",
      description: "Show your support with an exclusive premium badge on your profile and comments.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      title: "Early Access",
      description: "Get early access to new features, exclusive content, and feminist resources.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Priority Support",
      description: "Get priority customer support and faster response times from our team.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
        </svg>
      )
    },
    {
      title: "Exclusive Content",
      description: "Access to premium articles, feminist book recommendations, and expert interviews.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Community Events",
      description: "Join exclusive virtual events, workshops, and feminist discussions.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsUpgrading(true);
    setUpgradeError('');

    try {
      const result = await upgradePremium();
      if (result.success) {
        // Success - user will be redirected to chat room
        navigate('/chat');
      } else {
        setUpgradeError(result.error || 'Upgrade failed. Please try again.');
      }
    } catch (error) {
      setUpgradeError('An error occurred. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handlePayment = async (tier, method) => {
    setIsPaying(true);
    setPayError('');
    setPaySuccess('');
    
    try {
      const result = await createPaymentSession({ premiumTier: tier, paymentMethod: method });
      if (result.success) {
        window.location.href = result.url;
      } else {
        setPayError(result.error || 'Payment failed.');
      }
    } catch (e) {
      setPayError('An error occurred. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Join Premium
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock exclusive features and connect with feminists worldwide in our private community.
          </p>
        </div>

        {/* Payment Status Messages */}
        {paySuccess && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800 font-medium">{paySuccess}</p>
              </div>
            </div>
          </div>
        )}

        {payError && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-medium">{payError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Premium User Access */}
        {isPremium && (
          <div className="text-center mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Premium Member!</h2>
              <p className="text-gray-600 mb-6">You have access to all premium features.</p>
              <div className="space-y-3">
                <Link
                  to="/chat"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Enter Chat Room
                </Link>
                <Link
                  to="/premium/content"
                  className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Premium Content
                </Link>
                <Link
                  to="/blog"
                  className="inline-flex items-center px-6 py-3 border border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read Stories
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        {!isPremium && (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {tierDetails.map((tier) => (
              <div key={tier.key} className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${selectedTier === tier.key ? 'ring-2 ring-pink-500' : ''}`}>
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-8 text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{tier.name} Membership</h2>
                  <div className="text-4xl font-bold mb-2">${tier.price}</div>
                  <p className="text-pink-100">per month</p>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <ul className="space-y-4 mb-8 text-left">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {payError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <p className="text-sm text-red-600">{payError}</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => handlePayment(tier.key, 'stripe')}
                      disabled={isPaying || !isAuthenticated}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPaying ? 'Processing...' : 'Pay with Card (Stripe)'}
                    </button>
                    <button
                      onClick={() => handlePayment(tier.key, 'paypal')}
                      disabled={isPaying || !isAuthenticated}
                      className="w-full bg-yellow-400 text-yellow-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPaying ? 'Processing...' : 'Pay with PayPal'}
                    </button>
                  </div>
                  {!isAuthenticated && (
                    <p className="text-center text-sm text-gray-500 mt-4">Please log in to purchase a membership.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Room Preview */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Preview: Private Chat Room
          </h3>
          <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">Sarah</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                        </svg>
                        Premium
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Just finished reading an amazing feminist book. Anyone else read "We Should All Be Feminists"?</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">Maria</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                        </svg>
                        Premium
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Yes! It's such an important read. The way she explains intersectionality is so clear.</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">1 minute ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">Emma</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                        <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                        </svg>
                        Premium
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">I'm reading it right now! The chapter about raising feminist children really resonated with me.</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled
                />
                <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {isPremium ? 'You can participate in the conversation!' : 'Join Premium to participate in the conversation'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!isPremium && (
          <div className="text-center mt-16">
            {!isAuthenticated ? (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started Today
              </Link>
            ) : (
              <p className="text-gray-600">
                Ready to join the conversation? Click "Upgrade to Premium" above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Premium; 