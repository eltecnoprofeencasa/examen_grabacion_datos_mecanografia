(function () {
  "use strict";

  class TypingExam {
    constructor(config, callbacks) {
      this.config = config;
      this.callbacks = callbacks || {};
      this.lines = TypingContent.getLines(config.examType, config.difficulty, config.lineCount);
      this.lineIndex = 0;
      this.currentTarget = this.lines[0] || "";
      this.currentInput = "";
      this.currentVisual = [];
      this.totalKeystrokes = 0;
      this.correctCharacters = 0;
      this.errors = 0;
      this.startedAt = null;
      this.elapsedSeconds = 0;
      this.timerId = null;
      this.finished = false;
      this.cancelled = false;
      this.lineStats = [];
    }

    start() {
      this.renderLine();
      this.emit("state", this.getState());
      this.focusInput();
    }

    focusInput() {
      if (this.callbacks.focusInput) this.callbacks.focusInput();
    }

    beginTiming() {
      if (this.startedAt !== null || this.finished || this.cancelled) return;
      this.startedAt = performance.now();
      this.timerId = window.setInterval(() => {
        this.elapsedSeconds = (performance.now() - this.startedAt) / 1000;
        this.emit("timer", this.elapsedSeconds);
      }, 100);
      this.emit("timer", 0);
      this.emit("status", "Examen en curso.");
    }

    stopTiming() {
      if (this.startedAt !== null) {
        this.elapsedSeconds = (performance.now() - this.startedAt) / 1000;
      }
      if (this.timerId !== null) {
        window.clearInterval(this.timerId);
        this.timerId = null;
      }
    }

    handleKeyDown(event) {
      if (this.finished || this.cancelled) return;

      if (event.key === "Tab") {
        event.preventDefault();
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        if (["v", "V", "c", "C", "x", "X", "a", "A"].includes(event.key)) {
          event.preventDefault();
        }
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        // ENTER solo permite avanzar cuando la línea está completamente escrita.
        // Si aún faltan caracteres, se ignora sin generar errores ni cambiar estadísticas.
        if (this.currentInput.length < this.currentTarget.length) {
          // ENTER no tiene ningún efecto mientras la línea esté incompleta.
          this.focusInput();
          return;
        }
        this.finishLine();
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        if (this.currentInput.length > 0) {
          this.currentInput = this.currentInput.slice(0, -1);
          this.currentVisual.pop();
          this.renderLine();
          this.emit("state", this.getState());
        }
        return;
      }

      if (event.key.length !== 1) return;
      if (this.currentInput.length >= this.currentTarget.length) {
        event.preventDefault();
        this.showContinueMessage(true);
        this.focusInput();
        return;
      }

      event.preventDefault();
      this.beginTiming();

      const expected = this.currentTarget[this.currentInput.length];
      const actual = event.key;
      const correct = actual === expected;

      this.currentInput += actual;
      this.currentVisual.push({ char: actual, correct });
      this.totalKeystrokes += 1;
      if (correct) this.correctCharacters += 1;
      else this.errors += 1;

      this.renderLine();
      this.emit("state", this.getState());

      if (this.currentInput.length >= this.currentTarget.length) {
        this.showContinueMessage(true);
      }
    }

    finishLine() {
      // Esta función solo debe ejecutarse con la línea completa.
      if (this.currentInput.length < this.currentTarget.length) return;

      this.lineStats.push({
        target: this.currentTarget,
        input: this.currentInput,
        typed: this.currentInput.length,
        targetLength: this.currentTarget.length,
        correctCharacters: this.currentVisual.filter(c => c.correct).length,
        wrongCharacters: this.currentVisual.filter(c => !c.correct).length,
        missingCharacters: 0
      });

      if (this.lineIndex >= this.lines.length - 1) {
        this.finished = true;
        this.stopTiming();
        this.emit("timer", this.elapsedSeconds);
        this.emit("finish", this.getFinalData());
        return;
      }

      this.lineIndex += 1;
      this.currentTarget = this.lines[this.lineIndex];
      this.currentInput = "";
      this.currentVisual = [];
      this.renderLine();
      this.emit("state", this.getState());
      this.emit("status", "Continúa con la siguiente línea.");
      this.focusInput();
    }

    renderLine() {
      if (this.callbacks.render) {
        this.callbacks.render({
          target: this.currentTarget,
          visual: this.currentVisual,
          inputLength: this.currentInput.length,
          lineIndex: this.lineIndex,
          lineCount: this.lines.length
        });
      }
    }

    showContinueMessage(visible) {
      if (this.callbacks.continueMessage) this.callbacks.continueMessage(visible);
    }

    cancel() {
      if (this.finished || this.cancelled) return;
      this.cancelled = true;
      this.stopTiming();
      this.emit("cancel");
    }

    getState() {
      return {
        lineIndex: this.lineIndex,
        lineCount: this.lines.length,
        currentTarget: this.currentTarget,
        currentInput: this.currentInput,
        totalKeystrokes: this.totalKeystrokes,
        correctCharacters: this.correctCharacters,
        errors: this.errors,
        elapsedSeconds: this.elapsedSeconds,
        started: this.startedAt !== null
      };
    }

    getFinalData() {
      return {
        config: this.config,
        lines: this.lines.slice(),
        lineStats: this.lineStats.slice(),
        keystrokes: this.totalKeystrokes,
        correctCharacters: this.correctCharacters,
        errors: this.errors,
        elapsedSeconds: this.elapsedSeconds
      };
    }

    emit(type, payload) {
      const callback = this.callbacks[type];
      if (typeof callback === "function") callback(payload);
    }
  }

  window.TypingExam = TypingExam;
})();
