import { Request, Response, NextFunction } from 'express';
import { validateAuthToken } from '../utils/auth-token';  // Import the updated validate function
import { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user?: JwtPayload;
}

const fetchuser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({
      message: "No valid token provided",
    });
  }
  try {
    const decoded = await validateAuthToken(token); // Use the updated function
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default fetchuser;
