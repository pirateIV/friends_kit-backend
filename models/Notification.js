const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({});

module.exports = mongoose.model("Notification", NotificationSchema);
