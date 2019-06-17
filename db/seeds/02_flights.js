exports.seed = (knex, Promise) => {
  return knex('flights').del()
    .then(() => {
      return knex('flights').insert([
        {flightNumber: 2315, from: "Phoenix", to: "New York", currentPrice: 108, duration: 4},
        {flightNumber: 1115, from: "Phoenix", to: "León", currentPrice: 292, duration: 18},
        {flightNumber: 2315, from: "Phoenix", to: "Buchanna", currentPrice: 250, duration: 6},
      ]);
    });
};