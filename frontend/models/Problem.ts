import mongoose from "mongoose"

const problemSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
});

const Problem = mongoose.models.Problems || mongoose.model("Problems", problemSchema)

export default Problem;
