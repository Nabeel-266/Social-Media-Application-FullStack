import "./user.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function User({ user }) {
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const { _id, userName, firstName, lastName, profilePicture } = user;
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    setIsFollowingUser(user?.followers?.includes(currentUser._id));
  }, [currentUser, user]);

  const followingAndUnfollowingHandler = async () => {
    try {
      if (isFollowingUser) {
        await axios.put(`/user/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/user/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.error(`Something went wrong on follow Handler ${error.message}`);
    }

    setIsFollowingUser(!isFollowingUser);
  };

  if (_id !== currentUser._id) {
    return (
      <li className="eachUser">
        <Link to={`/profile/${userName?.slice(1)}`} style={{ textDecoration: "none" }}>
          <div className="userNameAndImageSide">
            <img
              src={profilePicture || "/assets/no-profile-image.jpg"}
              alt="eachUser"
              className="userImage"
            />
            <span className="userName">
              {firstName} {lastName}
            </span>
          </div>
        </Link>

        <button className="followUnfollowBtn" onClick={followingAndUnfollowingHandler}>
          {isFollowingUser ? "Unfollow" : "Follow"}
        </button>
      </li>
    );
  }
}
