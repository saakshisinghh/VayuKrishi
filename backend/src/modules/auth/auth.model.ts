/**
 * modules/auth/auth.model.ts
 * --------------------------------
 * The auth module does not own its own MongoDB collection — credentials
 * and verification status live on the User document (modules/users/user.model.ts),
 * since "a user" and "an account that can log in" are the same entity here.
 *
 * This file re-exports the User model/interface under the auth module so
 * auth's repository/service layers can import from within their own module
 * boundary (`./auth.model`) rather than reaching across into `modules/users`
 * directly, which keeps the module structure the project expects while
 * avoiding a duplicate schema.
 */

export { UserModel, IUser } from '../users/user.model';
