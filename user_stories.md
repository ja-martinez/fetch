# Home Page/ Flight Search
1. As a user: When I go to the root route I see a form that includes a Current Location, Destination, Date, and Number of Travelers field.

2. As a user: When I submit the form by clicking a "Get Flights" button, I am redirected to /fetch/fights

3. The root route should include a navbar with the company logo(link to the root route), a link to the user login page, and two buttons: "about us" and "features". These buttons should automatically scroll to the corresponding sections of the page. 

4. As a user: when I scroll down in the root route, I should see a feature section which sould include 3 suggested flights

5. As a user: I should see a "Get Prices" button on each of the suggested flights. When clicked, this should take me to /fetch/flights/:id

6. As a user: when I scroll down further, I should see an about us section(footer)

* (Stretch) Under the suggestions, I should see a visual representation of average flight prices in according to country or state from my location. (there should be an input for current location)

* (Stretch) Navbar should also have a link to the cart

# Flights Page

1. As a user: I should see a list of flights based on the "Get Flights" request. Flights should automaitcally be  sorted by price: lowest to heighest 


2. Each flight should include: Price, Carrier, Carrier IMG, Departure time, Arrival time, Origin Airport, Destination Airport, and Duration.

3. As a user: I should see a "View" button on each of the flights listed. When clicked, this should take me to /fetch/flights/:id

4. As a user: I should see an "Add to Watchlist" button on each of the flights listed. When clicked, this should add the fight to the watchlist table, and alert "watchlist updated" (stretch: use a Bootstrap Modal);

* (Stretch) As a user: I should see an option to sort flights by other parameters such as duration 

# Individual Flight Page

1. As a user: I should see the following information about the flight: Price, Carrier, Carrier IMG, Departure time, Arrival time, Origin Airport, Destination Airport, Duration , status.

2. As a user: When I click a button called "add to cart" I am redirect to /fetch/cart

# Cart Page

1. As a user: I should see a list of all of the flights that I have added to my cart

2. As a user: I should have the ability to delete flights from my cart

3. As a user: When I click a button called "checkout", I am redirected to /fetch/checkout

4. As a user: If my cart is emty, I should see Your "Shopping Cart is empty." and link to the route route

# Checkout Page

1. As a user: I should be able to review my order Itinerary and Price

2. As a user: See a "Contact and Billing Information" form consisting of: Email, First Name, Last Name

3. As a user: I have already logged in, I should the "Contact and Billing Information" form already filled out.

4. As a user: I should see a "Payment Information" form consisting of Card Holder's Name, Card Number, Experation Date, and Card CVC (Security Code)

# Login/ Resigration

1. As a user: when I visit /user/login I see a "Log In" form, and a "Register" form.

2. As a user: if I enter invalid credentials into the login form & submit, I am redirected back to the login page.

3. As a user: if I enter valid credentials into the login form & submit I am redirected to /myFlights (watchlist)

4. As a user: if I am not logged in and try to visit /myFlights (or any route that stems from it) I am redirected to     /user/login

* (Stretch) Add additional fields to the "Contact and Billing Information" form and "User Resgistration" form. (e.g. address, city, state, postal code, phone-number)  

# My Flights/ Watchlist

1. As a user: I should see a list of flights that I have added to my watch list.

2. As a user: I should see a "View" button on each of the flights listed. When clicked, this should take me to /fetch/flights/:id

3. As a user: I should see a "Book a New Flight" link that redircts me to the root route
 
4. (stretch) Include a list of previous flights

5. (stretch) Include a map that displays a pin on previous destinations

# Stretch

1. Add advertisements 


