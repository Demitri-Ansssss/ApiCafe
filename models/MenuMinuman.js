const mongoose = require("mongoose");

// Skema yang mencerminkan struktur menu di link GitHub Anda
const MinumanSchema = new mongoose.Schema(
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
    timestamps: true,
    collection: "MenuMinuman",
  }
);

const Minuman = mongoose.model("Minuman", MinumanSchema);
module.exports = Minuman;
