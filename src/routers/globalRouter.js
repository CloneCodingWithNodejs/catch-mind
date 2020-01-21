import express from 'express';
import { goHome } from '../controller/catchMind';

const globalRouter = express.Router();

globalRouter.get('/', goHome);

export default globalRouter;
