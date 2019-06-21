//Update the name of the controller below and rename the file.
const flights = require("../controllers/flights.js")
const watchList = require("../controllers/watchList.js")
module.exports = function(app){

  app.get('/', flights.home);
  app.post('/flights/search', flights.getFlights(app));
  //app.get('/flights/:flightsIndex', flights.getOne(app));
  app.get('/register', flights.getRegister);
  app.get('/error', flights.error);
  app.post('/login', flights.login);
  app.post('/register', flights.register);
  app.use(authMiddleware);
  app.post('/flights/add-to-watchlist', flights.addToWatchlist(app));
  app.get('/myFlights',flights.getWatchlist)
}

function authMiddleware(req, res, next){
  if(!req.session.user){
    res.redirect("/");
  }else{
    next();
  }
}

// app.use(authMiddleware);
