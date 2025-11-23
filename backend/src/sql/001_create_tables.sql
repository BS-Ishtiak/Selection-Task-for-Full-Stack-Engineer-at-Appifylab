-- Migration: create core tables for feed feature

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    image_url VARCHAR(255),
    visibility VARCHAR(10) NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    comment_id INT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Single likes table for posts, comments, replies. Exactly one of the *_id fields must be non-null.
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
    reply_id INT REFERENCES replies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK (
        (post_id IS NOT NULL AND comment_id IS NULL AND reply_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NOT NULL AND reply_id IS NULL) OR
        (post_id IS NULL AND comment_id IS NULL AND reply_id IS NOT NULL)
    )
);

-- Indexes to support feed sorting and lookups
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_replies_comment_id ON replies(comment_id);
CREATE INDEX IF NOT EXISTS idx_likes_item ON likes(post_id, comment_id, reply_id);

-- Convenience views (optional)
CREATE OR REPLACE VIEW post_like_counts AS
SELECT p.id AS post_id, COUNT(l.*) AS like_count
FROM posts p
LEFT JOIN likes l ON l.post_id = p.id
GROUP BY p.id;

CREATE OR REPLACE VIEW comment_like_counts AS
SELECT c.id AS comment_id, COUNT(l.*) AS like_count
FROM comments c
LEFT JOIN likes l ON l.comment_id = c.id
GROUP BY c.id;

CREATE OR REPLACE VIEW reply_like_counts AS
SELECT r.id AS reply_id, COUNT(l.*) AS like_count
FROM replies r
LEFT JOIN likes l ON l.reply_id = r.id
GROUP BY r.id;
