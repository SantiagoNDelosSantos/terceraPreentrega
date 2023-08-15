import mongoose from 'mongoose';

import {
    v4 as uuidv4
} from 'uuid';

const collection = "ticket";

// Define el esquema del Ticket
const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        code: uuidv4,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    products: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
        }]
    },
    amount: {
        // Total de la compra.
        type: Number,
    },
    purchase: {
        // Correo del usuario del carrito. 
        type: String,
    },
});

export const ticketModel = mongoose.model(collection, ticketSchema);