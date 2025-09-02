import express from 'express';
import { 
  createAsistencia, 
  getAsistencias, 
  updateAsistencia, 
  deleteAsistencia,
  getAsistenciasByInscripcion,
  marcarAsistenciaMasiva 
} from '../controllers/asistencias.js';

const router = express.Router();

router.post('/asistencias', createAsistencia);
router.get('/asistencias', getAsistencias);
router.get('/asistencias/inscripcion/:inscripcionId', getAsistenciasByInscripcion);
router.put('/asistencias/:id', updateAsistencia);
router.delete('/asistencias/:id', deleteAsistencia);
router.post('/asistencias/masiva', marcarAsistenciaMasiva);

export default router;