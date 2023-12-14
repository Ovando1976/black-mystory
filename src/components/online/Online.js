import React from "react";
import "./online.css";

export default function Online({ user }) {
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="onlineFriend">
      <div className="onlineProfileImageContainer">
        <img
          className="onlineProfileImage"
          src={publicFolder + user.profilePicture}
          alt=""
        />
        <span className="onlineIcon"></span>
      </div>
      <span className="onlineUsername">{user.username}</span>
    </li>
  );
}