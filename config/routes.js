//Update the name of the controller below and rename the file.
const flights = require("../controllers/flights.js")
const flights = require("../controllers/watchList.js")
module.exports = function(app){

  app.get('/', flights.goHome);
  app.get('/user/login', flights.getLogin);
  app.get('/user/:id', flights.getFlight);
  app.post('/user/:id', appointments.create);
  app.post('/register', flights.register);
  app.post('/login', flights.login);
  app.use(authMiddleware);
  app.get('/myFlights',watchList.myFlights)

}

function authMiddleware(req, res, next){
  if(!req.session.user_id){
    res.redirect("/user_login");
    
  }else{
    next();
  }
}

app.use(authMiddleware);
