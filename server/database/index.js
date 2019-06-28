const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/itau-webs-craper", {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
