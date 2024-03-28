const joi = require("joi");

const editFamilyNameDto = joi.object().keys({
  family_name: joi.string().required().label("Family name"),
});

const addRelationDto = joi.object().keys({
  first_name: joi.string().required().label("First name"),
  last_name: joi.string().required().label("Last name"),
  dob: joi.string().required().label("DOB"),
  relation_type: joi.string().allow(),
  parent_user_id: joi.string().allow(),
  profile_picture: joi.string().allow(),
  color: joi.string().allow(),
});

const deleteRelationDto = joi.object().keys({
  relation_id: joi.string().required().label("Relation id"),
});

const editRelationDto = joi.object().keys({
  relation_id: joi.string().allow().label("Relation id"),
  first_name: joi.string().allow().label("First name"),
  last_name: joi.string().allow().label("Last name"),
  dob: joi.string().allow().label("DOB"),
  relation_type: joi.string().allow(),
  parent_user_id: joi.string().allow(),
  profile_picture: joi.string().allow(),
  color: joi.string().allow(),
});

module.exports = {
  editFamilyNameDto,
  addRelationDto,
  deleteRelationDto,
  editRelationDto,
};
