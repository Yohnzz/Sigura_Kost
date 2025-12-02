const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDB = require("./config/connectDb");
const path = require("path");
const session = require("express-session");


const authRoutes = require("./routes/authRoutes");
const kostRoutes = require("./routes/kostRoutes");

const PORT = process.env.PORT || 3000;

connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Landing
app.get("/", (req, res) => {
  res.render("landingPage", { user: req.session.user || null });
});

// Routes
app.use("/auth", authRoutes);
app.use("/kost", kostRoutes);

app.get("/", (req, res) => {
    res.send("Express + MongoDB Atlas is online!");
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
