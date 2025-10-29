require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API running'});
});

// I'm using this for health check
app.get('/api/server/health', (req, res) => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const ok = state === 1;

  res.status(ok ? 200 : 503).json({
    service: 'api',
    db: states[state],
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.use('/api/tasks', tasksRouter);

app.use('/api/users', usersRouter);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');
    app.listen(PORT, () => console.log('Server started'));
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

startServer();
