import "./follower.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";

export default function Follower({ followerId }) {
  const [follower, setFollower] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { userName, firstName, lastName, profilePicture } = follower;

  useEffect(() => {
    const getFollower = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/user?userId=${followerId}`);
        setFollower(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error("Something went wrong " + error.message);
      }
      setIsLoading(false);
    };
    getFollower();
  }, [followerId]);

  return (
    <Link to={`/profile/${userName?.slice(1)}`} style={{ textDecoration: "none" }}>
      <li className="eachFollower">
        {isLoading ? (
          <CircularProgress
            style={{ color: "#004461", marginBottom: "2px" }}
            size="40px"
          />
        ) : (
          <>
            <img
              src={profilePicture ? profilePicture : `/assets/no-profile-image.jpg`}
              alt="follower"
              className="followerImage"
            />

            <span className="followerName">
              {firstName} {lastName}
            </span>

            <span className="followerUsername">{userName}</span>
          </>
        )}
      </li>
    </Link>
  );
}
