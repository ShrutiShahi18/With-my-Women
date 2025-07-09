import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlog = () => {
    api.get(`/api/blogs/${id}`).then(res => {
      setBlog(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, [id]);

  const handleLike = async () => {
    setLikeLoading(true);
    await api.put(`/api/blogs/${id}/like`);
    fetchBlog();
    setLikeLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this post?')) {
      await api.delete(`/api/blogs/${id}`);
      navigate('/');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    await api.post(`/api/blogs/${id}/comments`, { content: comment });
    setComment('');
    fetchBlog();
    setCommentLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      await api.delete(`/api/comments/${commentId}`);
      fetchBlog();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/" className="text-pink-500 hover:underline">&larr; Back to list</Link>
      <div className="bg-white rounded shadow p-4 mt-4">
        <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
        <div className="text-gray-500 text-sm mb-2">By {blog.author?.name || 'Unknown'} | {new Date(blog.createdAt).toLocaleString()}</div>
        {blog.image && <img src={blog.image} alt="Blog" className="mb-2 max-h-64 object-cover rounded" />}
        <div className="text-gray-700 mb-4 whitespace-pre-line">{blog.content}</div>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={handleLike} disabled={likeLoading || !user} className={`px-3 py-1 rounded ${user ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'} hover:bg-pink-600`}>
            {blog.likes.some(like => like._id === user?._id) ? 'Unlike' : 'Like'} ({blog.likes.length})
          </button>
          {user && blog.author?._id === user._id && (
            <>
              <Link to={`/edit/${blog._id}`} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</Link>
              <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
            </>
          )}
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Comments ({blog.comments.length})</h3>
          {user && (
            <form onSubmit={handleComment} className="flex gap-2 mb-4">
              <input type="text" value={comment} onChange={e => setComment(e.target.value)} className="flex-1 border rounded px-2 py-1" placeholder="Add a comment..." required disabled={commentLoading} />
              <button type="submit" className="bg-pink-500 text-white px-3 py-1 rounded" disabled={commentLoading || !comment.trim()}>{commentLoading ? '...' : 'Post'}</button>
            </form>
          )}
          <div>
            {blog.comments.length === 0 ? <div>No comments yet.</div> : blog.comments.map(c => (
              <div key={c._id} className="border-b py-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold">{c.author?.name || 'Unknown'}:</span> {c.content}
                  <span className="text-xs text-gray-400 ml-2">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                {user && c.author?._id === user._id && (
                  <button onClick={() => handleDeleteComment(c._id)} className="text-red-500 text-xs ml-2">Delete</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 