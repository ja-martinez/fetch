unirest = require('unirest')

const cabinClass = 'economy';
const adults = 1;
const children = 0;
const infants = 0;
const country = 'US';
const currency = 'USD';
const locale = 'en-US';
const originPlace = 'SFO-sky';
const destinationPlace = 'NYCA-sky';
const outboundDate = '2019-09-01';
const inboundDate = '2019-09-10';

const flightType = 'round'


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
        const segments = result.body.Segments;
        
        let flights = [];

        if (flightType === 'one-way') {
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
        } else if (flightType === 'round') {
          let outboundOriginId = '';
          let inboundOriginId = '';
          let outboundDestinationId = '';
          let inboundDestinationId = '';
          

          for (let i = 0; i < itineraries.length; i++) {
            let flight = {};
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

            

            for (let j=0; j<segments.length; j++) {
              for (let k=0; k<outboundSegmentIds.length; k++) {
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
              for (let k=0; k<inboundSegmentIds.length; k++) {
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
              for (let k=0; k<flight.outboundLegs.length; k++) {
                if (carriers[j].Id === flight.outboundLegs[k].carrierId) {
                  flight.outboundLegs[k].carrierName = carriers[j].Name;
                  flight.outboundLegs[k].carrierImgUrl = carriers[j].ImageUrl
                  delete flight.outboundLegs[k].carrierId
                }
              }
              for (let k=0; k<flight.inboundLegs.length; k++) {
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
              for (let k=0; k<flight.outboundLegs.length; k++) {
                if (places[j].Id === flight.outboundLegs[k].originId) {
                  flight.outboundLegs[k].origin = places[j].Name;
                  delete flight.outboundLegs[k].originId;
                }
                if (places[j].Id === flight.outboundLegs[k].destinationId) {
                  flight.outboundLegs[k].destination = places[j].Name;
                  delete flight.outboundLegs[k].destinationId
                }
              }
              for (let k=0; k<flight.inboundLegs.length; k++) {
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

            flights.push(flight);
            console.log(flight)
          }
        }
      })
  });