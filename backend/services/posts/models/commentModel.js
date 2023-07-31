import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    commentId: { type:String, required: true},
    postId: { type:String, required: true},
    userId: { type: String, required: true },
    desc: {type: String, required : true},
    likes: [],
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

let CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;