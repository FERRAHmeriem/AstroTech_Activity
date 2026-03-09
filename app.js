/* ══════════════════════════════════════════════
   ASTROTECH BRAINSTORMING — APP.JS
══════════════════════════════════════════════ */

const DEBATE_QUESTIONS = [
"Do you think Aliens exist ?",
"Do you think space exploration is overrated? Or Underrated? ",
"Should we spend more on space exploration or on maintaining our earth and eco-system ?",

];

const QUIZ_QUESTIONS = [
  {
    question: "How many planets are officially recognized in our Solar System? Can you name them all?",
    answer: "8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
    info: "In 2006 the IAU redefined 'planet', removing Pluto which became a 'dwarf planet'. The 8 planets orbit the Sun and have cleared the neighbourhood around their orbits."
  },
  {
    question: "How far is Earth from the Sun, and how long does sunlight take to reach us?",
    answer: "About 150 million km. Sunlight takes approximately 8 minutes and 20 seconds to reach Earth.",
    info: "This average distance is defined as 1 Astronomical Unit (AU). Earth's orbit is slightly elliptical — ranging from 147 million km in January to 152 million km in July. Light travels at 299,792 km/s."
  },
  {
    question: "Which planet in our Solar System has the most moons, and roughly how many does it have?",
    answer: "Saturn holds the record with 146 confirmed moons (as of 2023).",
    info: "Saturn's largest moon Titan is bigger than Mercury and has a thick nitrogen atmosphere with lakes of liquid methane. Jupiter comes second with 95 confirmed moons."
  },
  {
    question: "What is the Fermi Paradox, and why is it relevant to the question of alien life?",
    answer: "It is the contradiction between the high probability of alien civilizations existing and the complete lack of any contact or evidence.",
    info: "Physicist Enrico Fermi asked: 'If intelligent aliens exist, where is everybody?' Given billions of Earth-like planets there should be many advanced civilizations. The 'Great Filter' hypothesis suggests intelligent life may be far rarer than we think."
  },
  {
    question: "Is space exploration worth its enormous cost, or should that money address Earth's problems?",
    answer: "Both sides have strong arguments. Space budgets are typically less than 0.5% of national GDP, yet produce technologies used in daily life.",
    info: "NASA's annual budget is roughly $25 billion — about 0.3% of the US federal budget. Space programs produced GPS, memory foam, water filters, and life-saving medical devices. Many scientists argue the return on investment far exceeds the initial cost."
  }
];


