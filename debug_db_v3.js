const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });
const fs = require("fs");

async function checkDB() {
  let output = "";
  try {
    const mongoURI = process.env.MONGO_URI;
    output += `URI: ${
      mongoURI ? mongoURI.substring(0, 30) + "..." : "MISSING"
    }\n`;
    await mongoose.connect(mongoURI);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    output += `ALL_COLLECTIONS: ${collections.map((c) => c.name).join(", ")}\n`;

    const models = {
      Makanan: require("./models/MenuMakanan"),
      Minuman: require("./models/MenuMinuman"),
      Camilan: require("./models/MenuCamilan"),
      Order: require("./models/Order"),
    };

    for (const [name, model] of Object.entries(models)) {
      const count = await model.countDocuments();
      output += `MODEL_${name}_COUNT: ${count} (collection: ${model.collection.name})\n`;
    }

    await mongoose.disconnect();
    output += "DONE\n";
  } catch (err) {
    output += `ERROR: ${err.message}\n`;
  }
  fs.writeFileSync("debug_output.txt", output);
}
checkDB();
