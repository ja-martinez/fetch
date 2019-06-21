const knex = require("../db/knex.js");
const unirest = require('unirest');
let flights = [];
let query = {};

module.exports = {

  home: (req, res) => {
    res.render("index")
  },

  getRegister: (req, res) => {
    res.render('register');
  },

  register: (req, res) => {
    knex('users')
      .insert([{
        email: req.body.email,
        password: req.body.password
      }])
      .then(() => {
        res.redirect('/')
      })
  },

  login: (req, res) => {
    knex('users')
      .where({
        email: req.body.email
      })
      .then(result => {
        let user = result[0];
        if (user.password === req.body.password) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.redirect('/')
        }
      })
  },

  error: (req, res) => {
    res.render('server-crash');
  },

  addToWatchlist: (req, res) => {
    knex('flights')
      .insert([query], ['id'])
      .then((flightId) => {
        flightId = flightId[0].id;
        knex('watchList')
          .insert([{user_id: req.session.user.id, flight_id: flightId}])
          .then(() => {
            res.redirect('/');
          })
      })
  },

  getWatchlist: (req, res) => {
    knex.select('flight_id')
      .from('watchlist')
      .where('user_id', req.session.user.id)
      .then(flight_ids => {
        flight_id = flight_id[0].flight_id;
        knex.select('*')
          .from('prices')
          .where('flight_id', flight_id)
          .fullOuterJoin('flights', 'prices.flight_id', 'flights.id')
          .then(flights => {
            res.render('watchlist', {flights: flights})
          })
      })
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

    query.cabinClass = req.body.cabinClass;
    query.adults = req.body.adults;
    query.children = req.body.children;
    query.infants = req.body.infants;
    query.country = req.body.country;
    query.currency = req.body.currency;
    query.locale = req.body.locale;
    query.originPlace = req.body.origin;
    query.destinationPlace = req.body.destination;
    query.outboundDate = req.body.outboundDate;
    query.inboundDate = req.body.inboundDate;

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
        if (result.body.ValidationErrors) {
          res.redirect('/error');
          return false;
        }
        const sessionKey = result.headers.location.slice(-36);

        setTimeout(() => {
          unirest.get(`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${sessionKey}?sortType=price&sortOrder=asc&pageIndex=0&pageSize=10`)
            .header("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
            .header("X-RapidAPI-Key", "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea")
            .end(function (result) {
              const itineraries = result.body.Itineraries;
              const legs = result.body.Legs;
              const carriers = result.body.Carriers;
              const agents = result.body.Agents;
              const places = result.body.Places;
              const segments = result.body.Segments;

              let flights = [];

              if (flightType === 'one-way') {
                let originId = '';
                let destinationId = '';

                for (let i = 0; i < itineraries.length; i++) {
                  let flight = {};
                  flight.isRound = false;
                  flight.legs = [];
                  const agentId = itineraries[i].PricingOptions[0].Agents[0];
                  let price = itineraries[i].PricingOptions[0].Price;
                  flight.price = Number.parseFloat(price).toFixed(2);
                  const legId = itineraries[i].OutboundLegId;

                  for (let j = 0; j < agents.length; j++) {
                    if (agents[j].Id === agentId) {
                      flight.agentName = agents[j].Name;
                      flight.agentImgUrl = agents[j].ImageUrl;
                    }
                  }

                  for (let j = 0; j < legs.length; j++) {
                    if (legs[j].Id === legId) {
                      originId = legs[j].OriginStation;
                      destinationId = legs[j].DestinationStation;
                      flight.departure = legs[j].Departure;
                      flight.arrival = legs[j].Arrival;
                      flight.duration = legs[j].Duration;
                      flight.numStops = legs[j].Stops.length;
                      segmentIds = legs[j].SegmentIds;
                    }
                  }



                  for (let j = 0; j < segments.length; j++) {
                    for (let k = 0; k < segmentIds.length; k++) {
                      if (segments[j].Id === segmentIds[k]) {
                        let leg = {};
                        leg.originId = segments[j].OriginStation;
                        leg.destinationId = segments[j].DestinationStation;
                        leg.departure = segments[j].DepartureDateTime;
                        leg.arrival = segments[j].DepartureDateTime;
                        leg.duration = segments[j].Duration
                        leg.carrierId = segments[j].Carrier
                        leg.flightNumber = segments[j].FlightNumber;
                        flight.legs.push(leg);
                      }
                    }
                  }

                  for (let j = 0; j < carriers.length; j++) {
                    for (let k = 0; k < flight.legs.length; k++) {
                      if (carriers[j].Id === flight.legs[k].carrierId) {
                        flight.legs[k].carrierName = carriers[j].Name;
                        flight.legs[k].carrierImgUrl = carriers[j].ImageUrl
                        delete flight.legs[k].carrierId
                      }
                    }
                  }

                  for (let j = 0; j < places.length; j++) {
                    if (places[j].Id === originId) {
                      flight.origin = places[j].Name;
                    }
                    if (places[j].Id === destinationId) {
                      flight.destination = places[j].Name;
                    }
                    for (let k = 0; k < flight.legs.length; k++) {
                      if (places[j].Id === flight.legs[k].originId) {
                        flight.legs[k].origin = places[j].Name;
                        delete flight.legs[k].originId;
                      }
                      if (places[j].Id === flight.legs[k].destinationId) {
                        flight.legs[k].destination = places[j].Name;
                        delete flight.legs[k].destinationId
                      }
                    }
                  }

                  flight.flyingTime = 0;
                  for (let j = 0; j < flight.legs.length; j++) {
                    flight.flyingTime += flight.legs[j].duration;
                  }
                  flight.layoverTime = flight.duration - flight.flyingTime;

                  flights.push(flight);
                }
              } else if (flightType === 'round') {
                let outboundOriginId = '';
                let inboundOriginId = '';
                let outboundDestinationId = '';
                let inboundDestinationId = '';


                for (let i = 0; i < itineraries.length; i++) {
                  let flight = {};
                  flight.isRound = true;
                  flight.outboundLegs = [];
                  flight.inboundLegs = [];
                  const agentId = itineraries[i].PricingOptions[0].Agents[0];
                  flight.price = itineraries[i].PricingOptions[0].Price;
                  const outboundLegId = itineraries[i].OutboundLegId;
                  const inboundLegId = itineraries[i].InboundLegId;

                  for (let j = 0; j < agents.length; j++) {
                    if (agents[j].Id === agentId) {
                      flight.agentName = agents[j].Name;
                      flight.agentImgUrl = agents[j].ImageUrl;
                    }
                  }

                  for (let j = 0; j < legs.length; j++) {
                    if (legs[j].Id === outboundLegId) {
                      outboundOriginId = legs[j].OriginStation;
                      outboundDestinationId = legs[j].DestinationStation;
                      flight.outboundDeparture = legs[j].Departure;
                      flight.outboundArrival = legs[j].Arrival;
                      flight.outboundDuration = legs[j].Duration;
                      flight.outboundNumStops = legs[j].Stops.length;
                      outboundSegmentIds = legs[j].SegmentIds;
                    } else if (legs[j].Id === inboundLegId) {
                      inboundOriginId = legs[j].OriginStation;
                      inboundDestinationId = legs[j].DestinationStation;
                      flight.inboundDeparture = legs[j].Departure;
                      flight.inboundArrival = legs[j].Arrival;
                      flight.inboundDuration = legs[j].Duration;
                      flight.inboundNumStops = legs[j].Stops.length;
                      inboundSegmentIds = legs[j].SegmentIds;
                    }
                  }



                  for (let j = 0; j < segments.length; j++) {
                    for (let k = 0; k < outboundSegmentIds.length; k++) {
                      if (segments[j].Id === outboundSegmentIds[k]) {
                        let leg = {};
                        leg.originId = segments[j].OriginStation;
                        leg.destinationId = segments[j].DestinationStation;
                        leg.departure = segments[j].DepartureDateTime;
                        leg.arrival = segments[j].DepartureDateTime;
                        leg.duration = segments[j].Duration
                        leg.carrierId = segments[j].Carrier
                        leg.flightNumber = segments[j].FlightNumber;
                        flight.outboundLegs.push(leg);
                      }
                    }
                    for (let k = 0; k < inboundSegmentIds.length; k++) {
                      if (segments[j].Id === inboundSegmentIds[k]) {
                        let leg = {};
                        leg.originId = segments[j].OriginStation;
                        leg.destinationId = segments[j].DestinationStation;
                        leg.departure = segments[j].DepartureDateTime;
                        leg.arrival = segments[j].DepartureDateTime;
                        leg.duration = segments[j].Duration
                        leg.carrierId = segments[j].Carrier
                        leg.flightNumber = segments[j].FlightNumber;
                        flight.inboundLegs.push(leg);
                      }
                    }
                  }

                  for (let j = 0; j < carriers.length; j++) {
                    for (let k = 0; k < flight.outboundLegs.length; k++) {
                      if (carriers[j].Id === flight.outboundLegs[k].carrierId) {
                        flight.outboundLegs[k].carrierName = carriers[j].Name;
                        flight.outboundLegs[k].carrierImgUrl = carriers[j].ImageUrl
                        delete flight.outboundLegs[k].carrierId
                      }
                    }
                    for (let k = 0; k < flight.inboundLegs.length; k++) {
                      if (carriers[j].Id === flight.inboundLegs[k].carrierId) {
                        flight.inboundLegs[k].carrierName = carriers[j].Name;
                        flight.inboundLegs[k].carrierImgUrl = carriers[j].ImageUrl
                        delete flight.inboundLegs[k].carrierId
                      }
                    }
                  }

                  for (let j = 0; j < places.length; j++) {
                    if (places[j].Id === outboundOriginId) {
                      flight.outboundOrigin = places[j].Name;
                    }
                    if (places[j].Id === outboundDestinationId) {
                      flight.outboundDestination = places[j].Name;
                    }
                    if (places[j].Id === inboundOriginId) {
                      flight.inboundOrigin = places[j].Name;
                    }
                    if (places[j].Id === inboundDestinationId) {
                      flight.inboundDestination = places[j].Name;
                    }
                    for (let k = 0; k < flight.outboundLegs.length; k++) {
                      if (places[j].Id === flight.outboundLegs[k].originId) {
                        flight.outboundLegs[k].origin = places[j].Name;
                        delete flight.outboundLegs[k].originId;
                      }
                      if (places[j].Id === flight.outboundLegs[k].destinationId) {
                        flight.outboundLegs[k].destination = places[j].Name;
                        delete flight.outboundLegs[k].destinationId
                      }
                    }
                    for (let k = 0; k < flight.inboundLegs.length; k++) {
                      if (places[j].Id === flight.inboundLegs[k].originId) {
                        flight.inboundLegs[k].origin = places[j].Name;
                        delete flight.inboundLegs[k].originId;
                      }
                      if (places[j].Id === flight.inboundLegs[k].destinationId) {
                        flight.inboundLegs[k].destination = places[j].Name;
                        delete flight.inboundLegs[k].destinationId;
                      }
                    }
                  }

                  flight.outboundFlyingTime = 0;
                  flight.inboundFlyingTime = 0;

                  for (let j = 0; j < flight.outboundLegs.length; j++) {
                    flight.outboundFlyingTime += flight.outboundLegs[j].duration;
                  }
                  flight.outboundLayoverTime = flight.duration - flight.outboundFlyingTime;

                  for (let j = 0; j < flight.inboundLegs.length; j++) {
                    flight.inboundFlyingTime += flight.inboundLegs[j].duration;
                  }
                  flight.inboundLayoverTime = flight.duration - flight.inboundFlyingTime;

                  flights.push(flight);
                }
              }
              res.render('flights', {
                flights: flights
              })
            })
        }, 5000)
      });
  },

  getOne: (req, res) => {
    res.render('singleflight', {
      flight: flights[req.params.flightsIndex]
    })
  }
}