import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connectTestDB = async (): Promise<Connection> =>
  createConnection({
    ...(await getConnectionOptions()),
    name: "default",
  });
