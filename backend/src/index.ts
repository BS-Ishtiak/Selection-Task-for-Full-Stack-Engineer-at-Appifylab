import express from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import { corsMiddleware } from "./middleware/middleware";
import createRoutes from "./routes/routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(corsMiddleware);

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

// Mount API routes and pass the DB pool
app.use("/api", createRoutes(pool));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
