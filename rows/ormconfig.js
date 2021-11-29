const SnakeNamingStrategy = require('typeorm-naming-strategies')
   .SnakeNamingStrategy;

const database = {
   development: 'dev',
   production: 'postgres',
   test: 'test'
}

module.exports = {
   name: 'default',
   type: 'postgres',
   username: "postgres",
   password: "postgres",
   database: database[process.env.NODE_ENV],
   host: 'db',
   port: 5432,
   namingStrategy: new SnakeNamingStrategy(),
   logging: true,
   extra: { max: 10 },
   entities: [
      "../pages/src/core/entity/*.ts",
      "src/apps/*/entity/*.ts",
      "src/apps/*/*/entity/*.ts",
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/core-orm/SetTenantSubscriber.ts",
   ],
}
