import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-bold text-purple-800 mb-4">
          With my Women!
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto">
          A bold, empowering space for feminists to share stories, connect, and inspire change.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-pink-600 mb-3">Share Stories</h3>
          <p className="text-gray-600">Write and share your feminist journey, experiences, and insights.</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-purple-600 mb-3">Connect</h3>
          <p className="text-gray-600">Join our community of empowered women and allies.</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-bold text-indigo-600 mb-3">Premium Chat</h3>
          <p className="text-gray-600">Exclusive private chat room for premium members.</p>
        </div>
      </div>
      <div className="text-center">
        <Link
          to="/blogs"
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 inline-block"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>
);

export default Home; 