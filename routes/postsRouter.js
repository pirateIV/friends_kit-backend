const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const authMiddleware = require("../middleware/authMiddleware");
const Post = require("../models/Post");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts",
    allowedFormats: ["jpg", "png"],
  },
});

const upload = multer({ storage: storage });

router.post("upload", upload.array("images"), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => file.path);
    res.json({ imageUrls });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload images" });
  }
});

router.get("/getAllPosts", authMiddleware, async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });

  res.status(200).json(posts);
});

// Route to create a new post
router.post("/createPost", authMiddleware, async (req, res) => {
  try {
    const userId = req.id;
    const { content, imageUrls } = req.body;

    console.log(content);

    if (!content) return res.status(400).json({ msg: "Please enter post" });

    // Create a new post
    const newPost = new Post({
      user: userId,
      content: content,
      images: imageUrls,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

router.get("/:userPostId", async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userPostId })
      .populate("comments")
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(400).json({ message: "not posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(400).json({ msg: "Post not found" });
  }
  res.status(200).json(post);
});

router.delete("/:postId/delete", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(400).json({ error: "Post not found!" });
    }
    res.sendStatus(204);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = router;
