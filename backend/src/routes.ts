import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrfanatoController from './controllers/OrfanatoController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/orfanatos', OrfanatoController.index);
routes.get('/orfanatos/:id', OrfanatoController.show);
routes.post('/orfanatos', upload.array('imagem'), OrfanatoController.create);

export default routes;