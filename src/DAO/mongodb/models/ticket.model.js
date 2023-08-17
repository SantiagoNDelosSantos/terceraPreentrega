import mongoose from 'mongoose';

import { v4 as uuidv4 } from 'uuid';

const collection = "ticket";

const productSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
    quantity: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    }
});

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        default: uuidv4, 
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    products: [productSchema], // Cambio aquí
    amount: {
        type: Number,
    },
    purchase: {
        type: String,
    },
});

export const ticketModel = mongoose.model(collection, ticketSchema);
