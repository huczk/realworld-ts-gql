import { Request } from "express";
import { sign, verify } from "jsonwebtoken";
import { IContext } from "./types";

export const createToken = ({ id }: { id: number }): string =>
  sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

const getToken = (req: Request): string | undefined =>
  req.headers.authorization && req.headers.authorization.split(" ")[1];

const getUserfromToken = (token?: string): IContext["user"] => {
  let user;

  try {
    user = token
      ? (verify(token, process.env.JWT_SECRET as string) as IContext["user"])
      : undefined;
  } catch (e) {}

  return user;
};

export const getContext = (req: Request): IContext => {
  const token = getToken(req);
  const user = getUserfromToken(token);

  return user
    ? {
        token,
        user,
      }
    : {};
};
