import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";

type SignupBody = { firstName: string; lastName: string; email: string; password: string };
type LoginBody = { email: string; password: string };

type AccessTokenPayload = { id: number; email: string; name?: string; role: string };
type RefreshTokenPayload = { id: number; email: string; role: string };

type RouteDeps = {
  pool: Pool;
  refreshStore: Set<string>;
  signAccessToken: (payload: AccessTokenPayload) => string;
  signRefreshToken: (payload: RefreshTokenPayload) => string;
  authenticateToken?: (req: Request, res: Response, next: NextFunction) => void;
  isValidPassword?: (password: string) => boolean;
  jwt?: any;
  bcrypt?: any;
  logErrorToAuditDb?: (error_message: string, error_stack?: string) => Promise<void>;
  logUpdateToAuditDb?: (admin_id: number, action_type: string, target_table: string, target_id: number, details?: string) => Promise<void>;
};

function defaultIsValidPassword(pw: string) {
  return /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(pw);
}

export default function createRoutes({ pool, refreshStore, signAccessToken, signRefreshToken, isValidPassword, jwt, bcrypt, logErrorToAuditDb, logUpdateToAuditDb }: RouteDeps) {
  const router = express.Router();

  const checkPassword = isValidPassword || defaultIsValidPassword;

  // Signup
  router.post(
    "/signup",
    async (req: Request<{}, {}, SignupBody & { role?: string }>, res: Response) => {
      const { firstName, lastName, email, password, role } = req.body;
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          data: null,
          message: null,
          errors: ["firstName, lastName, email, password are required"],
        });
      }

      if (!checkPassword(password)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: null,
          errors: [
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
          ],
        });
      }

      const hasher = (bcrypt && bcrypt.hash) ? bcrypt : bcrypt;
      const hashed = await hasher.hash(password, 10);
      try {
        await pool.query(
          "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5)",
          [firstName, lastName, email, hashed, role || "user"]
        );
        return res.json({
          success: true,
          data: null,
          message: "User registered successfully!",
          errors: null,
        });
      } catch (err: any) {
        if (err?.code === "23505") {
          return res.status(400).json({
            success: false,
            data: null,
            message: null,
            errors: ["Email already exists!"],
          });
        }
        console.error("Signup error:", err?.message || err);
        if (logErrorToAuditDb) await logErrorToAuditDb(err?.message || String(err), err?.stack);
        return res.status(500).json({
          success: false,
          data: null,
          message: null,
          errors: ["Server error"],
        });
      }
    }
  );

  // Login
  router.post("/login", async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        data: null,
        message: null,
        errors: ["email and password are required"],
      });
    }

    try {
      const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({
          success: false,
          data: null,
          message: null,
          errors: ["User not found!"],
        });
      }

      const user = result.rows[0] as any; // id, first_name, last_name, email, password, role
      const comparer = (bcrypt && bcrypt.compare) ? bcrypt : bcrypt;
      const ok = await comparer.compare(password, user.password);
      if (!ok) {
        return res.status(400).json({
          success: false,
          data: null,
          message: null,
          errors: ["Invalid password!"],
        });
      }

      const name = (user.first_name || user.name) ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : undefined;
      const accessToken = signAccessToken({ id: user.id, email: user.email, name, role: user.role || "user" });
      const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role || "user" });
      refreshStore.add(refreshToken);

      return res.json({
        success: true,
        data: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email, role: user.role },
        message: "Access and refresh tokens generated",
        accessToken,
        refreshToken,
        errors: null,
      });
    } catch (err: any) {
      console.error("Login error:", err?.message || err);
      if (logErrorToAuditDb) await logErrorToAuditDb(err?.message || String(err), err?.stack);
      return res.status(500).json({ success: false, data: null, message: null, errors: ["Server error"] });
    }
  });

  return router;
}
