import { Router } from "express";
import {
  createDatabase,
  getDatabases,
  getDatabaseById,
  updateDatabase,
  deleteDatabase,
  addChild,
  initializeDatabase
} from "../controllers/database.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const databaseRouter = Router();

databaseRouter.route("/create-database").post(verifyJWT, createDatabase);

databaseRouter.route("/").get(verifyJWT, getDatabases);

databaseRouter.route("/:id").get(verifyJWT, getDatabaseById);

databaseRouter.route("/:id").patch(verifyJWT, updateDatabase);

databaseRouter.route("/:id").delete(verifyJWT, deleteDatabase);

databaseRouter.route("/:id/child").patch(verifyJWT, addChild);

databaseRouter.route("/:id/initialize").post(verifyJWT, initializeDatabase);

export default databaseRouter;
