import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout.jsx';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12); // Mock online users
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();
  const { handleLogout, isLoggingOut } = useLogout();

  // Mock messages for demonstration
  const mockMessages = [
    {
      id: 1,
      user: { name: 'Sarah', id: 'user1', isPremium: true },
      content: 'Just finished reading an amazing feminist book. Anyone else read "We Should All Be Feminists"?',
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: 2,
      user: { name: 'Maria', id: 'user2', isPremium: true },
      content: 'Yes! It\'s such an important read. The way she explains intersectionality is so clear.',
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: 3,
      user: { name: 'Emma', id: 'user3', isPremium: true },
      content: 'I\'m reading it right now! The chapter about raising feminist children really resonated with me.',
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: 4,
      user: { name: 'Alex', id: 'user4', isPremium: true },
      content: 'Has anyone read "The Second Sex" by Simone de Beauvoir? It\'s a classic but quite dense.',
      timestamp: new Date(Date.now() - 15000)
    },
    {
      id: 5,
      user: { name: 'Jordan', id: 'user5', isPremium: true },
      content: 'I\'ve been meaning to read that! Any tips for getting through it?',
      timestamp: new Date(Date.now() - 10000)
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isPremium) {
      navigate('/premium');
      return;
    }

    // Load mock messages
    setMessages(mockMessages);
    scrollToBottom();

    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000 + Math.random() * 3000);
      }
    }, 5000);

    return () => clearInterval(typingInterval);
  }, [isAuthenticated, isPremium, navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);

    // Simulate sending message
    const message = {
      id: Date.now(),
      user: { 
        name: user.name, 
        id: user.id, 
        isPremium: user.isPremium 
      },
      content: newMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsLoading(false);

    // Simulate response after 2-4 seconds
    setTimeout(() => {
      const responses = [
        'That\'s such a great point!',
        'I completely agree with you.',
        'This reminds me of my own experience...',
        'Thank you for sharing that!',
        'I\'ve been thinking about this too.',
        'That\'s a really interesting perspective.',
        'I\'d love to hear more about your thoughts on this.',
        'This is exactly what I needed to hear today.',
        'You\'ve articulated this so well.',
        'I\'m going to look into this more.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseMessage = {
        id: Date.now() + 1,
        user: { 
          name: ['Sarah', 'Maria', 'Emma', 'Alex', 'Jordan'][Math.floor(Math.random() * 5)], 
          id: 'community',
          isPremium: true
        },
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000 + Math.random() * 2000);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!isPremium) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Premium Chat Room</h1>
                <p className="text-pink-100 text-sm">Connect with feminists worldwide</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-pink-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">{onlineUsers} online</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                  </svg>
                  Premium
                </span>
                <span className="text-pink-100 text-sm">
                  {messages.length} messages
                </span>
                <button
                  onClick={() => handleLogout('Are you sure you want to logout from the chat room?')}
                  disabled={isLoggingOut}
                  className="text-pink-100 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => {
              const showDate = index === 0 || 
                formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp);
              
              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${message.user.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${message.user.id === user?.id ? 'order-2' : 'order-1'}`}>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.user.id === user?.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.user.name}
                          </span>
                          {message.user.isPremium && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-yellow-900">
                              <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" clipRule="evenodd" />
                              </svg>
                              Premium
                            </span>
                          )}
                          <span className={`text-xs ${
                            message.user.id === user?.id ? 'text-pink-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Someone is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isLoading}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={isLoading || !newMessage.trim()}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {newMessage.length}/500 characters
              </p>
              <p className="text-xs text-gray-500">
                Press Enter to send
              </p>
            </div>
          </div>
        </div>

        {/* Chat Guidelines */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Community Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">✅ Do's</h4>
              <ul className="space-y-1">
                <li>• Share your feminist journey and experiences</li>
                <li>• Support and encourage other members</li>
                <li>• Respect diverse perspectives and backgrounds</li>
                <li>• Use inclusive and respectful language</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">❌ Don'ts</h4>
              <ul className="space-y-1">
                <li>• Harass, bully, or discriminate against others</li>
                <li>• Share personal information without consent</li>
                <li>• Promote hate speech or harmful ideologies</li>
                <li>• Spam or advertise unrelated content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom; 