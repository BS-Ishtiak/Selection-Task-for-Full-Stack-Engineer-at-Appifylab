import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import createPostsRouter from "../controllers/postsController";
import createAuthRouter from "./auth";

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

export default function createRoutes({ pool, refreshStore, signAccessToken, signRefreshToken, authenticateToken, isValidPassword, jwt, bcrypt, logErrorToAuditDb, logUpdateToAuditDb }: RouteDeps) {
  const router = express.Router();

  // Mount auth routes (signup/login)
  router.use(
    "/auth",
    createAuthRouter({ pool, signAccessToken, signRefreshToken, refreshStore, bcrypt })
  );

  // Mount posts routes (create, feed, single post)
  // The posts router expects an object { pool, authenticateToken }.
  router.use("/posts", createPostsRouter({ pool, authenticateToken } as any));

  // Mount likes routes for comments and replies (posts like handled in posts router)
  try {
    const createLikesRouter = require('../controllers/likesController').default;
    router.use('/', createLikesRouter({ pool, authenticateToken } as any));
  } catch (e: any) {
    console.warn('Could not mount likes router:', e?.message || e);
  }

  // Mount comments routes (create/list comments and replies)
  try {
    const createCommentsRouter = require('../controllers/commentsController').default;
    router.use('/', createCommentsRouter({ pool, authenticateToken } as any));
  } catch (e: any) {
    console.warn('Could not mount comments router:', e?.message || e);
  }

  return router;
}

