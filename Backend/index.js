require('dotenv').config();
const express = require('express'); //sets up express, cors
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',        require('./routes/auth')); // mounts all routes
app.use('/api/game',        require('./routes/game'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected'); //connect to mongodb
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)); //starts server on port 5000
  })
  .catch(err => console.error(err));

  app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});