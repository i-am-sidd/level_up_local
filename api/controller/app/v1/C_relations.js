const users = require("../../../models/M_user");
const relations = require("../../../models/M_relations");
const user_session = require("../../../models/M_user_session");

//testing
const util = require("util");

const { userToken } = require("../../../../utils/token");
const {
  successRes,
  errorRes,
  multiSuccessRes,
} = require("../../../../utils/common_fun");
const { sendOtpCode } = require("../../../../utils/send_mail");
const fs = require("fs");
const path = require("path");
const { unlink } = require("fs");
const outputPath = path.join(__dirname, "../../../../");
const {
  securePassword,
  comparePassword,
} = require("../../../../utils/secure_pwd");

const { ObjectId } = require("mongodb");
const { dateTime } = require("../../../../utils/date_time");

const editFamilyName = async (req, res) => {
  try {
    var user_id = req.user._id;

    var { family_name } = req.body;

    var updated_data = await users.findByIdAndUpdate(
      { _id: user_id },
      { $set: { family_name: family_name } },
      { new: true }
    );
    if (updated_data?.profile_picture) {
      updated_data.profile_picture =
        process.env.BASE_URL + updated_data.profile_picture;
    }
    if (updated_data) {
      return successRes(res, "Family name updated successfully", updated_data);
    }
  } catch (error) {
    console.log("Error : ", error);
    return errorRes(res, "Internal server error");
  }
};

const addRelation = async (req, res) => {
  try {
    var user_id = req.user._id;

    var { first_name, last_name, dob, relation_type, parent_user_id, color } =
      req.body;



    var { profile_picture } = req.files;

    var insert_data = {
      user_id: user_id,
      first_name,
      last_name,
      dob,
    };

    if (relation_type) {
      insert_data = {
        ...insert_data,
        relation_type: relation_type,
      };
    }

    if (parent_user_id) {
      insert_data = {
        ...insert_data,
        parent_user_id: parent_user_id,
      };
    }

    if (color) {
      insert_data = {
        ...insert_data,
        color: color,
      };
    }

    if (profile_picture) {
      let file_extension = profile_picture.originalFilename
        .split(".")
        .pop()
        .toLowerCase();

      var file_name =
        Math.floor(1000 + Math.random() * 9000) +
        "_" +
        Date.now() +
        "." +
        file_extension;

      // Upload file into folder
      let oldPath = profile_picture.path;
      let newPath = "public/profile_picture/" + file_name;

      await fs.readFile(oldPath, function (err, data) {
        if (err) throw err;

        fs.writeFile(newPath, data, function (err) {
          if (err) throw err;
        });
      });

      // unlink(`${outputPath}/public/${find_user.profile_picture}`, (err) => {
      //   // if (err) throw err;
      //   if (err) console.log(err);
      // });

      insert_data = {
        ...insert_data,
        profile_picture: "profile_picture/" + file_name,
      };
    }


    var add_relation = await relations.create(insert_data);

    // update relation_ids

    var add_relation = await relations
      .findByIdAndUpdate(
        { _id: add_relation._id },
        { $push: { relation_ids: add_relation._id } },
        { new: true }
      )
      .populate({
        path: "parent_user_id",
        select: "first_name last_name dob",
      });

    // update other parenmt relations ids
    if (parent_user_id) {
      await relations.updateMany(
        { relation_ids: parent_user_id },
        { $push: { relation_ids: add_relation._id } },
        { multi: true }
      );
    }

    if (add_relation?.profile_picture) {
      add_relation.profile_picture =
        process.env.BASE_URL + add_relation.profile_picture;
    }

    return successRes(res, `Relation added successfully`, add_relation);
  } catch (error) {
    console.log("Error : ", error);
    return errorRes(res, "Internal server error");
  }
};

const relationList = async (req, res) => {
  try {
    var user_id = req.user._id;

    var get_relations = await relations
      .find({ user_id: user_id, is_deleted: false })
      .populate({
        path: "parent_user_id",
        select: "first_name last_name dob color",
      });

    get_relations.map((value) => {
      value.profile_picture = process.env.BASE_URL + value.profile_picture;
    });

    return successRes(res, `Relation list successfully`, get_relations);
  } catch (error) {
    console.log("Error : ", error);
    return errorRes(res, "Internal server error");
  }
};

