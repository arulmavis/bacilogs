// src/Pages/EditPostPage.js
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePostPage.css'; // Reuse the same CSS

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        // Security check: only allow the author to edit
        if (currentUser && postData.authorId === currentUser.uid) {
          setTitle(postData.title);
          setContent(postData.content);
        } else {
          navigate('/'); // Redirect if not the author
        }
      }
      setIsLoading(false);
    };
    if (currentUser) {
      fetchPost();
    }
  }, [postId, currentUser, navigate]);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && currentUser) {
        const storageRef = ref(storage, `images/${currentUser.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', downloadURL);
      }
    };
  }, [currentUser, quillRef]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image', 'video'], ['clean']
      ],
      handlers: { image: imageHandler },
    },
  }), [imageHandler]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const postRef = doc(db, 'posts', postId);
    try {
      await updateDoc(postRef, {
        title,
        content,
      });
      navigate(`/post/${postId}`); // Navigate back to the post detail page
    } catch (error) {
      console.error("Error updating document: ", error);
      alert('Failed to update post.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="page-container"><h1>Loading editor...</h1></div>;
  }

  return (
    <div className="page-container create-post-page">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Blog Content</label>
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            value={content} 
            onChange={setContent}
            modules={modules}
          />
        </div>
        <button type="submit" className="publish-button" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;