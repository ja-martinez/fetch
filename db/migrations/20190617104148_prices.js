exports.up = (knex, Promise) => {
    return knex.schema.createTable("prices", table => {
        table.increments()
        table.integer("flight_id")
        .notNullable()
        .references('id')
        .inTable('flights')
        .onDelete('CASCADE')
        .index();
        table.float("price").notNullable();
        table.timestamps(true, true)
    })
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable("prices")
  };