const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const finances = require("./src/server/routes/api/finances");

app.use("/api/finances", finances);

const port = process.env.PORT || 5000;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server started on port ${port}`));
