# Tripel

Tripel is a vacation planning tool that simplifies the process of planning multiple trips, booking flights, hotels, and events.
The name "tripel" is a pun on "trip-to", emphasizing its focus on helping users plan their trips efficiently.

## Features

- **Trip Planning**: Plan multiple trips, each with multiple areas to visit.
- **Flight Search**: Find flights between different areas within your trip.
- **Hotel Booking**: Reserve accommodations at hotels in various areas.
- **Event Planning**: Plan each day's events and activities during your trip.
- **Trip Overview**: View an overview of your entire trip, including flights, hotels, and events by day.
- **Interactive Map**: Visualize your trip on an interactive map, indicating your current location, hotels, and event locations.

## Usage

To get started with Tripel, follow these steps:

1. **Clone the Repository**: 
`git clone https://github.com/OmerShuvami/tripel.git`

2. **Install Dependencies**:
`npm install`

3. **Go to the follwoing websites and register and get your own api keys**:
[Geoapify](https://www.geoapify.com/)
[RapidAPI.](https://rapidapi.com/tipsters/api/hotels-com-provider/)
[SerpApi.](https://serpapi.com/google-flights-api)

5. **In the client folder add and .env file and within it add the following**:
`RAPID_API_KEY : "RapidApiKeyHere` 
`VITE_GEOAPIFY_API_KEY : "GeoapifyApiKeyHere`
`VITE_API_URL = "http://your_domain_name/trip-planner"`

6. **In the server folder add and .env file and within it add the following**:
`FLIGHTS_API_KEY : "AerpApiKeyHere` 
`SECRET_KEY : "RandomSecretKeyHere`
`PORT = PortNumberOfYourChoice`

7. **Run the Server**:
`nodemon server.js`

8. **Run the Application**:
`npm run dev`

## Contributing

Contributions are welcome! If you have ideas for new features, suggestions for improvements, or found any bugs, feel free to open an issue or submit a pull request.

