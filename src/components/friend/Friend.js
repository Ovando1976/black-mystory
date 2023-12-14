import React from "react";
import "./friend.css";

export default function Friend({ user }) {
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="friend">
      <img
        src={publicFolder + user.profilePicture}
        alt=""
        className="friendImage"
      />
      <span className="friendName">{user.username}</span>
    </li>
  );
}
