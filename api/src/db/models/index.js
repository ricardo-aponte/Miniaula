import { sequelize } from '../../config/database.js';
import { Usuario } from './usuario.model.js';
import { Curso } from './curso.model.js';
import { Leccion } from './leccion.model.js';
import { Pregunta } from './pregunta.model.js';
import { Inscripcion } from './inscripcion.model.js';
import { Progreso } from './progreso.model.js';

// Usuario (instructor) <-> Curso
Usuario.hasMany(Curso, { foreignKey: 'instructorId', as: 'cursosDictados' });
Curso.belongsTo(Usuario, { foreignKey: 'instructorId', as: 'instructor' });

// Curso <-> Leccion
Curso.hasMany(Leccion, { foreignKey: 'cursoId', as: 'lecciones' });
Leccion.belongsTo(Curso, { foreignKey: 'cursoId', as: 'curso' });

// Leccion <-> Pregunta
Leccion.hasMany(Pregunta, { foreignKey: 'leccionId', as: 'preguntas' });
Pregunta.belongsTo(Leccion, { foreignKey: 'leccionId', as: 'leccion' });

// Usuario (estudiante) <-> Inscripcion <-> Curso
Usuario.hasMany(Inscripcion, { foreignKey: 'estudianteId', as: 'inscripciones' });
Inscripcion.belongsTo(Usuario, { foreignKey: 'estudianteId', as: 'estudiante' });

Curso.hasMany(Inscripcion, { foreignKey: 'cursoId', as: 'inscripciones' });
Inscripcion.belongsTo(Curso, { foreignKey: 'cursoId', as: 'curso' });

// Inscripcion <-> Progreso <-> Leccion
Inscripcion.hasMany(Progreso, { foreignKey: 'inscripcionId', as: 'progresos' });
Progreso.belongsTo(Inscripcion, { foreignKey: 'inscripcionId', as: 'inscripcion' });

Leccion.hasMany(Progreso, { foreignKey: 'leccionId', as: 'progresos' });
Progreso.belongsTo(Leccion, { foreignKey: 'leccionId', as: 'leccion' });

export {
  sequelize,
  Usuario,
  Curso,
  Leccion,
  Pregunta,
  Inscripcion,
  Progreso,
};