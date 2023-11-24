import bcrypt from "bcrypt";
import User from "../models/userSchema.js";

//? Get Profile
const getProfile = async (req, res) => {
  console.log(req.params);
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ userName: username });

    const { password, updatedAt, ...others } = user._doc;

    res.status(200).send({
      status: "Success",
      message: "Get Profile Data Successfully",
      data: others,
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: error.message,
    });
  }
};

//? Update User Profile
const updateProfile = async (req, res) => {
  console.log(req.params);

  if (req.body.userId === req.params.id || req.body.isAdmin) {
    // edit password encrypted
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).send({
          status: "Failed",
          message: error.message,
        });
      }
    }

    // Updating Profile
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).send({
        status: "Success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      return res.status(404).send({
        status: "Failed",
        message: "User not found",
      });
    }
  } else {
    res.status(403).send({
      status: "Failed",
      message: "You can update only your profile",
    });
  }
};

//? Delete User Profile
const deleteProfile = async (req, res) => {
  console.log(req.params);

  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      // Deleting Profile
      const user = await User.findByIdAndDelete(req.params.id);
      console.log("Deleted Profile ==>>" + user);

      res.status(200).send({
        status: "Success",
        message: "Profile deleted successfully",
      });
    } catch (error) {
      return res.status(404).send({
        status: "Failed",
        message: "User not Found",
      });
    }
  } else {
    res.status(403).send({
      status: "Failed",
      message: "You can delete only your profile",
    });
  }
};

//? Follow Other User Profile
const followProfile = async (req, res) => {
  console.log(req.params);

  if (req.body.userId !== req.params.id) {
    try {
      const followUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (!followUser.followers.includes(req.body.userId)) {
        await followUser.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { followings: req.params.id },
        });

        res.status(200).send({
          status: "Ok",
          message: "You have following user successfully",
        });
      } else {
        res.status(403).send({
          status: "Rejected",
          message: "You have already follow this user",
        });
      }
    } catch (error) {
      res.status(404).send({
        status: "Failed",
        message: error.message,
      });
    }
  } else {
    res.status(403).send({
      status: "Failed",
      message: "You can't follow your profile",
    });
  }
};

//? Unfollow Other User Profile
const unFollowProfile = async (req, res) => {
  console.log(req.params);

  if (req.body.userId !== req.params.id) {
    try {
      const unfollowUser = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);

      if (unfollowUser.followers.includes(req.body.userId)) {
        await unfollowUser.updateOne({
          $pull: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $pull: { followings: req.params.id },
        });

        res.status(200).send({
          status: "Ok",
          message: "You have unfollowing user successfully",
        });
      } else {
        res.status(403).send({
          status: "Rejected",
          message: "This user already unfollow",
        });
      }
    } catch (error) {
      res.status(404).send({
        status: "Failed",
        message: error.message,
      });
    }
  } else {
    res.status(403).send({
      status: "Failed",
      message: "You can't unfollow your profile",
    });
  }
};

//? Get a User Following Friends
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    let friendList = [];

    // user following friends
    const friends = await Promise.all(
      user.followings?.map((followUserID) => {
        return User.findById(followUserID);
      })
    );

    friends?.map((eachFriend) => {
      const { _id, userName, firstName, lastName, profilePicture } = eachFriend;
      friendList.push({ _id, userName, firstName, lastName, profilePicture });
    });

    res.status(200).send({
      status: "Success",
      message: "Get a User Friends Successfully",
      data: friendList,
    });
  } catch (error) {
    res.status(404).send({
      status: "Failed",
      message: "Not found",
    });
  }
};

//? Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).send({
      status: "Success",
      message: "Get All Users Successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      status: "Failed",
      message: error.message,
    });
  }
};

export {
  getProfile,
  updateProfile,
  deleteProfile,
  followProfile,
  unFollowProfile,
  getFriends,
  getUsers,
};
