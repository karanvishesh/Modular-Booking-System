import APIError from "../utils/apiError.js";
import expressAsyncHandler from "express-async-handler";
import APIResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import userSchema from '../schema/user.schema.js';
import bookingSchema from '../schema/booking.schema.js';
import createModel from "../utils/createmodel.js";

async function getAccessAndRefreshToken(User, userId, res) {
  const user = await User.findById(userId);
  if (!user) return res.status(401).json(new APIError(401, "Invalid User"));

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  return { refreshToken, accessToken };
}

const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const User = req.userModel;

  if ([username, email, password].some((field) => !field.trim())) {
    return res.status(400).json(new APIError(400, "All fields are required"));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(409).json(new APIError(409, "User already exists"));
  }

  const user = await User.create({ email, username, password });
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    return res.status(500).json(new APIError(500, "Internal Server Error"));
  }

  return res
    .status(201)
    .json(new APIResponse(201, createdUser, "User Registered Successfully"));
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const User = req.userModel;
  const { username, email, password } = req.body;

  if (!username && !email) {
    return res.status(401).json(new APIError(401, "Please enter username or email"));
  }

  const loggedInUser = await User.findOne({ $or: [{ email }, { username }] });
  if (!loggedInUser) {
    return res.status(401).json(new APIError(401, "User doesn't exist"));
  }

  const isPasswordValid = await loggedInUser.verifyPassword(password);
  if (!isPasswordValid) {
    return res.status(401).json(new APIError(401, "Invalid Username or password"));
  }

  const { accessToken, refreshToken } = await getAccessAndRefreshToken(User, loggedInUser._id, res);

  loggedInUser.refreshToken = refreshToken;
  await loggedInUser.save({ validateBeforeSave: false });

  const userToReturn = await User.findById(loggedInUser._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
    .json(new APIResponse(200, { user: userToReturn, refreshToken, accessToken }, "User logged in successfully"));
});

const logoutUser = expressAsyncHandler(async (req, res) => {
  const currentDatabase = req.dbKey;
  const User = createModel(currentDatabase, 'User', userSchema);
  const userId = req.user._id;

  await User.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .clearCookie("refreshToken", { httpOnly: true, secure: true })
    .json(new APIResponse(200, {}, "User logged out"));
});

const refreshAccessToken = expressAsyncHandler(async (req, res) => {
  const User = req.userModel;
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json(new APIError(401, "Unauthorized Request"));
  }

  try {
    const decodedData = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decodedData) {
      return res.status(401).json(new APIError(401, "Invalid Refresh token"));
    }

    const user = await User.findById(decodedData._id);
    if (!user || incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json(new APIError(401, "Invalid Refresh token"));
    }

    const { accessToken, newRefreshToken } = await getAccessAndRefreshToken(User, user._id, res);

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true })
      .json(new APIResponse(200, { accessToken, newRefreshToken }, "Access Token Refreshed"));
  } catch (error) {
    return res.status(401).json(new APIError(401, error.message || "Invalid refresh token"));
  }
});

const changeCurrentPassword = expressAsyncHandler(async (req, res) => {
  const User = req.userModel;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(401).json(new APIError(401, "Invalid Password"));
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(401).json(new APIError(401, "User doesn't exist"));
  }

  const isPasswordValid = await user.verifyPassword(oldPassword);
  if (!isPasswordValid) {
    return res.status(401).json(new APIError(401, "Incorrect Password"));
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new APIResponse(200, {}, "Password changed successfully"));
});

const getUser = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json(new APIError(404, "User not found"));
  }

  return res.status(200).json(new APIResponse(200, user, "User returned successfully"));
});

const updateAccountDetails = expressAsyncHandler(async (req, res) => {
  const User = req.userModel;
  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json(new APIError(400, "All fields are required"));
  }

  const user = req.user;
  if (email) user.email = email;
  if (username) user.username = username;
  await user.save();

  return res.status(200).json(new APIResponse(200, user, "Account details updated successfully"));
});

const getAllBookings = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const dbKey = req.dbKey;
  const Booking = createModel(dbKey, 'Booking', bookingSchema);

  const bookings = await Booking.find({ bookerId: userId });

  return res.status(200).json(new APIResponse(200, bookings, "Bookings fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
  getAllBookings
};
