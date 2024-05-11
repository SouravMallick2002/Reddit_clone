import express, { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import fetchuser from "../middleware/fetchuser";
import User from "../models/User";
import { signAuthToken } from "../utils/auth-token";
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
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "User with this email already exists",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const securedPassword = bcrypt.hashSync(req.body.password, salt);

      user = new User({
        name: req.body.name,
        password: securedPassword,
        email: req.body.email,
      });

      await user.save();

      const authtoken = signAuthToken(user.id); // Use centralized token signing
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
      let user = await User.findOne({ email });
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

      const authtoken = signAuthToken(user.id); // Use centralized token signing
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error((error as Error).message); // Type assertion here
      res.status(500).send("Internal Server Error");
    }
  }
);


router.post("/getuser", fetchuser, async (req: Request, res: Response) => {
  try {
    // Now TypeScript knows about `req.user`
    const userId = req.user!.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
