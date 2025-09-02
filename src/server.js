// importaciones
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import asistencias from "./routes/asistencias.js";
import estudiantes from './routes/estudiantes.js';
import cursos from './routes/cursos.js';
import inscripciones from './routes/inscripciones.js';

import { connect } from "./prismaClient.js";

// configuraciones

dotenv.config();
const app = express();
app.use(cors()); // Permite peticiones desde otros orígenes (ej: frontend)
app.use(express.json()); // Permite recibir JSON desde el frontend
app.use("/api", asistencias);    // /api/asistencias/*
app.use("/api", estudiantes);     // /api/estudiantes/*
app.use("/api", cursos);          // /api/cursos/*
app.use("/api", inscripciones); // Prefijo para nuestras rutas

connect();

//Puesta en marcha de servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
