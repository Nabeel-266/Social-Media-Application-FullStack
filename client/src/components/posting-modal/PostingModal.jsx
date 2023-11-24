import "./postingModal.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../../firebaseConfig.js";

//* Import Edit Post Functions
import {
  editPostWithOnlyPostText,
  editPostWithOnlyPostFile,
  editPostWithOnlyCurrentPostImg,
  editPostWithPostTextAndPostFile,
  editPostWithPostTextAndCurrentPostImg,
} from "../../editPost.js";

//* Components
import Loader from "../loader/Loader.jsx";

// * Import Material Icons
import {
  ClearRounded,
  SentimentSatisfiedRounded,
  InsertPhotoRounded,
  VideocamRounded,
  LocalActivityRounded,
  EmojiEmotionsRounded,
  SellRounded,
} from "@mui/icons-material";

export default function PostingModal({
  setPostModalOpen,
  setIsAddNewPost,
  isOpenEditPostModal,
  setIsOpenEditPostModal,
  editPostContent,
  setEditPostContent,
  setIsEditPost,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [postText, setPostText] = useState("");
  const [postFile, setPostFile] = useState(null);
  const [currentPostImg, setCurrentPostImg] = useState(null);
  const { user } = useContext(AuthContext);
  const { _id, profilePicture, firstName, lastName } = user;

  useEffect(() => {
    if (editPostContent?.desc && editPostContent?.image) {
      setPostText(editPostContent?.desc);
      setCurrentPostImg(editPostContent?.image);
    } else if (editPostContent?.desc) {
      setPostText(editPostContent?.desc);
    } else if (editPostContent?.image) {
      setCurrentPostImg(editPostContent?.image);
    } else {
      setPostText("");
      setCurrentPostImg(null);
    }
  }, [editPostContent]);

  // Post Modal Closing Funtion
  function closePostModal() {
    setPostText("");
    setPostFile(null);
    setIsOpenEditPostModal(false);
    setEditPostContent({});
    setCurrentPostImg(null);
    setPostModalOpen(false);
  }

  // For Create Post Handler
  const postCreationHandler = async () => {
    if (postText && !postFile) {
      const newPost = {
        userId: _id,
        desc: postText,
      };
      setIsUploading(true);

      try {
        await axios.post("/post", newPost);
        setIsAddNewPost(true);
      } catch (error) {
        console.error(`Something went wrong on create post ${error}`);
      }

      setIsUploading(false);
      closePostModal();
    } else if ((!postText && postFile) || (postText && postFile)) {
      setIsUploading(true);

      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/example.jpg'
      const storageRef = ref(storage, "Post-Images/" + postFile.name);
      const uploadTask = uploadBytesResumable(storageRef, postFile, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              console.log("Upload is done");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.log("User canceled the upload");
              break;
            case "storage/unknown":
              console.log("Unknown error occurred, inspect error.serverResponse");
              break;
            default:
              console.log(error.message);
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const newPost = {
              userId: _id,
              desc: postText,
              image: downloadURL,
            };

            try {
              await axios.post("/post", newPost);
              setIsAddNewPost(true);
            } catch (error) {
              console.error(`Something went wrong on create post ${error}`);
            }

            setIsUploading(false);
            closePostModal();
          });
        }
      );
    }
  };

  // For Edit Post Handler
  const postEditHandler = async () => {
    if (postText && !postFile && !currentPostImg) {
      await editPostWithOnlyPostText(
        postText,
        editPostContent,
        closePostModal,
        setIsEditPost,
        setIsUploading
      );
    } else if (postFile && !postText && !currentPostImg) {
      await editPostWithOnlyPostFile(
        postFile,
        editPostContent,
        closePostModal,
        setIsEditPost,
        setIsUploading
      );
    } else if (currentPostImg && !postFile && !postText) {
      await editPostWithOnlyCurrentPostImg(
        currentPostImg,
        editPostContent,
        closePostModal,
        setIsEditPost,
        setIsUploading
      );
    } else if (postText && postFile && !currentPostImg) {
      await editPostWithPostTextAndPostFile(
        postText,
        postFile,
        editPostContent,
        closePostModal,
        setIsEditPost,
        setIsUploading
      );
    } else if (postText && currentPostImg && !postFile) {
      await editPostWithPostTextAndCurrentPostImg(
        postText,
        currentPostImg,
        editPostContent,
        closePostModal,
        setIsEditPost,
        setIsUploading
      );
    } else {
      alert("Your Post is Empty");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="postModal">
        {isUploading && (
          <div className="upLoadArea">
            <Loader />
            <span>{isOpenEditPostModal ? "Saving" : "Posting"} ...</span>
          </div>
        )}

        <header className="modalHeader">
          <h2>{isOpenEditPostModal ? "Edit Post" : "Create Post"}</h2>
          <button className="closeModalBtn" onClick={closePostModal}>
            <ClearRounded className="closeIcon" />
          </button>
        </header>

        <section className="modalMiddle">
          <div className="postUser">
            <img
              src={profilePicture ? profilePicture : "/assets/no-profile-image.jpg"}
              alt="User"
              className="postUserImage"
            />
            <div className="postUserName">
              <h6>
                {firstName} {lastName}
              </h6>
              <span>Post to Anyone</span>
            </div>
          </div>

          <div className="postTextArea">
            <textarea
              className="textArea"
              placeholder="What do you want to write about?"
              onChange={(e) => setPostText(e.target.value)}
              style={
                postFile || currentPostImg
                  ? { maxHeight: "80px" }
                  : { maxHeight: "120px" }
              }
              value={postText}></textarea>
          </div>

          {(postFile || currentPostImg) && (
            <div className="postFileViewArea">
              <div className="fileViewer">
                <img
                  src={postFile ? URL.createObjectURL(postFile) : currentPostImg}
                  alt="Attach File"
                  className="selectedImage"
                />
                <button
                  className="removeAttachFileBtn"
                  onClick={() => {
                    setPostFile(null);
                    setCurrentPostImg(null);
                  }}>
                  <ClearRounded className="removeIcon" />
                </button>
              </div>
            </div>
          )}

          <div className="postAddEmoji">
            <SentimentSatisfiedRounded className="emoji" />
          </div>

          <div className="postAttachFilesBar">
            <h6>Add to your post</h6>

            <div className="attachFileOptions">
              <abbr title="Photo">
                <span className="fileOption">
                  <label htmlFor="photo">
                    <InsertPhotoRounded className="fileIcon" />
                  </label>
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept=".png,.jpeg,.jpg"
                    onChange={(e) => {
                      setPostFile(e.target.files[0]);
                      setCurrentPostImg(null);
                    }}
                  />
                </span>
              </abbr>

              <abbr title="Video">
                <span className="fileOption">
                  <label htmlFor="video">
                    <VideocamRounded className="fileIcon" />
                  </label>
                  <input type="file" name="video" id="video" />
                </span>
              </abbr>

              <abbr title="Activity">
                <span className="fileOption">
                  <label htmlFor="activity">
                    <LocalActivityRounded className="fileIcon" />
                  </label>
                  <input type="file" name="activity" id="activity" />
                </span>
              </abbr>

              <abbr title="Tag People">
                <span className="fileOption">
                  <label htmlFor="tagPeople">
                    <SellRounded className="fileIcon" />
                  </label>
                  <input type="file" name="tagPeople" id="tagPeople" />
                </span>
              </abbr>

              <abbr title="Feelings">
                <span className="fileOption">
                  <label htmlFor="feelings">
                    <EmojiEmotionsRounded className="fileIcon" />
                  </label>
                  <input type="file" name="feelings" id="feelings" />
                </span>
              </abbr>
            </div>
          </div>
        </section>

        <footer className="modalFooter">
          {isOpenEditPostModal ? (
            <button
              className="postHandlerBtn"
              onClick={postEditHandler}
              style={
                postText || postFile || currentPostImg
                  ? { cursor: "pointer", backgroundColor: "#003247" }
                  : { cursor: "not-allowed", backgroundColor: "#888" }
              }>
              Save
            </button>
          ) : (
            <button
              className="postHandlerBtn"
              onClick={postCreationHandler}
              style={
                postText || postFile
                  ? { cursor: "pointer", backgroundColor: "#003247" }
                  : { cursor: "not-allowed", backgroundColor: "#888" }
              }>
              Post
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
