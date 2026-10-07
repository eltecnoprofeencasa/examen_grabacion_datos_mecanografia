(function () {
  "use strict";

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function calculatePPM(keystrokes, elapsedSeconds) {
    if (elapsedSeconds <= 0) return 0;
    return keystrokes / (elapsedSeconds / 60);
  }

  function calculateErrorPercent(errors, keystrokes) {
    if (keystrokes <= 0) return 0;
    return (errors / keystrokes) * 100;
  }

  function calculatePrecisionScore(errorPercent) {
    if (errorPercent <= 5) return 5;
    return clamp(5 * (1 - (errorPercent - 5) / 5), 0, 5);
  }

  function calculateSpeedScore(ppm) {
    return clamp(5 * ppm / 300, 0, 5);
  }

  function calculateFinalScore(precisionScore, speedScore) {
    return clamp(precisionScore + speedScore, 0, 10);
  }

  function calculateResults(data) {
    const ppm = calculatePPM(data.keystrokes, data.elapsedSeconds);
    const errorPercent = calculateErrorPercent(data.errors, data.keystrokes);
    const precisionScore = calculatePrecisionScore(errorPercent);
    const speedScore = calculateSpeedScore(ppm);
    const finalScore = calculateFinalScore(precisionScore, speedScore);
    return {
      ppm,
      errorPercent,
      precisionScore,
      speedScore,
      finalScore
    };
  }

  const api = {
    clamp,
    calculatePPM,
    calculateErrorPercent,
    calculatePrecisionScore,
    calculateSpeedScore,
    calculateFinalScore,
    calculateResults
  };

  if (typeof window !== "undefined") window.TypingScoring = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
