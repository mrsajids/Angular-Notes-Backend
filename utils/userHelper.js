const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateHashPassword = async (pass) => {
  const saltRounds = 10;
  try {
    // ****** hashing password
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(pass, salt);
    if (hash) {
      return hash;
    }
  } catch (error) {
    console.error("error while hashing", error);
  }
};

const validatePassword = async (pasword, hashpassword) => {
  try {
    // checking password
    const isValid = await bcrypt.compare(pasword, hashpassword);
    return isValid;
  } catch (error) {
    console.error("error while hashing", error);
  }
};

const generateHeaderKey = (email) => {
  try {
    // generate token
    let token = jwt.sign({ email: email }, process.env.JWTTOKEN, {
      expiresIn: "1Hr",
    });
    return token;
  } catch (error) {
    console.error("error while hashing", error);
  }
};

module.exports = { generateHashPassword, validatePassword, generateHeaderKey };
