import mongoose from 'mongoose';

const connectionMap = new Map();

const createModel = (database, modelName, schema) => {
    let dbConnection = connectionMap.get(database);
    if (!dbConnection) {
        dbConnection = mongoose.createConnection(`${process.env.MONGO_URI}/${database}`);
        connectionMap.set(database, dbConnection);
    }
    return dbConnection.model(modelName, schema);
};

export default createModel;
