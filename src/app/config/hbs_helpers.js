function hbsHelpers(hbs) {

    hbs.registerPartials(`${__dirname}/frontend/views/partials`);

    hbs.handlebars.registerHelper("json", function (context) {
        return JSON.stringify(context);
    });


    hbs.handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
        console.log("registerHelper ifCond", v1, operator, v2);
        switch (operator) {
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
            case "!==":
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
            case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    hbs.registerHelper("times", function (n, block) {
        var accum = "";
        for (var i = 0; i < n; ++i) accum += block.fn(i);
        return accum;
    });

    hbs.registerHelper("for", function (from, to, incr, block) {
        var accum = "";
        for (var i = from; i < to; i += incr) accum += block.fn(i);
        return accum;
    });
}

module.exports = hbsHelpers;
