const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); 
  },
  credentials: true, 
}));
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const path = require('path');
const slideRoutes = require('./routes/slideRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const https = require('https');
const http = require('http');
const fs = require('fs');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();


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


// Define port
const HTTP_PORT = process.env.PORT || 3001;
const HTTPS_PORT = 443;

const options = {
  key: fs.readFileSync('./private.key'),  
  cert: fs.readFileSync('./certificate.crt')  
};

http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host.replace(/:80$/, `:${HTTPS_PORT}`)}${req.url}` });
  res.end();
}).listen(80, () => {
  console.log(`HTTP server running on http://localhost:80 (redirecting to HTTPS)`);
});

https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`Server running on https://localhost:${HTTPS_PORT}`);
});
// Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
