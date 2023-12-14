import React from "react";
import "./leftbar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { Users } from "../../dummyData";
import Friend from "../friend/Friend";

export default function Leftbar() {
  return (
    <div className="leftbar">
      <div className="leftbarWrapper">
        <ul className="leftbarList">
          <li className="leftbarListItem">
            <RssFeedIcon className="leftbarIcon" />
            <span className="leftbarListItemText">Feed</span>
          </li>

          <li className="leftbarListItem">
            <QuestionMarkIcon className="leftbarIcon" />
            <span className="leftbarListItemText">...</span>
          </li>

          <li className="leftbarListItem">
            <QuestionMarkIcon className="leftbarIcon" />
            <span className="leftbarListItemText">...</span>
          </li>

          <li className="leftbarListItem">
            <QuestionMarkIcon className="leftbarIcon" />
            <span className="leftbarListItemText">...</span>
          </li>
        </ul>

        <button className="leftbarButton">...</button>
        <hr className="leftbarHr" />

        <ul className="leftbarFriendList">
          {Users.map((user) => (
            <Friend key={user.id} user={user} />
          ))}
        </ul>
      </div>
    </div>
  );
}
