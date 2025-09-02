import express from 'express';
import { 
  createAsistencia,
  //getAsistencias,
  //updateAsistencia,
  //deleteAsistencia,  // <- Agregar esta
  getEstudiantesParaAsistencia,
  marcarAsistenciaMasiva,
  getAsistenciaPorCursoYFecha,
  verificarAsistenciaExistente,
  //deleteAsistenciasPorCursoYFecha  // <- Y esta
} from '../controllers/asistencias.js';

const router = express.Router();

// Rutas existentes...
router.post('/asistencias', createAsistencia);
//router.get('/asistencias', getAsistencias);
//router.put('/asistencias/:id', updateAsistencia);

// NUEVAS RUTAS DE ELIMINACIÓN:
//router.delete('/asistencias/:id', deleteAsistencia);
//router.delete('/asistencias/curso/:cursoId/fecha/:fecha', deleteAsistenciasPorCursoYFecha);

// Otras rutas...
router.get('/cursos/:cursoId/estudiantes-asistencia', getEstudiantesParaAsistencia);
router.post('/asistencias/marcar-clase', marcarAsistenciaMasiva);
router.get('/asistencias/curso/:cursoId/fecha/:fecha', getAsistenciaPorCursoYFecha);
router.get('/asistencias/verificar/:cursoId/:fecha', verificarAsistenciaExistente);

export default router;