import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        const mongoURI = process.env.MONGO_URI;
        if(!mongoURI){
            console.error("Mongo URI is not found");
        }
        const connectionInstance = await mongoose.connect(mongoURI);
        console.log("\n The database is connected !!! DB instance is: ",connectionInstance.connection.host);
    } catch (error) {
        console.log("Connection is failed: ",error);
        process.exit(1);
    }
}

export default connectDB;
