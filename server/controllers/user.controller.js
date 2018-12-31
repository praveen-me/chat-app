const User = require('./../models/User');

module.exports = {
  signUp : (req, res) => {
    const user = req.body;

    const newUser = new User({
      ...user,
    });

    User.findOne({ username: user.username }, (err, data) => {
      if (data) {
        return res.status(302).json({
          msg: 'username is not available',
        });
      }
      newUser.save((err, data) => {
        if (err) {
          return res.json({
            msg: 'Problem in saving your data. Please try again.',
          });
        }
        return res.status(200).json({
          msg: 'Signup Successful',
        });
      });
    });
  }
}