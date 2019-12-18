const validations = require("../validation/model-validations")
module.exports = {
  // DB
  dbUri:
    "mongodb+srv://kim:127.0.0.1@cluster0-vjurh.mongodb.net/hod?retryWrites=true&w=majority",

  // jsonwebtoken secret
  jwtSecret:
    "!!slkdfjlsdfjlsdfjlsdfjsdlfunkdsjfjsdjkkljdsjfksdfjksdflsdfjsdlfjsdfhsdfljsdflsdj57897685476gjdfklgjjfgh!!",

  // Model validations
  validations: validations,

  //sms service url
  smsServiceUrl: "http://34.83.202.130:8181/v1/text/send"
}
