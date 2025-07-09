const express = require('express');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const router = express.Router();

// DELETE /api/comments/:id - Delete a comment (auth, only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // Remove comment from blog's comments array
    await Blog.findByIdAndUpdate(comment.blog, { $pull: { comments: comment._id } });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 