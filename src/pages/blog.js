import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Section from '../components/Section';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, getDoc, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import OpenAI from 'openai';
import stylesFeatures from './BlogPage.Features.module.css';
import { getStorage, ref } from 'firebase/storage';
import styles from './Blog.module.css'; // Assuming you use CSS Modules for styling
import { app } from '../Firebase/firebaseConfig';  // Adjust path as per your project structure

const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage();
const postsCollectionRef = collection(db, 'posts');

/* Component Definitions */

function Main({ children }) {
  return <div className={`${styles.mainContainer}
  <span class="math-inline">{stylesFeatures.authContainer}`}>{children}</div>;
}
function Post({ post, user, deletePost }){
return (
<div className={styles.post}>
<div className={styles.postHeader}>
<div className={styles.title}>
<h1>{post.title}</h1>
</div>
{user && post.author.id === user.uid && (
<button onClick={() => deletePost(post.id)}>&#128465;</button>
)}
</div>
<div className={styles.postTextContainer}>{post.postText}</div>
<h3>@{post.author.name}</h3>
</div>
);
}
function NewsCard({ article }) {
return (
<div>
<h3>{article.title}</h3>
<p>{article.description}</p>
<a href={article.url} target="_blank" rel="noreferrer">
Read More
</a>
</div>
);
}
const PostList = ({ children }) => {
return <div className={`</span>{styles.postListContainer} <span class="math-inline">{styles.newsContainer}`}>{children}</div>;
};
const NewsContainer = ({ children }) => {
return <div className={`</span>{styles.postListContainer} ${styles.newsContainer}`}>{children}</div>;
};

/* Main Component */

export default function BlogPage() {
  const [article, setArticle] = useState(null);
  const [postList, setPostList] = useState([]);
  const [news, setNews] = useState([]);
  const [chatGPTResponse, setChatGPTResponse] = useState('');

  const { user } = useAuthState(auth);

  const fetchArticle = async () => {
    try {
      const docRef = doc(db, 'articles', 'revolutionizing-communication');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setArticle(docSnap.data());
      } else {
        console.error('Article not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(postsCollectionRef);
      const posts = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPostList(posts);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (id) => {
    try {
      await deleteDoc(doc(db, 'posts', id));
      setPostList(postList.filter((post) => post.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNewsArticles = async () => {
    try {
      const response = await axios.get('https://api.apnews.com/v2/search', {
        params: {
          q: 'US Virgin Islands',
          apiKey: process.env.NEWSAPI_API_KEY,
        },
      });
      
      setNews(response.data.articles);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatGPTInput = async (prompt) => {
    try {
      const response = await chatGPTResponse.sendMessage(prompt);
      setChatGPTResponse(response.data.text);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!article || !postList || !news) return;

    fetchArticle();
    fetchPosts();
    fetchNewsArticles();

    // Chat GPT integration based on article content
    const chatGPTPrompt = `Generate insights related to the article titled "${article.title}" focusing on the US Virgin Islands.`;
    handleChatGPTInput(chatGPTPrompt);
  }, [article, news, postList]);

  if (!article || !postList || !news) return <div>Loading...</div>;

  return (
    <>
    
      <Main>
        <Section title="USVI Tech Talk" />
        <div className={stylesFeatures.chatGPTContainer}>
          <h2>ChatGPT Insights</h2>
          <p>{chatGPTResponse}</p>
        </div>
        {article &&
          Object.entries(article.sections).map(([key, section]) => (
            <Section key={key} title={section.title} description={section.content} />
          ))}
      </Main>
      <PostList>
        <h2>Latest Posts</h2>
        {postList.map((post) => (
          <Post key={post.id} post={post} user={user} deletePost={deletePost} />
        ))}
      </PostList>
      <NewsContainer>
        <h2>News Headlines</h2>
        {news.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </NewsContainer>
    </>
  );
}