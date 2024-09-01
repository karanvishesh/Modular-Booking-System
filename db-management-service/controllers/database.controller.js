import Database from "../models/database.model.js";
import expressAsyncHandler from "express-async-handler";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";

const createDatabase = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { databaseName, bookerEntityName, bookableEntityName, availableBookings } = req.body;

    const existingDatabase = await Database.findOne({ userId, databaseName });
    if (existingDatabase) {
      throw new APIError(400, "Database already exists for this user");
    }

    const newDatabase = new Database({
      userId,
      databaseName,
      bookerEntityName,
      bookableEntityName,
      availableBookings
    });
    const accessToken = await newDatabase.generateAccessToken();
    newDatabase.databaseAccessToken = accessToken;
    await newDatabase.save();
    res.status(201).json(new APIResponse(201, newDatabase, "Database created successfully"));
  } catch (error) {
    console.error("Error creating database: ", error);
    res.status(error.statusCode || 500).json(new APIError(error.statusCode || 500, error.message));
  }
});

const getDatabases = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const databases = await Database.find({ userId });

    if (databases.length === 0) {
      throw new APIError(404, "No databases found for the user");
    }

    res.status(200).json(new APIResponse(200, databases, "Databases retrieved successfully"));
  } catch (error) {
    console.error("Error retrieving databases: ", error);
    res.status(error.statusCode || 500).json(new APIError(error.statusCode || 500, error.message));
  }
});

const getDatabaseById = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const database = await Database.findOne({ _id: id, userId });

    if (!database) {
      throw new APIError(404, "Database not found");
    }

    res.status(200).json(new APIResponse(200, database, "Database retrieved successfully"));
  } catch (error) {
    console.error("Error retrieving database by ID: ", error);
    res.status(error.statusCode || 500).json(new APIError(error.statusCode || 500, error.message));
  }
});

export { createDatabase, getDatabases, getDatabaseById };
