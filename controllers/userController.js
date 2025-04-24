//authentication
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  validatePassword,
  generateHashPassword,
  generateHeaderKey,
} = require("../utils/userHelper");
const response = require("../utils/responseManager");

exports.registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password) {
    response.forbidden(res, "All fields are required");
  }

  try {
    const isExist = await User.find({ email: email });
    if (isExist.length) {
      response.alreadyExist(res, "User already registered.");
    }

    // generate hash
    const hashpassword = await generateHashPassword(password);

    const newUser = new User({
      name: name,
      email: email,
      mobile: mobile || 0,
      password: hashpassword,
    });

    newUser
      .save()
      .then((result) => {
        response.success(res, "Successfully Registered.", result);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    response.forbidden(res, "All fields are required");
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      response.notFound(res, "User is not registered");
    } else {
      const validate = await validatePassword(password, user.password);
      if (validate) {
        // generate token
        const token = generateHeaderKey(email);
        response.success(res, "Successfully Loged in.", { headerkey: token });
      } else response.forbidden(res, "Incorrect Password");
    }
  } catch (error) {
    next(error);
  }
};
