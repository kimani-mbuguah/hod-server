const Events = require("mongoose").model("Events");

//POST /events/create
exports.postCreateEvent = (req, res) => {
  if (
    !req.body.title ||
    !req.body.time ||
    !req.body.date ||
    !req.body.image ||
    !req.body.about
  ) {
    return res.status(400).json({
      success: false,
      message:
        "One or more required fields in the submitted date is invalid or empty"
    });
  }
  const newEvent = new Events({
    title: req.body.title,
    time: req.body.time,
    date: req.body.date,
    image: req.body.image,
    about: req.body.about
  });

  newEvent
    .save()
    .then(event => {
      console.log(event);
      return res.status(200).json({
        success: true,
        message: "Event saved successfully"
      });
    })
    .catch(error => {
      return res.status(400).json(error);
    });
};

exports.getEvents = (req, res) => {
  Events.find({}).then(events => {
    return res.status(200).json(events);
  });
};
