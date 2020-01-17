import { Connection, createConnection } from "typeorm";

export const connectTestDB = async (): Promise<Connection> =>
  createConnection({
    name: "development",
    type: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: "",
    database: "test",
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber",
    },
  });
