const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async createUser(req, res) {
    try {
      const { firstName, lastName, password, email } = req.body;

      const existentUser = await User.findOne({
        email,
      });
      if (!existentUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResponse = await User.create({
          firstName,
          lastName,
          password: hashedPassword,
          email,
        });

        return jwt.sign({ user: userResponse }, "secret", (err, token) => {
          return res.json({
            user: token,
            user_id: userResponse._id,
          });
        });
      }
      return res.status(409).json({
        message: "Email already exists! Login instead?",
      });
    } catch (error) {
      return res.status(400).json({ message: "Error while creating user" });
    }
  },
  async getUserById(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      res.json(user);
    } catch (error) {
      return res.status(400).json({
        message: "User does not exist! Register instead?",
      });
    }
  },
};
