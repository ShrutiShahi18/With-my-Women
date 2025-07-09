import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateBlog = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) return <div className="p-4">You must be logged in to create a post.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/blogs', { title, content, image });
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Blog Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" className="border rounded px-2 py-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="border rounded px-2 py-1" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} required rows={6} />
        <input type="text" className="border rounded px-2 py-1" placeholder="Image URL (optional)" value={image} onChange={e => setImage(e.target.value)} />
        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
      </form>
    </div>
  );
};

export default CreateBlog; 