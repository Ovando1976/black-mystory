import React, { useContext, useEffect, useState } from "react";
import Post from "../posts/Posts";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
/* import { Posts } from "../../dummyData"; */

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  // fetch posts once on render
  useEffect(() => {
    const fetchPosts = async () => {
      // we can skip the manual fetching of api queries with axios
      const res = username
        ? await axios.get(`posts/profile/${username}`)
        : await axios.get(`posts/timeline/${user._id}`);
      // sorts posts by date
      setPosts(
        res.data.sort((post1, post2) => {
          return new Date(post2.createdAt) - new Date(post1.createdAt);
        })
      );
      return res;
    };
    console.log(fetchPosts());
  }, [username, user._id]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
