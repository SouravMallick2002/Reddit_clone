import { Request, Response, NextFunction } from 'express';
import { validateAuthToken } from '../utils/auth-token';
import User, { UserDocument } from '../models/User';
import Session, { SessionDocument } from '../models/Session';

export interface AuthenticatedRequest extends Request {
  user?: UserDocument;
  session?: SessionDocument
}

const fetchuser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({
      message: "No valid token provided",
    });
  }
  try {
    const decoded = await validateAuthToken(token); // Use the updated function
    const [user, session] = await Promise.all([
      User.findById(decoded.user).select("-password"),
      Session.findById(decoded.session)
    ]);

    if (!user || !session) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    if (session.revokedAt && session.revokedAt > new Date()) {
      return res.status(401).json({
        message: "Session has been revoked",
      });
    }

    req.user = user
    req.session = session
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default fetchuser;
