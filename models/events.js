const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const timestamps = require("mongoose-timestamp");

const EventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  }
});

EventsSchema.plugin(mongoosePaginate);
EventsSchema.plugin(timestamps);

module.exports = mongoose.model("Events", EventsSchema);
