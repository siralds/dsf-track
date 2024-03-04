var mongoose = require("mongoose");

var schema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    purpose: {
        type: String,
    },
    dateCreated: {
        type: String,
    },
    adminApproved: {
        type: String,
    },
    adminDeclined: {
        type: String,
    },
    supplyApproved: {
        type: String,
    },
    supplyDeclined: {
        type: String,
    },
    remark: {
        type: String,
    },
    remarkRG: {
        type: String,
    },
    status: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true
}
);

module.exports = mongoose.model("Requests", schema, "Requests");