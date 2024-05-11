import jwt from "jsonwebtoken";
import { UserDocument } from "../models/User";
import { SessionDocument } from "../models/Session";

const JWT_KEY = "ThisIsJustAnotherJWTKey";

export interface AuthTokenContents {
  user: string;
  session: string;
}

export function signAuthToken(user: UserDocument, session: SessionDocument): string {
  const contents: AuthTokenContents = {
    user: user.id,
    session: session.id,
  };
  return jwt.sign(contents, JWT_KEY);
}

export async function validateAuthToken(token: string): Promise<AuthTokenContents> {
  return jwt.verify(token, JWT_KEY) as AuthTokenContents;
}
