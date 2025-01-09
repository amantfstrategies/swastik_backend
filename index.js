const express = require('express');
const cors = require('cors');
const https = require('https');  // Import the https module
const fs = require('fs');        // Import the fs module to read SSL files

const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const path = require('path');
const slideRoutes = require('./routes/slideRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create the Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Import routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/slides', slideRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Define the paths for your SSL certificate
const options = {
  key: fs.readFileSync('./mykey.key'),  // Path to the private key
  cert: fs.readFileSync('./mycert.crt'),  // Path to the certificate
};

// Define port
const PORT = process.env.PORT || 3001;

// Start the HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
