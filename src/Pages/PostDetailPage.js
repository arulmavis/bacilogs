// src/Pages/PostDetailPage.js
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './PostDetailPage.css';

const PostDetailPage = ({ posts, onDelete, auth }) => {
  const { postId } = useParams();
  const post = posts.find(p => p._id === postId);
  const navigate = useNavigate();

  if (!post) {
    return <div className="page-container"><h2>Post not found!</h2></div>;
  }

  const handleDelete = () => {
    onDelete(post._id, post.blogType);
  };

  return (
    <div className="page-container post-detail-container">
      <article className="post-detail">
        <h1>{post.title}</h1>
        <p className="post-meta">By {post.author} on {new Date(post.createdAt).toLocaleDateString()}</p>
        
        {/* This is the important part: only show buttons if auth exists */}
        {auth && (
          <div className="post-actions">
            <Link to={`/edit-post/${post._id}`} className="btn btn-edit">Edit Post</Link>
            <button onClick={handleDelete} className="btn btn-delete">Delete Post</button>
          </div>
        )}

        <div 
          className="post-content" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        <button onClick={() => navigate(-1)} className="btn btn-back">
          &larr; Back to Posts
        </button>
      </article>
    </div>
  );
};

export default PostDetailPage;