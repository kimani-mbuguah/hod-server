const mongoose = require("mongoose")
const utils = require("../main/common/utils")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const Roles = require("../validation/roles")

// define the user model schema
const MemberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String
  },
  email: {
    type: String
  },
  occupation: {
    type: String
  },
  ministry: {
    type: String
  },
  city: {
    type: String
  },
  county: {
    type: String
  },
  about: {
    type: String
  },
  gender: {
    type: String
  },
  maritalStatus: {
    type: String
  },
  parentalStatus: {
    type: String
  },
  leadershipPosition: {
    type: String
  },
  profilePic: {
    type: String
  },
  relationships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship"
    }
  ]
})

MemberSchema.plugin(mongoosePaginate)
MemberSchema.plugin(timestamps)

module.exports = mongoose.model("Member", MemberSchema)
