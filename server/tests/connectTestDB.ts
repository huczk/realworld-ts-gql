import { Connection } from "typeorm";
import { connectDB } from "../src/connectDB";

export const connectTestDB = async (): Promise<Connection> =>
  connectDB("development", {
    host: "localhost",
    username: "realworld",
    password: "realworld",
    database: "test",
    synchronize: true,
    retryAttempts: 2,
    retryDelay: 1000,
  });
