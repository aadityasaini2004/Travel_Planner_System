const Trip = require('../models/Trip');

// Create a new trip
const createTrip = async (req, res) => {
  const { destination, days, budget, tripType, plan } = req.body;

  try {
    const trip = new Trip({
      user: req.user._id,
      destination,
      days,
      budget,
      tripType,
      plan,
    });

    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all trips for logged-in user
const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createTrip, getUserTrips };
