import APIError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import databaseSchema from "../schema/database.schema.js";
import expressAsyncHandler from "express-async-handler";
import createModel from "../utils/createmodel.js";
import userSchema from "../schema/user.schema.js";
import {DB_NAME} from "../constants.js"

const verifydbAccess = expressAsyncHandler(async (req, _, next) => {
  try {
    const Database = createModel(DB_NAME, "Database", databaseSchema)
    const token  = 
    req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new APIError(401, "Unauthorized request");
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const database = await Database.findById(decodedToken?._id).select(
      "-databaseRefreshToken"
    );

    if (!database) {
      throw new APIError(401, "Invalid Database Access Token");
    }

    const dbName = database.databaseName;
    const userId = database.userId;
    
    if (!dbName) {
        return res.status(400).send('Database name is required');
    }
    const dbKey = (dbName + '-' + userId).substr(0,38);
    req.userModel = createModel(dbKey, 'User', userSchema);
    req.dbKey = dbKey;
    req.db = database;

    next();
  } 
  catch (error) {
    throw new APIError(401, error?.message || "Invalid Database access token");
  }
});

const verifyJWT = expressAsyncHandler(async (req, _, next) => {
  try {
    const token  = 
      req.cookies?.accessToken;
    if (!token) {
      throw new APIError(401, "Unauthorized request");
    }
    const User = req.userModel;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken)
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new APIError(401, "Invalid Access Token (User not found)");
    }
    req.user = user;
    next();
  } 
  catch (error) {
    throw new APIError(401, error?.message || "Invalid access token");
  }
});

export { verifydbAccess, verifyJWT};