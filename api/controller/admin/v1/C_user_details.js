const {
    successRes,
    errorRes,
    multiSuccessRes,
} = require("../../../../utils/common_fun");
const users = require("../../../models/M_user");
const user_session = require("../../../models/M_user_session");

const {
    securePassword,
    comparePassword,
} = require("../../../../utils/secure_pwd");

const {
    notificationSend,
    notiSendMultipleDevice,
} = require("../../../../utils/notification_send");

const { dateTime } = require("../../../../utils/date_time");
const { sendOtpCode } = require("../../../../utils/send_mail");
const { userToken } = require("../../../../utils/token");

const fs = require("fs");
var nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const ObjectId = require("mongodb").ObjectId;

const userList = async (req, res) => {
    try {
        let find_user = await users
            .find({
                is_deleted: false,
                user_type: "user",
            })
            .sort({ createdAt: -1 });

        let find_user_count = await users
            .find({
                is_deleted: false,
                user_type: "user",
            })
            .count();

        find_user?.forEach((post) => {
            if (post?.profile_picture) {
                post.profile_picture = process.env.BASE_URL + post.profile_picture;
            }
        });

        if (find_user) {
            return multiSuccessRes(
                res,
                "User data get successfully",
                find_user,
                find_user_count
            );
        }
    } catch (error) {
        console.log("Error : ", error);
        return errorRes(res, "Internal Server Error!");
    }
};

const getUserdetails = async (req, res) => {
    try {
        var { user_id } = req.body;
        if (user_id) {
            var find_user = await users.findById(user_id)
            .where({ is_deleted: false });

            if (!find_user) {
                return errorRes(res, "Couldn't found user");
            }

            if (find_user?.profile_picture) {
                find_user.profile_picture =
                    process.env.BASE_URL + find_user.profile_picture;
            }

            if (!find_user) {
                return errorRes(res, "Couldn't found user");
            } else {
                return successRes(res, `User details get successfully`, find_user);
            }
        }
    } catch (error) {
        console.log("Error : ", error);
        return errorRes(res, "Internal Server Error!");
    }
};

module.exports = {
    userList,
    getUserdetails,
};