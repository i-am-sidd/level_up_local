const app_versions = require("../../../models/M_app_version");
const users = require("../../../models/M_user");

//user is now pending
const { successRes, errorRes } = require("../../../../utils/common_fun");

// add app version
const addAppVersion = async (req, res) => {
  try {
    let {
      app_version,
      is_maintenance,
      app_update_status,
      app_platform,
      app_url,
      api_base_url,
      is_live,
    } = req.body;

    let insert_qry = await app_versions.create({
      app_version,
      is_maintenance,
      app_update_status,
      app_platform,
      app_url,
      api_base_url,
      is_live,
    });

    return await successRes(res, `App version added`, insert_qry);
  } catch (error) {
    console.log(error);
    return errorRes(res, "Internal server error");
  }
};

const appVersionCheck = async (req, res) => {
  try {
    let {
      app_version,
      user_id,
      app_platform,
      device_token,
      location,
      address,
    } = req.body;

    console.log("appVersionCheck-->  ", req.body);

    var result = [];

    let check_version = await app_versions.findOne().where({
      app_version: app_version,
      is_live: true,
      app_platform: app_platform,
      is_deleted: false,
    });

    var data = {
      device_type: app_platform,
      device_token: device_token,
    };

    if (user_id) {
      data = { ...data, user_id: user_id };

      var find_user = await users.findById(user_id);

      if (find_user) {
        result = {
          ...result,
          is_deleted: find_user.is_deleted,
          is_active: find_user.is_active,
          noti_badge: find_user.noti_badge,
        };
      }

      if (device_token != undefined && device_token != null) {
        let update_data = {
          device_type: app_platform,
          device_token: device_token,
          app_version: app_version,
        };

        if (location) {
          update_data = {
            ...update_data,
            location: JSON.parse(location),
            address: address,
          };
        }

        if (app_platform) {
          if (app_platform == "ios") {
            var device_type = "ios";
          } else {
            var device_type = "android";
          }
          update_data = { ...update_data, device_type: device_type };
        }

        await users.findByIdAndUpdate(user_id, update_data);

        // find unread notification counter
      }
      result["unread_notification"] = find_user.noti_badge;

      /* // chat counter
        let findRoom = await chat_room.find({
          $or: [{ user_id: user_id }, { other_user_id: user_id }],
        });

        let flag = 0;
        if (findRoom.length > 0) {
          for (const element of findRoom) {
            // let hello = await findRoom.forEach(async (element) => {
            let unread_message = await chat.find({
              chat_room_id: element._id,
              is_read: false,
              receiver_id: user_id,
            });

            if (unread_message.length > 0) {
              flag++;
            }
          }
        }

        result = {
          ...result,
          chat_counter: flag,
        }; */
    }

    /* let query = {
        user_id: user_id,
      };
      let request = {
        $set: data,
      };
      let options = { upsert: true, new: true };
      await app_installed_user.updateOne(query, request, options); */

    var app_update_status = "";

    if (check_version) {
      if (check_version.app_version != app_version) {
        app_update_status = check_version.app_update_status;

        if (app_update_status == "is_force_update") {
          result = {
            ...result,
            is_need_update: true,
            is_force_update: true,
          };
        } else {
          result = {
            ...result,
            is_need_update: true,
            is_force_update: false,
          };
        }
      } else {
        result = {
          ...result,
          is_need_update: false,
          is_force_update: false,
        };
      }

      result["is_maintenance"] = check_version.is_maintenance;
    } else {
      let check_version = await app_versions.findOne().where({
        is_live: true,
        app_platform: app_platform,
        is_deleted: false,
      });

      app_update_status = check_version.app_update_status;

      if (app_update_status == "is_force_update") {
        result = { ...result, is_need_update: true, is_force_update: true };
      } else {
        result = {
          ...result,
          is_need_update: true,
          is_force_update: false,
        };
      }
      result["is_maintenance"] = check_version.is_maintenance;
    }

    return await successRes(res, `App version updated successfully`, result);
  } catch (error) {
    console.log(error);
    return errorRes(res, "Internal server error");
  }
};

module.exports = {
  addAppVersion,
  appVersionCheck,
};
