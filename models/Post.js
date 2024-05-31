const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  },
  { timestamps: true },
);

postSchema.set("toJSON", {
  transform: (_, returnedObj) => {
    delete returnedObj.__v;
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
