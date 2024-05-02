import connectToMongo from "./db";
import express from 'express';
import cors from 'cors';

import auth from './auth';

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


// routes
app.use('/api/auth', auth);

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
