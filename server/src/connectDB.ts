import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectDB = async (): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions(process.env.NODE_ENV || "development")),
    name: "default",
  });
