import express from 'express';
import { 
  createInscripcion, 
  getInscripciones, 
  getInscripcionesByCurso,
  getInscripcionesByEstudiante,
  updateInscripcion, 
  deleteInscripcion 
} from '../controllers/inscripciones.js';

const router = express.Router();

// Crear nueva inscripción
router.post('/inscripciones', createInscripcion);

// Obtener todas las inscripciones
router.get('/inscripciones', getInscripciones);

// Obtener inscripciones por curso específico
router.get('/inscripciones/curso/:cursoId', getInscripcionesByCurso);

// Obtener inscripciones por estudiante específico
router.get('/inscripciones/estudiante/:estudianteId', getInscripcionesByEstudiante);

// Actualizar inscripción (cambiar estado principalmente)
router.put('/inscripciones/:id', updateInscripcion);

// Cancelar inscripción (cambiar a inactivo)
router.delete('/inscripciones/:id', deleteInscripcion);

export default router;