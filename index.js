const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// // Database Connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch((err) => console.error('❌ MongoDB Connection Error:', err));


app.get('/', (req, res) => {
  res.send('QuickHire API is running...');
});


app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});