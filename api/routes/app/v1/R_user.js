const router = require("express").Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const userAuth = require("../../../middlewares/auth");
const validateRequest = require("../../../middlewares/validation");
const {
  signup,
  sendOTP,
  verifyOtp,
  resetPassword,
  checkEmail,
  signIn,
  changePassword,
  logout,
  getProfile,
  editProfile,
} = require("../../../controller/app/v1/C_user");

const {
  userSignUpDto,
  userSigninDto,
  sendotpdto,
  verifyOtpDto,
  resetPasswordDto,
  checkmailDto,
  changePasswordDto,
  editProfileDto,
} = require("../../../dto/app/v1/user_dto");

// validateRequest(createEventDto)
router.post(
  "/sign_up",
  multipartMiddleware,
  validateRequest(userSignUpDto),
  signup
);
router.post(
  "/sign_in",
  multipartMiddleware,
  validateRequest(userSigninDto),
  signIn
);
router.post(
  "/send_otp",
  multipartMiddleware,
  validateRequest(sendotpdto),
  sendOTP
);
router.post(
  "/verify_otp",
  multipartMiddleware,
  validateRequest(verifyOtpDto),
  verifyOtp
);
router.post(
  "/reset_password",
  multipartMiddleware,
  validateRequest(resetPasswordDto),
  resetPassword
);
router.post(
  "/check_mail",
  multipartMiddleware,
  validateRequest(checkmailDto),
  checkEmail
);
router.post(
  "/change_password",
  multipartMiddleware,
  userAuth,
  validateRequest(changePasswordDto),
  changePassword
);
router.post("/logout", multipartMiddleware, userAuth, logout);
router.post("/get_profile", multipartMiddleware, userAuth, getProfile);
router.post(
  "/edit_profile",
  multipartMiddleware,
  userAuth,
  validateRequest(editProfileDto),
  editProfile
);

module.exports = router;
