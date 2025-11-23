import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Pool } from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { corsMiddleware, jsonMiddleware, authenticateToken } from "./middleware/middleware";
import createRoutes from "./routes/routes";

dotenv.config();

const app = express();
app.use(jsonMiddleware);
app.use(corsMiddleware);

// Serve uploaded files from /uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// ---- PostgreSQL main connection ----
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE, // <-- authlab
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

// Test connection
pool.query("SELECT 1")
  .then(() => console.log("✅ Connected to PostgreSQL (authlab)"))
  .catch((err) => console.log("❌ DB Connection Error:", err.message));

// Example route to test DB
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// JWT / Auth config
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "CHANGE_ME_access_secret_!@#";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "CHANGE_ME_refresh_secret_!@#";
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

const refreshStore = new Set<string>();

function signAccessToken(payload: { id: number; email: string; name?: string; role?: string }) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

function signRefreshToken(payload: { id: number; email: string; role?: string }) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
}

async function logErrorToAuditDb(error_message: string, error_stack?: string) {
  // Simple stub: in a real app write to an audit DB table
  console.error("AuditLog(Error):", error_message, error_stack || "");
}

async function logUpdateToAuditDb(admin_id: number, action_type: string, target_table: string, target_id: number, details?: string) {
  console.log("AuditLog(Update):", { admin_id, action_type, target_table, target_id, details });
}

// Mount API routes and pass dependencies
app.use(
  "/api",
  createRoutes({
    pool,
    refreshStore,
    signAccessToken,
    signRefreshToken,
    authenticateToken,
    isValidPassword: undefined,
    jwt,
    bcrypt,
    logErrorToAuditDb,
    logUpdateToAuditDb,
  })
);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
