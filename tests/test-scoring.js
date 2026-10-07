const scoring = require('../js/scoring.js');

function assertClose(actual, expected, message) {
  if (Math.abs(actual - expected) > 0.000001) {
    throw new Error(`${message}: esperado ${expected}, obtenido ${actual}`);
  }
}

const cases = [
  { ppm: 300, error: 0, precision: 5, speed: 5, final: 10 },
  { ppm: 300, error: 5, precision: 5, speed: 5, final: 10 },
  { ppm: 150, error: 0, precision: 5, speed: 2.5, final: 7.5 },
  { ppm: 300, error: 10, precision: 0, speed: 5, final: 5 },
  { ppm: 150, error: 10, precision: 0, speed: 2.5, final: 2.5 }
];

cases.forEach((test, index) => {
  const result = scoring.calculateResults({
    keystrokes: test.ppm,
    elapsedSeconds: 60,
    errors: test.error === 0 ? 0 : test.ppm * test.error / 100
  });
  assertClose(result.ppm, test.ppm, `Prueba ${index + 1}, PPM`);
  assertClose(result.errorPercent, test.error, `Prueba ${index + 1}, error`);
  assertClose(result.precisionScore, test.precision, `Prueba ${index + 1}, precisión`);
  assertClose(result.speedScore, test.speed, `Prueba ${index + 1}, velocidad`);
  assertClose(result.finalScore, test.final, `Prueba ${index + 1}, nota`);
});

console.log('Todas las pruebas de puntuación han pasado correctamente.');
