const router = require("express").Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const userAuth = require("../../../middlewares/auth");
const validateRequest = require("../../../middlewares/validation");
const {
    userList,
    getUserdetails,
} = require("../../../controller/admin/v1/C_user_details");

const {
    adminSignUpInDto,
} = require("../../../dto/admin/v1/admin_dto");

router.post(
    "/user_list",
    multipartMiddleware,
    userAuth,
    userList
);

router.post(
    "/user_details",
    multipartMiddleware,
    userAuth,
    getUserdetails
);

module.exports = router;