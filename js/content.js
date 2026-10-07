(function () {
  "use strict";

  const TEXT = {
    facil: [
      "La mañana comienza con una taza de café.",
      "El teclado permite escribir con rapidez.",
      "La práctica mejora la precisión al escribir.",
      "Un buen ritmo ayuda a cometer menos errores.",
      "Cada ejercicio sirve para ganar confianza.",
      "El ordenador facilita muchas tareas.",
      "Conviene mantener una postura cómoda.",
      "Los dedos deben volver a su posición inicial.",
      "Es mejor escribir con calma que correr demasiado.",
      "La constancia produce buenos resultados.",
      "Una pantalla limpia facilita la concentración.",
      "El alumno debe mirar la línea de referencia.",
      "La precisión es importante para mejorar.",
      "Un pequeño error también puede servir para aprender.",
      "La velocidad aumenta con la práctica diaria.",
      "Cada tecla tiene una posición determinada.",
      "La escritura fluida necesita atención y práctica.",
      "Un ejercicio corto puede ser muy útil.",
      "La paciencia ayuda a mejorar la técnica.",
      "El objetivo es escribir mejor cada día."
    ],
    medio: [
      "La práctica constante permite aumentar la velocidad sin perder precisión.",
      "Antes de empezar conviene colocar las manos correctamente sobre el teclado.",
      "Una escritura eficaz combina ritmo, atención y control de los errores.",
      "El ordenador puede convertirse en una herramienta muy útil para estudiar.",
      "Durante el ejercicio es preferible mantener un ritmo estable y cómodo.",
      "La precisión debe mantenerse incluso cuando aumenta la velocidad.",
      "Los atajos de teclado permiten realizar muchas tareas con mayor rapidez.",
      "Aprender a escribir correctamente requiere tiempo, repetición y concentración.",
      "Un buen método consiste en mirar la referencia y no buscar las teclas.",
      "La tecnología facilita el trabajo cuando se utiliza de forma ordenada.",
      "Es importante corregir los hábitos que provocan errores repetidos.",
      "Una sesión breve y frecuente suele ser más útil que una práctica ocasional.",
      "La memoria muscular mejora cuando se repiten los mismos movimientos.",
      "El objetivo de una prueba no es correr, sino mantener un ritmo eficaz.",
      "Los resultados permiten conocer los puntos fuertes y los aspectos que deben mejorar."
    ],
    dificil: [
      "La mecanografía eficiente exige coordinación, precisión y una atención constante durante toda la prueba.",
      "Cuando aumenta la velocidad, resulta especialmente importante mantener una postura estable y relajada.",
      "La práctica deliberada permite reducir errores, mejorar el ritmo y automatizar movimientos complejos.",
      "Un alumno que controla la posición de sus manos puede concentrarse mejor en el contenido que escribe.",
      "La tecnología cambia con rapidez; sin embargo, una buena técnica de escritura sigue siendo fundamental.",
      "La precisión tiene prioridad sobre la velocidad cuando se pretende construir un hábito de escritura sólido.",
      "Durante una prueba exigente conviene mantener la concentración y evitar movimientos innecesarios.",
      "Los errores corregidos mediante BACKSPACE siguen formando parte del historial real de la escritura.",
      "Una planificación adecuada permite practicar caracteres, signos, mayúsculas y números de manera progresiva.",
      "La automatización de ciertos movimientos libera recursos mentales para comprender y organizar la información.",
      "Una escritura rápida y precisa no depende únicamente de la fuerza de los dedos, sino de la coordinación.",
      "La evaluación debe proporcionar información útil para que el alumno pueda identificar sus posibilidades de mejora.",
      "La constancia resulta especialmente importante cuando se pretende transformar una habilidad consciente en un hábito.",
      "La práctica con textos variados ayuda a desarrollar una técnica flexible ante diferentes situaciones de escritura.",
      "El equilibrio entre precisión y velocidad permite obtener un rendimiento elevado sin convertir la prueba en una carrera."
    ]
  };

  const NUMERIC = {
    facil: [
      "234+56", "450-125", "25*4", "100/5", "375+48", "820-315", "42*6", "960/8",
      "125+75", "740-240", "32*5", "840/7", "560+125", "900-450", "24*8", "720/9"
    ],
    medio: [
      "243.52-584*325.4", "125.50+37.25", "8542*25.5", "985.75/12.5",
      "7400-325.50+42.75", "1250.75+875.25", "452.6*125.4", "985.5/12.5+25.2",
      "854.25-125.75*4.5", "125.5+37.25-8.5", "4500.75/25.5", "784.25*32.5-15.2",
      "985.75+124.50/5.5", "640.25-85.75+42.5", "325.5*24.25", "852.75/15.5"
    ],
    dificil: [
      "452.3/456.2+652.3+456", "854.25*125.6-4582.75", "9856.75/125.5+784.25",
      "745000-28950.75+452.3", "1254.75+856.25*42.5-75.2", "985.25/45.5+652.75*4.2",
      "4521.75-825.5/12.5+75.25", "854.2*125.75-452.5+36.25", "12500.5/25.25+854.75-12.5",
      "745.25+852.75*45.5/5.5", "9854.25-125.75+452.5*8.25", "456.75/12.5+854.25-75.5",
      "1254.5*85.25-452.75/5.5", "985.75+452.25/15.5*42.5", "78542.25-854.75+125.5/4.5"
    ]
  };

  function shuffleCopy(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getLines(type, difficulty, count) {
    const source = type === "numerico" ? NUMERIC[difficulty] : TEXT[difficulty];
    if (!source || !source.length) return [];
    const result = [];
    let pool = shuffleCopy(source);
    while (result.length < count) {
      if (!pool.length) pool = shuffleCopy(source);
      result.push(pool.pop());
    }
    return result;
  }

  const api = { TEXT, NUMERIC, getLines };
  if (typeof window !== "undefined") window.TypingContent = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
