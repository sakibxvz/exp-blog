// load the things we need
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//import Routes
const authRoutes = require("./routes/authRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

//import Middleware
const { bindUserWithRequest } = require("./middleware/authMiddleware");
const  setLocals  = require("./middleware/setLocals");

const MONGODB_URI = "mongodb://localhost:27017/exp-blog";
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 2,
});

const app = express();

//set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

//Middleware array
const middleware = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || "SECRET_KEY",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
];

app.use(middleware);

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.render("pages/auth/singup", { title: "Create A New Account" });
});

const PORT = process.env.PORT || 7070;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database Connected");
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((e) => {
    return console.log(e);
  });
