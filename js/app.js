(function () {
  "use strict";

  const $ = id => document.getElementById(id);
  let exam = null;
  let lastResult = null;

  const setupScreen = $("setup-screen");
  const examScreen = $("exam-screen");
  const resultsScreen = $("results-screen");
  const setupForm = $("setup-form");
  const nameInput = $("student-name");
  const groupInput = $("student-group");
  const nameError = $("name-error");
  const referenceLine = $("reference-line");
  const writingLine = $("writing-line");
  const typingInput = $("typing-input");
  const continueMessage = $("continue-message");
  const progressText = $("progress-text");
  const timer = $("timer");
  const statusText = $("status-text");
  const examModeLabel = $("exam-mode-label");
  const cancelExam = $("cancel-exam");
  const confirmModal = $("confirm-modal");
  const confirmCancel = $("confirm-cancel");
  const confirmAbort = $("confirm-abort");

  function showScreen(screen) {
    [setupScreen, examScreen, resultsScreen].forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("es-ES", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
    }[char]));
  }

  function renderReference(target, inputLength) {
    referenceLine.innerHTML = "";
    [...target].forEach((char, index) => {
      const span = document.createElement("span");
      span.className = "char";
      if (index === inputLength && inputLength < target.length) span.classList.add("cursor-target");
      span.textContent = char;
      referenceLine.appendChild(span);
    });
    if (inputLength >= target.length) {
      const marker = document.createElement("span");
      marker.className = "typing-cursor";
      referenceLine.appendChild(marker);
    }
  }

  function renderWriting(visual, inputLength, targetLength) {
    writingLine.innerHTML = "";
    visual.forEach(item => {
      const span = document.createElement("span");
      span.className = `char ${item.correct ? "correct" : "wrong"}`;
      span.textContent = item.char;
      writingLine.appendChild(span);
    });

    const cursor = document.createElement("span");
    cursor.className = "typing-cursor" + (inputLength < targetLength && visual.length && !visual[visual.length - 1].correct ? " cursor-wrong" : "");
    writingLine.appendChild(cursor);
  }

  function resetInput() {
    typingInput.value = "";
  }

  function startExam(config) {
    exam = new TypingExam(config, {
      render: payload => {
        renderReference(payload.target, payload.inputLength);
        renderWriting(payload.visual, payload.inputLength, payload.target.length);
        progressText.textContent = `Línea ${payload.lineIndex + 1} de ${payload.lineCount}`;
        continueMessage.classList.toggle("visible", payload.inputLength >= payload.target.length);
      },
      focusInput: () => typingInput.focus(),
      continueMessage: visible => continueMessage.classList.toggle("visible", visible),
      timer: seconds => { timer.textContent = formatTime(seconds); },
      status: message => { statusText.textContent = message; },
      state: state => {
        if (!state.started) statusText.textContent = "Empieza a escribir para iniciar el tiempo.";
      },
      finish: data => finishExam(data),
      cancel: () => abortExam()
    });

    resetInput();
    timer.textContent = "00:00";
    examModeLabel.textContent = `${config.examType === "texto" ? "Teclado de texto" : "Teclado numérico"} · ${difficultyLabel(config.difficulty)}`;
    showScreen(examScreen);
    exam.start();
  }

  function difficultyLabel(value) {
    return ({ facil: "Fácil", medio: "Medio", dificil: "Difícil" })[value] || value;
  }

  function typeLabel(value) {
    return value === "texto" ? "Teclado de texto" : "Teclado numérico";
  }

  function finishExam(data) {
    const scores = TypingScoring.calculateResults(data);
    lastResult = {
      ...data,
      scores,
      config: { ...data.config }
    };
    renderResults(lastResult);
    showScreen(resultsScreen);
  }

  function renderResults(result) {
    const { config, scores } = result;
    const summary = [
      ["Nombre", config.name],
      ...(config.group ? [["Grupo", config.group]] : []),
      ["Modalidad", typeLabel(config.examType)],
      ["Dificultad", difficultyLabel(config.difficulty)],
      ["Líneas", config.lineCount],
      ["Tiempo", formatTime(result.elapsedSeconds)],
      ["Pulsaciones", result.keystrokes],
      ["PPM", formatNumber(scores.ppm, 2)],
      ["Errores", result.errors],
      ["Porcentaje de error", `${formatNumber(scores.errorPercent, 2)} %`]
    ];

    $("results-summary").innerHTML = summary.map(([label, value]) => `
      <div class="result-row"><span class="result-label">${escapeHtml(label)}</span><span class="result-value">${escapeHtml(value)}</span></div>
    `).join("");

    $("precision-score").textContent = `${formatNumber(scores.precisionScore)} / 5`;
    $("speed-score").textContent = `${formatNumber(scores.speedScore)} / 5`;
    $("final-score").textContent = `${formatNumber(scores.finalScore)} / 10`;

    const explanation = config.examType === "texto"
      ? `Has realizado una prueba de copia de texto. Se ha evaluado tu velocidad de escritura, tus pulsaciones y los errores cometidos durante la prueba.<br><br><strong>PPM:</strong> ${formatNumber(scores.ppm)}<br><strong>Porcentaje de error:</strong> ${formatNumber(scores.errorPercent)} %<br><strong>Precisión:</strong> ${formatNumber(scores.precisionScore)}/5<br><strong>Velocidad:</strong> ${formatNumber(scores.speedScore)}/5<br><strong>Nota final:</strong> ${formatNumber(scores.finalScore)}/10`
      : `Has realizado una prueba de teclado numérico. Se ha evaluado la introducción de números, decimales y operaciones mediante el teclado.<br><br>No se ha evaluado el resultado matemático de las operaciones.<br><br><strong>PPM:</strong> ${formatNumber(scores.ppm)}<br><strong>Porcentaje de error:</strong> ${formatNumber(scores.errorPercent)} %<br><strong>Precisión:</strong> ${formatNumber(scores.precisionScore)}/5<br><strong>Velocidad:</strong> ${formatNumber(scores.speedScore)}/5<br><strong>Nota final:</strong> ${formatNumber(scores.finalScore)}/10`;
    $("result-explanation").innerHTML = explanation;
  }

  function showCancelModal() {
    confirmModal.classList.remove("hidden");
    confirmAbort.focus();
  }

  function hideCancelModal() {
    confirmModal.classList.add("hidden");
    typingInput.focus();
  }

  function abortExam() {
    if (exam) {
      exam.stopTiming();
      exam = null;
    }
    lastResult = null;
    resetInput();
    referenceLine.innerHTML = "";
    writingLine.innerHTML = "";
    continueMessage.classList.remove("visible");
    timer.textContent = "00:00";
    statusText.textContent = "Empieza a escribir para iniciar el tiempo.";
    hideCancelModal();
    showScreen(setupScreen);
    nameInput.focus();
  }

  setupForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameError.textContent = "Introduce el nombre del alumno.";
      nameInput.focus();
      return;
    }
    nameError.textContent = "";

    const config = {
      name,
      group: groupInput.value.trim(),
      lineCount: Number(document.querySelector('input[name="lines"]:checked').value),
      difficulty: document.querySelector('input[name="difficulty"]:checked').value,
      examType: document.querySelector('input[name="examType"]:checked').value
    };
    startExam(config);
  });

  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim()) nameError.textContent = "";
  });

  typingInput.addEventListener("keydown", event => {
    if (!exam) return;
    exam.handleKeyDown(event);
  });

  typingInput.addEventListener("paste", event => event.preventDefault());
  typingInput.addEventListener("copy", event => event.preventDefault());
  typingInput.addEventListener("cut", event => event.preventDefault());
  typingInput.addEventListener("drop", event => event.preventDefault());
  typingInput.addEventListener("dragover", event => event.preventDefault());
  typingInput.addEventListener("contextmenu", event => event.preventDefault());

  cancelExam.addEventListener("click", showCancelModal);
  confirmCancel.addEventListener("click", hideCancelModal);
  confirmAbort.addEventListener("click", () => {
    if (exam) exam.cancel();
    else abortExam();
  });
  confirmModal.addEventListener("click", event => {
    if (event.target === confirmModal) hideCancelModal();
  });

  $("new-exam").addEventListener("click", () => {
    lastResult = null;
    showScreen(setupScreen);
    nameInput.focus();
  });

  $("download-result").addEventListener("click", () => {
    if (!lastResult) return;
    window.print();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !confirmModal.classList.contains("hidden")) hideCancelModal();
    if (!examScreen.classList.contains("hidden") && document.activeElement !== typingInput && !confirmModal.classList.contains("hidden")) return;
    if (!examScreen.classList.contains("hidden") && document.activeElement !== typingInput && confirmModal.classList.contains("hidden")) typingInput.focus();
  });

  window.addEventListener("beforeunload", event => {
    if (exam && !exam.finished && !exam.cancelled) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
})();
