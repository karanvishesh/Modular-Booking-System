import Database from "../models/database.model.js";
import expressAsyncHandler from "express-async-handler";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";

const createDatabase = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { databaseName, bookerEntityName, bookableEntityName, availableBookings } = req.body;

  const existingDatabase = await Database.findOne({ userId, databaseName });
  if (existingDatabase) {
    return res.status(400).json(new APIError(400, "Database already exists for this user"));
  }

  const newDatabase = new Database({
    userId,
    databaseName,
    bookerEntityName,
    bookableEntityName,
    availableBookings,
  });

  try {
    const accessToken = await newDatabase.generateAccessToken();
    newDatabase.databaseAccessToken = accessToken;
    await newDatabase.save();
    return res.status(201).json(new APIResponse(201, newDatabase, "Database created successfully"));
  } catch (error) {
    console.error("Error creating database: ", error);
    return res.status(500).json(new APIError(500, "Failed to create database"));
  }
});

const getDatabases = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const databases = await Database.find({ userId });

  if (databases.length === 0) {
    return res.status(404).json(new APIError(404, "No databases found for the user"));
  }

  return res.status(200).json(new APIResponse(200, databases, "Databases retrieved successfully"));
});

const getDatabaseById = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const database = await Database.findOne({ _id: id, userId });

  if (!database) {
    return res.status(404).json(new APIError(404, "Database not found"));
  }

  return res.status(200).json(new APIResponse(200, database, "Database retrieved successfully"));
});

export { createDatabase, getDatabases, getDatabaseById };
