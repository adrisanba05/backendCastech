-- CreateTable
CREATE TABLE "public"."Estado" (
    "id" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Estudiantes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cursos" (
    "id" SERIAL NOT NULL,
    "codigo_curso" TEXT NOT NULL,
    "nombre_curso" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "intensidad" INTEGER NOT NULL,
    "modalidad" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "Cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asistencias" (
    "id" SERIAL NOT NULL,
    "fecha_clase" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT NOT NULL,
    "inscripcionesId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "Asistencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inscripciones" (
    "id" SERIAL NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estudianteId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estudiantes_numero_documento_key" ON "public"."Estudiantes"("numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiantes_correo_key" ON "public"."Estudiantes"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Cursos_codigo_curso_key" ON "public"."Cursos"("codigo_curso");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_usuario_key" ON "public"."Usuario"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "public"."Usuario"("correo");

-- AddForeignKey
ALTER TABLE "public"."Estudiantes" ADD CONSTRAINT "Estudiantes_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cursos" ADD CONSTRAINT "Cursos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cursos" ADD CONSTRAINT "Cursos_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencias" ADD CONSTRAINT "Asistencias_inscripcionesId_fkey" FOREIGN KEY ("inscripcionesId") REFERENCES "public"."Inscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencias" ADD CONSTRAINT "Asistencias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Asistencias" ADD CONSTRAINT "Asistencias_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripciones" ADD CONSTRAINT "Inscripciones_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripciones" ADD CONSTRAINT "Inscripciones_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."Cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripciones" ADD CONSTRAINT "Inscripciones_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "public"."Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
