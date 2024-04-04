const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    post: {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: { type: String, required: true },
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
