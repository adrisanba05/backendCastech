import prisma from "../prismaClient.js";

// Crear una inscripción nueva
export const createInscripcion = async (req, res) => {
  const { estudianteId, cursoId, fecha_inscripcion, estadoId } = req.body;
  
  try {
    // Verificar si ya existe la inscripción
    const inscripcionExistente = await prisma.inscripciones.findFirst({
      where: {
        estudianteId: Number(estudianteId),
        cursoId: Number(cursoId)
      }
    });
    
    if (inscripcionExistente) {
      return res.status(400).json({ error: "El estudiante ya está inscrito en este curso" });
    }
    
    const inscripcion = await prisma.inscripciones.create({
      data: { 
        estudianteId: Number(estudianteId),
        cursoId: Number(cursoId),
        fecha_inscripcion: fecha_inscripcion ? new Date(fecha_inscripcion) : new Date(),
        estadoId: estadoId || 1 // Por defecto activo
      },
      include: {
        estudiante: true,
        curso: true,
        estado: true
      }
    });
    res.json(inscripcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error al crear inscripción:", error);
  }
};

// Obtener todas las inscripciones
export const getInscripciones = async (req, res) => {
  try {
    const inscripciones = await prisma.inscripciones.findMany({
      include: {
        estudiante: true,
        curso: true,
        estado: true
      },
      orderBy: {
        fecha_inscripcion: 'desc'
      }
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener inscripciones:", error);
  }
};

// Obtener inscripciones por curso
export const getInscripcionesByCurso = async (req, res) => {
  const { cursoId } = req.params;
  
  try {
    const inscripciones = await prisma.inscripciones.findMany({
      where: { 
        cursoId: Number(cursoId),
        estadoId: 1  // Solo activas
      },
      include: {
        estudiante: true,
        estado: true
      },
      orderBy: {
        estudiante: {
          apellido: 'asc'
        }
      }
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener inscripciones por curso:", error);
  }
};

// Obtener inscripciones por estudiante
export const getInscripcionesByEstudiante = async (req, res) => {
  const { estudianteId } = req.params;
  
  try {
    const inscripciones = await prisma.inscripciones.findMany({
      where: { 
        estudianteId: Number(estudianteId)
      },
      include: {
        curso: true,
        estado: true,
        asistencias: {
          include: {
            estado: true
          },
          orderBy: {
            fecha_clase: 'desc'
          }
        }
      },
      orderBy: {
        fecha_inscripcion: 'desc'
      }
    });
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener inscripciones por estudiante:", error);
  }
};

// Actualizar una inscripción
export const updateInscripcion = async (req, res) => {
  const { id } = req.params;
  const { estadoId } = req.body;
  
  try {
    const inscripcion = await prisma.inscripciones.update({
      data: { 
        ...(estadoId && { estadoId })
      },
      where: { id: Number(id) },
      include: {
        estudiante: true,
        curso: true,
        estado: true
      }
    });
    res.json(inscripcion);
  } catch (error) {
    res.status(404).json({ error: "Inscripción no encontrada" });
    console.error("Error al actualizar inscripción:", error);
  }
};

// Cancelar inscripción (cambiar a inactivo)
export const deleteInscripcion = async (req, res) => {
  const { id } = req.params;
  
  try {
    const inscripcion = await prisma.inscripciones.update({
      where: { id: Number(id) },
      data: { estadoId: 2 }, // 2 = Inactivo
      include: {
        estudiante: true,
        curso: true,
        estado: true
      }
    });
    res.json({ message: "Inscripción cancelada correctamente", inscripcion });
  } catch (error) {
    res.status(404).json({ error: "Inscripción no encontrada" });
    console.error("Error al cancelar inscripción:", error);
  }
};