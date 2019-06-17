exports.up = (knex, Promise) => {
  return knex.schema.createTable("users", table => {
    table.increments().notNullable();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.timestamps(true, true)
  })
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable("users")
};