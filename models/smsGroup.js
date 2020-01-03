const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const timestamps = require("mongoose-timestamp");

const SmsGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  members: {
    type: Array,
    required: true
  }
});

SmsGroupSchema.plugin(mongoosePaginate);
SmsGroupSchema.plugin(timestamps);

module.exports = mongoose.model("SmsGroup", SmsGroupSchema);
