import "./postingBox.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// * Material Icons
import {
  InsertPhotoRounded,
  VideocamRounded,
  LocalActivityRounded,
  EmojiEmotionsRounded,
} from "@mui/icons-material";

export default function PostingBox({ username, setPostModalOpen }) {
  const { user } = useContext(AuthContext);
  const { profilePicture, firstName, lastName, userName } = user;

  return (
    <section
      className="postingBox"
      style={
        !username
          ? { display: "block" }
          : username === userName
          ? { display: "block" }
          : { display: "none" }
      }>
      <div className="upperBoxSide">
        <img
          src={profilePicture ? profilePicture : "/assets/no-profile-image.jpg"}
          alt="user"
          className="userImage"
        />
        <input
          type="text"
          placeholder={`What's on your mind? ${firstName} ${lastName}`}
          readOnly
          onClick={() => setPostModalOpen(true)}
        />
      </div>

      <div className="lowerBoxSide">
        <span className="postingOption" onClick={() => setPostModalOpen(true)}>
          <InsertPhotoRounded className="optIcon" /> Photo
        </span>

        <span className="postingOption" onClick={() => setPostModalOpen(true)}>
          <VideocamRounded className="optIcon" /> Video
        </span>

        <span className="postingOption" onClick={() => setPostModalOpen(true)}>
          <LocalActivityRounded className="optIcon" /> Activity
        </span>

        <span className="postingOption" onClick={() => setPostModalOpen(true)}>
          <EmojiEmotionsRounded className="optIcon" /> Feelings
        </span>
      </div>
    </section>
  );
}
