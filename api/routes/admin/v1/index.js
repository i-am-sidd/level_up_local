const router = require("express").Router();

const adminAuth = require("./R_admin");
const userDetails = require("./R_user_details");

router.use("/api/v1/admin", adminAuth);
router.use("/api/v1/user_details", userDetails);

module.exports = router;
