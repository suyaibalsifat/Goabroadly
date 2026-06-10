const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

// Point directly to your remote database configuration variable
const DB = process.env.DATABASE;

mongoose
  .connect(DB)
  .then(() =>
    console.log(
      "🔌 MongoDB Atlas cloud cluster pipeline connected successfully!",
    ),
  )
  .catch((err) =>
    console.log("❌ Cloud Database connection crash error:", err),
  );

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("\n=================================================");
  console.log("🚀 GOABROADLY ENGINE ACTIVE ON PORT: " + PORT);
  console.log("=================================================\n");
});
// Base app lifecycle container init

// Graceful cluster shutdown connection trap
