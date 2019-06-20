//Update the name of the controller below and rename the file.
const flights = require("../controllers/flights.js")
const watchList = require("../controllers/watchList.js")
module.exports = function(app){

  app.get('/', flights.home);
  app.post('/flights/search', flights.getFlights);
  app.get('/flights/:flightsIndex', flights.getOne);
  app.get('/register', flights.getRegister);
  app.get('/error', flights.error)
  // app.get('/cart', flights.getCart);
  // app.get('/checkout', flights.getCheckout)
  app.post('/login', flights.login);
  app.post('/register', flights.register);
  // app.use(authMiddleware);
  // app.post('/checkout', flights.purchase)
  // app.get('/myFlights',watchList.myFlights)
  // app.post('/flights/:origin/:destination/:date', watchList.Add);
}

function authMiddleware(req, res, next){
  if(!req.session.user){
    res.redirect("/user_login");
    
  }else{
    next();
  }
}

// app.use(authMiddleware);
