const SnakeNamingStrategy = require('typeorm-naming-strategies')
   .SnakeNamingStrategy;

module.exports = {
   name: 'development',
   type: 'postgres',
   host: 'localhost',
   port: 5432,

   namingStrategy: new SnakeNamingStrategy(),

   "synchronize": true,
   "logging": false,
   "entities": [
      "src/core/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],

}
