import { Router } from "express";
import {
  createDatabase,
  getDatabases,
  getDatabaseById
} from "../controllers/database.controller.js";
import {
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const databaseRouter = Router();

databaseRouter.route("/create-database").post(verifyJWT, createDatabase);
databaseRouter.route("/:id").get(verifyJWT, getDatabaseById);
databaseRouter.route("/").get(verifyJWT, getDatabases);

export default databaseRouter;
