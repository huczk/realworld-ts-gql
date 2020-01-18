import { Connection } from "typeorm";
import { connectDB } from "../src/connectDB";

export const connectTestDB = async (): Promise<Connection> =>
  connectDB("development", {
    host: "127.0.0.1",
    username: "root",
    password: "",
    database: "test",
    dropSchema: true,
  });
