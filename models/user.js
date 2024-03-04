var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var schema = mongoose.Schema({

        fullname: {
            type: String,
        },
        email: {
            type: String,
        },
        contact: {
            type: String,
        },
        role: {
            type: String,
            required: true
        },
        password: {
            type: String,
        },
    }, {
        versionKey: false,
        timestamps: true
    }
);

schema.pre('save', function (next) {

    var user = this;

    // generate a salt

    if (user.isModified("password") || user.isNew) {

        bcrypt.genSalt(10, function (error, salt) {

            if (error) return next(error);

            // hash the password along with our new salt

            bcrypt.hash(user.password, salt, function (error, hash) {

                if (error) return next(error);

                // override the cleartext password with the hashed one

                user.password = hash;

                next(null, user);
            });
        });

    } else {
        next(null, user);
    }
});

/**
 * Compare raw and encrypted password
 * @param password
 * @param callback
 */
schema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (error, match) {
        if (error) callback(error);
        if (match) {
            callback(null, true);
        } else {
            callback(error, false);
        }
    });
}

module.exports = mongoose.model("Users", schema, "Users");