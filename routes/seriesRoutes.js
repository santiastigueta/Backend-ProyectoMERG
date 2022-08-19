import express from 'express';
import { main, postSeries, updateSeries } from '../controllers/seriescontroller.js';

const router = express.Router();
router.get('/', main);
router.post('/post', postSeries);
router.get('/serie/:id', updateSeries)
export default router;