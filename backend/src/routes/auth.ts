import express from 'express';
import makeLoginController from '../controllers/loginController';
import makeRegistrationController from '../controllers/registrationController';

export default function createAuthRouter(deps: any) {
  const router = express.Router();
  const loginController = makeLoginController(deps);
  const registrationController = makeRegistrationController(deps);

  router.post('/login', loginController);
  router.post('/signup', registrationController); // keep '/signup' for compatibility

  return router;
}
