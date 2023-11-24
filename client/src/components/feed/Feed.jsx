import "./feed.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

//* Components
import PostingModal from "../posting-modal/PostingModal";
import PostingBox from "../posting-box/PostingBox";
import Post from "../post/Post";
import Loading from "../loading/Loading";

export default function Feed({ username }) {
  const [isLoading, setIsLoading] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [isOpenEditPostModal, setIsOpenEditPostModal] = useState(false);
  const [editPostContent, setEditPostContent] = useState({});
  const [isAddNewPost, setIsAddNewPost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [isDeletePost, setIsDeletePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const { _id } = user;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = username
          ? await axios.get(`/post/user/${username}`)
          : await axios.get(`/post/timeline/${_id}`);
        // console.log(response.data.data);

        const allPosts = response.data.data;
        setPosts(
          allPosts.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt);
          })
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Something went wrong on fetching Post " + error);
      }
    };
    fetchPosts();

    setIsAddNewPost(false);
    setIsEditPost(false);
    setIsDeletePost(false);
  }, [username, _id, isAddNewPost, isEditPost, isDeletePost]);

  return (
    <section className="feedArea">
      <div className="feedWrapper">
        <PostingBox username={username} setPostModalOpen={setPostModalOpen} />
        {postModalOpen && (
          <PostingModal
            setPostModalOpen={setPostModalOpen}
            setIsAddNewPost={setIsAddNewPost}
            isOpenEditPostModal={isOpenEditPostModal}
            setIsOpenEditPostModal={setIsOpenEditPostModal}
            editPostContent={editPostContent}
            setEditPostContent={setEditPostContent}
            setIsEditPost={setIsEditPost}
          />
        )}
        <div
          className="allPosts"
          style={
            !username
              ? { padding: "15px 0px" }
              : username !== user?.userName
              ? { padding: "0px" }
              : { padding: "15px 0px" }
          }>
          {posts?.map((post) => {
            return (
              <Post
                key={post._id}
                post={post}
                setPostModalOpen={setPostModalOpen}
                setEditPostContent={setEditPostContent}
                setIsOpenEditPostModal={setIsOpenEditPostModal}
                setIsDeletePost={setIsDeletePost}
              />
            );
          })}
        </div>
      </div>

      {isLoading && <Loading />}
    </section>
  );
}
