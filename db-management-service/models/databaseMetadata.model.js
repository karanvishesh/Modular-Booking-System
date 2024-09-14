import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const hierarchySchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
  child: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

hierarchySchema.add({
  child: hierarchySchema,
});

const databaseMetadataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    databaseName: { type: String, required: true },
    child: {
      type: hierarchySchema,
    },
    schema: {
      type: Map,
      of: String,
    },
    isInitialized: { type: Boolean, default: false },
    initializedAt: { type: Date },
    databaseAccessToken: { type: String},
  },
  { timestamps: true }
);

databaseMetadataSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      databaseName: this.databaseName,
      userId: this.userId,
    },
    process.env.ACCESS_TOKEN_SECRET
  );
};

const DatabaseMetadata = mongoose.model(
  "DatabaseMetadata",
  databaseMetadataSchema
);
export default DatabaseMetadata;
