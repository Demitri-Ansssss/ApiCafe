// server.js

// 1. Load library dan dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "Api.env" });
}
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 2. Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Konfigurasi Middleware
app.use(cors()); // Mengizinkan semua origin (untuk development)
app.use(express.json()); // Memungkinkan server untuk menerima data JSON

// 4. Konfigurasi Koneksi Database Mongoose
const mongoURI = process.env.MONGO_URI;
console.log("Nilai MONGO_URI yang terbaca:", mongoURI);
if (mongoURI) {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ Koneksi ke MongoDB berhasil!"))
    .catch((err) => console.error("❌ Koneksi ke MongoDB gagal:", err.message));
} else {
  console.error("ERROR: Variabel lingkungan MONGO_URI tidak ditemukan.");
}
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ Koneksi ke MongoDB berhasil!");
//   })
//   .catch((err) => {
//     console.error("❌ Koneksi ke MongoDB gagal:", err.message);
//     process.exit(1);
//   });

// 5. Setup Routes
const makananRoutes = require("./routes/MakananRoutes");
const minumanRoutes = require("./routes/MinumanRoutes");
const camilanRoutes = require("./routes/CamilanRoutes");
const orderRoutes = require("./routes/OrderRoutes");
// Gunakan path /api/makanan untuk semua endpoint makanan
app.use("/MenuCafe/makanan", makananRoutes);
app.use("/MenuCafe/minuman", minumanRoutes);
app.use("/MenuCafe/camilan", camilanRoutes);
app.use("/history", orderRoutes);

// (Tambahkan routes minuman di sini: app.use('/api/minuman', minumanRoutes);)

// 6. Root Route dan Health Check
app.get("/", (req, res) => {
  res.send("Menu API is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    env: process.env.NODE_ENV || "development",
  });
});

// 7. Menjalankan Server (Hanya jika tidak di Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`📡 Server berjalan di http://localhost:${PORT}`);
  });
}

// Export app untuk Vercel
module.exports = app;
