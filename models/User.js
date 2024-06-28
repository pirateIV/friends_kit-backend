const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    lastName: { type: String, required: !0 },
    firstName: { type: String, required: !0 },
    passwordHash: { type: String, required: !0 },
    accountType: {
      type: String,
      required: !0,
      enum: ["Company", "Public", "Personal"],
      default: "Personal",
    },
    email: {
      type: String,
      required: !0,
      unique: !0,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    backupEmail: { type: String, default: "" },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [
      {
        friendId: mongoose.Schema.Types.ObjectId,
        status: {
          type: Number,
          enums: [0, 1, 2, 3, 4], // 0: "add friend", 1: "requested", 2: "pending", 3: "friends", 4: "rejected"
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

userSchema.index({ firstName: "text", lastName: "text" });
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.set("toJSON", {
  transform: (e, t) => {
    (t.id = t._id.toString()),
      delete t._id,
      delete t.__v,
      delete t.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
