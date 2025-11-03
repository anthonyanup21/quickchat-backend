import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected successfully")

    } catch (error) {
        console.log("error while connecting database\n",error)
        process.exit(1)


    }

}