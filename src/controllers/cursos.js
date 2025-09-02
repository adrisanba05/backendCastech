import prisma from "../prismaClient.js";

// Crear un curso nuevo
export const createCurso = async (req, res) => {
  const { 
    codigo_curso,
    nombre_curso,
    nivel,
    descripcion,
    intensidad,
    modalidad,
    valor,
    fecha_inicio,
    fecha_fin,
    usuarioId,
    estadoId 
  } = req.body;
  
  try {
    const curso = await prisma.cursos.create({
      data: { 
        codigo_curso,
        nombre_curso,
        nivel,
        descripcion,
        intensidad: Number(intensidad),
        modalidad,
        valor: Number(valor),
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        usuarioId: Number(usuarioId),
        estadoId: estadoId || 1 // Por defecto activo
      },
      include: {
        usuario: true,  // Información del instructor
        estado: true    // Estado del curso
      }
    });
    res.json(curso);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: "El código de curso ya existe" });
    } else {
      res.status(400).json({ error: error.message });
    }
    console.error("Error al crear curso:", error);
  }
};

// Obtener todos los cursos
export const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.cursos.findMany({
      include: {
        usuario: {
          select: {
            nombre_completo: true,
            correo: true
          }
        },
        estado: true,
        inscripciones: {
          include: {
            estudiante: {
              select: {
                nombre: true,
                apellido: true
              }
            }
          }
        }
      },
      orderBy: {
        fecha_inicio: 'desc'
      }
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener cursos:", error);
  }
};

// Obtener cursos activos (para dropdown de asistencias)
export const getCursosActivos = async (req, res) => {
  try {
    const cursosActivos = await prisma.cursos.findMany({
      where: {
        estadoId: 1  // Solo cursos activos
      },
      select: {
        id: true,
        codigo_curso: true,
        nombre_curso: true,
        modalidad: true,
        fecha_inicio: true,
        fecha_fin: true
      },
      orderBy: {
        nombre_curso: 'asc'
      }
    });
    res.json(cursosActivos);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener cursos activos:", error);
  }
};

// Obtener un curso por ID con estudiantes inscritos
export const getCursoById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const curso = await prisma.cursos.findUnique({
      where: { id: Number(id) },
      include: {
        usuario: true,
        estado: true,
        inscripciones: {
          where: {
            estadoId: 1  // Solo inscripciones activas
          },
          include: {
            estudiante: true,
            asistencias: {
              orderBy: {
                fecha_clase: 'desc'
              },
              take: 5  // Últimas 5 asistencias
            }
          }
        }
      }
    });
    
    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    
    res.json(curso);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener curso:", error);
  }
};

// Actualizar un curso
export const updateCurso = async (req, res) => {
  const { id } = req.params;
  const { 
    codigo_curso,
    nombre_curso,
    nivel,
    descripcion,
    intensidad,
    modalidad,
    valor,
    fecha_inicio,
    fecha_fin,
    usuarioId,
    estadoId 
  } = req.body;
  
  try {
    const curso = await prisma.cursos.update({
      data: { 
        ...(codigo_curso && { codigo_curso }),
        ...(nombre_curso && { nombre_curso }),
        ...(nivel && { nivel }),
        ...(descripcion && { descripcion }),
        ...(intensidad && { intensidad: Number(intensidad) }),
        ...(modalidad && { modalidad }),
        ...(valor && { valor: Number(valor) }),
        ...(fecha_inicio && { fecha_inicio: new Date(fecha_inicio) }),
        ...(fecha_fin && { fecha_fin: new Date(fecha_fin) }),
        ...(usuarioId && { usuarioId: Number(usuarioId) }),
        ...(estadoId && { estadoId })
      },
      where: { id: Number(id) },
      include: {
        usuario: true,
        estado: true
      }
    });
    res.json(curso);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: "El código de curso ya existe" });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: "Curso no encontrado" });
    } else {
      res.status(400).json({ error: error.message });
    }
    console.error("Error al actualizar curso:", error);
  }
};

// Eliminar un curso (cambiar a inactivo)
export const deleteCurso = async (req, res) => {
  const { id } = req.params;
  
  try {
    const curso = await prisma.cursos.update({
      where: { id: Number(id) },
      data: { estadoId: 2 }, // 2 = Inactivo
      include: {
        estado: true
      }
    });
    res.json({ message: "Curso desactivado correctamente", curso });
  } catch (error) {
    res.status(404).json({ error: "Curso no encontrado" });
    console.error("Error al eliminar curso:", error);
  }
};

// Obtener estudiantes inscritos en un curso
export const getEstudiantesByCurso = async (req, res) => {
  const { cursoId } = req.params;
  
  try {
    const inscripciones = await prisma.inscripciones.findMany({
      where: { 
        cursoId: Number(cursoId),
        estadoId: 1  // Solo inscripciones activas
      },
      include: {
        estudiante: {
          include: {
            estado: true
          }
        }
      },
      orderBy: {
        estudiante: {
          apellido: 'asc'
        }
      }
    });
    
    // Extraer solo los estudiantes
    const estudiantes = inscripciones.map(inscripcion => ({
      ...inscripcion.estudiante,
      inscripcionId: inscripcion.id,
      fecha_inscripcion: inscripcion.fecha_inscripcion
    }));
    
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener estudiantes del curso:", error);
  }
};


