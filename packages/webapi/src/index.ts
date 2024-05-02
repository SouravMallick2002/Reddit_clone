import connectToMongo from "./db";
import express from 'express';
import cors from 'cors';

connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


// routes
app.use('/api/auth', require('./auth'));

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});
