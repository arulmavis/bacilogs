// src/Pages/PostDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import './PostDetailPage.css';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          setPost({ ...postSnap.data(), id: postSnap.id });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        navigate(`/blog/${post.blogType}`); // Redirect to the blog page after deletion
      } catch (error) {
        console.error("Error deleting post: ", error);
        alert('Failed to delete post.');
      }
    }
  };

  if (loading) {
    return <div className="page-container"><h2>Loading post...</h2></div>;
  }

  if (!post) {
    return <div className="page-container"><h2>Post not found!</h2></div>;
  }

  return (
    <div className="page-container post-detail-page">
      <div className="post-content">
        <h1>{post.title}</h1>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      {currentUser && currentUser.uid === post.authorId && (
        <div className="post-actions">
          <Link to={`/edit-post/${post.id}`} className="action-button edit">Edit</Link>
          <button onClick={handleDelete} className="action-button delete">Delete</button>
        </div>
      )}
      <Link to={`/blog/${post.blogType}`} className="back-link">
        &larr; Back to {post.blogType === 'willow' ? 'Memorial of a Willow Tree' : 'Eyes Hiding Secret Wishes'}
      </Link>
    </div>
  );
};

export default PostDetailPage;