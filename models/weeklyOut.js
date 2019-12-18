const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const WeeklyOutSchema = new mongoose.Schema({
  mon: {
    type: Number,
    required: true,
    default: 0
  },
  tue: {
    type: Number,
    required: true,
    default: 0
  },
  wed: {
    type: Number,
    required: true,
    default: 0
  },
  thur: {
    type: Number,
    required: true,
    default: 0
  },
  fri: {
    type: Number,
    required: true,
    default: 0
  },
  sat: {
    type: Number,
    required: true,
    default: 0
  },
  sun: {
    type: Number,
    required: true,
    default: 0
  },
  weekNumber: {
    type: Number,
    required: true
  }
})

WeeklyOutSchema.plugin(mongoosePaginate)
WeeklyOutSchema.plugin(timestamps)

module.exports = mongoose.model("WeeklyOut", WeeklyOutSchema)
