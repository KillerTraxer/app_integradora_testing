import mongoose from "mongoose";

export const Connetion = async () => {
    try {   
        await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.wseso.mongodb.net/?retryWrites=true&w=majority&appName={process.env.MONGODB_APP_NAME}`);
        console.log("Base de datos conectada");

    } catch (error) {
        console.log(error);

    }
}