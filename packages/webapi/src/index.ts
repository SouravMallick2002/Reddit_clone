import connectToMongo from "./db";
import express from 'express';
import cors from 'cors';

import auth from './auth';
import posts from './posts';

connectToMongo();
const app = express();
const port = 6000;

app.use(cors());
app.use(express.json());


// routes
app.use('/api/auth', auth);
app.use('/api/posts', posts);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
