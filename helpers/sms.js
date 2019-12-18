const axios = require("axios")

const { smsServiceUrl } = require("../config")
module.exports = function sendSms(data) {
  return new Promise((resolve, reject) => {
    axios
      .post(smsServiceUrl, data)
      .then(response => {
        resolve(true)
      })
      .catch(error => {
        reject(false)
      })
  })
}
