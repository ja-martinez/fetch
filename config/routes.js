//Update the name of the controller below and rename the file.
const flights = require("../controllers/flights.js")
const watchList = require("../controllers/watchList.js")
module.exports = function(app){

  app.get('/', flights.goHome);
  // app.get('/fetch/flights', flights.getFlights);
  // app.get('/fetch/flights/:id', flights.getOne);
  // app.get('/login', flights.getLogin);
  // app.get('/fetch/cart', flights.getCart);
  // app.get('/fetch/checkout', flights.getCheckout)
  // app.post('/login', flights.login);
  // app.post('/register', flights.register);
  // app.use(authMiddleware);
  // app.post('/fetch/checkout', flights.purchase)
  // app.get('/myFlights',watchList.myFlights)
  // app.post('/fetch/flights/:id', watchList.Add);
}

function authMiddleware(req, res, next){
  if(!req.session.user_id){
    res.redirect("/user_login");
    
  }else{
    next();
  }
}

// app.use(authMiddleware);
