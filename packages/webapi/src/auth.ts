import express, { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import fetchuser from "./middleware/fetchuser";
import User from "./models/User";

const JWT_KEY = "ThisIsJustAnotherJWTKey";
const router: Router = express.Router();

// ROUTE 1: Create a user using -> POST "/api/auth/createuser". Doesn't require authentication
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be at least five characters").isLength({
      min: 5,
    }),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    //return bad request and error message for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if email is already in use
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res.status(400).json({
          success,
          error: "User with this email already exists",
        });
      }

      // Password encryption
      const salt = bcrypt.genSaltSync(10);
      const securedPassword = bcrypt.hashSync(req.body.password, salt);

      // Creating new user
      user = await User.create({
        name: req.body.name,
        password: securedPassword,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_KEY);
      success = true;
      res.json({ success, authtoken });

      // res.json(user);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
      
      
  }
);

// ROUTE 2: Authenticating a user using -> POST "/api/auth/login". Doesn't require authentication
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  async (req: Request, res: Response) => {
    let success = false;
    // Return bad request and error message for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: errors.array() });
    }

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

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_KEY);
      success = true;
      res.json({ success, authtoken });
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
      
  }
);

// ROUTE 3: Get details of logged-in user -> POST "/api/auth/getuser". Login required

// router.post("/getuser", fetchuser, async (req: Request, res: Response) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId).select("-password");
//     res.send(user);
// } catch (error: any) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
  
// });

export default router;
