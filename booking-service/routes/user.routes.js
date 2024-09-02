import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
  getAllBookings
} from "../controllers/user.controller.js";
import { verifyJWT, verifydbAccess } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.use(verifydbAccess);

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/").get(verifyJWT, getUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/change-password").patch(verifyJWT, changeCurrentPassword);
userRouter.route("/update-account").patch(verifyJWT, updateAccountDetails);
userRouter.route('/bookings').get(verifyJWT,getAllBookings)

export default userRouter;
