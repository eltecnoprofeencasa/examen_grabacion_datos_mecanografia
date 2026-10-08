const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

let now = 0;
const sandbox = {
  window: {
    setInterval: () => 1,
    clearInterval: () => {}
  },
  performance: { now: () => now },
  TypingContent: {
    getLines: () => ['abc']
  }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname, '..', 'js', 'exam.js'), 'utf8'), sandbox);

function event(key) {
  return {
    key,
    ctrlKey: false,
    metaKey: false,
    preventDefault() { this.prevented = true; }
  };
}

const states = [];
const statuses = [];
const finished = [];
const exam = new sandbox.window.TypingExam(
  { name: 'Alumno', group: '', lineCount: 1, difficulty: 'facil', examType: 'texto' },
  {
    focusInput() {},
    render() {},
    state(s) { states.push(s); },
    status(s) { statuses.push(s); },
    finish(data) { finished.push(data); }
  }
);

exam.start();

let e = event('Enter');
exam.handleKeyDown(e);
assert.equal(e.prevented, true);
assert.equal(exam.lineIndex, 0, 'ENTER no debe avanzar con la línea incompleta');
assert.equal(exam.errors, 0, 'ENTER incompleto no debe generar errores');
assert.equal(exam.totalKeystrokes, 0, 'ENTER no debe contar como pulsación');

for (const key of ['a', 'b', 'c']) exam.handleKeyDown(event(key));
assert.equal(exam.currentInput, 'abc');
assert.equal(exam.totalKeystrokes, 3);
assert.equal(exam.errors, 0);

exam.handleKeyDown(event('Enter'));
assert.equal(exam.finished, true, 'ENTER debe finalizar una línea completa si es la última');
assert.equal(exam.errors, 0);
assert.equal(exam.lineStats[0].missingCharacters, 0);
assert.equal(finished.length, 1);

const css = fs.readFileSync(require('node:path').join(__dirname, '..', 'css', 'styles.css'), 'utf8');
assert.match(css, /\.typing-line[^\{]*\{[^}]*overflow:\s*hidden/);
assert.match(css, /\.typing-line[^\{]*\{[^}]*white-space:\s*normal/);
assert.doesNotMatch(css, /\.typing-line[^\{]*\{[^}]*overflow-x:\s*auto/);

const content = fs.readFileSync(require('node:path').join(__dirname, '..', 'js', 'content.js'), 'utf8');
const numericStrings = [...content.matchAll(/"([0-9.+*\/-]+)"/g)].map(m => m[1]);
assert.ok(numericStrings.length > 0);
for (const value of numericStrings) {
  assert.match(value, /^[0-9.+*\/-]+$/, `Contenido numérico inválido: ${value}`);
  assert.doesNotMatch(value, /[ ,=]/, `Contenido numérico contiene espacio, coma o =: ${value}`);
}

console.log('Pruebas de comportamiento, responsive y contenido superadas.');
