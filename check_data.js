const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });
const fs = require("fs");

async function checkData() {
  let output = "";
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Makanan = require("./models/MenuMakanan");
    const data = await Makanan.find().limit(5);
    output += "SAMPLE_MAKANAN:\n" + JSON.stringify(data, null, 2) + "\n";
    await mongoose.disconnect();
  } catch (err) {
    output += `ERROR: ${err.message}\n`;
  }
  fs.writeFileSync("data_sample.txt", output);
}
checkData();
