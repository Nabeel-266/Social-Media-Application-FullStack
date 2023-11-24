import axios from "axios";
import { storage, ref, uploadBytesResumable, getDownloadURL } from "./firebaseConfig.js";

export const editPostWithOnlyPostText = async (
  postText,
  editPostContent,
  closePostModal,
  setIsEditPost,
  setIsUploading
) => {
  setIsUploading(true);
  const { _id, userId } = editPostContent;

  const editedPost = {
    userId: userId,
    desc: postText,
    image: "",
  };

  try {
    await axios.put(`/post/${_id}`, editedPost);
    setIsEditPost(true);
  } catch (error) {
    console.error(`Something went wrong on edit post ${error}`);
  }

  setIsUploading(false);
  closePostModal();
};

export const editPostWithOnlyPostFile = async (
  postFile,
  editPostContent,
  closePostModal,
  setIsEditPost,
  setIsUploading
) => {
  setIsUploading(true);
  const { _id, userId } = editPostContent;

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
        const editedPost = {
          userId: userId,
          desc: "",
          image: downloadURL,
        };

        try {
          await axios.put(`/post/${_id}`, editedPost);
          setIsEditPost(true);
        } catch (error) {
          console.error(`Something went wrong on edit post ${error}`);
        }
      });
    }
  );

  setIsUploading(false);
  closePostModal();
};

export const editPostWithOnlyCurrentPostImg = async (
  currentPostImg,
  editPostContent,
  closePostModal,
  setIsEditPost,
  setIsUploading
) => {
  setIsUploading(true);
  const { _id, userId } = editPostContent;

  const editedPost = {
    userId: userId,
    desc: "",
    image: currentPostImg,
  };

  try {
    await axios.put(`/post/${_id}`, editedPost);
    setIsEditPost(true);
  } catch (error) {
    console.error(`Something went wrong on edit post ${error}`);
  }

  setIsUploading(false);
  closePostModal();
};

export const editPostWithPostTextAndPostFile = async (
  postText,
  postFile,
  editPostContent,
  closePostModal,
  setIsEditPost,
  setIsUploading
) => {
  setIsUploading(true);
  const { _id, userId } = editPostContent;

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
        const editedPost = {
          userId: userId,
          desc: postText,
          image: downloadURL,
        };

        try {
          await axios.put(`/post/${_id}`, editedPost);
          setIsEditPost(true);
        } catch (error) {
          console.error(`Something went wrong on edit post ${error}`);
        }
      });
    }
  );

  setIsUploading(false);
  closePostModal();
};

export const editPostWithPostTextAndCurrentPostImg = async (
  postText,
  currentPostImg,
  editPostContent,
  closePostModal,
  setIsEditPost,
  setIsUploading
) => {
  setIsUploading(true);
  const { _id, userId } = editPostContent;

  const editedPost = {
    userId: userId,
    desc: postText,
    image: currentPostImg,
  };

  try {
    await axios.put(`/post/${_id}`, editedPost);
    setIsEditPost(true);
  } catch (error) {
    console.error(`Something went wrong on edit post ${error}`);
  }

  setIsUploading(false);
  closePostModal();
};
