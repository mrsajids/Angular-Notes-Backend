const express = require("express");
const router = express.Router();
const {
  gettoken,
  verifytoken,
  gethashpassword,
  verifypassword,
} = require("../controllers/userController");

router.get("/gettoken", gettoken);

router.get("/verifytoken/:token", verifytoken);

router.get("/hashpassword", gethashpassword);

router.get("/verifypasword/:pasword/:hash", verifypassword);

module.exports = router;
