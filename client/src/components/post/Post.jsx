import "./post.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// * Material Icons
import {
  MoreHorizRounded,
  CloseRounded,
  ThumbUpRounded,
  ThumbUpOutlined,
  ChatBubbleOutlineRounded,
  SendRounded,
  BookmarkBorderOutlined,
  EditOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";

export default function Post({
  post,
  setPostModalOpen,
  setIsOpenEditPostModal,
  setEditPostContent,
  setIsDeletePost,
}) {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [commentCount, setCommentCount] = useState(post.comments.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [isOpenPostOptions, setIsOpenPostOptions] = useState(false);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);

  // De-structuring an Objects
  const { _id, userId, desc, image, createdAt } = post;
  const { firstName, lastName, userName, profilePicture } = user;

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user?userId=${userId}`);
        // console.log(response.data.data);
        setUser(response.data.data);
      } catch (error) {
        console.error("Something went wrong " + error);
      }
    };
    fetchUser();
  }, [userId, currentUser]);

  // For Like Post
  const likeHandler = async () => {
    try {
      await axios.put(`/post/${_id}/like`, {
        userId: currentUser._id,
      });
    } catch (error) {
      console.error("Something went wrong on like or dislike Post " + error);
    }
    setIsLiked(!isLiked);
    setLikeCount((prvCount) => (isLiked ? prvCount - 1 : prvCount + 1));
  };

  // For Comment Post
  const commentHandler = () => {
    setCommentCount((prvCount) => (comment ? prvCount + 1 : prvCount));
    setIsComment(false);
    setComment("");
    document.querySelector(".commentInput").value = "";
  };

  // For Delete Post
  const deletePostHandler = async () => {
    setIsOpenPostOptions(false);

    try {
      await axios.delete(`/post/${_id}`, {
        data: {
          userId: currentUser._id,
        },
      });
    } catch (error) {
      return console.error("Something went wrong on deleting Post " + error);
    }

    setIsDeletePost(true);
  };

  return (
    <div className="post">
      <section className="postTop">
        <div className="postTopLeft">
          <Link to={`/profile/${userName?.slice(1)}`}>
            <img
              src={profilePicture ? profilePicture : "/assets/no-profile-image.jpg"}
              alt="user"
              className="postAuthorImage"
            />
          </Link>
          <div className="postInfo">
            <span className="postAuthorName">{`${firstName} ${lastName}`}</span>
            <span className="postTime">{format(createdAt)}</span>
          </div>
        </div>

        <div className="postTopRight">
          <span>
            {isOpenPostOptions ? (
              <CloseRounded
                className="postOptionsIcon"
                onClick={() => setIsOpenPostOptions(false)}
              />
            ) : (
              <MoreHorizRounded
                className="postOptionsIcon"
                onClick={() => setIsOpenPostOptions(true)}
              />
            )}
          </span>

          <ul
            className="postOptions"
            style={isOpenPostOptions ? { display: "block" } : { display: "none" }}>
            <li className="eachOption">
              <BookmarkBorderOutlined className="eachOptIcon" /> Save
            </li>
            {currentUser._id === userId && (
              <>
                <li
                  className="eachOption"
                  onClick={() => {
                    setPostModalOpen(true);
                    setIsOpenEditPostModal(true);
                    setEditPostContent(post);
                    setIsOpenPostOptions(false);
                  }}>
                  <EditOutlined className="eachOptIcon" />
                  Edit
                </li>
                <li className="eachOption" onClick={deletePostHandler}>
                  <DeleteOutlineOutlined className="eachOptIcon" /> Delete
                </li>
              </>
            )}
          </ul>
        </div>
      </section>

      <section className="postCenter">
        <span
          className="postText"
          style={desc ? { display: "block" } : { display: "none" }}>
          {desc ? desc : ""}
        </span>
        <img
          src={image}
          alt="post"
          className="postImage"
          style={image ? { display: "block" } : { display: "none" }}
        />
      </section>

      <section className="postBottom">
        <div className="postBottomUp">
          <span className="likeInfo">
            <ThumbUpRounded className="likeIcon" />
            {likeCount}
          </span>

          <span className="commentInfo">{commentCount} comments</span>
        </div>

        <div className="postBottomMid">
          <button
            className="postBtn"
            style={isLiked ? { color: "#0053c0" } : { color: "#444" }}
            onClick={() => likeHandler()}>
            {isLiked ? (
              <ThumbUpRounded className="postBtnIcon" style={{ color: "#0053c0" }} />
            ) : (
              <ThumbUpOutlined className="postBtnIcon" style={{ color: "#444" }} />
            )}
            Like
          </button>
          <button className="postBtn" onClick={() => setIsComment(!isComment)}>
            <ChatBubbleOutlineRounded className="postBtnIcon commentIcon" />
            Comment
          </button>
        </div>

        {isComment && (
          <div className="postBottomDown">
            <img
              src={user.profilePicture || "/assets/no-profile-image.jpg"}
              alt="user"
              className="commentUserImg"
            />
            <input
              type="text"
              className="commentInput"
              placeholder="Submit your comments here"
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="sendCommentBtn"
              onClick={() => commentHandler()}
              style={comment ? { cursor: "pointer" } : { cursor: "not-allowed" }}>
              <SendRounded className="sendCommentIcon" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
