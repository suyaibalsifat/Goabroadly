const path = require("path");
const express = require("express");
const morgan = require("morgan");
const authRouter = require("./routes/authRoutes");
const countryRouter = require("./routes/countryRoutes");
const tourismRouter = require("./routes/tourismRoutes");
const academicRouter = require("./routes/academicRoutes");
const migrationRouter = require("./routes/migrationRoutes");
// IMPORT YOUR ROUTERS
const agencyRouter = require("./routes/agencyRoutes");

// MOUNT THE ROUTER WITH THE CORRECT API PREFIX

const app = express();

// Log incoming interactions to terminal
app.use(morgan("dev"));

// Middlewares to read incoming data streams
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bind static UI assets from your public folder
// Express will now automatically serve /tourism-offer.html, /css/*, and /js/* out of here!
app.use(express.static(path.join(__dirname, "public")));

// Mount Routers Cleanly
app.use("/api", authRouter);
app.use("/api", countryRouter);
app.use("/api", tourismRouter);
app.use("/api", academicRouter);
app.use("/api", migrationRouter);
app.use("/api", require("./routes/agencyRoutes"));
app.use("/api", agencyRouter);
// Universal validation test route
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "GoAbroadly API engine is online.",
  });
});

module.exports = app;
