import { Connection } from "typeorm";
import { connectDB } from "../src/connectDB";

export const connectTestDB = async (): Promise<Connection> =>
  connectDB("development", {
    host: "localhost",
    username: "user",
    password: "pass",
    database: "test",
    dropSchema: true,
  });
