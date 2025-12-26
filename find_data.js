const mongoose = require("mongoose");
require("dotenv").config({ path: "Api.env" });
const fs = require("fs");

async function findData() {
  let output = "";
  try {
    const mongoURI = process.env.MONGO_URI;
    await mongoose.connect(mongoURI);
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();

    for (const dbInfo of dbs.databases) {
      if (["admin", "local", "config"].includes(dbInfo.name)) continue;
      const currentDb = mongoose.connection.useDb(dbInfo.name);
      const colls = await currentDb.db.listCollections().toArray();

      for (const coll of colls) {
        const count = await currentDb.db.collection(coll.name).countDocuments();
        if (count > 0) {
          const sample = await currentDb.db.collection(coll.name).findOne();
          // Check if it looks like a menu item (has 'nama' or 'harga')
          if (
            sample &&
            (sample.nama || sample.Nama || sample.harga || sample.Harga)
          ) {
            output += `FOUND potential menu in DB: '${dbInfo.name}', Collection: '${coll.name}', Count: ${count}\n`;
            output += `Sample: ${JSON.stringify(sample)}\n\n`;
          }
        }
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    output += `ERROR: ${err.message}\n`;
  }
  fs.writeFileSync("search_results.txt", output);
}
findData();
