require("dotenv").config({ path: "Api.env" });
const mongoose = require("mongoose");
const Makanan = require("./models/MenuMakanan");
const Minuman = require("./models/MenuMinuman");
const Camilan = require("./models/MenuCamilan");

const mongoURI = process.env.MONGO_URI;

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB for seeding...");

    // Clear existing data to ensure clean slate with new images
    await Makanan.deleteMany({});
    await Minuman.deleteMany({});
    await Camilan.deleteMany({});
    console.log("🗑️  Cleared existing data.");

    const makananData = [
      {
        nama: "Nasi Goreng Spesial",
        deskripsi: "Nasi goreng dengan telur, ayam suwir, dan kerupuk.",
        harga: 25000,
        kategori: "Makanan Berat",
        // Menggunakan Unsplash karena akses langsung ke iStock dilindungi
        gambar:
          "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?auto=format&fit=crop&w=800&q=80",
      },
      {
        nama: "Mie Goreng Jawa",
        deskripsi: "Mie goreng bumbu jawa dengan sayuran segar.",
        harga: 22000,
        kategori: "Makanan Berat",
        gambar:
          "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80",
      },
    ];

    const minumanData = [
      {
        nama: "Es Kopi Susu Gula Aren",
        deskripsi: "Kopi susu kekinian dengan gula aren asli.",
        harga: 18000,
        kategori: "Minuman Kopi",
        gambar:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
      },
      {
        nama: "Green Tea Latte",
        deskripsi: "Minuman matcha segar dengan susu creamy.",
        harga: 20000,
        kategori: "Minuman Non-Kopi",
        gambar:
          "https://images.unsplash.com/photo-1515823150537-b88321dd3e1c?auto=format&fit=crop&w=800&q=80",
      },
    ];

    const camilanData = [
      {
        nama: "Kentang Goreng",
        deskripsi: "Kentang goreng renyah dengan saus sambal.",
        harga: 15000,
        kategori: "Camilan",
        gambar:
          "https://images.unsplash.com/photo-1630384060421-a4323ce5663e?auto=format&fit=crop&w=800&q=80",
      },
      {
        nama: "Roti Bakar Coklat Keju",
        deskripsi: "Roti bakar tebal dengan topping coklat dan keju melimpah.",
        harga: 18000,
        kategori: "Camilan",
        gambar:
          "https://images.unsplash.com/photo-1541592106381-b31e9671c37d?auto=format&fit=crop&w=800&q=80",
      },
    ];

    await Makanan.insertMany(makananData);
    console.log("🍛 Makanan seeded successfully!");

    await Minuman.insertMany(minumanData);
    console.log("🥤 Minuman seeded successfully!");

    await Camilan.insertMany(camilanData);
    console.log("🍟 Camilan seeded successfully!");

    console.log("🎉 All data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
