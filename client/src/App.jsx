import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import Premium from './components/Premium';
import PremiumContent from './components/PremiumContent';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/premium-content" element={<PremiumContent />} />
      </Routes>
      <ChatbotWidget />
    </Router>
  );
}

export default App;

