const express = require("express");
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require('body-parser');
const { connectDB } = require("./config/conn");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", moduleRoutes);


app.get("/", (req, res) => {
    res.send("<h1>Welcome to VidyaVault </h1>");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on PORT ${port}`));
