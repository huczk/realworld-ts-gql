module.exports = {
  name: "default",
  type: "mysql",
  host: "localhost",
  username: "root",
  password: "root",
  database: "test",
  synchronize: true,
  retryAttempts: 2,
  retryDelay: 1000,
  logging: true,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
