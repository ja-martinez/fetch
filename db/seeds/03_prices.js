exports.seed = (knex, Promise) => {
  return knex('prices').del()
    .then(() => {
      return knex('prices').insert([
        {flight_id: 3, price: 742},
        {flight_id: 1, price: 399},
        {flight_id: 2, price: 592},
      ]);
    });
};