const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      enum: ["user", "admin"],
      // required: [true, "User type is required."],
    },
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
    },
    middle_name: {
      type: String,
      default: null,
    },
    email_address: {
      type: String,
      trim: true,
      index: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Your email is not valid please enter the correct email",
      },

      required: [true, "Email address is required."],
    },
    password: {
      type: String,
      default: null,
      // required: [true, "Password is required."],
    },
    dob: {
      type: Date,
      default: null,
      // required: [true, "Date of birth is required."],
    },
    profile_picture: {
      type: String,
      default: null,
    },
    family_name: { type: String, default: null },
    is_self_delete: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    otp: {
      type: Number,
      length: [4, "OTP must be 4 digit."],
      default: null,
      // required: [true, "OTP is required."]
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

// usersSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("users", usersSchema);
