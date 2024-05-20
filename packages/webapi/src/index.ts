import connectToMongo from "./db";
import express from 'express';
import cors from 'cors';

import auth from './routes/auth';
import posts from './routes/posts';

connectToMongo();
const app = express();
const port = 6000;

app.use(cors());
app.use(express.json()); // Apply globally for JSON requests
app.use(express.urlencoded({ extended: true })); // Apply globally for URL-encoded requests

// Use built-in body parsing middleware only for non-file upload routes
app.use('/api/auth', auth);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
