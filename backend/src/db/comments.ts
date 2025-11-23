import { Pool } from 'pg';

export async function createComment(pool: Pool, userId: number, postId: number, text: string) {
  const res = await pool.query(
    `INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
    [postId, userId, text]
  );
  return res.rows[0];
}

export async function getCommentsForPost(pool: Pool, postId: number) {
  const res = await pool.query(
    `
    SELECT c.*, u.first_name, u.last_name,
      (SELECT COUNT(*) FROM likes l WHERE l.comment_id = c.id) AS like_count,
      (SELECT COUNT(*) FROM replies r WHERE r.comment_id = c.id) AS reply_count
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
    `,
    [postId]
  );
  return res.rows;
}

export async function createReply(pool: Pool, userId: number, commentId: number, text: string) {
  const res = await pool.query(
    `INSERT INTO replies (comment_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
    [commentId, userId, text]
  );
  return res.rows[0];
}

export async function getRepliesForComment(pool: Pool, commentId: number) {
  const res = await pool.query(
    `
    SELECT r.*, u.first_name, u.last_name,
      (SELECT COUNT(*) FROM likes l WHERE l.reply_id = r.id) AS like_count
    FROM replies r
    JOIN users u ON u.id = r.user_id
    WHERE r.comment_id = $1
    ORDER BY r.created_at ASC
    `,
    [commentId]
  );
  return res.rows;
}

export async function getCommentById(pool: Pool, commentId: number) {
  const res = await pool.query('SELECT * FROM comments WHERE id=$1', [commentId]);
  return res.rows[0] || null;
}
