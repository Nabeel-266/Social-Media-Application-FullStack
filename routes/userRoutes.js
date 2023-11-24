import express from "express";

import {
  getProfile,
  updateProfile,
  deleteProfile,
  followProfile,
  unFollowProfile,
  getFriends,
  getUsers,
} from "../controllers/profileController.js";

const userRoutes = express.Router();

// Get User Profile
userRoutes.get("/", getProfile);

// Update User Profile
userRoutes.put("/:id", updateProfile);

// Delete User Profile
userRoutes.delete("/:id", deleteProfile);

// Follow Other User Profile
userRoutes.put("/:id/follow", followProfile);

// Unfollow Other User Profile
userRoutes.put("/:id/unfollow", unFollowProfile);

// Get User Friends
userRoutes.get("/:userId/friends", getFriends);

// Get All Users
userRoutes.get("/all", getUsers);

export default userRoutes;
