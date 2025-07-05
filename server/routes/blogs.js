const express = require('express');
const auth = require('../middleware/auth');
const Blog = require('../models/Blog');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', ['name'])
      .populate('likes', ['name'])
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', ['name'])
      .populate('likes', ['name']);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const newBlog = new Blog({
      title,
      content,
      author: req.user.id,
    });

    const blog = await newBlog.save();
    await blog.populate('author', ['name']);
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    ).populate('author', ['name']);

    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user owns the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/blogs/:id/like
// @desc    Like or unlike a blog
router.put('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if already liked
    const alreadyLiked = blog.likes.some(like => like.toString() === req.user.id);

    if (alreadyLiked) {
      // Unlike
      blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      blog.likes.push(req.user.id);
    }

    await blog.save();
    await blog.populate('likes', ['name']);
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router; 