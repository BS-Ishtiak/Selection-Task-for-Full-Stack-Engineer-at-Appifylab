import { Pool } from 'pg';

export async function findLikeForPost(pool: Pool, userId: number, postId: number) {
  const res = await pool.query('SELECT * FROM likes WHERE user_id=$1 AND post_id=$2', [userId, postId]);
  return res.rows[0] || null;
}

export async function createLikeForPost(pool: Pool, userId: number, postId: number) {
  const res = await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *', [userId, postId]);
  return res.rows[0];
}

export async function deleteLikeById(pool: Pool, likeId: number) {
  await pool.query('DELETE FROM likes WHERE id=$1', [likeId]);
}

export async function countLikesForPost(pool: Pool, postId: number) {
  const res = await pool.query('SELECT COUNT(*) AS cnt FROM likes WHERE post_id=$1', [postId]);
  return Number(res.rows[0].cnt || 0);
}

export async function userLikedPost(pool: Pool, userId: number, postId: number) {
  const res = await pool.query('SELECT 1 FROM likes WHERE user_id=$1 AND post_id=$2', [userId, postId]);
  return res.rows.length > 0;
}

// Generic functions for comments and replies
export async function findLikeForComment(pool: Pool, userId: number, commentId: number) {
  const res = await pool.query('SELECT * FROM likes WHERE user_id=$1 AND comment_id=$2', [userId, commentId]);
  return res.rows[0] || null;
}
export async function createLikeForComment(pool: Pool, userId: number, commentId: number) {
  const res = await pool.query('INSERT INTO likes (user_id, comment_id) VALUES ($1, $2) RETURNING *', [userId, commentId]);
  return res.rows[0];
}
export async function countLikesForComment(pool: Pool, commentId: number) {
  const res = await pool.query('SELECT COUNT(*) AS cnt FROM likes WHERE comment_id=$1', [commentId]);
  return Number(res.rows[0].cnt || 0);
}
export async function findLikeForReply(pool: Pool, userId: number, replyId: number) {
  const res = await pool.query('SELECT * FROM likes WHERE user_id=$1 AND reply_id=$2', [userId, replyId]);
  return res.rows[0] || null;
}
export async function createLikeForReply(pool: Pool, userId: number, replyId: number) {
  const res = await pool.query('INSERT INTO likes (user_id, reply_id) VALUES ($1, $2) RETURNING *', [userId, replyId]);
  return res.rows[0];
}
export async function countLikesForReply(pool: Pool, replyId: number) {
  const res = await pool.query('SELECT COUNT(*) AS cnt FROM likes WHERE reply_id=$1', [replyId]);
  return Number(res.rows[0].cnt || 0);
}
