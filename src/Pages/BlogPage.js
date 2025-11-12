// src/Pages/BlogPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = ({ blogName, blogType, posts, auth }) => {
  return (
    <div className="page-container blog-page">
      <div className="blog-header">
        <h1>{blogName}</h1>
        {/* This is the important part: only show button if auth exists */}
        {auth && (
          <Link to={`/create-post/${blogType}`} className="btn btn-create">
            &#43; Create New Post
          </Link>
        )}
      </div>

      <div className="post-list">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="post-preview">
              <h2><Link to={`/post/${post._id}`}>{post.title}</Link></h2>
              <p className="preview-meta">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
              <p className="preview-content">{post.content.substring(0, 150).replace(/<[^>]+>/g, '')}...</p>
              <Link to={`/post/${post._id}`} className="read-more">Read More &rarr;</Link>
            </div>
          ))
        ) : (
          <p>No posts yet. Why not create one?</p>
        )}
      </div>
    </div>
  );
};

export default BlogPage;