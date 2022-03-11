const env = require("../config/dotenv");
const path = require("path");
const express = require("express");
const app = express();
const createError = require("http-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./config/hbs_helpers")(require("hbs"));
const logger = require("morgan");

/* Request Logs */
env.debug.request_log ? app.use(logger("dev")) : null;

class AppController {
  constructor() {
    this.express = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());

    this.express.disable("x-powered-by");
    this.express.set("view engine", "html");
    this.express.engine("html", require("hbs").__express);
    this.express.set("views", `${__dirname}/views`);
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(express.static(path.join(`${__dirname}/views/public/`)));
    this.express.use(cookieParser());
    this.express.use(require("method-override")());
    this.express.use(
      cors({
        origin: (origin, callback) => callback(null, true),
        credentials: false,
      })
    );
  }

  routes() {
    this.express.use("/api", require("./routes/api"));
    this.express.use("/", require("./routes/web"));
    this.express.use(async (req, res, next) => next(createError(404)));
    this.express.use(function (err, req, res, next) {
      // Set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};
      //Render the error page
      res.status(err.status || 500).render("./Error/404");
    });
  }
}

module.exports = new AppController().express;
