/**
 * middleware/role.middleware.ts
 * ----------------------------------
 * Simple RBAC middleware factory. Must run AFTER `authenticate`, since
 * it relies on req.user being already populated.
 *
 * Usage:
 *   router.delete('/users/:id', authenticate, authorize('admin'), controller.remove);
 *   router.get('/reports', authenticate, authorize('admin', 'govt_officer'), controller.list);
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../shared/enums/user.enums';
import { ApiError } from '../shared/utils/api-error';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(ApiError.forbidden('You do not have permission to perform this action'));
      return;
    }

    next();
  };
}
