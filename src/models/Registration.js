const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  date: () => Date.now(),
  approved: Boolean,
  owner: String,
  eventTitle: String,
  eventPrice: String,
  userEmail: String,
  eventDate: String,
  //sports: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    // will bring the events info based on the eventid
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

module.exports = mongoose.model("Registration", RegistrationSchema);
