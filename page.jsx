"use client"; // Ensure this is a client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function CreatePostPage() {
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const router = useRouter(); // This should work if this is a client-side component

  // Function to handle the creation of a new post
  const handleCreatePost = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    try {
      // Sending a POST request to the backend API to create a new post
      await axios.post('http://localhost:4500/posts', newPost);
      router.push('/blogs'); // Redirect to the blogs list after creating the post
    } catch (error) {
      console.error('Error creating post:', error); // Logging the error if any
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Blog Post</h1>
      <form className="space-y-4" onSubmit={handleCreatePost}>
        <input
          type="text"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Author"
          required
        />
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Content"
          rows="5"
          required
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
