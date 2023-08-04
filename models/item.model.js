import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default:0
    }
}, {
    timestamps:true
})

export default mongoose.model('Item', itemSchema)