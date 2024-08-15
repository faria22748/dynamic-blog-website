const express = require("express");
const mongoose = require('mongoose');
const cors=require("cors")
const { ObjectId } = mongoose.Types; // Import ObjectId for validation

const app = express();
const port = 4500;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/myDatabase")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB...", err));

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);

app.use(express.json());
app.use(cors());
//post api
app.post('/posts', async (req, res) => {
    const { title, content, author } = req.body;

    const newPost = new Post({
        title,
        content,
        author
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
//  get all post
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// get one post by id
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//patch api by id
app.patch('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, author } = req.body;

    try {
        // Validate the ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid post ID");
        }

        // Find the post by ID and update it
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, content, author },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }

        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//delete api by id
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Validate the ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid post ID");
        }

        // Find the post by ID and delete it
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).send("Post not found");
        }

        res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});