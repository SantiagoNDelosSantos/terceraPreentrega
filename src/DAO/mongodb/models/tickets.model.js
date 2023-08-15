/*
import mongoose from "mongoose";

const collection = "tickets";

const TicketsSchema = new mongoose.Schema({
    ticketsRef: {
        type: [{
            ticket: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ticket",
            },
        }, ],
    },
});

export const ticketsModel = mongoose.model(collection, TicketsSchema)

*/