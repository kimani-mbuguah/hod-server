const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const RelationshipSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    required: true
  }
})

RelationshipSchema.plugin(mongoosePaginate)
RelationshipSchema.plugin(timestamps)

module.exports = mongoose.model("Relationship", RelationshipSchema)
