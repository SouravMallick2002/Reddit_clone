import express from 'express';
import { blacklistToken, removeBlacklistedToken } from '../services/tokenService';

const router = express.Router();

// Endpoint to blacklist a token
router.post('/blacklist-token', async (req, res) => {
  try {
    await blacklistToken(req.body.token);
    res.status(200).send('Token successfully blacklisted.');
  } catch (error) {
    res.status(500).send('Error blacklisting token.');
  }
});

// Endpoint to remove a token from the blacklist
router.delete('/remove-blacklisted-token', async (req, res) => {
  try {
    await removeBlacklistedToken(req.body.token);
    res.status(200).send('Token successfully removed from blacklist.');
  } catch (error) {
    res.status(500).send('Error removing token from blacklist.');
  }
});

export default router;
