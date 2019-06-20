exports.up = (knex, Promise) => {
    return knex.schema.createTable("flights", table => {
        table.increments().notNullable();
        table.string('cabinClass');
        table.integer('adults');
        table.integer('children');
        table.integer('infants');
        table.string('country');
        table.string('currency');
        table.string('locale');
        table.string('originPlace');
        table.string('destinationPlace');
        table.string('outboundDate');
        table.string('inboundDate');
        table.timestamps(true, true)
    })
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable("flights")
  };