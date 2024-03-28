const router = require("express").Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const appVersionController = require("../../../controller/app/v1/C_app_version");
const validateRequest = require("../../../middlewares/validation");

const {
  addAppVersionDto,
  appVersionCheckDto,
} = require("../../../dto/app/v1/app_version_dto");

module.exports = function (router, io) {
  router.post(
    "/add_app_version",
    multipartMiddleware,
    validateRequest(addAppVersionDto),
    appVersionController.addAppVersion
  );

  router.post(
    "/update_app_version",
    multipartMiddleware,
    validateRequest(appVersionCheckDto),
    appVersionController.appVersionCheck
  );
};

module.exports = router;
