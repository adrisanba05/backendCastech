import prisma from "../prismaClient.js";

// 1. Obtener estudiantes inscritos en un curso para tomar asistencia
export const getEstudiantesParaAsistencia = async (req, res) => {
  const { cursoId } = req.params;
  
  try {
    const inscripciones = await prisma.inscripciones.findMany({
      where: { 
        cursoId: Number(cursoId),
        estadoId: 1  // Solo inscripciones activas
      },
      include: {
        estudiante: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            numero_documento: true,
            correo: true
          }
        }
      },
      orderBy: {
        estudiante: {
          apellido: 'asc'
        }
      }
    });
    
    // Formatear respuesta para el frontend
    const estudiantesParaAsistencia = inscripciones.map(inscripcion => ({
      inscripcionId: inscripcion.id,
      estudiante: inscripcion.estudiante,
      fecha_inscripcion: inscripcion.fecha_inscripcion
    }));
    
    res.json(estudiantesParaAsistencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener estudiantes para asistencia:", error);
  }
};

// 2. Crear asistencia individual (una por una)
export const createAsistencia = async (req, res) => {
  const { fecha_clase, observaciones, inscripcionId, usuarioId, estadoId } = req.body;
  
  try {
    // Verificar que la inscripción existe y está activa
    const inscripcion = await prisma.inscripciones.findFirst({
      where: {
        id: Number(inscripcionId),
        estadoId: 1  // Solo inscripciones activas
      },
      include: {
        estudiante: true,
        curso: true
      }
    });
    
    if (!inscripcion) {
      return res.status(404).json({ error: "Inscripción no encontrada o inactiva" });
    }
    
    // Verificar si ya existe asistencia para esa fecha
    const asistenciaExistente = await prisma.asistencias.findFirst({
      where: {
        inscripcionId: Number(inscripcionId),
        fecha_clase: {
          gte: new Date(fecha_clase).setHours(0, 0, 0, 0),
          lt: new Date(fecha_clase).setHours(23, 59, 59, 999)
        }
      }
    });
    
    if (asistenciaExistente) {
      return res.status(400).json({ error: "Ya existe asistencia registrada para esta fecha" });
    }
    
    const asistencia = await prisma.asistencias.create({
      data: { 
        fecha_clase: new Date(fecha_clase),
        observaciones: observaciones || "", 
        inscripcionId: Number(inscripcionId), 
        usuarioId: Number(usuarioId), 
        estadoId: Number(estadoId)  // 1 = Presente, 2 = Ausente
      },
      include: {
        inscripcion: {
          include: {
            estudiante: true,
            curso: true
          }
        },
        usuario: {
          select: {
            nombre_completo: true
          }
        },
        estado: true
      }
    });
    
    res.json(asistencia);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error al crear la asistencia:", error);
  }
};

// 3. Marcar asistencia masiva para toda una clase (método recomendado)
export const marcarAsistenciaMasiva = async (req, res) => {
  const { cursoId, fecha_clase, usuarioId, asistencias } = req.body;
  // asistencias = [{ inscripcionId: 1, estadoId: 1, observaciones: "..." }, ...]
  
  try {
    // Verificar que el curso existe
    const curso = await prisma.cursos.findUnique({
      where: { id: Number(cursoId) },
      include: { usuario: true }
    });
    
    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    
    // Verificar si ya existe asistencia para esa fecha en el curso
    const asistenciaExistente = await prisma.asistencias.findFirst({
      where: {
        inscripcion: {
          cursoId: Number(cursoId)
        },
        fecha_clase: {
          gte: new Date(fecha_clase).setHours(0, 0, 0, 0),
          lt: new Date(fecha_clase).setHours(23, 59, 59, 999)
        }
      }
    });
    
    if (asistenciaExistente) {
      return res.status(400).json({ error: "Ya existe asistencia registrada para esta fecha y curso" });
    }
    
    const resultados = await Promise.all(
      asistencias.map(async (asistenciaData) => {
        return await prisma.asistencias.create({
          data: {
            fecha_clase: new Date(fecha_clase),
            inscripcionId: Number(asistenciaData.inscripcionId),
            estadoId: Number(asistenciaData.estadoId), // 1=Presente, 2=Ausente
            observaciones: asistenciaData.observaciones || "",
            usuarioId: Number(usuarioId)
          },
          include: {
            inscripcion: {
              include: {
                estudiante: {
                  select: {
                    nombre: true,
                    apellido: true,
                    numero_documento: true
                  }
                }
              }
            },
            estado: true
          }
        });
      })
    );
    
    res.json({ 
      message: "Asistencia registrada correctamente para toda la clase", 
      curso: curso.nombre_curso,
      fecha: fecha_clase,
      total_estudiantes: resultados.length,
      asistencias: resultados 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.error("Error al marcar asistencia masiva:", error);
  }
};

// 4. Obtener lista de asistencia por curso y fecha (para verificar)
export const getAsistenciaPorCursoYFecha = async (req, res) => {
  const { cursoId, fecha } = req.params;
  
  try {
    const asistencias = await prisma.asistencias.findMany({
      where: {
        inscripcion: {
          cursoId: Number(cursoId)
        },
        fecha_clase: {
          gte: new Date(fecha + 'T00:00:00'),
          lt: new Date(fecha + 'T23:59:59')
        }
      },
      include: {
        inscripcion: {
          include: {
            estudiante: {
              select: {
                nombre: true,
                apellido: true,
                numero_documento: true
              }
            }
          }
        },
        estado: true,
        usuario: {
          select: {
            nombre_completo: true
          }
        }
      },
      orderBy: {
        inscripcion: {
          estudiante: {
            apellido: 'asc'
          }
        }
      }
    });
    
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener asistencia por curso y fecha:", error);
  }
};

// 5. Verificar si ya existe asistencia para una fecha
export const verificarAsistenciaExistente = async (req, res) => {
  const { cursoId, fecha } = req.params;
  
  try {
    const asistenciaExistente = await prisma.asistencias.findFirst({
      where: {
        inscripcion: {
          cursoId: Number(cursoId)
        },
        fecha_clase: {
          gte: new Date(fecha + 'T00:00:00'),
          lt: new Date(fecha + 'T23:59:59')
        }
      }
    });
    
    res.json({ existe: !!asistenciaExistente });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al verificar asistencia existente:", error);
  }
};