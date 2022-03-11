const env = require("../config/dotenv");
const path = require("path");
const express = require("express");
const app = express();
const createError = require("http-errors");
const cors = require('cors');
const cookieParser = require("cookie-parser");
require("./config/hbs_helpers")(require("hbs"));
const logger = require("morgan");

/* Request Logs */
env.debug.request_log? app.use(logger("dev")) : null;

app.disable("x-powered-by");
app.set("view engine", "html");
app.engine("html", require("hbs").__express);
app.set("views", `${__dirname}/views`);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(`${__dirname}/views/public/`)));


app.use(cookieParser());
app.use(require('method-override')())

/*  Allow requests from any origin and with cors credentials */
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: false }));
/* you can also configure */
/* app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, PATCH, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Credentials', true)
    next()
}) */


/* Routes */
const webRoutes = require("./routes/web");
const apiRoutes = require("./routes/api");
app.use("/", webRoutes)
app.use("/api", apiRoutes)

/* Handler bad request error */
app.use(function(req, res, next) {
    next(createError(404));
});
app.use(function(err, req, res, next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    //Render the error page
    res.status(err.status || 500).render('./Error/404');
});


module.exports = app;
