import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectDB = async (ovverride: any = {}): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions("development")),
    ...ovverride,
    name: "default",
  });
