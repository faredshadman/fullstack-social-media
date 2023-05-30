import { useEffect, useState } from "react";
import Post from "../post/Post";
import { makeRequest } from "../../api/axios";
import "./posts.scss";
const Posts = ({ userId }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () =>
      await makeRequest
        .get("/posts?userId=" + userId, {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    fetchData();
  }, [userId]);

  return (
    <div className="posts">
      {data?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};

export default Posts;
