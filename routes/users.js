const express = require("express");
const router = express.Router();
const {
  gettoken,
  verifytoken,
  gethashpassword,
  verifypassword,
  registerUser,
  loginUser,
} = require("../controllers/userController");

router.get("/gettoken", gettoken);

router.get("/verifytoken/:token", verifytoken);

router.get("/hashpassword", gethashpassword);

router.get("/verifypasword/:pasword/:hash", verifypassword);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;
