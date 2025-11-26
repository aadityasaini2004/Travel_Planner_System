const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow frontend to connect
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Travel Buddy API is running... 🚀');
});

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
