import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postId: { type:String, required: true},
    userId: { type: String, required: true },
    desc: {type: String, required : true},
    likes: [],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    image: String,
  },
  {
    timestamps: true,
  }
);

let PostModel = mongoose.model("Posts", postSchema);

export default PostModel;