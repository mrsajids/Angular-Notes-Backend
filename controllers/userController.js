//authentication
const jwt = require("jsonwebtoken");
// password hashing
const bcrypt = require("bcrypt");

exports.gettoken = (req, res) => {
  let token = jwt.sign({ username: "sajeed" }, "12345", { expiresIn: "1Hr" });
  res.send(token);
};

exports.verifytoken = (req, res) => {
  const token = req.params?.token;
  if (!token) {
    res.status(403).json({ message: "no token provided" });
  }
  // verify a token symmetric
  jwt.verify(req.params.token, "12345", function (err, decoded) {
    if (err) res.status(401).send({ message: "Unauthorized!.." });
    res.status(200).json(decoded);
    // next(); // proceed further (middleware)
  });
};

exports.gethashpassword = async (req, res) => {
  const saltRounds = 10;
  const myPlaintextPassword = "mypass";

  try {
    // ****** hashing password
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(myPlaintextPassword, salt);
    if (hash) {
      console.log("hash", hash);
      res.send(hash);
    }
  } catch (error) {
    console.error("error while hashing", error);
  }
};

exports.verifypassword = async (req, res) => {
  const pasword = req.params?.pasword;
  const hash = req.params?.hash;

  if (!pasword) {
    res.status(403).json({ message: "no pasword provided" });
  }

  try {
    // checking password
    const isValid = await bcrypt.compare(pasword, hash);
    if (isValid) {
      res.status(200).json({ message: "Correct password" });
    } else {
      res.status(401).json({ message: "Incorrect Passwrod" });
    }
  } catch (error) {
    console.error("error while hashing", error);
  }
};
