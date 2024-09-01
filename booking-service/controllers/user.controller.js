import APIError from "../utils/apiError.js";
import expressAsyncHandler from "express-async-handler";
import APIResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import userSchema from '../schema/user.schema.js';
import bookingSchema from '../schema/booking.schema.js';
import createModel from "../utils/createmodel.js";

async function getAccessAndRefreshToken(User,userId) {
  const user = await User.findById(userId);
  if (!user) throw APIError(401, "Invalid User");
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  return { refreshToken, accessToken };
}

const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const User = req.userModel;
  if ([username, email, password].some((field) => !field.trim())) {
    throw new APIError(400, "All Fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new APIError(409, "User already exists");
  }

  const user = await User.create({
    email,
    username,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new APIError(500, "Internal Server Error");

  res
    .status(201)
    .json(new APIResponse(201, createdUser, "User Registered Successfully"));
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const User = req.userModel;
  const { username, email, password } = req.body;
  if (!username && !email)
    throw new APIError(401, "Please enter username or email");

  const loggedInUser = await User.findOne({ $or: [{ email }, { username }] });
  if (!loggedInUser) throw new APIError(401, "User doesn't exist");

  const isPasswordValid = await loggedInUser.verifyPassword(password);

  if (!isPasswordValid) throw new APIError(401, "Invalid Username of password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } = await getAccessAndRefreshToken(User,
    loggedInUser._id
  );

  loggedInUser.refreshToken = refreshToken;

  await loggedInUser.save({ ValidateBeforeSave: false });

  const userToReturn = await User.findById(loggedInUser._id).select(
    "-password -refreshToken"
  );
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new APIResponse(
        200,
        {
          user: userToReturn,
          refreshToken,
          accessToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = expressAsyncHandler(async (req, res) => {
  const currentDatabase = req.dbKey;
  console.log("req", req.dbKey);
  const User = createModel(currentDatabase, 'User', userSchema);
  const userId = req.user._id;
  await User.updateOne(
    { _id: userId },
    { $unset: { refreshToken: 1 } },
    {
      new: true,
    }
  );
  const options = {
    HttpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new APIResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = expressAsyncHandler(async (req, res) => {
    const User = req.userModel;
  try {
    const incomingRefreshToken =
      req.cookies.refreshAccessToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw APIError(401, "Unauthorized Request");

    const decodedData = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedData) throw APIError(401, "Invalid Refresh token");

    const user = await User.findById(decodedData._id);

    if (!user) throw APIError(401, "User doesn't exist");

    if (incomingRefreshToken != user.refreshAccessToken)
      throw APIError(401, "Invalid Refresh token");

    const { accessToken, newRefreshAccessToken } = getAccessAndRefreshToken(User,
      user._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshAccessToken, options)
      .json(
        new APIResponse(
          200,
          { accessToken, newRefreshAccessToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = expressAsyncHandler(async (req, res) => {
    const User = req.userModel;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword && !newPassword) throw new APIError(401, "Invalid Password");
  const user = await User.findById(req.user._id);
  if (!user) throw new APIError(401, "User doesn't exist");
  const isPasswordValid = await user.verifyPassword(oldPassword);
  if (!isPasswordValid) throw new APIError("401", "Incorrect Password");
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new APIResponse(200, {}, "Password changed successfully"));
});

const getUser = expressAsyncHandler(async (req, res) => {
    const User = req.userModel;
  const user = req.user;
  if (!user) throw new APIError(404, "User not found");
  res
    .status(200)
    .json(new APIResponse(200, user, "User returned Successfully"));
});

const updateAccountDetails = expressAsyncHandler(async (req, res) => {
    const User = req.userModel;
  const { username, email } = req.body;
  if (!username && !email) throw new APIError(400, "All fields are required");
  const user = req.user;
  if (email) user.email = email;
  if (username) user.username = username;
  await user.save();
  res
    .status(200)
    .json(new APIResponse(200, user, "Account details updated successfully"));
});

const getAllBookings = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const dbKey = req.dbKey;

  const Booking = createModel(dbKey, 'Booking', bookingSchema);

  const bookings = await Booking.find({ bookerId: userId });

  res.status(200).json({
    status: 200,
    data: bookings,
    message: "Bookings fetched successfully"
  });
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
