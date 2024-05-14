import express, { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import fetchuser, { AuthenticatedRequest } from "../middleware/fetchuser";
import User, { UserDocument } from "../models/User";
import { signAuthToken } from "../utils/auth-token";
import Session from "../models/Session";
const router: Router = express.Router();

// ROUTE 1: Create a user using -> POST "/api/auth/createuser"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be at least five characters").isLength({ min: 5 }),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({
          success,
          error: "User with this email already exists",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const securedPassword = bcrypt.hashSync(req.body.password, salt);

      const newUser = new User({
        name: req.body.name,
        password: securedPassword,
        email: req.body.email,
      });
      await newUser.save();

      const newSession = new Session({
        user: newUser.id,
        ip: req.ip,
        ua: req.header("User-Agent"),
      })
      await newSession.save()

      const authtoken = signAuthToken(newUser, newSession);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error((error as Error).message); // Type assertion here
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticating a user using -> POST "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success });
    }

    // Destructure email and password from the request body
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const session = new Session({
        user: user.id,
        ip: req.ip,
        ua: req.header("User-Agent"),
      })
      await session.save()

      const authtoken = signAuthToken(user, session); // Use centralized token signing
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error((error as Error).message); // Type assertion here
      res.status(500).send("Internal Server Error");
    }
  }
);


// ROUTE 3: Authenticating a user using -> POST "/api/auth/getuser"
router.post("/getuser", fetchuser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Now TypeScript knows about `req.user`
    const userId = req.user!.id;
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTE 4: Authenticating a user using -> POST "/api/auth/logout"
router.post(
  "/logout",
  fetchuser,
  async (req: AuthenticatedRequest, res: Response) => {
    req.session!.revokedAt = new Date()
    req.session!.save()
    return res.json({ success: true })
  }
);


export default router;
