# flightsfetch.com

## Description

A search engine to help users minimize travel cost

## Technologies

* Sky Scanner API
* Heroku/Raspberry pi
* postgreSQL
* Node.js
* Express.js
* Knex
* unirest

## Features

* Search flights by current location and destination
* Sort flights by price and flight duration
* User login
* Add watch list to flights to see how the price fluctuates
  * every couple of hours the server will search for that flight and add the info to the database
* Mock User flight cart and checkout


## Stretch goals

* add hotels with Sabre APIs
* send email to customer once a flight has been booked
* Have graphics to display statistics about flights for destinations given a current location
* Have a monthly view for a destination with the lowest price available for each date
* make a map of all destinations a user has been to
* have a world map of the cheapest locations to travel to separated by color
* Detects where a user is by their IP address
* google ads integration
  