const router = require("express").Router();

const user = require("./R_user");
const relations = require("./R_relations");

router.use("/api/v1/user", user);
router.use("/api/v1/relations", relations);

module.exports = router;
