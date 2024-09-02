import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const databaseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  databaseName: { type: String, required: true},
  databaseAccessToken: { type: String },
  bookerEntityName : {type: String, required: true},
  bookableEntityName : {type: String, required: true},
  availableBookings : {type: Number, default:0},
});

databaseSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      databaseName: this.databaseName,
      userId: this.userId,
    },
  );
};

export default databaseSchema;
