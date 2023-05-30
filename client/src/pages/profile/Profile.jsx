import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../api/axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [refetch, setRefetch] = useState(0);
  const [openUpdate, setOpenUpdate] = useState(false);

  const handleFollow = async () => {
    const isFollowed = followers?.includes(currentUser.id);
    if (isFollowed) {
      await makeRequest.delete("/relationships?userId=" + id);
    } else {
      await makeRequest.post("/relationships", { userId: id });
    }
    setRefetch((prev) => prev + 1);
  };
  useEffect(() => {
    (async () => {
      await makeRequest("/users/find/" + id).then((res) => {
        setUser(res.data[0]);
      });
    })();
    (async () => {
      await makeRequest("/relationships?followedUserId=" + id).then((res) => {
        setFollowers(res.data);
      });
    })();
  }, [id, refetch]);
  const handleOpenUpdate = () => {
    document.body.classList.toggle("modalOpen");
    setOpenUpdate((prev) => (prev = !prev));
  };
  return (
    <div className="profile">
      <div className="images">
        <img src={"/upload/" + user.coverPic} alt="" className="cover" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="profileHeader">
            <img
              src={"/upload/" + user.profilePic}
              alt=""
              className="profilePic"
            />
            <span className="profile_name">{user.name}</span>
          </div>

          <div className="top">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <div className="center">
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{user.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{user.website}</span>
              </div>
            </div>
            {currentUser.id === Number(id) ? (
              <button onClick={() => handleOpenUpdate()}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {followers?.includes(currentUser.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
        <Posts userId={id} />
      </div>
      {openUpdate && (
        <Update
          handleOpenUpdate={handleOpenUpdate}
          user={currentUser}
          setRefetch={setRefetch}
        />
      )}
    </div>
  );
};

export default Profile;
