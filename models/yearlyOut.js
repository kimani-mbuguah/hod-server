const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const YearlyOutSchema = new mongoose.Schema({
  jan: {
    type: Number,
    required: true,
    default: 0
  },
  feb: {
    type: Number,
    required: true,
    default: 0
  },
  mar: {
    type: Number,
    required: true,
    default: 0
  },
  apr: {
    type: Number,
    required: true,
    default: 0
  },
  may: {
    type: Number,
    required: true,
    default: 0
  },
  jun: {
    type: Number,
    required: true,
    default: 0
  },
  jul: {
    type: Number,
    required: true,
    default: 0
  },
  aug: {
    type: Number,
    required: true,
    default: 0
  },
  sep: {
    type: Number,
    required: true,
    default: 0
  },
  oct: {
    type: Number,
    required: true,
    default: 0
  },
  nov: {
    type: Number,
    required: true,
    default: 0
  },
  dec: {
    type: Number,
    required: true,
    default: 0
  },
  year: {
    type: Number,
    required: true
  }
})

YearlyOutSchema.plugin(mongoosePaginate)
YearlyOutSchema.plugin(timestamps)

module.exports = mongoose.model("YearlyOut", YearlyOutSchema)
