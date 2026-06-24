import { Request, Response, NextFunction } from "express";
import { UserRole } from "../shared/enums/user.enums";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

export const requireAuth = authenticate;

export const requireRole = (...roles: string[]) =>
  authorize(...(roles as UserRole[]));
