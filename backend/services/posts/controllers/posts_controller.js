import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import * as postActions from "./post_actions";
import mongoose from 'mongoose';

const {randomBytes}=require("crypto");

const handleErrors = async (promise) => {
  try {
    const result = await promise;
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
};

export const createPost = async (req, res) => {
  const result = await postActions.createPostAction(req.body);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result.error);
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.id;
  const result = await postActions.getPostAction(postId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result.error);
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  const newData = req.body;
  
  const result = await postActions.updatePostAction(postId, newData, userId);
  
  if (result.success) {
    res.status(200).json(result.message);
  } else {
    res.status(403).json(result.message);
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  
  const result = await postActions.deletePostAction(postId, userId);
  
  if (result.success) {
    res.status(200).json(result.message);
  } else {
    res.status(403).json(result.message);
  }
};

export const likePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  
  const result = await postActions.likePostAction(postId, userId);
  
  if (result.success) {
    res.status(200).json(result.message);
  } else {
    res.status(500).json(result.error);
  }
};

export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;
  const result = await postActions.getTimelinePostsAction(userId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json(result.error);
  }
};

  

module.exports = {
    createPost,
    getPost,
    updatePost,
    deletePost,
    likePost,
    getTimelinePosts,
};
