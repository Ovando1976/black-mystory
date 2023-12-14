import React, { useContext, useRef, useState } from "react";
import "./share.css";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Share() {
  const { user } = useContext(AuthContext);
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const description = useRef();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userID: user._id,
      description: description.current.value,
    };
    if (file) {
      const data = new FormData();
      // TODO removing feature since i don't pass the request body with axios properly and fuck stuff up FIXME
      // we generate unique filename to prevent conflicts with other user uploads
      const fileName = /* Date.now() +  */ file.name;
      data.append("file", file);
      data.append("name", fileName);
      newPost.image = fileName;
      try {
        await axios
          .post("/upload", data)
          .then
          // cleaner to update through a post context and post state, but this will do for visualization
          // TODO it actually won't do since it breaks the post FIXME
          //window.location.reload()
          ();
      } catch (e) {
        console.log(e);
      }
    }

    try {
      await axios.post("/posts", newPost);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={publicFolder + (user.profilePicture || "person/noAvatar.png")}
            alt=""
            className="shareProfileImage"
          />
          <input
            placeholder={`What's on your mind ${user.username}...`}
            type="text"
            className="shareInput"
            ref={description}
          />
        </div>
        <hr className="shareHr" />
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag someone</span>
            </div>

            <div className="shareOption">
              <RoomIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Share location</span>
            </div>

            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="gold" className="shareIcon" />
              <span className="shareOptionText">Share mood</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
