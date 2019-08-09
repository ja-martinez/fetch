const knex = require("../db/knex.js");
const unirest = require("unirest");
let query = {};

module.exports = {
  home: (req, res) => {
    res.render("index", { user: req.session.user });
  },

  getRegister: (req, res) => {
    res.render("register");
  },

  register: (req, res) => {
    knex("users")
      .insert([
        {
          email: req.body.email,
          password: req.body.password
        }
      ])
      .then(() => {
        res.redirect("/");
      });
  },

  login: (req, res) => {
    knex("users")
      .where({
        email: req.body.email
      })
      .then(result => {
        let user = result[0];
        if (user.password === req.body.password) {
          req.session.user = user;
          res.redirect("/");
        } else {
          res.redirect("/");
        }
      });
  },

  logout: (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          console.error(err);
        } else {
          res.redirect("/");
        }
      });
    }
  },

  error: (req, res) => {
    res.render("server-crash");
  },

  addToWatchlist: app => {
    return (req, res) => {
      knex("flights")
        .insert(app.get("query"), ["id"])
        .then(flightId => {
          flightId = flightId[0].id;
          knex("watchList")
            .insert([
              {
                user_id: req.session.user.id,
                flight_id: flightId
              }
            ])
            .then(() => {
              res.redirect("/");
            });
        });
    };
  },

  getWatchlist: (req, res) => {
    knex("watchList")
      .where("user_id", req.session.user.id)
      .rightJoin("flights", "watchList.flight_id", "flights.id")
      .then(flights => {
        let flightsCount = 0;
        let flightsArray = [];
        flights.forEach(flight => {
          let outbound = {};
          outbound.year = parseInt(flight.outboundDate.slice(0, 4));
          outbound.month = parseInt(flight.outboundDate.slice(5, 7));
          outbound.day = parseInt(flight.outboundDate.slice(8));
          let outboundDate = new Date(
            outbound.year,
            outbound.month - 1,
            outbound.day
          );

          let dateMinus1 = new Date(
            outbound.year,
            outbound.month - 1,
            outbound.day
          );
          let dateMinus2 = new Date(
            outbound.year,
            outbound.month - 1,
            outbound.day
          );
          let datePlus1 = new Date(
            outbound.year,
            outbound.month - 1,
            outbound.day
          );
          let datePlus2 = new Date(
            outbound.year,
            outbound.month - 1,
            outbound.day
          );

          dateMinus1.setDate(outboundDate.getDate() - 1);
          dateMinus2.setDate(outboundDate.getDate() - 2);
          datePlus1.setDate(outboundDate.getDate() + 1);
          datePlus2.setDate(outboundDate.getDate() + 2);

          let outboundMinus1 = {};
          let outboundMinus2 = {};
          let outboundPlus1 = {};
          let outboundPlus2 = {};

          outbound.year = outbound.year.toString();
          outbound.month = outbound.month.toString().padStart(2, "0");
          outbound.day = outbound.day.toString().padStart(2, "0");

          outboundMinus1.year = dateMinus1.getFullYear().toString();
          outboundMinus1.month = (dateMinus1.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          outboundMinus1.day = dateMinus1
            .getDate()
            .toString()
            .padStart(2, "0");

          outboundMinus2.year = dateMinus2.getFullYear().toString();
          outboundMinus2.month = (dateMinus2.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          outboundMinus2.day = dateMinus2
            .getDate()
            .toString()
            .padStart(2, "0");

          outboundPlus1.year = datePlus1.getFullYear().toString();
          outboundPlus1.month = (datePlus1.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          outboundPlus1.day = datePlus1
            .getDate()
            .toString()
            .padStart(2, "0");

          outboundPlus2.year = datePlus2.getFullYear().toString();
          outboundPlus2.month = (datePlus2.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          outboundPlus2.day = datePlus2
            .getDate()
            .toString()
            .padStart(2, "0");

          const dates = [
            outboundMinus2,
            outboundMinus1,
            outbound,
            outboundPlus1,
            outboundPlus2
          ];

          // inbound dates
          let inboundDates;
          if (flight.inboundDate) {
            let inbound = {};
            inbound.year = parseInt(flight.inboundDate.slice(0, 4));
            inbound.month = parseInt(flight.inboundDate.slice(5, 7));
            inbound.day = parseInt(flight.inboundDate.slice(8));
            let inboundDate = new Date(
              inbound.year,
              inbound.month - 1,
              inbound.day
            );

            let dateMinus1 = new Date(
              inbound.year,
              inbound.month - 1,
              inbound.day
            );
            let dateMinus2 = new Date(
              inbound.year,
              inbound.month - 1,
              inbound.day
            );
            let datePlus1 = new Date(
              inbound.year,
              inbound.month - 1,
              inbound.day
            );
            let datePlus2 = new Date(
              inbound.year,
              inbound.month - 1,
              inbound.day
            );

            dateMinus1.setDate(inboundDate.getDate() - 1);
            dateMinus2.setDate(inboundDate.getDate() - 2);
            datePlus1.setDate(inboundDate.getDate() + 1);
            datePlus2.setDate(inboundDate.getDate() + 2);

            let inboundMinus1 = {};
            let inboundMinus2 = {};
            let inboundPlus1 = {};
            let inboundPlus2 = {};

            inbound.year = inbound.year.toString();
            inbound.month = inbound.month.toString().padStart(2, "0");
            inbound.day = inbound.day.toString().padStart(2, "0");

            inboundMinus1.year = dateMinus1.getFullYear().toString();
            inboundMinus1.month = (dateMinus1.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            inboundMinus1.day = dateMinus1
              .getDate()
              .toString()
              .padStart(2, "0");

            inboundMinus2.year = dateMinus2.getFullYear().toString();
            inboundMinus2.month = (dateMinus2.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            inboundMinus2.day = dateMinus2
              .getDate()
              .toString()
              .padStart(2, "0");

            inboundPlus1.year = datePlus1.getFullYear().toString();
            inboundPlus1.month = (datePlus1.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            inboundPlus1.day = datePlus1
              .getDate()
              .toString()
              .padStart(2, "0");

            inboundPlus2.year = datePlus2.getFullYear().toString();
            inboundPlus2.month = (datePlus2.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            inboundPlus2.day = datePlus2
              .getDate()
              .toString()
              .padStart(2, "0");

            inboundDates = [
              inboundMinus2,
              inboundMinus1,
              inbound,
              inboundPlus1,
              inboundPlus2
            ];
          }

          let datePricesObj = {origin: flight.originPlace, destination: flight.destinationPlace, dates: {}};
          let count = 0;

          dates.forEach((date, index) => {
            const completeDate = `${date.year}-${date.month}-${date.day}`;
            let completeInboundDate;
            if (flight.inboundDate) {
              completeInboundDate = `${inboundDates[index].year}-${inboundDates[index].month}-${inboundDates[index].day}`;              
            } else {
              completeInboundDate = flight.inboundDate;
            }

            unirest(
              "GET",
              `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${
                flight.originPlace
              }/${flight.destinationPlace}/${completeDate}`
            )
              .query({
                inboundpartialdate: completeInboundDate
              })
              .headers({
                "x-rapidapi-host":
                  "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                "x-rapidapi-key":
                  "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea"
              })
              .end(function(response) {
                count++;
                if (response.error) throw new Error(response.error);
                let price = response.body.Quotes[0].MinPrice;
                datePricesObj['dates'][completeDate] = price;
                if (count === dates.length) {
                  flightsCount++;
                  flightsArray.push(datePricesObj);
                }
                if (flightsCount === flights.length) {
                  res.render("watchlist", {
                    user: req.session.user,
                    flights: flightsArray
                  });
                }
              });
          });
        });
      });
  },

  getFlights: app => {
    return (req, res) => {
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
      app.set("query", query);

      const flightType = req.body.flightType;

      unirest
        .post(
          "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0"
        )
        .header(
          "X-RapidAPI-Host",
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
        )
        .header(
          "X-RapidAPI-Key",
          "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea"
        )
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
        .end(function(result) {
          if (result.body.ValidationErrors) {
            res.redirect("/error");
            return false;
          }
          const sessionKey = result.headers.location.slice(-36);

          setTimeout(() => {
            unirest
              .get(
                `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0/${sessionKey}?sortType=price&sortOrder=asc&pageIndex=0&pageSize=10`
              )
              .header(
                "X-RapidAPI-Host",
                "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
              )
              .header(
                "X-RapidAPI-Key",
                "4f35d21e85mshd99b830c3d8fc00p1bb8d5jsn462cba9bbdea"
              )
              .end(function(result) {
                const itineraries = result.body.Itineraries;
                const legs = result.body.Legs;
                const carriers = result.body.Carriers;
                const agents = result.body.Agents;
                const places = result.body.Places;
                const segments = result.body.Segments;

                let flights = [];

                if (flightType === "one-way") {
                  let originId = "";
                  let destinationId = "";

                  for (let i = 0; i < itineraries.length; i++) {
                    let flight = {};
                    flight.isRound = false;
                    flight.legs = [];
                    const agentId = itineraries[i].PricingOptions[0].Agents[0];
                    let price = itineraries[i].PricingOptions[0].Price;
                    flight.bookingUrl =
                      itineraries[i].PricingOptions[0].DeeplinkUrl;
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
                          leg.duration = segments[j].Duration;
                          leg.carrierId = segments[j].Carrier;
                          leg.flightNumber = segments[j].FlightNumber;
                          flight.legs.push(leg);
                        }
                      }
                    }

                    for (let j = 0; j < carriers.length; j++) {
                      for (let k = 0; k < flight.legs.length; k++) {
                        if (carriers[j].Id === flight.legs[k].carrierId) {
                          flight.legs[k].carrierName = carriers[j].Name;
                          flight.legs[k].carrierImgUrl = carriers[j].ImageUrl;
                          delete flight.legs[k].carrierId;
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
                          delete flight.legs[k].destinationId;
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
                } else if (flightType === "round") {
                  let outboundOriginId = "";
                  let inboundOriginId = "";
                  let outboundDestinationId = "";
                  let inboundDestinationId = "";

                  for (let i = 0; i < itineraries.length; i++) {
                    let flight = {};
                    flight.isRound = true;
                    flight.outboundLegs = [];
                    flight.inboundLegs = [];
                    const agentId = itineraries[i].PricingOptions[0].Agents[0];
                    let price = itineraries[i].PricingOptions[0].Price;
                    flight.bookingUrl =
                      itineraries[i].PricingOptions[0].DeeplinkUrl;
                    flight.price = Number.parseFloat(price).toFixed(2);
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
                          leg.duration = segments[j].Duration;
                          leg.carrierId = segments[j].Carrier;
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
                          leg.duration = segments[j].Duration;
                          leg.carrierId = segments[j].Carrier;
                          leg.flightNumber = segments[j].FlightNumber;
                          flight.inboundLegs.push(leg);
                        }
                      }
                    }

                    for (let j = 0; j < carriers.length; j++) {
                      for (let k = 0; k < flight.outboundLegs.length; k++) {
                        if (
                          carriers[j].Id === flight.outboundLegs[k].carrierId
                        ) {
                          flight.outboundLegs[k].carrierName = carriers[j].Name;
                          flight.outboundLegs[k].carrierImgUrl =
                            carriers[j].ImageUrl;
                          delete flight.outboundLegs[k].carrierId;
                        }
                      }
                      for (let k = 0; k < flight.inboundLegs.length; k++) {
                        if (
                          carriers[j].Id === flight.inboundLegs[k].carrierId
                        ) {
                          flight.inboundLegs[k].carrierName = carriers[j].Name;
                          flight.inboundLegs[k].carrierImgUrl =
                            carriers[j].ImageUrl;
                          delete flight.inboundLegs[k].carrierId;
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
                        if (
                          places[j].Id === flight.outboundLegs[k].destinationId
                        ) {
                          flight.outboundLegs[k].destination = places[j].Name;
                          delete flight.outboundLegs[k].destinationId;
                        }
                      }
                      for (let k = 0; k < flight.inboundLegs.length; k++) {
                        if (places[j].Id === flight.inboundLegs[k].originId) {
                          flight.inboundLegs[k].origin = places[j].Name;
                          delete flight.inboundLegs[k].originId;
                        }
                        if (
                          places[j].Id === flight.inboundLegs[k].destinationId
                        ) {
                          flight.inboundLegs[k].destination = places[j].Name;
                          delete flight.inboundLegs[k].destinationId;
                        }
                      }
                    }

                    flight.outboundFlyingTime = 0;
                    flight.inboundFlyingTime = 0;

                    for (let j = 0; j < flight.outboundLegs.length; j++) {
                      flight.outboundFlyingTime +=
                        flight.outboundLegs[j].duration;
                    }
                    flight.outboundLayoverTime =
                      flight.duration - flight.outboundFlyingTime;

                    for (let j = 0; j < flight.inboundLegs.length; j++) {
                      flight.inboundFlyingTime +=
                        flight.inboundLegs[j].duration;
                    }
                    flight.inboundLayoverTime =
                      flight.duration - flight.inboundFlyingTime;
                    flights.push(flight);
                  }
                }
                app.set("flights", flights);
                res.render("flights", {
                  flights: flights,
                  user: req.session.user
                });
              });
          }, 5000);
        });
    };
  },

  getOne: app => {
    return (req, res) => {
      res.render("singleflight", {
        flight: app.get("flights")[req.params.flightsIndex]
      });
    };
  }
};
