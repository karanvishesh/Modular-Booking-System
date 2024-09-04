import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import APIResponse from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

async function getAccessAndRefreshToken(userId) {
  const user = await User.findById(userId);
  if (!user) return { error: "Invalid User" };
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  return { refreshToken, accessToken };
}

const registerUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => !field.trim())) {
    return res
      .status(400)
      .json(new APIResponse(400, {}, "All Fields are required"));
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res
      .status(409)
      .json(new APIResponse(409, {}, "User already exists"));
  }

  const user = await User.create({
    email,
    username,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    return res
      .status(500)
      .json(new APIResponse(500, {}, "Internal Server Error"));

  res
    .status(201)
    .json(new APIResponse(201, createdUser, "User Registered Successfully"));
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email)
    return res
      .status(401)
      .json(new APIResponse(401, {}, "Please enter username or email"));

  const loggedInUser = await User.findOne({ $or: [{ email }, { username }] });
  
  if (!loggedInUser)
    return res.status(401).json(new APIResponse(401, {}, "User doesn't exist"));

  const isPasswordValid = await loggedInUser.verifyPassword(password);

  if (!isPasswordValid)
    return res
      .status(401)
      .json(new APIResponse(401, {}, "Invalid Username or password"));

  const { accessToken, refreshToken } = await getAccessAndRefreshToken(
    loggedInUser._id
  );

  if (accessToken.error || refreshToken.error) {
    return res
      .status(401)
      .json(new APIResponse(401, {}, accessToken.error || refreshToken.error));
  }

  loggedInUser.refreshToken = refreshToken;

  await loggedInUser.save({ validateBeforeSave: false });

  const userToReturn = await User.findById(loggedInUser._id).select(
    "-password -refreshToken"
  );
  res
    .status(200)
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
  const userId = req.user._id;
  await User.updateOne(
    { _id: userId },
    { $unset: { refreshToken: 1 } },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .json(new APIResponse(200, {}, "User logged Out"));
});

const regenerateAccessToken = expressAsyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;
    const incomingAccessToken = req.cookies?.accessToken;
    if (!incomingAccessToken)
      return res
        .status(401)
        .json(new APIResponse(401, {}, "Unauthorized Request"));

    const decodedData = jwt.verify(
      incomingAccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (decodedData) {
      return res
        .status(200)
        .json(new APIResponse(200, {}, "Access Token Verified"));
    }

    const user = await User.findById(decodedData._id);

    if (!user)
      return res
        .status(401)
        .json(new APIResponse(401, {}, "User doesn't exist"));

    if (incomingRefreshToken !== user.refreshToken)
      return res
        .status(401)
        .json(new APIResponse(401, {}, "Invalid Refresh token"));

    const { accessToken: newAccessToken, refreshToken } =
      await getAccessAndRefreshToken(user._id);

    if (newAccessToken.error || refreshToken.error) {
      return res
        .status(401)
        .json(
          new APIResponse(401, {}, newAccessToken.error || refreshToken.error)
        );
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          { newAccessToken, refreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    return res
      .status(401)
      .json(
        new APIResponse(401, {}, error?.message || "Invalid refresh token")
      );
  }
});

const changeCurrentPassword = expressAsyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json(new APIResponse(400, {}, "Invalid Password"));
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).json(new APIResponse(404, {}, "User doesn't exist"));
  const isPasswordValid = await user.verifyPassword(oldPassword);
  if (!isPasswordValid)
    return res.status(401).json(new APIResponse(401, {}, "Incorrect Password"));
  user.password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new APIResponse(200, {}, "Password changed successfully"));
});

const getUser = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  if (!user)
    return res.status(404).json(new APIResponse(404, {}, "User not found"));
  res
    .status(200)
    .json(new APIResponse(200, user, "User returned Successfully"));
});

const updateAccountDetails = expressAsyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username && !email)
    return res
      .status(400)
      .json(new APIResponse(400, {}, "All fields are required"));
  const user = req.user;
  if (email) user.email = email;
  if (username) user.username = username;
  await user.save();
  res
    .status(200)
    .json(new APIResponse(200, user, "Account details updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  regenerateAccessToken,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
};
