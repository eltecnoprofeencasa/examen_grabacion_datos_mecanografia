# Examen de mecanografía

Aplicación web estática para evaluar mecanografía de texto y teclado numérico sin base de datos ni servidor.

## Estructura

- `index.html`: estructura de las pantallas de configuración, examen y resultados.
- `css/styles.css`: diseño responsive y estilos de impresión.
- `js/content.js`: banco de frases y operaciones.
- `js/scoring.js`: cálculo de PPM, errores y puntuación.
- `js/exam.js`: motor del examen, líneas, cursores, temporizador, ENTER, BACKSPACE y cancelación.
- `js/app.js`: interfaz, navegación, resultados, privacidad y descarga mediante impresión del navegador.
- `tests/test-scoring.js`: pruebas automáticas de los cinco casos de puntuación solicitados.

## Funciones principales

- 10, 20 o 30 líneas.
- Dificultad fácil, media y difícil.
- Teclado de texto y teclado numérico.
- Una sola línea visible cada vez.
- Cursor visual en la línea de referencia y en la zona de escritura.
- Corrección inmediata mediante verde oscuro y rojo.
- Límite estricto de caracteres por línea.
- Mensaje no intrusivo `Presiona ENTER para continuar` al llegar al final.
- Registro de errores aunque se utilice BACKSPACE para corregir.
- Temporizador iniciado con la primera pulsación real.
- Botón `Anular examen` con confirmación.
- Bloqueo de copiar, cortar, pegar y arrastrar texto.
- Resultados sin fecha.
- Descarga mediante el diálogo de impresión de Chrome o Edge, seleccionando `Guardar como PDF`.
- Sin base de datos, cuentas, servidor ni servicios externos.

## Banco de contenidos

Editar `js/content.js`.

Los textos están organizados en:

- `TypingContent.TEXT.facil`
- `TypingContent.TEXT.medio`
- `TypingContent.TEXT.dificil`

Las operaciones están organizadas en:

- `TypingContent.NUMERIC.facil`
- `TypingContent.NUMERIC.medio`
- `TypingContent.NUMERIC.dificil`

En teclado numérico se utilizan exclusivamente números, punto decimal y los operadores `+`, `-`, `*` y `/`. No hay espacios, comas ni signo `=`.

## Puntuación

Editar `js/scoring.js`.

La precisión vale 5 puntos. Hasta un 5 % de error se obtienen 5 puntos. Entre el 5 % y el 10 % la puntuación disminuye linealmente hasta 0. Con más de un 10 % se mantienen 0 puntos.

La velocidad vale 5 puntos. Se obtienen 5 puntos con 300 PPM o más. Por debajo se calcula proporcionalmente.

`PPM` significa pulsaciones por minuto.

## Pruebas

Con Node.js instalado, desde la carpeta del proyecto:

```bash
node tests/test-scoring.js
```

Debe aparecer:

```text
Todas las pruebas de puntuación han pasado correctamente.
```

## Publicación

La aplicación es estática. Puede publicarse subiendo `index.html`, `css/` y `js/` a un repositorio y activando GitHub Pages, o utilizando un servicio de alojamiento estático como Netlify o Cloudflare Pages.

No necesita compilación.

## PDF

El botón `Descargar resultado` abre el diálogo de impresión del navegador. En Chrome o Edge se puede seleccionar `Guardar como PDF`. Los estilos de impresión ocultan los botones y las pantallas del examen. No se genera ni muestra la fecha.

## Privacidad

Los datos del alumno y los resultados se mantienen en memoria mientras dura la página. No existe base de datos y no se envían datos personales a servicios externos.
