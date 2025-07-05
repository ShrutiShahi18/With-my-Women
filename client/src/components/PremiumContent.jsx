import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLogout } from '../hooks/useLogout.jsx';

const PremiumContent = () => {
  const { isAuthenticated, isPremium } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();
  const [activeTab, setActiveTab] = useState('articles');

  const premiumArticles = [
    {
      id: 1,
      title: "The Evolution of Feminist Thought: From First Wave to Intersectionality",
      author: "Dr. Sarah Johnson",
      excerpt: "An in-depth exploration of how feminist theory has evolved over the decades, examining the contributions of key thinkers and the emergence of intersectional feminism.",
      readTime: "8 min read",
      category: "Theory",
      isNew: true
    },
    {
      id: 2,
      title: "Breaking the Glass Ceiling: Strategies for Women in Leadership",
      author: "Maria Rodriguez",
      excerpt: "Practical advice and proven strategies for women navigating corporate environments and breaking through barriers to leadership positions.",
      readTime: "12 min read",
      category: "Career",
      isNew: false
    },
    {
      id: 3,
      title: "Feminist Parenting: Raising Empowered Children",
      author: "Emma Thompson",
      excerpt: "How to raise children with feminist values, challenge gender stereotypes, and create an inclusive family environment.",
      readTime: "10 min read",
      category: "Parenting",
      isNew: false
    },
    {
      id: 4,
      title: "The Gender Pay Gap: Understanding and Addressing the Issue",
      author: "Dr. Lisa Chen",
      excerpt: "A comprehensive analysis of the gender pay gap, its causes, and actionable steps for individuals and organizations to address it.",
      readTime: "15 min read",
      category: "Economics",
      isNew: true
    }
  ];

  const bookRecommendations = [
    {
      id: 1,
      title: "We Should All Be Feminists",
      author: "Chimamanda Ngozi Adichie",
      description: "A personal and powerful essay from Chimamanda Ngozi Adichie, based on her 2013 TEDx talk of the same name.",
      rating: 4.8,
      category: "Essays",
      coverColor: "from-pink-400 to-purple-500"
    },
    {
      id: 2,
      title: "The Second Sex",
      author: "Simone de Beauvoir",
      description: "A foundational text of feminist philosophy, exploring the construction of woman as the 'Other' in patriarchal society.",
      rating: 4.6,
      category: "Philosophy",
      coverColor: "from-purple-400 to-indigo-500"
    },
    {
      id: 3,
      title: "Bad Feminist",
      author: "Roxane Gay",
      description: "A collection of essays spanning politics, criticism, and feminism from one of the most-watched young cultural observers of her generation.",
      rating: 4.7,
      category: "Essays",
      coverColor: "from-indigo-400 to-blue-500"
    },
    {
      id: 4,
      title: "The Feminine Mystique",
      author: "Betty Friedan",
      description: "The book that sparked second-wave feminism, examining the dissatisfaction of suburban housewives in the 1950s and 1960s.",
      rating: 4.5,
      category: "History",
      coverColor: "from-blue-400 to-cyan-500"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Feminist Book Club: 'The Color Purple'",
      date: "2024-01-15",
      time: "7:00 PM EST",
      type: "Virtual",
      description: "Join us for a discussion of Alice Walker's masterpiece, exploring themes of race, gender, and empowerment.",
      attendees: 24,
      maxAttendees: 30
    },
    {
      id: 2,
      title: "Workshop: Building Confidence in the Workplace",
      date: "2024-01-22",
      time: "2:00 PM EST",
      type: "Virtual",
      description: "Learn practical techniques for building confidence, advocating for yourself, and navigating workplace challenges.",
      attendees: 18,
      maxAttendees: 25
    },
    {
      id: 3,
      title: "Panel Discussion: Women in STEM",
      date: "2024-01-29",
      time: "6:00 PM EST",
      type: "Virtual",
      description: "Hear from successful women in STEM fields about their journeys, challenges, and advice for aspiring professionals.",
      attendees: 35,
      maxAttendees: 50
    }
  ];

  const resources = [
    {
      id: 1,
      title: "Feminist Glossary",
      description: "A comprehensive guide to feminist terminology and concepts.",
      type: "PDF",
      size: "2.3 MB"
    },
    {
      id: 2,
      title: "Salary Negotiation Guide",
      description: "Step-by-step strategies for negotiating fair compensation.",
      type: "PDF",
      size: "1.8 MB"
    },
    {
      id: 3,
      title: "Feminist Reading List",
      description: "Curated list of essential feminist literature across genres and time periods.",
      type: "PDF",
      size: "1.2 MB"
    },
    {
      id: 4,
      title: "Self-Care Toolkit",
      description: "Resources and practices for maintaining mental health and well-being.",
      type: "PDF",
      size: "3.1 MB"
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please log in to access premium content.</p>
            <Link
              to="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Content</h2>
            <p className="text-gray-600 mb-6">Upgrade to Premium to access exclusive articles, book recommendations, events, and resources.</p>
            <Link
              to="/premium"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Premium Content</h1>
            <button
              onClick={() => handleLogout('Are you sure you want to logout?')}
              disabled={isLoggingOut}
              className="ml-4 p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              {isLoggingOut ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exclusive articles, book recommendations, events, and resources curated for our premium community.
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'articles', label: 'Articles', count: premiumArticles.length },
              { id: 'books', label: 'Book Recommendations', count: bookRecommendations.length },
              { id: 'events', label: 'Upcoming Events', count: upcomingEvents.length },
              { id: 'resources', label: 'Resources', count: resources.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Articles */}
          {activeTab === 'articles' && (
            <div className="grid md:grid-cols-2 gap-8">
              {premiumArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {article.category}
                      </span>
                      {article.isNew && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                        Read Article →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Book Recommendations */}
          {activeTab === 'books' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bookRecommendations.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className={`h-32 bg-gradient-to-r ${book.coverColor} flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{book.title.split(' ').map(word => word[0]).join('')}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-3">{book.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-gray-600">{book.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{book.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {event.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>{event.time}</span>
                        <span>{event.attendees}/{event.maxAttendees} attendees</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all">
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resources */}
          {activeTab === 'resources' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{resource.type} • {resource.size}</span>
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumContent; 