import "./profile.css";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";
import axios from "axios";

// * Components
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import UserBio from "../../components/user-bio/UserBio";
import UserInfo from "../../components/user-info/UserInfo";
import Follower from "../../components/follower/Follower";
import ProfileModal from "../../components/profile-modal/ProfileModal";

import { ClearRounded } from "@mui/icons-material";

export default function Profile({ setIsLoading }) {
  const username = useParams().username;
  const [user, setUser] = useState({});
  const [isHideFollowers, setIsHideFollowers] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const { user: currentUser, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user?username=@${username}`);
        setUser(response.data.data);
        // console.log(response.data.data);
      } catch (error) {
        console.error("Something went wrong " + error.message);
      }
    };
    fetchUser();
  }, [username, isFollowed, currentUser]);

  useEffect(() => {
    setIsFollowed(user?.followers?.includes(currentUser._id));
    setIsHideFollowers(true);
  }, [currentUser, user]);

  const followAndUnfollowHandler = async () => {
    try {
      if (isFollowed) {
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

    setIsFollowed(!isFollowed);
  };

  return (
    <div className="profileMainContainer">
      <Topbar />

      <div className="profileSubContainer">
        <Sidebar />

        <div className="profileContainer">
          <div className="profileTop">
            <UserBio
              user={user}
              isHideFollowers={isHideFollowers}
              setIsHideFollowers={setIsHideFollowers}
              isFollowed={isFollowed}
              followAndUnfollowHandler={followAndUnfollowHandler}
              setIsProfileModalOpen={setIsProfileModalOpen}
            />
          </div>

          {!isHideFollowers && (
            <div className="profileCenter">
              <section className="profileFollowersCont">
                <header className="profileFollowersHdr">
                  <h3>Followers</h3>
                  <button
                    className="closeFollowersAreaBtn"
                    onClick={() => setIsHideFollowers(true)}>
                    <ClearRounded className="closeIcon" />
                  </button>
                </header>

                <ul className="profileFollowersList">
                  {user?.followers?.map((followerId, index) => {
                    return <Follower key={index} followerId={followerId} />;
                  })}
                </ul>
              </section>
            </div>
          )}

          <div className="profileBottom">
            <Feed username={`@${username}`} setIsLoading={setIsLoading} />
            <UserInfo user={user} />
          </div>

          {isProfileModalOpen && (
            <ProfileModal user={user} setIsProfileModalOpen={setIsProfileModalOpen} />
          )}
        </div>
      </div>
    </div>
  );
}
