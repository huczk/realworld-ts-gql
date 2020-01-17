import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectDB = async (
  dropSchema = false,
  optionName = process.env.NODE_ENV || "development",
): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions(optionName)),
    dropSchema,
    name: "default",
  });
