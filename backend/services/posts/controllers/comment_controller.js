import CommentModel from "../models/commentModel.js";

const {randomBytes}=require("crypto");

export const createComment = async (req, res) => {
    const { postId, userId, desc } = req.body;

    try {
        const commentId = randomBytes(8).toString("hex");
        const newComment = new CommentModel({
        commentId,
        postId,
        userId,
        desc,
        });
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getCommentsForPost = async (req, res) => {
    const postId = req.params.postId;
    try {
        const commentQuery = CommentModel.find({ postId }).exec();
        const comments = await commentQuery;
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const { userId } = req.body;
    try {
        const commentQuery = CommentModel.findOne({ commentId }).exec();
        const comment = await commentQuery;
        if (!comment) {
            return res.status(404).json("Comment not found.");
        }
        if (comment.userId !== userId) {
            return res.status(403).json("Action forbidden.");
        }
        await comment.deleteOne();
        res.status(200).json("Comment deleted.");
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updateComment = async (req, res) => {
    const commentId = req.params.commentId;
    const { userId, desc } = req.body;
    try {
        const commentQuery = CommentModel.findOne({ commentId }).exec();
        const comment = await commentQuery;
        if (!comment) {
        return res.status(404).json("Comment not found.");
        }
        if (comment.userId !== userId) {
        return res.status(403).json("Action forbidden.");
        }
        comment.desc = desc;
        await comment.save();
        res.status(200).json("Comment updated!");
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createComment,
    getCommentsForPost,
    deleteComment,
    updateComment,
};