const mongoose = require("mongoose");

// Skema yang mencerminkan struktur menu di link GitHub Anda
const CamilanSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    kategori: {
      // Contoh: 'Makanan Berat', 'Camilan', 'Minuman Kopi', 'Minuman Non-Kopi'
      type: String,
      required: true,
    },
    gambar: {
      // Link gambar menu
      type: String,
      default: "placeholder.png",
    },
  },
  {
    timestamps: true, // Menambahkan createdAt dan updatedAt
  }
);

const Camilan = mongoose.model("Camilan", CamilanSchema);
module.exports = Camilan;
