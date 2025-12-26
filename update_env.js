const fs = require("fs");
let env = fs.readFileSync("Api.env", "utf8");
// Replace the URI to include the database name 'MenuCafe'
env = env.replace(
  /MONGO_URI="mongodb\+srv:\/\/([^/]+)\/\?/,
  'MONGO_URI="mongodb+srv://$1/MenuCafe?'
);
fs.writeFileSync("Api.env", env);
console.log("Updated Api.env with MenuCafe database.");
