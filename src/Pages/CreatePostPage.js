// src/Pages/CreatePostPage.js
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './CreatePostPage.css';

const CreatePostPage = ({ blogType }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const quillRef = useRef(null);

  // Custom image handler for the Quill editor
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file && currentUser) {
        try {
          // Create a storage reference
          const storageRef = ref(storage, `images/${currentUser.uid}/${Date.now()}_${file.name}`);
          
          // Upload the file
          const snapshot = await uploadBytes(storageRef, file);
          
          // Get the download URL
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          // Insert the image into the editor
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', downloadURL);
        } catch (error) {
          console.error("Error uploading image: ", error);
          alert('Image upload failed. Please try again.');
        }
      }
    };
  }, [currentUser]);

  // Configure the Quill editor modules and formats for a rich text experience
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and content for your post.');
      return;
    }
    setIsPublishing(true);

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        blogType,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp(),
      });
      // Navigate to the corresponding blog page after successful publish
      navigate(`/blog/${blogType}`);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="page-container create-post-page">
      <h1>Create a New Post for "{blogType}"</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your post title" required />
        </div>
        <div className="form-group">
          <label>Blog Content</label>
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            value={content} 
            onChange={setContent}
            modules={modules}
            placeholder="Write your story here..."
          />
        </div>
        <button type="submit" className="publish-button" disabled={isPublishing}>
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;