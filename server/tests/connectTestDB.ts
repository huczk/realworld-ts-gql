import { Connection } from "typeorm";
import { connectDB } from "../src/connectDB";

export const connectTestDB = async (): Promise<Connection> =>
  connectDB("development", {
    dropSchema: true,
    host: "localhost",
    username: "realworld",
    password: "realworld",
    database: "test",
  });
