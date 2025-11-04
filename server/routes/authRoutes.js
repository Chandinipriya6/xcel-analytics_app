const express = require("express");
const router = express.Router();
const { register, verify, login,superadminRegister, superadminLogin  } = require("../controllers/authController");

router.post("/register", register);
router.post("/verify", verify);
router.post("/login", login);

// router.post("/superadmin/register", superadminRegister);
router.post("/superadmin/login", superadminLogin);

// router.delete("/:id", ensureAuthenticated, analysisController.deleteAnalysis);

module.exports = router;
