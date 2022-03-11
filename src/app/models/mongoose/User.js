const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    index: { unique: true },
    dropDups: true,
    validate: [
      (v) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      "invalid e-mail",
    ],
  },
  passwordHash: {
    type: String,
    required: [true, "password is required"]
  },
  role: { type: String, required: true }
});

schema.set("timestamps", true);

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove props on object serialization
    delete ret._id;
    delete ret.passwordHash;
  },
});

const userModel = mongoose.model("Users", schema, "Users");

module.exports = userModel;
