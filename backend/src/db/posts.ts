import { Pool } from "pg";

export async function createPost(pool: Pool, userId: number, text: string | null, imageUrl: string | null, visibility: 'public' | 'private') {
  const result = await pool.query(
    `INSERT INTO posts (user_id, text, image_url, visibility) VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, text, imageUrl, visibility]
  );
  return result.rows[0];
}

export async function getFeedPosts(pool: Pool, viewerId: number, limit = 20, offset = 0) {
  // Returns posts visible to the viewer: public OR owned by viewer
  const result = await pool.query(
    `
    SELECT p.*, u.first_name, u.last_name, u.email,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
      EXISTS(SELECT 1 FROM likes l2 WHERE l2.post_id = p.id AND l2.user_id = $1) AS liked_by_viewer,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE (p.visibility = 'public' OR p.user_id = $1)
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [viewerId, limit, offset]
  );
  return result.rows;
}

export async function getPostById(pool: Pool, postId: number, viewerId?: number) {
  const params: any[] = [postId];
  let whereClause = "p.id = $1";
  if (typeof viewerId === "number") {
    params.push(viewerId);
    whereClause = `(p.id = $1) AND (p.visibility = 'public' OR p.user_id = $2)`;
  }

  const result = await pool.query(
    `SELECT p.*, u.first_name, u.last_name,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE ${whereClause}
    `,
    params
  );
  return result.rows[0];
}

export async function getLikesPreview(pool: Pool, postId: number, limit = 3) {
  const result = await pool.query(
    `SELECT u.id, u.first_name, u.last_name FROM likes l JOIN users u ON u.id = l.user_id WHERE l.post_id = $1 ORDER BY l.created_at DESC LIMIT $2`,
    [postId, limit]
  );
  const countRes = await pool.query(`SELECT COUNT(*) AS cnt FROM likes WHERE post_id = $1`, [postId]);
  return { preview: result.rows, count: Number(countRes.rows[0].cnt) };
}

export async function deletePost(pool: Pool, postId: number) {
  // Because schema uses ON DELETE CASCADE for comments and likes, a single DELETE is sufficient.
  const res = await pool.query(`DELETE FROM posts WHERE id = $1 RETURNING id`, [postId]);
  return res.rows[0];
}
