import express from 'express';
import { 
  createEstudiante, 
  getEstudiantes, 
  getEstudianteById,
  updateEstudiante, 
  deleteEstudiante,
  searchEstudiantes 
} from '../controllers/estudiantes.js';

const router = express.Router();

router.post('/estudiantes', createEstudiante);
router.get('/estudiantes', getEstudiantes);
router.get('/estudiantes/search', searchEstudiantes);
router.get('/estudiantes/:id', getEstudianteById);
router.put('/estudiantes/:id', updateEstudiante);
router.delete('/estudiantes/:id', deleteEstudiante);

export default router;