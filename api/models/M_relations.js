const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const relationsSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    first_name: {
      type: String,
      default: null,
    },
    last_name: {
      type: String,
      default: null,
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
    relation_type: {
      type: String,
      enum: ["child", "parent","spouse"],
      default: null,
    },
    parent_user_id: {
      type: Schema.Types.ObjectId,
      ref: "relations",
    },
    relation_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "relations",
      },
    ],
     color:
     {
      type: String,
      default: "#FF8989",  //red
     },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false, // true-deleted, false-Not_deleted
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("relations", relationsSchema);
