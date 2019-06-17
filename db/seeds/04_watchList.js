exports.seed = (knex, Promise) => {
  return knex('watchList').del()
    .then(() => {
      return knex('watchList').insert([
        {user_id: 2, flight_id: 3},
        {user_id: 1, flight_id: 1},
        {user_id: 2, flight_id: 2},
      ]);
    });
};