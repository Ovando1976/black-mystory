import React, { useEffect, useState } from "react";
import Feed from "../../../components/feed/Feed";
import Leftbar from "../../../components/leftbar/Leftbar";
import Rightbar from "../../../components/rightbar/Rightbar";
import Topbar from "../../../components/topbar/Topbar";
import "./Profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Profile() {
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  // params allows us to fetch link params
  const username = useParams().username;

  // fetch posts once on render
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
      return res;
    };
    console.log(fetchUser());
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profileContainer">
        <Leftbar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={publicFolder + (user.coverPicture || "person/noCover.jpg")}
                alt=""
                className="profileCoverImage"
              />
              <img
                src={
                  publicFolder + (user.profilePicture || "person/noAvatar.png")
                }
                alt=""
                className="profileUserImage"
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDescription">{user.description}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}