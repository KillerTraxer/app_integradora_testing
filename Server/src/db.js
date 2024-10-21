import mongoose from "mongoose";

export const Connetion = async () => {
    try {   
        await mongoose.connect("mongodb+srv://erick3041210064:JCdT6X1EFTaFgL6E@consultoriodental.wseso.mongodb.net/?retryWrites=true&w=majority&appName=consultorioDental");
        console.log("Base de datos conectada");

    } catch (error) {
        console.log(error);

    }
}