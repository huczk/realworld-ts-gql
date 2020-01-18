import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectDB = async (
  connName?: "production" | "development",
  override?: any,
): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions(
      connName || process.env.NODE_ENV || "development",
    )),
    ...override,
    name: "default",
  });
