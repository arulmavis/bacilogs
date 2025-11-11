// src/Pages/EditPostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePostPage.css'; // We can reuse the same CSS

const EditPostPage = ({ posts, onUpdatePost }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const postToEdit = posts.find(p => p._id === postId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titlePicture, setTitlePicture] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setTitlePicture(postToEdit.titlePicture);
    } else {
      // If post not found, maybe redirect
      navigate('/');
    }
  }, [postToEdit, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTitlePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      ...postToEdit,
      title,
      content,
      titlePicture,
    };
    onUpdatePost(updatedPost);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }, { 'font': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (!postToEdit) return null; // Or a loading indicator

  return (
    <div className="page-container create-post-page">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="title-picture">Title Picture</label>
          <input type="file" id="title-picture" accept="image/png, image/jpeg" onChange={handleImageUpload} />
          {titlePicture && <img src={titlePicture} alt="Preview" className="image-preview" />}
        </div>
        <div className="form-group">
          <label>Blog Content</label>
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent}
            modules={modules}
          />
        </div>
        <button type="submit" className="submit-post-button">Update Post</button>
      </form>
    </div>
  );
};

export default EditPostPage;