const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports.connect = uri => {
  mongoose.set("useCreateIndex", true);
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose
    .connect(uri)
    .then(() => console.log(chalk.magenta("Success! Connected to MongoDB")))
    .catch(err => console.log(chalk.red(err)));

  // plug in the promise library:
  mongoose.Promise = global.Promise;

  mongoose.connection.on("error", err => {
    console.error(`Mongoose connection error: ${err}`);
    process.exit(1);
  });

  // load models
  require("./user");
  require("./member");
  require("./weeklyIn");
  require("./money");
  require("./fund");
  require("./yearlyIn");
  require("./weeklyOut");
  require("./yearlyOut");
  require("./relationship");
  require("./events");
  require("./smsGroup");
};
