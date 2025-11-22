import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";

interface SignupBody {
  name: string;
  email: string;
  password: string;
}
interface SignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function isValidPassword(pw: string) {
  // at least 8 chars, uppercase, lowercase, number, special
  return /(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(pw);
}

export default function createRoutes(pool: Pool) {
  const router = express.Router();

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

      if (!isValidPassword(password)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: null,
          errors: [
            "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
          ],
        });
      }

      const hashed = await bcrypt.hash(password, 10);
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
        return res.status(500).json({
          success: false,
          data: null,
          message: null,
          errors: ["Server error"],
        });
      }
    }
  );

  return router;
}
