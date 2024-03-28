const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const fs = require("fs");
const cron = require("node-cron");

const { dateTime } = require("./utils/date_time");

const router = express.Router();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ limit: "200mb", extended: true }));

// generate custom token
morgan.token("host", function (req) {
  return req.hostname;
});

app.use(
  morgan(":method :host :url :status :res[content-length] - :response-time ms")
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var port = process.env.PORT || 1000;

const server = http.createServer(app);

// const server = https.createServer(
//   {
//     key: fs.readFileSync("privkey.pem"),
//     cert: fs.readFileSync("fullchain.pem"),
//   },
//   app
// );

require("./config/database");
app.use("/public", express.static(path.join("./public")));
app.use("/css", express.static(path.join("./css")));

app.use("/", router);
app.use(require("./api/routes/admin/v1"));
app.use(require("./api/routes/app/v1"));
server.listen(port, () => {
  console.log(`Server listning at port : ${port}`);
});

// cron.schedule("* * * * * *", () => {
//   // Your task to be executed every minute and every second
//   console.log("Running task every minute and every second");
// });

// cron.schedule("* * * * *", () => {
//   // Your task to be executed every minute
//   console.log("Running task every minute------------------------------");
// });
