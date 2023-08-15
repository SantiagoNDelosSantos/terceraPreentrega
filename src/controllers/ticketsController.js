// Import de TicketService:
import TicketService from "../services/tickets.service.js";

// Import mongoose para validación de IDs:
import mongoose from "mongoose";

// Clase para el Controller de tickets:
export default class TicketController {

    constructor() {
        // Instancia de TicketService:
        this.ticketService = new TicketService();
    }

    // Métodos de TicketController: 

    // Crear una colección de tickets - Controller: 
    async createTicketController(req, res) {
        let response = {};
        try {
            const responseService = await this.ticketService.createTicketService();
                response.status = responseService.status;
                response.message= responseService.message;
                response.statusCode = responseService.statusCode;
            if (responseService.status === "success") {
                response.result = responseService.result;
            } else if (responseService.status === "error") {
                response.error = responseService.error;
            };
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({
                error: "Error al crear el carrito: " + error.message
            });
        };
    };

    // Obtener todos los tickets de un usuario por su ID - Controller:
    async getTicketsByIdController(req, res) {
        try {
            const tid = req.params.tid;
            if (!tid) {
                return res.status(400).json({
                    status: "error",
                    message: "No se proporcionó ningún ID de ticket.",
                    statusCode: 400
                });
            } else if (!mongoose.Types.ObjectId.isValid(tid)) {
                return res.status(400).json({
                    status: "error",
                    message: "El ID proporcionado no es válido.",
                    statusCode: 400
                });
            } else {
                const responseService = await this.ticketService.getTicketsByIdService(tid);
                const response = {
                    status: responseService.status,
                    message: responseService.message,
                    statusCode: responseService.statusCode,
                };
                if (responseService.status === "success") {
                    response.result = responseService.result;
                } else if (responseService.status === "error") {
                    response.error = responseService.error;
                }
                console.log(response);
                return res.status(response.statusCode).json(response);
            }
        } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({
                error: 'Error al obtener la colección de tickets: ' + error.message
            });
        }
    }
    
}
