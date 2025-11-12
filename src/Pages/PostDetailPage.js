// src/Pages/PostDetailPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetailPage.css';

const PostDetailPage = ({ posts, onDelete, auth }) => {
  const { postId } = useParams();
  const post = posts.find(p => p._id === postId);

  if (!post) {
    return <div className="page-container"><h2>Post not found!</h2></div>;
  }

  return (
    <div className="page-container post-detail-page">
      <div className="post-content">
        <h1>{post.title}</h1>
        {post.titlePicture && <img src={post.titlePicture} alt={post.title} className="post-detail-image" />}
        {/* Render the HTML content from the rich text editor */}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      {auth && (
        <div className="post-actions">
          <Link to={`/edit-post/${post._id}`} className="action-button edit">
            Edit Post
          </Link>
          <button 
            onClick={() => onDelete(post._id, post.blogType)} 
            className="action-button delete"
          >
            Delete Post
          </button>
        </div>
      )}
      <Link to={`/blog/${post.blogType}`} className="back-link">
        &larr; Back to {post.blogType === 'willow' ? 'Memorial of a Willow Tree' : 'Eyes Hiding Secret Wishes'}
      </Link>
    </div>
  );
};

export default PostDetailPage;