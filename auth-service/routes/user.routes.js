import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
  regenerateAccessToken
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/").get(verifyJWT, getUser);

userRouter.route("/register").post(registerUser);

userRouter.route("/regenerate-access-token").post(regenerateAccessToken);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/change-password").patch(verifyJWT, changeCurrentPassword);

userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);

export default userRouter;
