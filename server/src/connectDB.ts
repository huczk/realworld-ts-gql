import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectDB = async (dropSchema = false): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions(process.env.NODE_ENV || "development")),
    dropSchema,
    name: "default",
  });
