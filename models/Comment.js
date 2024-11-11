const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    // post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

commentSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Comment", commentSchema);
