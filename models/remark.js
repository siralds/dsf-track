var mongoose = require("mongoose");

var schema = mongoose.Schema({
    reqFormId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Requests', required: true
    },
    remark: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true
}
);

module.exports = mongoose.model("Remarks", schema, "Remarks");