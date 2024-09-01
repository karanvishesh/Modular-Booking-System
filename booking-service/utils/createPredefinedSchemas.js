import createModel from "../utils/createmodel.js";
import mongoose from "mongoose";
import bookableEntitySchema from "../schema/bookableEntity.schema";

const createPredefinedEntities = async (dbKey) => {
    const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);
    const entities = [];
    for (let i = 1; i <= 100; i++) {
      entities.push({
        name: `Seat ${i}`,
        status: 'available'
      });
    }
    await BookableEntity.insertMany(entities);
    console.log('Predefined bookable entities created.');
  };

export default createPredefinedEntities;