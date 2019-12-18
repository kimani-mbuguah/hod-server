const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const FundSchema = new mongoose.Schema({
  totalIn: {
    type: Number,
    required: true,
    default: 0
  },
  totalOut: {
    type: Number,
    required: true,
    default: 0
  },
  tag: {
    type: String,
    default: "hod"
  }
})

FundSchema.plugin(mongoosePaginate)
FundSchema.plugin(timestamps)

module.exports = mongoose.model("Fund", FundSchema)
