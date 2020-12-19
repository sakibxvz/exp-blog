const router = require("express").Router();

const singupValidator = require("../validator/auth/singupValidator");
const loginValidator = require("../validator/auth/loginValidator");

const {
  singupGetController,
  singupPostController,
  loginGetController,
  loginPostController,
  logoutController,
} = require("../controllers/authController");

const { isUnAuthenticated } = require("../middleware/authMiddleware");

router.get("/singup", isUnAuthenticated, singupGetController);
router.post(
  "/singup",
  isUnAuthenticated,
  singupValidator,
  singupPostController
);

router.get("/login", isUnAuthenticated, loginGetController);
router.post("/login", isUnAuthenticated, loginValidator, loginPostController);

router.get("/logout", logoutController);

module.exports = router;
