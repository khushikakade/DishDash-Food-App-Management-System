import { Router } from 'express';
import * as redirectionController from '../controllers/redirection.controller';

const router = Router();

router
  .route('/')
  .post(redirectionController.createRedirection)
  .get(redirectionController.getRedirections);

router
  .route('/:id')
  .get(redirectionController.getRedirectionById)
  .put(redirectionController.updateRedirection)
  .delete(redirectionController.deleteRedirection);

export default router;
