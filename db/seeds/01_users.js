exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([
        {name: "userone", email: 'userone@flightfetch.com', password: "Userone@01"},
        {name: "usertwo", email: 'usertwo@flightfetch.com', password: "Usertwo@02"},
        {name: "userthree", email: 'userthree@flightfetch.com', password: "Userthree@03"},
      ]);
    });
};