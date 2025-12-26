const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });

async function checkDB() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI not found");

    console.log("URI:", mongoURI.replace(/:([^@]+)@/, ":****@"));
    await mongoose.connect(mongoURI);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("ALL_COLLECTIONS:", collections.map((c) => c.name).join(", "));

    const models = {
      Makanan: require("./models/MenuMakanan"),
      Minuman: require("./models/MenuMinuman"),
      Camilan: require("./models/MenuCamilan"),
      Order: require("./models/Order"),
    };

    for (const [name, model] of Object.entries(models)) {
      const count = await model.countDocuments();
      console.log(
        `MODEL_${name}_COUNT: ${count} (collection: ${model.collection.name})`
      );
    }

    await mongoose.disconnect();
    console.log("DONE");
  } catch (err) {
    console.log("ERROR:", err.message);
  }
}
checkDB();
