const knex = require("../db/knex.js");
const unirest = require('unirest');
let flights = [];

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  home: (req, res) => {
    res.render("index")
  },

  register: (req, res) => {
    res.render('register');
  },

  getFlights: (req, res) => {
    const cabinClass = req.body.cabinClass;
    const adults = req.body.adults;
    const children = req.body.children;
    const infants = req.body.infants;
    const country = req.body.country;
    const currency = req.body.currency;
    const locale = req.body.locale;
    const originPlace = req.body.origin;
    const destinationPlace = req.body.destination;
    const outboundDate = req.body.outboundDate;
    const inboundDate = req.body.inboundDate;

    const flightType = req.body.flightType
    

    unirest.post("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0")
      .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
      .header("X-RapidAPI-Key", "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea")
      .header("Content-Type", "application/x-www-form-urlencoded")
      .send(`cabinClass=${cabinClass}`)
      .send(`children=${children}`)
      .send(`infants=${infants}`)
      .send(`country=${country}`)
      .send(`currency=${currency}`)
      .send(`locale=${locale}`)
      .send(`originPlace=${originPlace}`)
      .send(`destinationPlace=${destinationPlace}`)
      .send(`outboundDate=${outboundDate}`)
      .send(`inboundDate=${inboundDate}`)
      .send(`adults=${adults}`)
      .end(function (result) {
        const sessionKey = result.headers.location.slice(-36);

        unirest.get(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${sessionKey}?sortType=price&sortOrder=asc&pageIndex=0&pageSize=10`)
          .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
          .header("X-RapidAPI-Key", "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea")
          .end(function (result) {
            const itineraries = result.body.Itineraries;
            const legs = result.body.Legs;
            const carriers = result.body.Carriers;
            const agents = result.body.Agents;
            const places = result.body.Places;
            let originId = '';
            let destinationId = '';
            let carrierId = '';

            for (let i = 0; i < itineraries.length; i++) {
              let flight = {};
              const agentId = itineraries[i].PricingOptions[0].Agents[0];
              flight.price = itineraries[i].PricingOptions[0].Price;
              const legId = itineraries[i].OutboundLegId;


              for (let j = 0; j < legs.length; j++) {
                if (legs[j].Id === legId) {
                  originId = legs[j].OriginStation;
                  destinationId = legs[j].DestinationStation;
                  flight.departureTime = legs[j].Departure;
                  flight.arrivalTime = legs[j].Arrival;
                  flight.duration = legs[j].Duration;
                  flight.numStops = legs[j].Stops.length;
                  carrierId = legs[j].FlightNumbers[0].CarrierId;
                  flight.flightNumber = legs[j].FlightNumbers[0].FlightNumber;
                  break;
                }
              }

              for (let j = 0; j < carriers.length; j++) {
                if (carriers[j].Id === carrierId) {
                  flight.carrierName = carriers[j].Name;
                  flight.carrierImgUrl = carriers[j].ImageUrl
                  break;
                }
              }

              for (let j = 0; j < agents.length; j++) {
                if (agents[j].Id === agentId) {
                  flight.agentName = agents[j].Name;
                  flight.agentImgUrl = agents[j].ImageUrl;
                  break;
                }
              }

              for (let j = 0; j < places.length; j++) {
                if (places[j].Id === originId) {
                  flight.originName = places[j].Name;
                } else if (places[j].Id === destinationId) {
                  flight.destinationName = places[j].Name;
                }

              }
              flights.push(flight);
            }
            res.render("flights", {flights: flights});
          });
      })
  }
}