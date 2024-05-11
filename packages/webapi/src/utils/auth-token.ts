import jwt from "jsonwebtoken";
import { UserDocument } from "../models/User";
import { isTokenBlacklisted } from "../services/tokenService";  // Import the service to interact with the blacklist

const JWT_KEY = "ThisIsJustAnotherJWTKey";

export interface AuthTokenContents {
  user: {
    id: string;
  };
}

export function signAuthToken(user: UserDocument): string {
  const contents: AuthTokenContents = {
    user: {
      id: user.id,
    },
  };
  return jwt.sign(contents, JWT_KEY);
}

export async function validateAuthToken(token: string): Promise<AuthTokenContents> {
  if (await isTokenBlacklisted(token)) {
    throw new Error('Token has been revoked');
  }
  return jwt.verify(token, JWT_KEY) as AuthTokenContents;
}
