require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const urlRoutes = require('./routes/urlRoutes');


// database connection
connection();

// middlewares
app.use(bodyParser.json());
app.use(cors(
    {origin:process.env.FRONT_END_URL}
));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
app.use('/', urlRoutes);
app.use(express.static('public'));

const port = process.env.PORT;
app.listen(port, console.log(`Listening on port ${port}...`));