const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });

async function test() {
  const uri = process.env.MONGO_URI;
  console.log("Testing URI:", uri.replace(/:([^@]+)@/, ":****@"));
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Successfully connected!");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );
    await mongoose.disconnect();
  } catch (err) {
    console.error("Connection Failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.reason) {
      console.error("Reason:", err.reason);
    }
  }
}
test();