const deleteRelation = async (req, res) => {
  try {
    var { relation_id } = req.body;

    var delete_relation = await relations
      .findById(relation_id)
      .where({ is_deleted: false });

    delete_relation?.relation_ids?.map(async (value) => {
      await relations.findByIdAndUpdate(
        { _id: value },
        { $set: { is_deleted: true } },
        { new: true }
      );
    });

    var delete_relation = await relations.findByIdAndUpdate(
      { _id: relation_id },
      { $set: { is_deleted: true } },
      { new: true }
    );

    await relations.updateMany(
      { relation_ids: relation_id },
      {
        $pullAll: { relation_ids: delete_relation.relation_ids },
      },
      { multi: true }
    );

    return successRes(res, `Relation deleted successfully`, []);
  } catch (error) {
    console.log("Error : ", error);
    return errorRes(res, "Internal server error");
  }
};

const editRelation = async (req, res) => {
  try {
    var user_id = req.user._id;
    var {
      relation_id,
      first_name,
      last_name,
      dob,
      relation_type,
      parent_user_id,
      color,
    } = req.body;

    console.log("req.body", req.body)
    var { profile_picture } = req.files;

    var get_relation = await relations
      .findById(relation_id)
      .where({ is_deleted: false });

    if (!get_relation) {
      return errorRes(res, "Relation not found");
    }
    if (get_relation.user_id.toString() != user_id) {
      return errorRes(res, "You have no access to edit this relation");
    }

    let update_data = {
      first_name,
      last_name,
      dob,
    };

    if (relation_type) {
      update_data = {
        ...update_data,
        relation_type: relation_type,
      };
    }

    if (parent_user_id) {
      update_data = {
        ...update_data,
        parent_user_id: parent_user_id,
      };
    }

    if (color) {
      update_data = {
        ...update_data,
        color: color,
      };
    }

    if (profile_picture) {
      let file_extension = profile_picture.originalFilename
        .split(".")
        .pop()
        .toLowerCase();

      var file_name =
        Math.floor(1000 + Math.random() * 9000) +
        "_" +
        Date.now() +
        "." +
        file_extension;

      // Upload file into folder
      let oldPath = profile_picture.path;
      let newPath = "public/profile_picture/" + file_name;

      await fs.readFile(oldPath, function (err, data) {
        if (err) throw err;

        fs.writeFile(newPath, data, function (err) {
          if (err) throw err;
        });
      });

      unlink(`${outputPath}/public/${get_relation.profile_picture}`, (err) => {
        // if (err) throw err;
        if (err) console.log(err);
      });

      update_data = {
        ...update_data,
        profile_picture: "profile_picture/" + file_name,
      };
    }

    // update relation data
    var update_relation = await relations.findByIdAndUpdate(
      { _id: relation_id },
      { $set: update_data },
      { new: true }
    );

    // first remove all child from all parent
    await relations.updateMany(
      { relation_ids: relation_id, _id: { $ne: relation_id } },
      {
        $pullAll: { relation_ids: get_relation.relation_ids },
      },
      { multi: true }
    );

    if (parent_user_id) {
      // Third add relation ids to all parent
      await relations.updateMany(
        { relation_ids: parent_user_id },
        {
          $push: { relation_ids: get_relation.relation_ids },
        },
        { multi: true }
      );
    }

    var spouse_relation_ids = [];
    var find_data = await relations
      .findById(relation_id)
      .where({ is_deleted: false });

    for (const element of find_data?.relation_ids) {
      if (element) {
        var find_parent_data = await relations.findById(element).where({ is_deleted: false });
        console.log("spouse_relation_ids", spouse_relation_ids)

        if (!spouse_relation_ids.toString().includes(element.toString())) {
          if (find_parent_data.relation_type != "spouse") {

            let where_cond = { _id: find_parent_data._id }
            console.log("where_cond", where_cond)
            var update_relation = await relations.findOneAndUpdate(
              where_cond, 
              {
                $set: {
                  color: color
                }
              },
              { new: true }
            );
          } 
          else {
            if (find_parent_data._id.toString() == find_data._id.toString()) {
              var update_relation = await relations.findByIdAndUpdate(
                { _id: find_parent_data._id },
                {
                  $set: {
                    color: color
                  }
                },
                { new: true }
              );
            } else {
              find_parent_data?.relation_ids?.map((value) => {
                if (!spouse_relation_ids.includes(value)) {
                  spouse_relation_ids.push(value);
                }
              })
            }
          }
        }

      }
    }

    if (update_relation?.profile_picture) {
      update_relation.profile_picture =
        process.env.BASE_URL + update_relation.profile_picture;
    }

    return successRes(res, `Relation edited successfully`, update_relation);
  } catch (error) {
    console.log("Error : ", error);
    return errorRes(res, "Internal server error");
  }
};

module.exports = {
  editFamilyName,
  addRelation,
  relationList,
  deleteRelation,
  editRelation,
};
