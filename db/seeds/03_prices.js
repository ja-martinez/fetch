exports.seed = (knex, Promise) => {
  return knex('prices').del()
    .then(() => {
      return knex('prices').insert([
        {flight_id: 3, price: 742, time: 6},
        {flight_id: 1, price: 399, time: 4},
        {flight_id: 2, price: 592, time: 12},
      ]);
    });
};