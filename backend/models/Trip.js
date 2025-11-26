const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  destination: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  tripType: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
