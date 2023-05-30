import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useEffect, useState, useContext } from "react";
import moment from "moment";
import { makeRequest } from "../../api/axios";
import { AuthContext } from "../../context/authContext";
const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [refetch, setRefetch] = useState(0);
  const { currentUser } = useContext(AuthContext);
  //TEMPORARY
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    (async () => {
      await makeRequest.get("/likes?postId=" + post.id).then((res) => {
        setLikes(res.data);
      });
    })();
    (async () => {
      await makeRequest.get("/comments?postId=" + post.id).then((res) => {
        setComments(res.data);
      });
    })();
  }, [post.id, refetch]);
  const handleLike = async () => {
    const liked = likes?.includes(currentUser.id);
    if (liked) {
      await makeRequest.delete("/likes?postId=" + post.id);
    } else {
      await makeRequest.post("/likes", { postId: post.id });
    }
    setRefetch((prev) => prev + 1);
  };
  const deletePost = async (id) => {
    await makeRequest.delete("/posts/" + id);
    setRefetch((prev) => prev + 1);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>

          <MoreHorizIcon onClick={() => deletePost(post.id)} />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {likes?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                onClick={handleLike}
                style={{
                  color: "red",
                }}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {comments.length} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} setRefetch={setRefetch} />}
      </div>
    </div>
  );
};

export default Post;
