exports.up = (knex, Promise) => {
    return knex.schema.createTable("flights", table => {
        table.increments().notNullable();
        table.integer("flightNumber").notNullable();
        table.string("from").notNullable();
        table.string("to").notNullable();
        table.integer("currentPrice").notNullable();
        table.integer("duration").notNullable();
        table.timestamps(true, true)
    })
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable("flights")
  };