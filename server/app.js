require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require("multer");
const path = require("path");

const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());

/* ================== FILE UPLOAD ================== */
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

/* ================== SCHEMAS ================== */
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

/* ================== ROUTES ================== */

// Products route
app.use('/api/products', productRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Fabornas API Running 🚀');
});

/* CONTACT API */
app.post("/api/contact", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const newMsg = new Contact(req.body);
    await newMsg.save();

    console.log("Saved Successfully");

    res.json({ success: true });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Error saving message" });
  }
});

/* ================== ERROR HANDLING ================== */

// 404 (ALWAYS LAST)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

/* ================== DB CONNECT ================== */

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB error:', err);
  process.exit(1);
});