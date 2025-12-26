const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });

async function checkDB() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error("MONGO_URI not found in Api.env");
      return;
    }
    console.log("Connecting to:", mongoURI.replace(/:([^@]+)@/, ":****@"));
    await mongoose.connect(mongoURI);
    console.log("Connected!");

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections in DB:",
      collections.map((c) => c.name)
    );

    const Makanan = require("./models/MenuMakanan");
    const count = await Makanan.countDocuments();
    console.log(`Documents in 'makanans' collection: ${count}`);

    const sample = await Makanan.findOne();
    console.log("Sample document:", JSON.stringify(sample, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkDB();
