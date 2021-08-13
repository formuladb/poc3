const SnakeNamingStrategy = require('typeorm-naming-strategies')
   .SnakeNamingStrategy;

module.exports = {
   name: 'development',
   type: 'postgres',
   password: "postgres",
   host: 'db',
   port: 5432,
   namingStrategy: new SnakeNamingStrategy(),
}
