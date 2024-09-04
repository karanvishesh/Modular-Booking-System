import APIError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

const verifyJWT = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = req.header("X-access-token")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new APIError(401, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json(new APIError(401, "Invalid Access Token"));
    }

    req.user = user;
    next();
  } 
  catch (error) {
    console.error("JWT verification error: ", error);
    return res.status(401).json(new APIError(401, error?.message || "Invalid access token"));
  }
});

export { verifyJWT };
