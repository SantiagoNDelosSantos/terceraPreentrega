// Import mongoose para el mongoose.connect:
import mongoose from "mongoose";

// Import del modelo de ticket - Individual:
import { ticketModel } from './models/ticket.model.js'

// Importación de variables de entorno: 
import {
    envMongoURL
} from "../../config.js";

// Clase para el DAO de tickets:
export default class TicketDAO {

    // Conexión Mongoose:
    connection = mongoose.connect(envMongoURL);

    // Crear colección de tickets - DAO: 
    async createTicket() {
        try {
            const result = await ticketModel.create({
                ticketsRef: []
            });
            return result;
        } catch (error) {
            throw new Error("No se pudo crear la colección de tickets para el usuario - DAO. Error original: " + error.message);
        }
    }

    // Obtener todos los tickets de un usuario - DAO:
    async getTicketsByID(tid) {
        try {
            const result = await ticketsModel.findOne({
                _id: tid
            }).populate('tickets.ticket');
            return result;
        } catch (error) {
            throw new Error("No se pudieron obtener los tickets del usuario - DAO. Error original: " + error.message);
        }
    }

    // Agregar un nuevo ticket a los tickets del usuario: 
    async addTicketToTickets(tid, ticket) {
        try {
            const tickets = await ticketsModel.findOne({ _id: tid });
            tickets.tickets.push({ ticket: ticket });
            await tickets.save();
            return tickets;
        } catch (error) {
            throw new Error("No se pudo agregar el ticket a la colección de tickets del usuario - DAO. Error original: " + error.message);
        }
    }    

}
