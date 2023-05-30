import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useEffect } from "react";
import { makeRequest } from "../../api/axios";
import moment from "moment";
const Comments = ({ postId, setRefetch }) => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await makeRequest
        .get("/comments?postId=" + postId, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setLoading(false);
          setError(err);
          console.log(err);
        });
    };
    fetchData();
  }, [postId, newComment]);

  const addComment = async (postId) => {
    try {
      setLoading(true);
      await makeRequest.post("/comments", {
        desc,
        postId,
      });
      setLoading(false);
      setError(null);
      setNewComment((prev) => prev + 1);
      setRefetch((prev) => prev + 1);
    } catch (err) {
      setLoading(false);
      setError(err);
      console.log(err);
    }
  };
  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={() => addComment(postId)}>Send</button>
      </div>
      {isLoading
        ? "loading"
        : error
        ? "error"
        : data?.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
