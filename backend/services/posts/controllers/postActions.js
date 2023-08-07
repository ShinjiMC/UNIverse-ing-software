import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from 'mongoose';

export const createPostAction = async (postData) => {
  const postId = randomBytes(8).toString("hex");
  const newPost = new PostModel({ ...postData, postId });
  return await handleErrors(newPost.save());
};

export const getPostAction = async (postId) => {
  try {
    const post = await PostModel.findById(postId).exec();
    return { success: true, data: post };
  } catch (error) {
    return { success: false, error };
  }
};

export const updatePostAction = async (postId, newData, userId) => {
  try {
    const post = await PostModel.findById(postId).exec();
    
    if (post.userId === userId) {
      await post.updateOne({ $set: newData });
      return { success: true, message: "Post updated!" };
    } else {
      return { success: false, message: "Authentication failed" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

export const deletePostAction = async (postId, userId) => {
  try {
    const post = await PostModel.findById(postId).exec();
    if (post.userId === userId) {
      await post.deleteOne();
      return { success: true, message: "Post deleted." };
    } else {
      return { success: false, message: "Action forbidden" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

export const likePostAction = async (postId, userId) => {
  try {
    const post = await PostModel.findById(postId).exec();
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      return { success: true, message: "Post disliked" };
    } else {
      await post.updateOne({ $push: { likes: userId } });
      return { success: true, message: "Post liked" };
    }
  } catch (error) {
    return { success: false, error };
  }
};


export const getTimelinePostsAction = async (userId) => {
  try {
    const currentUserPostsQuery = PostModel.find({ userId: userId }).exec();
    const currentUserPosts = await currentUserPostsQuery;

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

    const timelinePosts = currentUserPosts.concat(
      ...followingPosts[0].followingPosts
    );

    timelinePosts.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return { success: true, data: timelinePosts };
  } catch (error) {
    return { success: false, error };
  }
};
