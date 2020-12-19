//user,titile,bio,profilePic,links,posts,bookmarks
const { Schema, model } = require("mongoose");
// const User = require("./User");
// const Post = require("./Post");

const profileSchema = new Schema(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength:30
    },
    titile: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    profilePic: {
      type: String,
    },
    links: {
      website: String,
      facebook: String,
      twitter: String,
      github: String,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);
module.exports = Profile;
