const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

// Create a new user and add it to the database -- output => new user
exports.registerUser = async (req, res) => {
  try {
    const userExists = await User.findOne({ where: { email: req.body.email } });
    
    if (userExists) {
      return res.status(400).json({
        status: "fail",
        mesage: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "client",
    });
    
    const token = jwt.sign({ id: newUser.id }, secret, { expiresIn: "3d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 25920000,
        sameSite: "strict",
      })
      .status(201)
      .json({
        user: newUser,
        token: token,
      });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Create a new user and add it to the database -- output => user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        mesage: "Incorrect Email or Password",
      });
    }

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "3d" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 25920000,
      sameSite: "strict",
    });

    res.status(201).json({
      user: user,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "fail",
      message: err,
    });
  }
};

// Logs out the current user
exports.logoutUser = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
    });

    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Retrieve all users from the database -- output => all users
exports.getUsers = async (req, res) => {
  try {
    const filter = req.body
    const users = await User.findAll({where:filter});
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting the users");
  }
};

// Retrieve a user from the database -- output =>  user
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send("user not found");
    }

    res.send(user);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Updates a selected user -- output => updated user
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const newUser = req.body;
  try {
    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(404).send("user not found");
    }

    // If the email is being updated, check for duplicates
    if (newUser.email && newUser.email !== existingUser.email) {
      const userExists = await User.findOne({
        where: { email: newUser.email },
      });
      if (userExists) {
        return res.status(401).json({
          status: "fail",
          message: "User already exists",
        });
      }
    }

    // If the password is being updated, hash the new password
    if (newUser.password) {
      newUser.password = await bcrypt.hash(newUser.password, saltRounds);
    }
    // Update the user
    const updatedUser = await User.findByPk(userId);
    if (!updatedUser) {
      return res.status(404).send("user not found");
    }
    await updatedUser.update({ ...newUser }, { where: { id: userId } });
    res.status(200).send(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

//Deletes a selected user -- output => updated user
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByPk(userId);
    await deletedUser.destroy();

    if (!deletedUser) {
      return res.status(404).send("user not found");
    }

    res.send(deletedUser);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.autoLogin = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.send(false);
    }
    const decoded = jwt.verify(token, secret);
    const userExists = await User.findByPk(decoded.id);
    if (userExists === undefined) {
      return res.send(false);
    }
    res.send(userExists);
  } catch (error) {
    res.status(500).json({ message: error.message || "An error occurred." });
  }
};
