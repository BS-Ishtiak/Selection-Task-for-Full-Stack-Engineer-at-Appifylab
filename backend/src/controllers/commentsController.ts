import express from 'express';
import { Pool } from 'pg';

export default function createCommentsRouter(deps: { pool: Pool; authenticateToken?: any }) {
  const router = express.Router();
  const { pool, authenticateToken } = deps;

  // Create a comment on a post
  router.post('/posts/:postId/comments', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const postId = Number(req.params.postId);
      const text = req.body && typeof req.body.text !== 'undefined' ? String(req.body.text).trim() : '';
      if (!text) return res.status(400).json({ success: false, data: null, message: null, errors: ['Text is required'] });
      const commentsDb = await import('../db/comments');
      const comment = await commentsDb.createComment(pool, userId, postId, text);
      return res.json({ success: true, data: comment, message: 'Comment created', errors: null });
    } catch (err: any) {
      console.error('Create comment error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // List comments for a post
  router.get('/posts/:postId/comments', authenticateToken, async (req: any, res) => {
    try {
      const postId = Number(req.params.postId);
      const commentsDb = await import('../db/comments');
      const comments = await commentsDb.getCommentsForPost(pool, postId);
      return res.json({ success: true, data: comments, message: null, errors: null });
    } catch (err: any) {
      console.error('Get comments error:', err?.message || err);
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // Create a reply to a comment
  router.post('/comments/:id/replies', authenticateToken, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const commentId = Number(req.params.id);
      if (!Number.isInteger(commentId) || commentId <= 0) return res.status(400).json({ success: false, data: null, message: null, errors: ['Invalid comment id'] });
      const text = req.body && typeof req.body.text !== 'undefined' ? String(req.body.text).trim() : '';
      if (!text) return res.status(400).json({ success: false, data: null, message: null, errors: ['Text is required'] });
      const commentsDb = await import('../db/comments');
      // ensure comment exists
      const existing = await commentsDb.getCommentById(pool, commentId);
      if (!existing) return res.status(404).json({ success: false, data: null, message: null, errors: ['Comment not found'] });
      const reply = await commentsDb.createReply(pool, userId, commentId, text);
      return res.json({ success: true, data: reply, message: 'Reply created', errors: null });
    } catch (err: any) {
      console.error('Create reply error:', err?.message || err, err?.stack || '');
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  // List replies for a comment
  router.get('/comments/:id/replies', authenticateToken, async (req: any, res) => {
    try {
      const commentId = Number(req.params.id);
      if (!Number.isInteger(commentId) || commentId <= 0) return res.status(400).json({ success: false, data: null, message: null, errors: ['Invalid comment id'] });
      const commentsDb = await import('../db/comments');
      const existing = await commentsDb.getCommentById(pool, commentId);
      if (!existing) return res.status(404).json({ success: false, data: null, message: null, errors: ['Comment not found'] });
      const replies = await commentsDb.getRepliesForComment(pool, commentId);
      return res.json({ success: true, data: replies, message: null, errors: null });
    } catch (err: any) {
      console.error('Get replies error:', err?.message || err, err?.stack || '');
      return res.status(500).json({ success: false, data: null, message: null, errors: ['Server error'] });
    }
  });

  return router;
}
