import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload;
}

const JWT_KEY = "ThisIsJustAnotherJWTKey";

const fetchuser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({
      message: "No valid token provided",
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default fetchuser;
