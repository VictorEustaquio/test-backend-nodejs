const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  creadted_by: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: "Users"
  },
});

schema.set("timestamps", true);

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
      // remove props on object serialization
      delete ret._id;
      delete ret.updated_by
      delete ret.creadted_by
  }
});

const categoryModel = mongoose.model("Categories", schema, "Categories")

module.exports = categoryModel;
