const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
//
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/products', productRoutes);

// Root route (optional but useful)
app.get('/', (req, res) => {
    res.send('Fabornas API Running 🚀');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error' 
    });
});

// MongoDB connection
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in environment variables');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('✅ MongoDB connected');
    
    // Start server only after DB connect
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});
const multer = require("multer");
const path = require("path");
// storage config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// serve static folder
app.use("/uploads", express.static("uploads"));