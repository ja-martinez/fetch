const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
var knex = require('../db/knex.js');

module.exports = function(app){
  const store = new KnexSessionStore({
      knex: knex,
      tablename: 'sessions' // optional. Defaults to 'sessions'
  });


  app.use(session({
      secret: 'keyboard cat',
      cookie: {
          maxAge: 259200000 // 30 days
      },
      resave: false,
      saveUninitialized: false,
      store: store
  }));
}
