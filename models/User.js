const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    accountType: {
      type: String,
      required: true,
      enum: ["Company", "Public", "Personal"],
      default: "Personal",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    backupEmail: {
      type: String,
      default: "",
      // validate: {
      //   validator: validator.isEmail,
      //   message: "Invalid email address",
      // },
    },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // followers and following merged into connections
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // New friends field
  },
  { timestamps: true },
);

// Define virtual property 'name'
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Define toJSON transformation
userSchema.set("toJSON", {
  transform: (_, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
