import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Pool } from "pg";
import { createPost, getFeedPosts, getPostById } from "../db/posts";

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images allowed"), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

export default function createPostsRouter(deps: { pool: Pool; authenticateToken?: any }) {
  const router = express.Router();
  const { pool, authenticateToken } = deps;

  // Create post
  router.post("/", authenticateToken, upload.single("image"), async (req: any, res) => {
    try {
      const user = req.user;
      const text = req.body.text || null;
      const visibility = req.body.visibility === "private" ? "private" : "public";
      let imageUrl: string | null = null;
      if (req.file) {
        // Use relative URL path for frontend
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const post = await createPost(pool, user.id, text, imageUrl, visibility);
      return res.json({ success: true, data: post, message: "Post created", errors: null });
    } catch (err: any) {
      console.error("Create post error:", err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ["Server error"] });
    }
  });

  // Get feed (protected)
  router.get("/", authenticateToken, async (req: any, res) => {
    try {
      const viewerId = req.user.id;
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      const posts = await getFeedPosts(pool, viewerId, limit, offset);
      return res.json({ success: true, data: posts, message: null, errors: null });
    } catch (err: any) {
      console.error("Get feed error:", err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ["Server error"] });
    }
  });

  // Get single post (respect privacy)
  router.get("/:id", authenticateToken, async (req: any, res) => {
    try {
      const viewerId = req.user.id;
      const postId = Number(req.params.id);
      const post = await getPostById(pool, postId, viewerId);
      if (!post) return res.status(404).json({ success: false, data: null, message: null, errors: ["Not found or private"] });
      return res.json({ success: true, data: post, message: null, errors: null });
    } catch (err: any) {
      console.error("Get post error:", err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ["Server error"] });
    }
  });

  // Toggle like for a post
  router.post("/:id/like", authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const postId = Number(req.params.id);
      // lazy import to avoid circular deps
      const likesDb = await import("../db/likes");
      const existing = await likesDb.findLikeForPost(pool, userId, postId);
      if (existing) {
        await likesDb.deleteLikeById(pool, existing.id);
        const cnt = await likesDb.countLikesForPost(pool, postId);
        return res.json({ success: true, data: { liked: false, like_count: cnt }, message: null, errors: null });
      } else {
        await likesDb.createLikeForPost(pool, userId, postId);
        const cnt = await likesDb.countLikesForPost(pool, postId);
        return res.json({ success: true, data: { liked: true, like_count: cnt }, message: null, errors: null });
      }
    } catch (err: any) {
      console.error("Toggle post like error:", err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ["Server error"] });
    }
  });

  return router;
}
