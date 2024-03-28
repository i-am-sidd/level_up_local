const router = require("express").Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const userAuth = require("../../../middlewares/auth");
const validateRequest = require("../../../middlewares/validation");
const {
  editFamilyName,
  addRelation,
  deleteRelation,
  relationList,
  editRelation,
} = require("../../../controller/app/v1/C_relations");

const {
  editFamilyNameDto,
  addRelationDto,
  deleteRelationDto,
  editRelationDto,
} = require("../../../dto/app/v1/relations_dto");

router.post(
  "/edit_family_name",
  multipartMiddleware,
  userAuth,
  validateRequest(editFamilyNameDto),
  editFamilyName
);

router.post(
  "/add_relation",
  multipartMiddleware,
  userAuth,
  validateRequest(addRelationDto),
  addRelation
);

router.post("/relation_list", multipartMiddleware, userAuth, relationList);

router.post(
  "/delete_relation",
  multipartMiddleware,
  userAuth,
  validateRequest(deleteRelationDto),
  deleteRelation
);

router.post(
  "/edit_relation",
  multipartMiddleware,
  userAuth,
  validateRequest(editRelationDto),
  editRelation
);

module.exports = router;
