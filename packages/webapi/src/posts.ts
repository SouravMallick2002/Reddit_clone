import express, { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import fetchuser, { CustomRequest } from "./middleware/fetchuser";
import Posts, { IPost } from "./models/Posts";

const router: Router = express.Router();

// ROUTE 1: Get all the posts using -> GET "/api/posts/fetchposts". Requires authentication
router.get("/fetchposts", fetchuser, async (req: CustomRequest, res: Response) => {
    try {
      const posts = await Posts.find({ user: req.user?.id });
      res.json(posts);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });



// ROUTE 2: Add posts using -> POST "/api/posts/addposts". Requires authentication
router.post(
    "/addposts",
    fetchuser,
    [
      body("title", "Enter a valid title").isLength({ min: 3 }),
      body("description", "Enter a valid description with at least five characters").isLength({ min: 5 }),
    ],
    async (req: CustomRequest, res: Response) => {
      try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Unauthorized" });
        }
  
        const posts = new Posts({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const savePosts = await posts.save();
  
        res.json(savePosts);
      } catch (error: any) {
        console.error(error.message);
        res.status(500).send("Server Error");
      }
    }
  );
  

// ROUTE 3: Update existing posts using -> PUT "/api/posts/updatepost". Requires authentication
router.put("/updatepost/:id", fetchuser, async (req: CustomRequest, res: Response) => {
    const { title, description, tag } = req.body;
  
    try {
      const newPosts: Partial<IPost> = {};
      if (title) newPosts.title = title;
      if (description) newPosts.description = description;
      if (tag) newPosts.tag = tag;
  
      let posts = await Posts.findById(req.params.id);
      if (!posts) return res.status(404).send("Not Found");
      if (posts.user.toString() !== req.user?.id) return res.status(404).send("Not Found");
  
      posts = await Posts.findByIdAndUpdate(req.params.id, { $set: newPosts }, { new: true });
      res.json({ posts });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  
  // ROUTE 4: Delete existing posts using -> DELETE "/api/posts/deletepost". Requires authentication
  router.delete("/deletepost/:id", fetchuser, async (req: CustomRequest, res: Response) => {
    try {
      let posts = await Posts.findById(req.params.id);
      if (!posts) return res.status(404).send("Not Found");
      if (posts.user.toString() !== req.user?.id) return res.status(404).send("Not Found");
  
      posts = await Posts.findByIdAndDelete(req.params.id);
      res.json({ Success: "Post Deleted successfully", posts });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });
  

export default router;
