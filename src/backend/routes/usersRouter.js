const express = require("express");
const {
  updateUserById,
  getUserById,
} = require("../controllers/usersControllers.js");
const router = express.Router();

router.patch("/:id", updateUserById);
router.get("/:id", getUserById);
router.get("/", getUserById);
module.exports = router;
