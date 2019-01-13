const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_FACTOR = 10;

const userSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  email: String,
  password: String,
});

// schema method for decrypt password and compare with the original one
userSchema.methods.verifyPassword = function verifyPassword(userPassword, cb) {
  // for userPassword === hash
  bcrypt.compare(userPassword, this.password, (err, res) => {
    if (err) return cb(err, false);
    return cb(null, res);
  });
};

// Hash the password before save
userSchema.pre('save', function preSave(next) {
  const { password } = this;

  if (this.isModified(password)) return next();

  // hash the password and stored in the db instead of string password
  return bcrypt.hash(password, SALT_FACTOR, (err, hash) => {
    if (err) throw err;
    this.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
