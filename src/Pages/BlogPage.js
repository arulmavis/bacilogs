// src/Pages/BlogPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = ({ blogName, blogType, posts, currentUser }) => {
  return (
    <div className="page-container blog-page">
      <div className="blog-header">
        <h1>{blogName}</h1>
        {currentUser && (
          <Link to={`/create-post/${blogType}`} className="write-blog-button">
            Write a Blog
          </Link>
        )}
      </div>

      <div className="post-list">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="post-summary">
              {post.titlePicture && <img src={post.titlePicture} alt={post.title} className="post-summary-image" />}
              <div className="post-summary-content">
                <h2>{post.title}</h2>
                {/* The content from the editor is HTML, so we use dangerouslySetInnerHTML */}
                {/* We'll show a snippet here in a real app, but for now, we show it all */}
                <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
                <Link to={`/post/${post._id}`} className="read-more">Read More</Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <p>No blog posts yet. Be the first to write one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;