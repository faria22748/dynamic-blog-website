"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import "../../globals.css";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // To manage which post is being edited
  const [updatedContent, setUpdatedContent] = useState(""); // To manage updated content

  async function getPosts() {
    try {
      const response = await axios.get("http://localhost:4500/posts"); // Replace with your API URL
      console.log("API Response:", response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:4500/posts/${id}`);
      getPosts(); // Refresh the list of posts
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  const handleUpdatePost = async (id) => {
    try {
      await axios.patch(`http://localhost:4500/posts/${id}`, { content: updatedContent });
      setEditingPost(null);
      setUpdatedContent("");
      getPosts(); // Refresh the list of posts
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Posts</h1>
      <div className="actions py-2">
        <Link href={`/blogs/create`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Blog
          </button>
        </Link>
      </div>
      <div className="blogs flex gap-3 flex-wrap">
        {posts.map((post) => (
          <div key={post._id} className="singlePostCont border border-black p-2 max-w-[30%]">
            <h2>Title: {post.title}</h2>
            <h2>Author: {post.author}</h2>
            <h2>Created At: {new Date(post.createdAt).toLocaleDateString()}</h2>
            <p>Content: {post.content}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setEditingPost(post._id);
                  setUpdatedContent(post.content);
                }}
              >
                Update
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleDeletePost(post._id)}
              >
                Delete
              </button>
            </div>
            {editingPost === post._id && (
              <div className="mt-4">
                <textarea
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="4"
                />
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => handleUpdatePost(post._id)}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
