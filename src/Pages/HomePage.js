// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ posts }) => {
  const navigate = useNavigate();

  const handleBlogClick = (blogPath) => {
    navigate(blogPath);
  };

  const willowPostsCount = posts.filter(p => p.blogType === 'willow').length;
  const wishesPostsCount = posts.filter(p => p.blogType === 'wishes').length;

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Choose a Story</h1>
      </div>
      <div className="blog-selection-container">
        <button
          className="blog-button willow"
          onClick={() => handleBlogClick('/blog/willow')}
        >
          <div className="button-content">
            <h2>Memorial of a Willow Tree</h2>
            <p className="author-name">by Arül</p>
            <p className="post-count">{willowPostsCount} {willowPostsCount === 1 ? 'blog is' : 'blogs are'} available</p>
          </div>
        </button>
        <button
          className="blog-button wishes"
          onClick={() => handleBlogClick('/blog/wishes')}
        >
          <div className="button-content">
            <h2>Eyes Hiding Secret Wishes</h2>
            <p className="author-name">by Gizemeh</p>
            <p className="post-count">{wishesPostsCount} {wishesPostsCount === 1 ? 'blog is' : 'blogs are'} available</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
