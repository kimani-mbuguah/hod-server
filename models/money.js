const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const MoneySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

MoneySchema.plugin(mongoosePaginate)
MoneySchema.plugin(timestamps)

module.exports = mongoose.model("Money", MoneySchema)
