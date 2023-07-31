import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from 'mongoose';

const {randomBytes}=require("crypto");

export const createPost = async (req, res) => {
  try {
    const postId = randomBytes(8).toString("hex");
    const newPost = new PostModel({...req.body,postId});
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const postQuery = PostModel.findById(id).exec();
    const post = await postQuery;
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};


export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const postQuery = PostModel.findById(postId).exec();
    const post = await postQuery;
    
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated!");
    } else {
      res.status(403).json("Authentication failed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};



export const deletePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const postQuery = PostModel.findById(id).exec();
    const post = await postQuery;
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const postQuery = PostModel.findById(id).exec();
    const post = await postQuery;
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post liked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
    try {
      const currentUserPostsQuery = PostModel.find({ userId: userId }).exec();
  
      const followingPosts = await UserModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "following",
            foreignField: "userId",
            as: "followingPosts",
          },
        },
        {
          $project: {
            followingPosts: 1,
            _id: 0,
          },
        },
      ]).exec();
  
      const currentUserPosts = await currentUserPostsQuery;
  
      res.status(200).json(
        currentUserPosts
          .concat(...followingPosts[0].followingPosts)
          .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
      );
    } catch (error) {
      res.status(500).json(error);
    }
  };
  

module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
};