import prisma from "../prismaClient.js";

// Crear un estudiante nuevo
export const createEstudiante = async (req, res) => {
  const { 
    nombre, 
    apellido, 
    tipo_documento, 
    numero_documento, 
    fecha_nacimiento, 
    correo, 
    telefono, 
    ciudad, 
    estadoId 
  } = req.body;
  
  try {
    const estudiante = await prisma.estudiantes.create({
      data: { 
        nombre,
        apellido,
        tipo_documento,
        numero_documento,
        fecha_nacimiento: new Date(fecha_nacimiento),
        correo,
        telefono,
        ciudad,
        estadoId: estadoId || 1 // Por defecto activo
      },
      include: {
        estado: true  // Incluir información del estado
      }
    });
    res.json(estudiante);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: "El documento o correo ya existe" });
    } else {
      res.status(400).json({ error: error.message });
    }
    console.error("Error al crear estudiante:", error);
  }
};

// Obtener todos los estudiantes
export const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await prisma.estudiantes.findMany({
      include: {
        estado: true,
        inscripciones: {
          include: {
            curso: true
          }
        }
      },
      orderBy: {
        apellido: 'asc'
      }
    });
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener estudiantes:", error);
  }
};

// Obtener un estudiante por ID
export const getEstudianteById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const estudiante = await prisma.estudiantes.findUnique({
      where: { id: Number(id) },
      include: {
        estado: true,
        inscripciones: {
          include: {
            curso: true,
            asistencias: {
              include: {
                estado: true
              }
            }
          }
        }
      }
    });
    
    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }
    
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al obtener estudiante:", error);
  }
};

// Actualizar un estudiante
export const updateEstudiante = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    apellido, 
    tipo_documento, 
    numero_documento, 
    fecha_nacimiento, 
    correo, 
    telefono, 
    ciudad, 
    estadoId 
  } = req.body;
  
  try {
    const estudiante = await prisma.estudiantes.update({
      data: { 
        ...(nombre && { nombre }),
        ...(apellido && { apellido }),
        ...(tipo_documento && { tipo_documento }),
        ...(numero_documento && { numero_documento }),
        ...(fecha_nacimiento && { fecha_nacimiento: new Date(fecha_nacimiento) }),
        ...(correo && { correo }),
        ...(telefono && { telefono }),
        ...(ciudad && { ciudad }),
        ...(estadoId && { estadoId })
      },
      where: { id: Number(id) },
      include: {
        estado: true
      }
    });
    res.json(estudiante);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: "El documento o correo ya existe" });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: "Estudiante no encontrado" });
    } else {
      res.status(400).json({ error: error.message });
    }
    console.error("Error al actualizar estudiante:", error);
  }
};

// Eliminar un estudiante (cambiar estado a inactivo)
export const deleteEstudiante = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Soft delete: cambiar a estado inactivo en lugar de eliminar
    const estudiante = await prisma.estudiantes.update({
      where: { id: Number(id) },
      data: { estadoId: 2 }, // 2 = Inactivo
      include: {
        estado: true
      }
    });
    res.json({ message: "Estudiante desactivado correctamente", estudiante });
  } catch (error) {
    res.status(404).json({ error: "Estudiante no encontrado" });
    console.error("Error al eliminar estudiante:", error);
  }
};

// Buscar estudiantes por filtros
export const searchEstudiantes = async (req, res) => {
  const { nombre, documento, correo, estado } = req.query;
  
  try {
    const whereCondition = {};
    
    if (nombre) {
      whereCondition.OR = [
        { nombre: { contains: nombre, mode: 'insensitive' } },
        { apellido: { contains: nombre, mode: 'insensitive' } }
      ];
    }
    
    if (documento) {
      whereCondition.numero_documento = { contains: documento };
    }
    
    if (correo) {
      whereCondition.correo = { contains: correo, mode: 'insensitive' };
    }
    
    if (estado) {
      whereCondition.estadoId = Number(estado);
    }
    
    const estudiantes = await prisma.estudiantes.findMany({
      where: whereCondition,
      include: {
        estado: true,
        inscripciones: {
          include: {
            curso: true
          }
        }
      },
      orderBy: {
        apellido: 'asc'
      }
    });
    
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al buscar estudiantes:", error);
  }
};