// server.js

// 1. Load library dan dotenv
require("dotenv").config({ path: "Api.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 2. Inisialisasi Aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Variabel untuk menyimpan error koneksi terakhir
let lastDbError = null;

// 3. Konfigurasi Middleware
app.use(cors()); // Mengizinkan semua origin (untuk development)
app.use(express.json()); // Memungkinkan server untuk menerima data JSON

// 4. Konfigurasi Koneksi Database Mongoose
const mongoURI = process.env.MONGO_URI;

// Nonaktifkan buffering agar error muncul langsung saat DB mati/tidak terkoneksi
mongoose.set("bufferCommands", false);

if (mongoURI) {
  const maskedURI = mongoURI.replace(/:([^@]+)@/, ":****@");
  console.log("Menghubungkan ke MongoDB:", maskedURI);

  mongoose
    .connect(mongoURI, {
      connectTimeoutMS: 30000, // Tingkatkan ke 30 detik
      serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
      console.log("✅ Koneksi ke MongoDB berhasil!");
      lastDbError = null; // Reset error saat berhasil
    })
    .catch((err) => {
      console.error("❌ Koneksi ke MongoDB gagal!");
      console.error("Detail Error:", err.message);

      let errorHint = err.message;
      // Cek apakah ada karakter spesial di password yang mungkin perlu di-encode
      if (
        mongoURI.includes("@") &&
        mongoURI.lastIndexOf("@") > mongoURI.indexOf(":")
      ) {
        const credentials = mongoURI.split("@")[0].split("//")[1];
        if (credentials && credentials.includes(":")) {
          const password = credentials.split(":")[1];
          if (/[#$^[\]{}|\\<>%^]/.test(password)) {
            errorHint +=
              " (TIP: Password Anda mengandung karakter spesial. Coba URL-encode password tersebut, contoh: '#' menjadi '%23')";
          }
        }
      }
      lastDbError = errorHint;
    });
} else {
  console.error(
    "CRITICAL ERROR: Variabel lingkungan MONGO_URI tidak ditemukan."
  );
}

// 4.1 Middleware Cek Koneksi DB
// Mencegah error "buffering timed out" dengan langsung menolak request jika DB mati
const dbGuard = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database tidak terkoneksi. Silakan cek MONGO_URI dan IP Whitelist.",
      status: "disconnected",
    });
  }
  next();
};

// 5. Setup Routes
const makananRoutes = require("./routes/MakananRoutes");
const minumanRoutes = require("./routes/MinumanRoutes");
const camilanRoutes = require("./routes/CamilanRoutes");
const orderRoutes = require("./routes/OrderRoutes");
// Gunakan path /api/makanan untuk semua endpoint makanan
app.use("/MenuCafe/makanan", dbGuard, makananRoutes);
app.use("/MenuCafe/minuman", dbGuard, minumanRoutes);
app.use("/MenuCafe/camilan", dbGuard, camilanRoutes);
app.use("/history", dbGuard, orderRoutes);

// 6. Root Route dan Health Check
app.get("/", (req, res) => {
  res.send("Menu API is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    env: process.env.NODE_ENV || "development",
    hasMongoURI: !!process.env.MONGO_URI,
    readyState: mongoose.connection.readyState,
    lastError: lastDbError, // Tampilkan error terakhir di sini
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
