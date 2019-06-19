//Update the name of the controller below and rename the file.
const flights = require("../controllers/flights.js")
const watchList = require("../controllers/watchList.js")
module.exports = function(app){

  app.get('/', flights.home);
  // app.get('/flights/search"', flights.getFlights);
  // app.get('/flights/:carrier/:flightNumber', flights.getOne);
  // app.get('/login', flights.getLogin);
  // app.get('/cart', flights.getCart);
  // app.get('/checkout', flights.getCheckout)
  // app.post('/login', flights.login);
  // app.post('/register', flights.register);
  // app.use(authMiddleware);
  // app.post('/checkout', flights.purchase)
  // app.get('/myFlights',watchList.myFlights)
  // app.post('/flights/:origin/:destination/:date', watchList.Add);
}

function authMiddleware(req, res, next){
  if(!req.session.user_id){
    res.redirect("/user_login");
    
  }else{
    next();
  }
}

// app.use(authMiddleware);
