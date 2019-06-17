exports.up = (knex, Promise) => {
    return knex.schema.createTable("watchList", table => {
        table.increments();
        table.integer("user_id")
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index();
        table.integer("flight_id")
        .notNullable()
        .references('id')
        .inTable('flights')
        .onDelete('CASCADE')
        .index();
        table.timestamps(true, true);
    })

  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable("watchList")
  };