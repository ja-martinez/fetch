exports.seed = (knex, Promise) => {
  return knex('users').del()
    .then(() => {
      return knex('users').insert([
        {email: 'userone@flightfetch.com', password: "Userone@01"},
        {email: 'usertwo@flightfetch.com', password: "Usertwo@02"},
        {email: 'userthree@flightfetch.com', password: "Userthree@03"},
      ]);
    });
};