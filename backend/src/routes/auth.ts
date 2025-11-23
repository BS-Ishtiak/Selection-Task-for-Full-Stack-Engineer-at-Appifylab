import express from 'express';
import makeLoginController from '../controllers/loginController';
import makeRegistrationController from '../controllers/registrationController';
import makeTokenController from '../controllers/tokenController';

type TokenBody = { refreshToken?: string; token?: string };

export default function createAuthRouter(deps: any) {
  const router = express.Router();
  const loginController = makeLoginController(deps);
  const registrationController = makeRegistrationController(deps);
  const tokenController = makeTokenController(deps);

  router.post('/login', loginController);
  router.post('/signup', registrationController); // keep '/signup' for compatibility
  router.post('/token', tokenController);

  // Logout: remove refresh token from server-side store
  router.post('/logout', (req: express.Request<{}, {}, TokenBody>, res: express.Response) => {
    const token = req.body?.refreshToken || req.body?.token;
    if (token && deps?.refreshStore) {
      try {
        deps.refreshStore.delete(token);
      } catch (e) {
        // ignore
      }
    }
    
  res.json({ message: "Logout successful" });
  });

  return router;
}
