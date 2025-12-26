const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });
const Makanan = require("./models/MenuMakanan");
const Minuman = require("./models/MenuMinuman");
const Camilan = require("./models/MenuCamilan");

async function verify() {
  try {
    console.log("Connecting using URI from Api.env...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Content Summary:");
    const countMakanan = await Makanan.countDocuments();
    const countMinuman = await Minuman.countDocuments();
    const countCamilan = await Camilan.countDocuments();

    console.log(`- Makanan: ${countMakanan} items`);
    console.log(`- Minuman: ${countMinuman} items`);
    console.log(`- Camilan: ${countCamilan} items`);

    if (countMakanan === 5) {
      console.log("✅ SUCCESS: Found the 5 expected Makanan items!");
    } else {
      console.log(`⚠️ WARNING: Found ${countMakanan} instead of 5.`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
verify();
