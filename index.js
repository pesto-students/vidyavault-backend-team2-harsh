const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/api", userRoutes);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("its running...");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on PORT ${port}`));