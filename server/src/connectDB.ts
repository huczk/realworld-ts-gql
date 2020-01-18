import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectDB = async (
  type?: "development" | "production",
  override: any = {},
): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions(
      type || process.env.NODE_ENV || "development",
    )),
    ...override,

    name: "default",
  });
