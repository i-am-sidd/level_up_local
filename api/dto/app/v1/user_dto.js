const joi = require("joi");

const userSignUpDto = joi.object().keys({
  user_type: joi.string().allow().valid("user", "admin").label("User type"),
  first_name: joi.string().required().label("First name"),
  last_name: joi.string().required().label("Last name"),
  middle_name: joi.string().required().label("Middle name"),
  family_name: joi.string().required().label("Family name"),
  email_address: joi.string().email().required().label("Email address"),
  password: joi.string().min(6).allow().label("Password"),
  is_social_login: joi.string().allow(),
  social_platform: joi.string().allow(),
  social_id: joi.string().allow(),
  profile_url: joi.string().allow(),
  dob: joi.string().allow(),
});

const userSigninDto = joi.object().keys({
  email_address: joi.string().email().allow().label("Email address"),
  password: joi.string().min(6).allow().label("Password"),
  name: joi.string().allow().label("Name"),
  device_type: joi
    .string()
    .valid("ios", "android", "web")
    .allow()
    .label("Device type"),
  device_token: joi.string().allow().label("Device token"),
  is_social_login: joi.string().allow(),
  social_platform: joi.string().allow(),
  social_id: joi.string().allow(),
  profile_url: joi.string().allow(),
});

const sendotpdto = joi.object().keys({
  email_address: joi.string().email().required().label("Email address"),
});
const checkmailDto = joi.object().keys({
  email_address: joi.string().email().required().label("Email address"),
});

const verifyOtpDto = joi.object().keys({
  email_address: joi.string().email().required().label("Email address"),
  otp: joi.string().length(4).required().label("OTP"),
});

const resetPasswordDto = joi.object().keys({
  email_address: joi.string().email().required().label("Email address"),
  password: joi.string().min(6).required().label("Password"),
});

const changePasswordDto = joi.object().keys({
  old_password: joi.string().min(6).required().label("Old password"),
  new_password: joi.string().min(6).required().label("New password"),
});
const deactiveAccountDto = joi.object().keys({
  is_deactive_account: joi.boolean().required().label("Is deactive account"),
});

const editProfileDto = joi.object().keys({
  user_id: joi.string().allow(),
  first_name: joi.string().allow(),
  middle_name: joi.string().allow(),
  last_name: joi.string().allow(),
  family_name: joi.string().allow(),
  profile_picture: joi.string().allow().label("Profile picture"),
  dob: joi.date().required().label("DOB"),
});

const getUserdetailsDto = joi.object().keys({
  user_id: joi.string().allow().label("User id"),
});
// Joi.boolean().required(),
module.exports = {
  userSignUpDto,
  userSigninDto,
  sendotpdto,
  verifyOtpDto,
  checkmailDto,
  resetPasswordDto,
  changePasswordDto,
  deactiveAccountDto,
  editProfileDto,
  getUserdetailsDto,
};
