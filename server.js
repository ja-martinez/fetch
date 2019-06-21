const express = require("express");
const unirest = require('unirest');
const knex = require("./db/knex.js");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
//app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, "public")));

require('./config/sessions')(app);

app.set('view engine', 'ejs');

var routes_setter = require('./config/routes.js');
routes_setter(app);

setInterval(() => {
  knex('flights')
    .then(queries => {
      queries.forEach(query => {

        unirest.post("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0")
          .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
          .header("X-RapidAPI-Key", "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea")
          .header("Content-Type", "application/x-www-form-urlencoded")
          .send(`cabinClass=${query.cabinClass}`)
          .send(`children=${query.children}`)
          .send(`infants=${query.infants}`)
          .send(`country=${query.country}`)
          .send(`currency=${query.currency}`)
          .send(`locale=${query.locale}`)
          .send(`originPlace=${query.originPlace}`)
          .send(`destinationPlace=${query.destinationPlace}`)
          .send(`outboundDate=${query.outboundDate}`)
          .send(`inboundDate=${query.inboundDate}`)
          .send(`adults=${query.adults}`)
          .end(function (result) {
            if (result.body.ValidationErrors) {
              console.log('Oh no! Server Overload');
              return false;
            }
            const sessionKey = result.headers.location.slice(-36);

            unirest.get(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${sessionKey}?sortType=price&sortOrder=asc&pageIndex=0&pageSize=10`)
              .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
              .header("X-RapidAPI-Key", "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea")
              .end(function (result) {
                const price = result.body.Itineraries[0].PricingOptions[0].Price;
                knex('prices')
                  .insert([{flight_id: query.id, price: price}], ['price'])
                  .then(() => {
                    console.log(`price: ${price}`)
                    
                  })
              })
          });
      })
    })
}, 60000)

app.listen(port, function () {
  console.log('Listening on', port);
});