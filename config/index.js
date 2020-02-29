const validations = require("../validation/model-validations")
module.exports = {
  // DB
  dbUri:
    "mongodb+srv://kim:127.0.0.1@Kim@hod-mngt-vaqrg.gcp.mongodb.net/test?retryWrites=true&w=majority",

  // jsonwebtoken secret
  jwtSecret:
    "!!slkdfjlsdfjlsdfjlsdfjsdlfunkdsjfjsdjkkljdsjfksdfjksdflsdfjsdlfjsdfhsdfljsdflsdj57897685476gjdfklgjjfgh!!",

  // Model validations
  validations: validations,

  //sms config
  apiKey: "274b7303b3ef866a04e8d792ec8dae4ed25692092f4b1650ab4958f2ec379c32",
  username:"hod-mngt"
}