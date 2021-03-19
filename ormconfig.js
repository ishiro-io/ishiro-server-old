module.exports = {
  type: "postgres",
  url: process.env.PRODUCTION_DATABASE_URL,
  entities: ["libs/database/src/entities/*.ts"],
  migrationsTableName: "migration_table",
  cache: true,
  migrations: ["migrations/*.ts"],
  cli: {
    migrationsDir: "migrations",
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};
