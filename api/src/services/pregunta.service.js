import { preguntaRepository } from '../repositories/pregunta.repository.js';
import { AppError } from '../errors/AppError.js';
import { toPreguntaPublica } from '../utils/serializers.js';

function assertLeccionCuestionario(leccion) {
  if (leccion.tipo !== 'cuestionario') {
    throw new AppError(
      'Solo las lecciones de tipo cuestionario pueden tener preguntas.',
      422,
      'NOT_A_QUIZ'
    );
  }
}

function validarIndiceCorrecto(indiceCorrecto, totalOpciones) {
  if (!Number.isInteger(indiceCorrecto) || indiceCorrecto < 0 || indiceCorrecto >= totalOpciones) {
    throw new AppError(
      'El índice correcto debe apuntar a una de las opciones de la pregunta.',
      422,
      'INVALID_CORRECT_OPTION'
    );
  }
}

export const preguntaService = {
  async create(leccion, data) {
    assertLeccionCuestionario(leccion);
    validarIndiceCorrecto(data.indiceCorrecto, data.opciones.length);

    const pregunta = await preguntaRepository.create({
      enunciado: data.enunciado,
      opciones: data.opciones,
      indiceCorrecto: data.indiceCorrecto,
      leccionId: leccion.id,
    });

    return toPreguntaPublica(pregunta);
  },

  async update(pregunta, data) {
    const actual = await preguntaRepository.findByIdConRespuesta(pregunta.id);

    if (!actual) {
      throw new AppError('Pregunta no encontrada.', 404, 'QUESTION_NOT_FOUND');
    }

    const opciones = data.opciones ?? actual.opciones;
    const indiceCorrecto = data.indiceCorrecto ?? actual.indiceCorrecto;

    validarIndiceCorrecto(indiceCorrecto, opciones.length);

    const actualizada = await preguntaRepository.updateById(pregunta.id, data);
    return toPreguntaPublica(actualizada);
  },

  async remove(pregunta) {
    await preguntaRepository.deleteById(pregunta.id);
  },
};
