const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });
const fs = require("fs");

async function listAllDBs() {
  let output = "";
  try {
    const mongoURI = process.env.MONGO_URI;
    const client = await mongoose.connect(mongoURI);
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    output +=
      "DATABASES:\n" + dbs.databases.map((db) => db.name).join(", ") + "\n";

    for (const dbInfo of dbs.databases) {
      if (["admin", "local", "config"].includes(dbInfo.name)) continue;
      output += `\nCollections in DB '${dbInfo.name}':\n`;
      const currentDb = mongoose.connection.useDb(dbInfo.name);
      const colls = await currentDb.db.listCollections().toArray();
      output += colls.map((c) => c.name).join(", ") + "\n";
    }

    await mongoose.disconnect();
  } catch (err) {
    output += `ERROR: ${err.message}\n`;
  }
  fs.writeFileSync("cluster_info.txt", output);
}
listAllDBs();
