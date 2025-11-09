// src/Pages/CreatePostPage.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import './CreatePostPage.css';

const CreatePostPage = ({ blogType, onAddPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titlePicture, setTitlePicture] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload this to a server.
      // For now, we'll use a local URL.
      setTitlePicture(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill out both the title and the blog content.');
      return;
    }
    onAddPost({ title, content, titlePicture, blogType });
  };

  // Configuration for the editor's toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }, { 'font': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'], // image and video are supported!
      ['clean']
    ],
  };

  return (
    <div className="page-container create-post-page">
      <h1>Create New Post for {blogType === 'willow' ? '"Memorial of a Willow Tree"' : '"Eyes Hiding Secret Wishes"'}</h1>
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Blog Title</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your awesome title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="title-picture">Title Picture</label>
          <input 
            type="file" 
            id="title-picture"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
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
        <button type="submit" className="submit-post-button">Publish Post</button>
      </form>
    </div>
  );
};

export default CreatePostPage;