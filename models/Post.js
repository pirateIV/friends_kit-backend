const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
    // images: [{}]
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
