import mongoose from "mongoose";
import Post from "../models/post.model.js";

// CREATE: POST /api/posts
export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Validation for required fields
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const post = await Post.create({ title, content });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ ALL: GET /api/posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ ONE: GET /api/posts/:id
export const getPost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE: PUT /api/posts/:id
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        const { title, content } = req.body;
        if (!title && !content) {
            return res.status(400).json({ message: "Please provide title or content to update" });
        }

        const post = await Post.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE: DELETE /api/posts/:id
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid post ID format" });
        }

        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
