import jwt from "jsonwebtoken";
import { AuthPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
const JWT_EXPIRES_IN = "2h";

export const signJwt = (payload: AuthPayload): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyJwt = (token: string): AuthPayload =>
  jwt.verify(token, JWT_SECRET) as AuthPayload;
