# Examen de mecanografía version 1.2

Aplicación web estática para realizar exámenes de mecanografía en navegador.

## Tecnologías

- HTML5
- CSS3
- JavaScript vanilla

No necesita servidor, base de datos ni instalación.

## Modalidades

- Teclado de texto
- Teclado numérico

## Dificultades

- Fácil
- Medio
- Difícil

## Funcionamiento

El examen muestra una línea cada vez. El alumno debe escribir exactamente la misma cantidad de caracteres que aparecen en la referencia. Al completar la línea aparece el mensaje «Presiona ENTER para continuar».

ENTER solo permite avanzar cuando la línea está completamente escrita. Si se pulsa antes, la pulsación se ignora y no genera errores ni modifica las estadísticas.

BACKSPACE permite corregir visualmente, pero no elimina los errores históricos ya contabilizados.

El temporizador comienza con el primer carácter real escrito, no al comenzar el examen.

Las líneas largas de dificultad Media y Difícil se ajustan al espacio disponible y se pueden distribuir en varias líneas para evitar desplazamiento horizontal.

## Contenido numérico

El modo numérico utiliza números, punto decimal y los operadores `+`, `-`, `*` y `/`. No utiliza espacios, comas ni `=`.

## Puntuación

- PPM: pulsaciones por minuto.
- Precisión: 0 a 5 puntos según porcentaje de errores.
- Velocidad: 0 a 5 puntos, con 300 PPM como máximo.
- Nota final: precisión + velocidad, máximo 10 puntos.

## Pruebas

Pruebas de puntuación:

```bash
node tests/test-scoring.js
```

Pruebas adicionales de comportamiento, ENTER, contenido numérico y ajuste responsive:

```bash
node tests/test-exam-behavior.js
```

## Publicación

La aplicación está preparada para publicarse como sitio estático en GitHub Pages, Cloudflare Pages, Netlify u otros servicios equivalentes.

Para GitHub Pages, `index.html` debe quedar en la raíz del repositorio y la publicación debe realizarse desde la rama `main` y la carpeta `/root`.

## PDF

El botón de resultados utiliza la impresión del navegador para permitir guardar el resultado como PDF. El contenido del resultado no muestra la fecha del examen.
