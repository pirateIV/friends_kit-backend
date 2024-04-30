const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    accountType: {
      type: String,
      required: true,
      enum: ['Company', 'Public', 'Personal'],
      default: 'Personal',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: { validator: validator.isEmail, message: 'Invalid email address' },
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Friend' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('url').get(function() {
  return ``
})

userSchema.set('toJSON', {
  transform: (_, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
    delete returnedObj.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