/* ══════════════════════════════════════════════
   TOPIC 1 — Debate + Timer
══════════════════════════════════════════════ */
var Topic1 = (function () {
  var TOTAL = 180;
  var CIRC  = 2 * Math.PI * 88;
  var secondsLeft = TOTAL;
  var timer   = null;
  var running = false;
  var usedIdx = [];

  function init() {
    if (!document.getElementById('debate-question')) return;
    pickQuestion();
    updateDisplay();
  }

  function newQuestion() { pickQuestion(); resetTimer(); }

  function pickQuestion() {
    if (usedIdx.length >= DEBATE_QUESTIONS.length) usedIdx = [];
    var idx;
    do { idx = Math.floor(Math.random() * DEBATE_QUESTIONS.length); }
    while (usedIdx.indexOf(idx) !== -1);
    usedIdx.push(idx);
    document.getElementById('debate-question').textContent = DEBATE_QUESTIONS[idx];
  }

  function startTimer() {
    if (running) return;
    running = true;
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'inline-flex';
    document.getElementById('timer-status').textContent = 'running';
    document.getElementById('timer-msg').textContent = '';
    document.getElementById('timer-msg').className = 'timer-msg';
    timer = setInterval(function () {
      secondsLeft--;
      updateDisplay();
      if (secondsLeft <= 0) { clearInterval(timer); running = false; onFinish(); }
    }, 1000);
  }

  function pauseTimer() {
    if (!running) return;
    clearInterval(timer); running = false;
    document.getElementById('btn-start').style.display = 'inline-flex';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('timer-status').textContent = 'paused';
  }

  function resetTimer() {
    clearInterval(timer); running = false; secondsLeft = TOTAL;
    document.getElementById('btn-start').style.display = 'inline-flex';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('timer-status').textContent = 'ready';
    document.getElementById('timer-msg').textContent = '';
    document.getElementById('timer-msg').className = 'timer-msg';
    updateDisplay();
  }

  function updateDisplay() {
    var m = Math.floor(secondsLeft / 60);
    var s = secondsLeft % 60;
    var digits = document.getElementById('timer-digits');
    var ring   = document.getElementById('ring-progress');
    var status = document.getElementById('timer-status');
    if (!digits) return;
    digits.textContent = '0' + m + ':' + (s < 10 ? '0' : '') + s;
    var frac = secondsLeft / TOTAL;
    ring.style.strokeDashoffset = CIRC * (1 - frac);
    ring.classList.remove('warn', 'danger');
    digits.classList.remove('warn', 'danger');
    if (frac <= 0.15) {
      ring.classList.add('danger'); digits.classList.add('danger');
      if (running) status.textContent = 'time almost up!';
    } else if (frac <= 0.35) {
      ring.classList.add('warn'); digits.classList.add('warn');
    }
  }

  function onFinish() {
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('timer-status').textContent = "time's up!";
    var msg = document.getElementById('timer-msg');
    msg.textContent = 'Time is up! Wrap up your debate.';
    msg.classList.add('visible');
    var wrap = document.querySelector('.timer-ring-wrap');
    if (wrap) { wrap.classList.add('ring-pulse'); setTimeout(function(){ wrap.classList.remove('ring-pulse'); }, 2400); }
  }

  window.addEventListener('load', init);
  return { newQuestion: newQuestion, startTimer: startTimer, pauseTimer: pauseTimer, resetTimer: resetTimer };
}());


