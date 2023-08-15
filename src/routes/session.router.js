import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser, getCurrentUser, authenticateWithGitHub, getProfileUser} from '../controllers/sessionController.js';

// Importamos el usuario creado luego de GitHub y luego de completar el formulario: 
import {completeProfile} from '../config/formExtra.js'

const sessionRouter = Router();

// Register:
sessionRouter.post('/register', registerUser);

// Login:
sessionRouter.post('/login', loginUser);

// Current user:
sessionRouter.get('/current', passport.authenticate('jwt', { session: false }), getCurrentUser);

// GitHub:
sessionRouter.get('/github', passport.authenticate('github', { session: false, scope: 'user:email' }));

sessionRouter.get('/githubcallback', authenticateWithGitHub);

// Formulario extra - GitHub:
sessionRouter.post('/completeProfile', completeProfile);

// Ver perfil usuario: 
sessionRouter.get('/profile', passport.authenticate('jwt', { session: false }), getProfileUser)

export default sessionRouter;
