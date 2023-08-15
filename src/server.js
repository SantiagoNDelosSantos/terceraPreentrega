// Importaciones de paquetes y módulos
import express, {
    urlencoded
} from 'express';
import mongoose from 'mongoose';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {
    Server
} from 'socket.io';

// Importación de rutas:
import cartRouter from './routes/cart.router.js';
import msmRouter from './routes/message.router.js';
import productsRouter from './routes/products.router.js';
import userRouter from './routes/session.router.js'
import viewsRouter from "./routes/views.router.js";

// Importación de controladores: 
import ViewsController from './controllers/viewsController.js';

// Importación de configuraciones de Passport:
import passport from 'passport';
import cookieParser from 'cookie-parser';
import {
    initializePassportLocal
} from './config/local.passport.js';
import {
    initializePassportGitHub
} from './config/gitHub.passport.js';
import {
    initializePassportJWT
} from './config/jwt.passport.js';

// Importación de variables de entorno:
import {
    envMongoURL,
    envPort
} from './config.js';

// Iniciamos el servidor Express:
const app = express();

// Conexión Mongoose: 
const connection = mongoose.connect(envMongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Configuración de Middlewares
app.use(express.json());
app.use(urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Inicialización de Passport 
app.use(cookieParser());
initializePassportLocal();
initializePassportJWT();
initializePassportGitHub();
app.use(passport.initialize());

// Creamos el servidor HTTP con Express:
const expressServer = app.listen(envPort, () => {
    console.log(`Servidor iniciado en el puerto ${envPort}.`);
});

// Creamos el servidor Socket.io escuchando el servidor HTTP
const socketServer = new Server(expressServer);

// Controlador vistas: 
let viewsController = new ViewsController;

// Eventos y acciones para el servidor Socket.io:
socketServer.on("connection", async (socket) => {

    // Mensaje de nuevo cliente conectado:
    console.log("¡Nuevo cliente conectado!", socket.id)

    // PRODUCTOS:

    // Envío de todos los productos en tiempo real:
    const productsResponse = await viewsController.getAllProductsControllerV();
    const productList = productsResponse.result;
    socket.emit('products', productList);

    // Recibo los filtros de main.js en busquedaProducts:
    socket.on('busquedaFiltrada', async (busquedaProducts) => {
        const {
            limit,
            page,
            sort,
            filtro,
            filtroVal
        } = busquedaProducts;
        const productsResponse = await viewsController.getAllProductsControllerV(limit, page, sort, filtro, filtroVal);
        const productsFilter = productsResponse.result
        socket.emit('products', productsFilter);
    });

    // MESSAGES: 

    // Enviamos todos los mensajes al usuario:
    const messages = await viewsController.getAllMessageControllerV();
    const messageResult = messages.result;
    socket.emit("messages", messageResult);

    // CARRITOS:

    // Enviamos los carritos a los usuarios: 
    socket.on('cartid', async (cartID) => {
        const cart = await viewsController.getCartByIdV(cartID);
        const cartResult = cart.result;
        socket.emit('cartuser', cartResult);
    });

});

// Middleware para acceder al servidor Socket.io desde las rutas:
app.use((req, res, next) => {
    req.socketServer = socketServer;
    next()
});

// Rutas:
app.use('/api/carts/', cartRouter);
app.use('/api/chat/', msmRouter);
app.use('/api/products', productsRouter);
app.use('/api/sessions', userRouter);
app.use('/', viewsRouter);