/* ══════════════════════════════════════════════
   TOPIC 2 — Quiz + Score
══════════════════════════════════════════════ */
var Topic2 = (function () {

  var current = 0;
  var score   = { p1: 0, p2: 0, tie: 0 };
  var TOTAL   = QUIZ_QUESTIONS.length;

  /* ── get element by id ── */
  function el(id) { return document.getElementById(id); }

  /* ── Init on page load ── */
  function init() {
    if (!el('quiz-q-text')) return;
    current = 0;
    score   = { p1: 0, p2: 0, tie: 0 };
    renderChecks();
    loadQuestion();
  }

  /* ── Draw check icons in scoreboard ── */
  function renderChecks() {
    var p1 = el('checks-p1');
    var p2 = el('checks-p2');
    if (!p1 || !p2) return;
    p1.innerHTML = '';
    p2.innerHTML = '';
    for (var i = 0; i < TOTAL; i++) {
      var a = document.createElement('img');
      a.className = 'check-icon';
      a.src = i < score.p1 ? './images/check-green.svg' : './images/check-white.svg';
      p1.appendChild(a);

      var b = document.createElement('img');
      b.className = 'check-icon';
      b.src = i < score.p2 ? './images/check-green.svg' : './images/check-white.svg';
      p2.appendChild(b);
    }
  }

  /* ── Load question: STATE = waiting for Show Answer ── */
  function loadQuestion() {
    var q = QUIZ_QUESTIONS[current];

    // Update question text
    el('quiz-q-num').textContent  = 'Q' + (current + 1);
    el('quiz-q-text').textContent = q.question;
    el('nav-progress').textContent = 'Q ' + (current + 1) + ' / ' + TOTAL;
    el('progress-bar-inner').style.width = ((current / TOTAL) * 100) + '%';

    // ---- RESET ALL PANELS ----
    // Hide answer panel
    el('answer-panel').style.display = 'none';

    // Clear answer content
    el('answer-text').textContent = '';
    el('extra-info').textContent  = '';
    el('extra-info').style.display = 'none';

    // Show picker, clear banner
    el('round-winner-picker').style.display = 'block';
    el('round-result-banner').style.display = 'none';
    el('round-result-banner').textContent   = '';
    el('round-result-banner').className     = 'round-result-banner';

    // Re-enable picker buttons
    el('pick-p1').disabled = false;
    el('pick-p2').disabled = false;
    el('pick-tie').disabled = false;
    el('pick-p1').classList.remove('pick-btn-selected');
    el('pick-p2').classList.remove('pick-btn-selected');
    el('pick-tie').classList.remove('pick-btn-selected');

    // Show "Show Answer" button
    el('btn-show-answer').style.display = 'inline-flex';

    // Hide next button
    el('quiz-nav-row').style.display = 'none';

    // Show card, hide finished
    el('quiz-card').style.display    = 'flex';
    el('finished-panel').style.display = 'none';
  }

  /* ── User clicks Show Answer: STATE = waiting for winner pick ── */
  function showAnswer() {
    var q = QUIZ_QUESTIONS[current];

    // Fill answer
    el('answer-text').textContent = q.answer;
    if (q.info) {
      el('extra-info').textContent   = q.info;
      el('extra-info').style.display = 'block';
    }

    // Show answer panel
    el('answer-panel').style.display = 'block';

    // Hide the Show Answer button
    el('btn-show-answer').style.display = 'none';

    // Keep next hidden until winner is picked
    el('quiz-nav-row').style.display = 'none';
  }

  /* ── User picks winner: STATE = ready for next ── */
  function pickWinner(who) {
    // Update score
    if      (who === 1) score.p1++;
    else if (who === 2) score.p2++;
    else                score.tie++;
    renderChecks();

    // Disable all 3 buttons, highlight chosen
    el('pick-p1').disabled  = true;
    el('pick-p2').disabled  = true;
    el('pick-tie').disabled = true;
    if      (who === 1) el('pick-p1').classList.add('pick-btn-selected');
    else if (who === 2) el('pick-p2').classList.add('pick-btn-selected');
    else                el('pick-tie').classList.add('pick-btn-selected');

    // Show result banner
    var banner = el('round-result-banner');
    if      (who === 1) { banner.textContent = 'Point to Player 1!'; banner.className = 'round-result-banner banner-p1'; }
    else if (who === 2) { banner.textContent = 'Point to Player 2!'; banner.className = 'round-result-banner banner-p2'; }
    else                { banner.textContent = "It's a Tie!";         banner.className = 'round-result-banner banner-tie'; }
    banner.style.display = 'block';

    // Hide picker, show next
    el('round-winner-picker').style.display = 'none';
    el('btn-next').textContent = current >= TOTAL - 1 ? 'See Results →' : 'Next Question →';
    el('quiz-nav-row').style.display = 'flex';
  }

  /* ── Next question ── */
  function next() {
    current++;
    if (current >= TOTAL) {
      showFinished();
    } else {
      loadQuestion();
    }
  }

  /* ── Final screen ── */
  function showFinished() {
    el('progress-bar-inner').style.width  = '100%';
    el('quiz-card').style.display         = 'none';
    el('quiz-nav-row').style.display      = 'none';

    var title, winner;
    if      (score.p1 > score.p2) { title = 'Winner!'; winner = 'Player 1 wins!'; }
    else if (score.p2 > score.p1) { title = 'Winner!'; winner = 'Player 2 wins!'; }
    else                           { title = 'Tie!';    winner = 'Both equally brilliant!'; }

    el('finish-title').textContent  = title;
    el('finish-winner').textContent = winner;
    el('fs-p1').textContent         = score.p1;
    el('fs-p2').textContent         = score.p2;
    el('fs-tie').textContent        = score.tie;
    el('finish-trophy').textContent = score.p1 === score.p2 ? '🌟' : '🏆';

    el('finished-panel').style.display = 'flex';
  }

  /* ── Restart ── */
  function restart() {
    el('finished-panel').style.display = 'none';
    current = 0;
    score   = { p1: 0, p2: 0, tie: 0 };
    renderChecks();
    loadQuestion();
  }

  window.addEventListener('load', init);
  return { showAnswer: showAnswer, pickWinner: pickWinner, next: next, restart: restart };
}());