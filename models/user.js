const mongoose = require("mongoose")
const utils = require("../main/common/utils")
const mongoosePaginate = require("mongoose-paginate")
const timestamps = require("mongoose-timestamp")

const Roles = require("../validation/roles")

// define the user model schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    default: Roles.member,
    enum: [Roles.member, Roles.admin, Roles.superAdmin]
  },
  phoneNumber: { type: String, default: "Not Updated" },
  occupation: { type: String, default: "Not Updated" },
  city: { type: String, default: "Not Updated" },
  county: { type: String, default: "Not Updated" },
  ministry: { type: String, default: "Not Updated" },
  about: { type: String, default: "Not Updated" },
  profilePic: { type: String },
  lastLogin: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  }
})

UserSchema.plugin(mongoosePaginate)
UserSchema.plugin(timestamps)

/**
 * Override default toJSON, remove password field and __v version
 */
UserSchema.methods.toJSON = function() {
  let obj = this.toObject()
  delete obj.password
  delete obj.__v
  obj.id = obj._id
  delete obj._id
  return obj
}

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
UserSchema.methods.comparePassword = function comparePassword(
  password,
  callback
) {
  utils.compareHash(password, this.password, callback)
}

/**
 * The pre-save hook method.
 *
 * NOTE: pre & post hooks are not executed on update() and findeOneAndUpdate()
 *       http://mongoosejs.com/docs/middleware.html
 */
UserSchema.pre("save", function saveHook(next) {
  const user = this

  // Proceed further only if the password is modified or the user is new
  if (!user.isModified("password")) return next()

  return utils.hash(user.password, (err, hash) => {
    if (err) {
      return next(err)
    }

    // Replace the password string with hash value
    user.password = hash

    return next()
  })
})

module.exports = mongoose.model("User", UserSchema)
