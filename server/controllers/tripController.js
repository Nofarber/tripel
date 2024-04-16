const Trip = require("../models/tripModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

User.hasMany(Trip, {
  foreignKey: "userId",
});
Trip.belongsTo(User, {
  foreignKey: "userId",
});

// Create a new trip and add it to the database -- output => new trip
exports.registerTrip = async (req, res) => {
  try {
    const currentUser = await User.findOne({ where: { id: req.params.id } });
    console.log(req.body, req.params.id);
    const tripExists = await Trip.findOne({
      where: { userId: currentUser.id, tripName: req.body.tripName },
    });
    if (tripExists) {
      return res.status(400).json({
        status: "fail",
        mesage: "Trip already exists",
      });
    }

    const newTrip = await Trip.create({
      ...req.body,
      userId: currentUser.dataValues.id,
    });

    res.status(201).send(newTrip);
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const filter = req.body
    const trips = await Trip.findAll({include:[{association:"Areas",include:["Days"]},{association:"Flights",include:["Days"]}],where:filter});
    res.send(trips);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting the trips");
  }
};

// Retrieve a trip from the database -- output =>  trip
exports.getTripById = async (req, res) => {
  const tripId = req.params.id;
  try {
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).send("trip not found");
    }

    res.send(trip);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Updates a selected trip -- output => updated trip
exports.updateTrip = async (req, res) => {
  const tripId = req.params.id;
  const newTrip = req.body;
  try {
    const existingTrip = await Trip.findByPk(tripId);

    if (!existingTrip) {
      return res.status(404).send("trip not found");
    }

    // If the email is being updated, check for duplicates
    if (newTrip.name && newTrip.name !== existingTrip.name) {
      const tripExists = await Trip.findOne({ where: { name: newTrip.name } });
      if (tripExists) {
        return res.status(401).json({
          status: "fail",
          message: "Trip name already exists",
        });
      }
    }

    // Update the trip
    if (!existingTrip) {
      return res.status(404).send("trip not found");
    }
    await existingTrip.update({ ...newTrip });
    await existingTrip.save();
    res.status(200).send(existingTrip);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Deletes a selected trip -- output => updated trip
exports.deleteTrip = async (req, res) => {
  const tripId = req.params.id;
  try {
    const deletedTrip = await Trip.findByPk(tripId);
    await deletedTrip.destroy();

    if (!deletedTrip) {
      return res.status(404).send("trip not found");
    }

    res.send(deletedTrip);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
