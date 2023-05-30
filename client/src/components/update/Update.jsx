import React, { useState } from "react";
import { makeRequest } from "../../api/axios";
import "./update.scss";
const Update = ({ handleOpenUpdate, user, setRefetch }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  console.log(cover);
  console.log(profile);
  const [texts, setTexts] = useState({
    name: user.name,
    city: user.city,
    website: user.website,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTexts((prev) => ({ ...prev, [name]: value }));
  };
  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await makeRequest.post("/upload", formData);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let profileUrl;
      let coverUrl;

      coverUrl = cover ? await upload(cover) : user.profilePic;
      profileUrl = profile ? await upload(profile) : user.coverPic;

      await makeRequest.put("/users", {
        ...texts,
        coverPic: coverUrl,
        profilePic: profileUrl,
      });
      setRefetch((prev) => prev + 1);
      handleOpenUpdate();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="updateWrapper">
      <div className="update">
        Update
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="file"
            name="profilePic"
            onChange={(e) => setProfile(e.target.files[0])}
          />
          <input
            type="file"
            name="coverPic"
            onChange={(e) => setCover(e.target.files[0])}
          />
          <input type="text" name="name" onChange={(e) => handleChange(e)} />
          <input type="text" name="city" onChange={(e) => handleChange(e)} />
          <input type="text" name="website" onChange={(e) => handleChange(e)} />
          <button type="submit">Submit</button>
        </form>
        <button onClick={handleOpenUpdate}>X</button>
      </div>
    </div>
  );
};

export default Update;
