import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";

const verifyJWT = expressAsyncHandler(async (req, res, next) => {
  try {
    const token = 
      req.header("X-access-token")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!decodedToken) return res.status(401).json({ error: "Invalid User" });

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid Access Token" });
    }
    
    req.user = user;
    next();
  } 
  catch (error) {
    return res.status(401).json({ error: error?.message || "Invalid access token" });
  }
});

export { verifyJWT };
