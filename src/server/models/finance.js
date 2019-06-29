const mongoose = require("../database");

const FinanceSchema = new mongoose.Schema({
    balance: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    extract: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Finance = mongoose.model("Finance", FinanceSchema);

module.exports = Finance;
