const express = require("express");
const app = express();
const path = require("path");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(fileUpload());

//Route Imports
// const product = require("./routes/productRoute");
// const venue = require("./routes/venueRoute");
const user = require("./routes/userRoute");
const company = require("./routes/companyRoute");
const serviceDetail = require("./routes/serviceDetailRoute");
const gigRoutes = require("./routes/gigRoutes");
const authRoutes = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const contractRoutes = require("./routes/contractRoutes");
// app.use("/api/z1",product);

// app.use("/aak/l1", venue);
app.use("/aak/l1", user);
app.use("/aak/l1", company);
app.use("/aak/l1", serviceDetail);
app.use("/aak/l1", gigRoutes);
app.use("/aak/l1", authRoutes);
app.use("/aak/l1", pdfRoutes);
app.use("/aak/l1", contractRoutes);

app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
