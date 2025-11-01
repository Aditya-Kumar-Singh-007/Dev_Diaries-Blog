const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const blogRoutes = require('./routes/blog.js'); 

dotenv.config();

const app = express();

// --- Handlebars setup ---
const { engine } = require('express-handlebars');
app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b,
    add: (a, b) => a + b
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // absolute path

// --- Middleware ---
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true })); // parses form submissions
app.use(express.json()); // parses JSON bodies

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ MongoDB connection failed:', err));

// --- Routes ---
app.use('/', blogRoutes);

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
