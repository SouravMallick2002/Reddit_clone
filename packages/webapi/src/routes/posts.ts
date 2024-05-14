import express, { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fetchuser, { AuthenticatedRequest } from "../middleware/fetchuser";
import Posts, { IPost } from "../models/Posts";

const router: Router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Define the type for the post data
interface PostData {
  title: string;
  description: string;
  tag: string;
  user: string;
  image?: string; // Make image optional
}

// ROUTE 1: Get all the posts using -> GET "/api/posts/fetchposts". Requires authentication
router.get(
  "/fetchposts",
  fetchuser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const posts = await Posts.find({ user: req.user!.id });
      res.json(posts);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ROUTE 2: Add posts using -> POST "/api/posts/addposts". Requires authentication
router.post(
  "/addposts",
  fetchuser,
  upload.single('image'), // Adding multer middleware to handle single image upload
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description with at least five characters").isLength({ min: 5 }),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Prepare post data with the defined type
      const postData: PostData = {
        title,
        description,
        tag,
        user: req.user.id,
      };

      // Check if file is uploaded and add the image path to post data
      if (req.file) {
        postData.image = req.file.path;
      }

      const posts = new Posts(postData);
      const savePosts = await posts.save();

      res.json(savePosts);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);


// ROUTE 3: Update existing posts using -> PUT "/api/posts/updatepost". Requires authentication
router.put(
  "/updatepost/:id",
  fetchuser,
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, tag } = req.body;

    try {
      const newPosts: Partial<IPost> = {};
      if (title) newPosts.title = title;
      if (description) newPosts.description = description;
      if (tag) newPosts.tag = tag;

      let posts = await Posts.findById(req.params.id);
      if (!posts) return res.status(404).send("Not Found");
      if (posts.user.toString() !== req.user!.id)
        return res.status(404).send("Not Found");

      posts = await Posts.findByIdAndUpdate(
        req.params.id,
        { $set: newPosts },
        { new: true }
      );
      res.json({ posts });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ROUTE 4: Delete existing posts using -> DELETE "/api/posts/deletepost". Requires authentication
router.delete(
  "/deletepost/:id",
  fetchuser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      let posts = await Posts.findById(req.params.id);
      if (!posts) return res.status(404).send("Not Found");
      if (posts.user.toString() !== req.user!.id)
        return res.status(404).send("Not Found");

      posts = await Posts.findByIdAndDelete(req.params.id);
      res.json({ Success: "Post Deleted successfully", posts });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// ROUTE 5: Get all posts (unauthenticated) using -> GET "/api/posts/allposts"
router.get("/allposts", async (req: Request, res: Response) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// ROUTE 6: Search posts by keyword -> GET "/api/posts/searchposts"
router.get("/searchposts", async (req: Request, res: Response) => {
  const { keyword } = req.query;
  try {
    const searchQuery = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const posts = await Posts.find(searchQuery);
    res.json(posts);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
