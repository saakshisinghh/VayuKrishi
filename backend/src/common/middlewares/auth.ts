import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";
import { AuthenticatedUserPayload } from "../../shared/types/express.types";
import { UserRole } from "../../shared/enums/user.enums";

// Re-use Phase 2's global type — no redefinition needed.
// req.user is already typed as AuthenticatedUserPayload via the global augmentation.
export type AuthPayload = AuthenticatedUserPayload;
export type AuthRequest = Request; // req.user already available globally

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return ApiResponse.error(res, "Authentication token missing", 401);
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return ApiResponse.error(res, "Invalid or expired token", 401);
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return ApiResponse.error(res, "Authentication required", 401);
  }
  if (req.user.role !== UserRole.ADMIN) {
    return ApiResponse.error(res, "Admin access required", 403);
  }
  next();
};