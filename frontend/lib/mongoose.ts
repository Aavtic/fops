import mongoose from "mongoose";

const connectionToDB = async () => {
    try {
        await mongoose.connect(process.env.MongoURL!);
    } catch (err) {
        console.log(err)
    }
}

export default connectionToDB;
