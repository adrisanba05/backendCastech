import express from 'express';
import { 
  createCurso, 
  getCursos, 
  getCursosActivos,
  getCursoById,
  updateCurso, 
  deleteCurso,
  getEstudiantesByCurso 
} from '../controllers/cursos.js';

const router = express.Router();

router.post('/cursos', createCurso);
router.get('/cursos', getCursos);
router.get('/cursos/activos', getCursosActivos); // Para el dropdown
router.get('/cursos/:id', getCursoById);
router.get('/cursos/:cursoId/estudiantes', getEstudiantesByCurso);
router.put('/cursos/:id', updateCurso);
router.delete('/cursos/:id', deleteCurso);

export default router;