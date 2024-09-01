import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MONGO DB connected !! DB Host : ${connectionInstance.connection.name}`);
        
    } catch (error) {
        console.error("MONGO DB CONNECTION ERROR : ", error);
        process.exit(1);
    }
}

export default connectDB