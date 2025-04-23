//authentication
const jwt = require("jsonwebtoken");
// password hashing
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  if (!name || !email || !password) {
    res.status(403).json({ message: "All fields are required" });
    return;
  }

  try {
    const isExist = await User.find({ email: email });
    if (isExist.length) {
      res.status(403).json({ message: "User already registered." });
      return;
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
        console.log(result);
        res.status(200).json({ message: "Successfully Registered." });
      })
      .catch((err) => console.error(err));

    if (newUser) {
    }
  } catch (error) {
    console.error(error);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (user.length == 0) {
      return res.status(403).json({ message: "User is not registered" });
    } else {
      const validate = await validatePassword(password, user.password);
      if (validate) {
        // generate token
        let token = jwt.sign({ email: email }, process.env.JWTTOKEN, {
          expiresIn: "1Hr",
        });

        return res
          .status(200)
          .json({ message: "Successfully Loged in.", headerkey: token });
      } else return res.status(403).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.error(error);
  }
};

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
