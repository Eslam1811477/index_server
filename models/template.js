import { Schema, model } from "mongoose";

var templateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    imgs: {
        type: [String],
    },
    available:{
        type:Boolean,
        required: true
    }
})

const templateModel = model('templates', templateSchema)


export default templateModel;