import expressAsyncHandler from 'express-async-handler';
import createModel from '../utils/createmodel.js';
import bookableEntitySchema from '../schema/bookableEntity.schema.js';

const createPredefinedEntities = async (dbKey, totalCount) => {
  const BookableEntity = createModel(dbKey, 'BookableEntity', bookableEntitySchema);
 
  const existingEntities = await BookableEntity.countDocuments();
  if (existingEntities > 0) {
    return;
  }

  const entities = [];
  for (let i = 1; i <= totalCount; i++) {
    entities.push({
      name: `Seat ${i}`,
      status: 'available'
    });
  }
  await BookableEntity.insertMany(entities);
};

export const checkPredefinedEntities = expressAsyncHandler(async (req, res, next) => {
  const dbKey = req.dbKey;
  const totalCount = req.db.availableBookings;
  if (dbKey) {
    await createPredefinedEntities(dbKey, totalCount);
  }
  next();
});
