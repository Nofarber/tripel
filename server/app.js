const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const AuthenticateRoute = require("./middleware/authenticateRoute");
const userRoutes = require('./routes/userRoutes')
const tripRoutes = require('./routes/tripRoutes')
const areaRoutes = require('./routes/areaRoutes')
const flightRoutes = require('./routes/flightRoutes')
const eventRoutes = require('./routes/eventRoutes')
const hotelRoutes = require('./routes/hotelRoutes')
const dayRoutes = require('./routes/dayRoutes')
const getHotelRoute = require('./routes/getHotelRoutes')

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174","https://tripel.netlify.app"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())

app.use('/trip-planner/users', userRoutes)
app.use('/trip-planner/getFlight', getHotelRoute)

app.use(AuthenticateRoute);

app.use('/trip-planner/trip', tripRoutes)
app.use('/trip-planner/area', areaRoutes)
app.use('/trip-planner/flight', flightRoutes)
app.use('/trip-planner/event', eventRoutes)
app.use('/trip-planner/hotel', hotelRoutes)
app.use('/trip-planner/day', dayRoutes)

module.exports = app;
