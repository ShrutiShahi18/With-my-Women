import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/blogs').then(res => {
      setBlogs(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await api.delete(`/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!user && (
        <div className="bg-pink-50 border border-pink-200 rounded p-4 mb-6 text-center">
          <span className="text-pink-700 font-semibold">Want to share your story or join the conversation?</span>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/login" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Login</Link>
            <Link to="/register" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Sign Up</Link>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        {user && <Link to="/create" className="bg-pink-500 text-white px-4 py-2 rounded">Create Post</Link>}
      </div>
      {blogs.length === 0 ? (
        <div>No blog posts yet.</div>
      ) : (
        blogs.map(blog => (
          <div key={blog._id} className="bg-white rounded shadow p-4 mb-4">
            {blog.image && (
              <img src={blog.image} alt="Blog" className="mb-2 w-full max-h-48 object-cover rounded" />
            )}
            <Link to={`/blogs/${blog._id}`} className="text-xl font-semibold text-pink-600 hover:underline">{blog.title}</Link>
            <div className="text-gray-500 text-sm">By {blog.author?.name || 'Unknown'} | {blog.likes.length} Likes</div>
            <div className="mt-2 text-gray-700 line-clamp-2">{blog.content}</div>
            <div className="flex items-center gap-2 mt-2">
              <Link to={`/blogs/${blog._id}`} className="text-pink-500 hover:underline text-sm">Read more</Link>
              {user && blog.author?._id === user._id && (
                <>
                  <button
                    onClick={() => navigate(`/edit/${blog._id}`)}
                    className="ml-2 bg-yellow-400 text-white px-2 py-1 rounded text-sm hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogList; 