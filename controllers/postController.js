import Post from "../models/postSchema.js";
import User from "../models/userSchema.js";

//? Create Post
const createPost = async (req, res) => {
  console.log("Creating Post");

  try {
    // Create a new post
    const newPost = new Post(req.body);

    // Save Post in Db and Respond
    const post = await newPost.save();
    res.status(200).send({
      status: "Success",
      message: "Post has created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

//? Update Post
const updatePost = async (req, res) => {
  console.log(req.params);

  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      const updatedPost = await post.updateOne({ $set: req.body });

      res.status(200).send({
        status: "success",
        message: "Post has updated successfully",
      });
    } else {
      res.status(403).send({
        status: "Rejected",
        message: "You can edit only your post",
      });
    }
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Post not found",
    });
  }
};

//? Delete Post
const deletePost = async (req, res) => {
  console.log(req.params);
  try {
    const post = await Post.findById(req.params.id);
    console.log(post.userId);
    console.log(req.body.userId);

    if (post.userId === req.body.userId) {
      const deletedPost = await post.deleteOne();

      res.status(200).send({
        status: "success",
        message: "Post has deleted successfully",
      });
    } else {
      res.status(403).send({
        status: "Rejected",
        message: "You can delete only your post",
      });
    }
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Post not found",
    });
  }
};

//? Post Liking or Disliking
const postLike = async (req, res) => {
  console.log(req.params);

  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {
      // For post liked
      await post.updateOne({
        $push: { likes: req.body.userId },
      });

      res.status(200).send({
        status: "success",
        message: "Post has been liked successfully",
      });
    } else {
      // For post unliked
      await post.updateOne({
        $pull: { likes: req.body.userId },
      });

      res.status(200).send({
        status: "success",
        message: "Post has been disliked successfully",
      });
    }
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Post not found",
    });
  }
};

//? Get a Post
const getPost = async (req, res) => {
  console.log(req.params);

  try {
    const post = await Post.findById(req.params.id);
    res.status(200).send({
      status: "Success",
      message: "Get Post Data Successfully",
      data: post,
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Post not found",
    });
  }
};

//? Get a Specific User Posts
const userPosts = async (req, res) => {
  console.log("userPost");
  try {
    const userOfPosts = await User.findOne({ userName: req.params.username });
    const posts = await Post.find({ userId: userOfPosts._id });

    res.status(200).send({
      status: "Success",
      message: "Get a specific user posts data Successfully",
      data: posts,
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Not found",
    });
  }
};

//? Get a Specific User Timeline Posts
const timelinePosts = async (req, res) => {
  try {
    const userOfPosts = await User.findById(req.params.userId);
    const allPostsOfUser = await Post.find({ userId: userOfPosts._id });

    // user to following users all posts
    const tmlinePosts = await Promise.all(
      userOfPosts.followings.map((followUserID) => {
        return Post.find({ userId: followUserID });
      })
    );

    res.status(200).send({
      status: "Success",
      message: "Get a timeline posts data Successfully",
      data: allPostsOfUser.concat(...tmlinePosts),
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Not found",
    });
  }
};

export {
  createPost,
  updatePost,
  deletePost,
  postLike,
  getPost,
  userPosts,
  timelinePosts,
};
