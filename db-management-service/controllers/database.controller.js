import DatabaseMetadata from "../models/databaseMetadata.model.js";
import expressAsyncHandler from "express-async-handler";
import APIResponse from "../utils/apiResponse.js";
import APIError from "../utils/apiError.js";

const createDatabase = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { databaseName, child } = req.body;

  const existingDatabase = await DatabaseMetadata.findOne({
    userId,
    databaseName,
  });
  if (existingDatabase) {
    return res
      .status(400)
      .json(new APIError(400, "Database already exists for this user"));
  }

  const newDatabaseMetadata = new DatabaseMetadata({
    userId,
    databaseName,
    child,
  });

  try {
    const accessToken = await newDatabaseMetadata.generateAccessToken();
    newDatabaseMetadata.databaseAccessToken = accessToken;
    await newDatabaseMetadata.save();
    return res
      .status(201)
      .json(
        new APIResponse(
          201,
          newDatabaseMetadata,
          "Database metadata created successfully"
        )
      );
  } catch (error) {
    console.error("Error creating database metadata: ", error);
    return res
      .status(500)
      .json(new APIError(500, "Failed to create database metadata"));
  }
});

const getDatabases = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const databases = await DatabaseMetadata.find({ userId });

  if (!databases.length) {
    return res
      .status(404)
      .json(new APIError(404, "No databases found for this user"));
  }

  return res
    .status(200)
    .json(new APIResponse(200, databases, "Databases retrieved successfully"));
});

const getDatabaseById = expressAsyncHandler(async (req, res) => {
  console.log("inside getDatabaseById");
  const { id } = req.params;
  const userId = req.user._id;
  const database = await DatabaseMetadata.findOne({ _id : id, userId });
  if (!database) {
    return res
      .status(404)
      .json(new APIError(404, "Database metadata not found"));
  }
  return res
    .status(200)
    .json(
      new APIResponse(200, database, "Database metadata retrieved successfully")
    );
});

const deleteDatabase = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const database = await DatabaseMetadata.findOne({ _id: id, userId });

  if (!database) {
    return res
      .status(404)
      .json(new APIError(404, "Database metadata not found"));
  }

  try {
    await database.deleteOne();
    return res
      .status(200)
      .json(
        new APIResponse(200, null, "Database metadata deleted successfully")
      );
  } catch (error) {
    console.error("Error deleting database metadata: ", error);
    return res
      .status(500)
      .json(new APIError(500, "Failed to delete database metadata"));
  }
});

const addChild = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { child } = req.body;

  const database = await DatabaseMetadata.findOne({ _id: id, userId });

  if (!database) {
    return res
      .status(404)
      .json(new APIError(404, "Database metadata not found"));
  }
  database.child = child;

  try {
    await database.save();
    return res
      .status(200)
      .json(new APIResponse(200, database, "Child added successfully"));
  } catch (error) {
    console.error("Error adding Child: ", error);
    return res.status(500).json(new APIError(500, "Failed to add Child"));
  }
});

const updateDatabase = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { schema, child, action } = req.body;

  const database = await DatabaseMetadata.findOne({ _id: id, userId });

  if (!database) {
    return res
      .status(404)
      .json(new APIError(404, "Database metadata not found"));
  }

  if (schema) {
    database.schema = schema;
  }

  if (child && action) {
    if (action === "add") {
      // Add hierarchy node
      database.hierarchy = hierarchy;
    } else if (action === "delete") {
      // Delete hierarchy node (assuming hierarchy has unique identifiers)
      database.child = database.hierarchy.childEntities.filter(
        (entity) => entity !== hierarchy
      );
    } else {
      return res
        .status(400)
        .json(new APIError(400, "Invalid action for hierarchy"));
    }
  }

  try {
    await database.save();
    return res
      .status(200)
      .json(new APIResponse(200, database, "Database updated successfully"));
  } catch (error) {
    console.error("Error updating database: ", error);
    return res.status(500).json(new APIError(500, "Failed to update database"));
  }
});

const initializeDatabase = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const database = await DatabaseMetadata.findOne({ _id: id, userId });

  if (!database) {
    return res
      .status(404)
      .json(new APIError(404, "Database metadata not found"));
  }

  if (database.isInitialized) {
    return res
      .status(400)
      .json(new APIError(400, "Database is already initialized"));
  }

  database.isInitialized = true;
  database.initializedAt = new Date();

  try {
    await database.save();
    return res
      .status(200)
      .json(
        new APIResponse(200, database, "Database initialized successfully")
      );
  } catch (error) {
    console.error("Error initializing database: ", error);
    return res
      .status(500)
      .json(new APIError(500, "Failed to initialize database"));
  }
});

export {
  createDatabase,
  getDatabases,
  getDatabaseById,
  updateDatabase,
  deleteDatabase,
  addChild,
  initializeDatabase,
};
