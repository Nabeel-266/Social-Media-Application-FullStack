import "./userBio.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function UserBio({
  user,
  isHideFollowers,
  setIsHideFollowers,
  isFollowed,
  followAndUnfollowHandler,
  setIsProfileModalOpen,
}) {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <section className="userBio">
      <div className="pictures">
        <img
          className="coverPic"
          src={user.coverPicture || "/assets/no-cover-image.jpg"}
          alt="coverPic"
        />
        <img
          className="profilePic"
          src={user.profilePicture || "/assets/no-profile-image.jpg"}
          alt="profilePic"
        />
      </div>

      <div className="aboutUser">
        <div className="userStatus">
          <span
            onClick={() =>
              user?.followers?.length > 0
                ? setIsHideFollowers(!isHideFollowers)
                : setIsHideFollowers(true)
            }>
            <strong>{user?.followers?.length}</strong> Followers
          </span>
          <div className="profileButtons">
            {user._id === currentUser._id ? (
              <button
                className="editProfileBtn"
                onClick={() => setIsProfileModalOpen(true)}>
                Edit Profile
              </button>
            ) : (
              <button className="followProfileBtn" onClick={followAndUnfollowHandler}>
                {isFollowed ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <h1 className="userName">{`${user?.firstName} ${user?.lastName}`}</h1>

        <p className="userDesc">
          {user?.desc ||
            `Hey! Hello everyone, I am ${user?.firstName} ${user?.lastName} and I am a new member of this Social Vibes platform.`}
        </p>
      </div>
    </section>
  );
}
