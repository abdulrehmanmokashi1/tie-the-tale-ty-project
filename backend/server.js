require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const eventsRoutes = require('./src/routes/events');
const venuesRoutes = require('./src/routes/venues');
const vendorsRoutes = require('./src/routes/vendors');
const budgetRoutes = require('./src/routes/budget');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/venues', venuesRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use('/api/budget', budgetRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'TieTheTale API running' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
