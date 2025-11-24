import express from 'express';
import { Pool } from 'pg';

export default function createLikesRouter(deps: { pool: Pool; authenticateToken?: any }) {
  const router = express.Router();
  const { pool, authenticateToken } = deps;

  // Toggle like on a comment
  router.post('/comments/:id/like', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const commentId = Number(req.params.id);
      const likesDb = await import('../db/likes');
      const existing = await likesDb.findLikeForComment(pool, userId, commentId);
      if (existing) {
        await likesDb.deleteLikeById(pool, existing.id);
        const cnt = await likesDb.countLikesForComment(pool, commentId);
        return res.json({ success: true, data: { liked: false, like_count: cnt }, message: null, errors: null });
      } else {
        await likesDb.createLikeForComment(pool, userId, commentId);
        const cnt = await likesDb.countLikesForComment(pool, commentId);
        return res.json({ success: true, data: { liked: true, like_count: cnt }, message: null, errors: null });
      }
    } catch (err: any) {
      console.error('Toggle comment like error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // Toggle like on a reply
  router.post('/replies/:id/like', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const replyId = Number(req.params.id);
      const likesDb = await import('../db/likes');
      const existing = await likesDb.findLikeForReply(pool, userId, replyId);
      if (existing) {
        await likesDb.deleteLikeById(pool, existing.id);
        const cnt = await likesDb.countLikesForReply(pool, replyId);
        return res.json({ success: true, data: { liked: false, like_count: cnt }, message: null, errors: null });
      } else {
        await likesDb.createLikeForReply(pool, userId, replyId);
        const cnt = await likesDb.countLikesForReply(pool, replyId);
        return res.json({ success: true, data: { liked: true, like_count: cnt }, message: null, errors: null });
      }
    } catch (err: any) {
      console.error('Toggle reply like error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // List likers for a post (username + when they liked)
  router.get('/posts/:id/likes', authenticateToken, async (req: any, res) => {
    try {
      const postId = Number(req.params.id);
      const likesDb = await import('../db/likes');
      const likers = await likesDb.getLikersForPost(pool, postId);
      return res.json({ success: true, data: likers, message: null, errors: null });
    } catch (err: any) {
      console.error('Get post likers error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // List likers for a comment
  router.get('/comments/:id/likes', authenticateToken, async (req: any, res) => {
    try {
      const commentId = Number(req.params.id);
      const likesDb = await import('../db/likes');
      const likers = await likesDb.getLikersForComment(pool, commentId);
      return res.json({ success: true, data: likers, message: null, errors: null });
    } catch (err: any) {
      console.error('Get comment likers error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // List likers for a reply
  router.get('/replies/:id/likes', authenticateToken, async (req: any, res) => {
    try {
      const replyId = Number(req.params.id);
      const likesDb = await import('../db/likes');
      const likers = await likesDb.getLikersForReply(pool, replyId);
      return res.json({ success: true, data: likers, message: null, errors: null });
    } catch (err: any) {
      console.error('Get reply likers error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  return router;
}
