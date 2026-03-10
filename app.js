/* ══════════════════════════════════════════════
   ASTROTECH BRAINSTORMING — APP.JS
══════════════════════════════════════════════ */

const DEBATE_QUESTIONS = [
  "Do you think intelligent alien life exists somewhere in the universe? Why or why not?",
  "If aliens exist, do you think they would be friendly or hostile toward humanity?",
  "Would discovering alien life change how humans see themselves and their place in the universe?",
  "Should we actively send signals into space to try to contact alien civilizations?",
  "Do you think governments already have evidence of alien life and are hiding it from the public?",
  "Is the universe too vast for us to be the only intelligent life?",
  "Do you think space exploration is overrated — are the costs really worth the benefits?",
  "Should private companies like SpaceX lead space exploration instead of government agencies?",
  "Does space exploration inspire the next generation enough to justify its enormous cost?",
  "Would you rather invest in deep-sea exploration or space exploration? Why?",
  "Should we spend more money on space exploration or on fixing climate change on Earth?",
  "Is it selfish to focus on colonizing Mars while millions suffer poverty on Earth?",
  "Could technologies developed for space exploration help solve Earth's environmental problems?",
  "Is it humanity's destiny to become a multi-planetary species, or should we focus on Earth first?",
  "Should space colonization be humanity's top long-term priority as Earth's resources run out?"
];

/* Full question bank — 5 are picked randomly each game */
var QUIZ_BANK = [
  {
    question: "Who was the first Muslim to go to space?",
    answer: "Prince Sultan bin Salman Al Saud",
    info: "He is a Saudi prince and former Royal Saudi Air Force pilot who flew aboard the American STS-51-G Space Shuttle mission as a payload specialist."
  },
  {
    question: "Who was the first Muslim to go to space during Ramadan?",
    answer: "Sheikh Muszaphar Shukor",
    info: "He is a Malaysian doctor who launched to the International Space Station aboard Soyuz TMA-11 on 10 October 2007. Because of him, a fatwa was issued about fasting in space."
  },
  {
    question: "When was the first telescope invented?",
    answer: "1608",
    info: "It was invented by Dutch spectacle maker Hans Lippershey in the Netherlands."
  },
  {
    question: "What galaxy do we live in?",
    answer: "The Milky Way",
    info: null
  },
  {
    question: "What is the size of the Milky Way in light years?",
    answer: "Approximately 100,000 to 200,000 light-years across",
    info: null
  },
  {
    question: "Where are stars born?",
    answer: "In a nebula (سديم)",
    info: null
  },
  {
    question: "What are rogue planets?",
    answer: "Planets that left their solar systems and wander alone through space",
    info: null
  },
  {
    question: "How long does it take light to travel from the Sun to the Earth?",
    answer: "Around 8 minutes and 20 seconds",
    info: null
  },
  {
    question: "How many stars are there in the Milky Way galaxy?",
    answer: "Between 100 billion and 400 billion stars",
    info: null
  },
  {
    question: "⚠️ Trick question — How many stars are there in our Solar System?",
    answer: "Only 1 — our Sun!",
    info: null
  },
  {
    question: "How many planets are there in our Solar System?",
    answer: "8",
    info: null
  },
  {
    question: "Why do stars twinkle?",
    answer: "Because their light is bent and distorted by the different layers of Earth's atmosphere as it travels to your eyes",
    info: null
  },
  {
    question: "Why is Mars called the Red Planet?",
    answer: "Because its surface is covered in iron oxide (rust)",
    info: null
  },
  {
    question: "What is the hottest planet in our Solar System?",
    answer: "Venus",
    info: null
  },
  {
    question: "Yes or No — Can you hear a loud explosion in space?",
    answer: "No — space is a vacuum, and sound needs a medium like air or water to travel",
    info: null
  },
  {
    question: "Which dwarf planet was reclassified from a full planet in 2006?",
    answer: "Pluto",
    info: null
  },
  {
    question: "What is the Great Red Spot on Jupiter?",
    answer: "A giant storm that has been raging for hundreds of years — bigger than Earth",
    info: null
  },
  {
    question: "What do we call a star that has collapsed under its own gravity so that not even light can escape?",
    answer: "A Black Hole",
    info: null
  },
  {
    question: "What is the nearest major spiral galaxy to our own Milky Way?",
    answer: "The Andromeda Galaxy",
    info: null
  },
  {
    question: "Who wrote كتاب صور الكواكب (The Book of Fixed Stars)?",
    answer: "Abd al-Rahman al-Sufi",
    info: "He was a Persian astronomer who wrote his book in 964. It included textual descriptions and illustrations of stars — their positions, magnitudes (brightness), and color."
  },
  {
    question: "Which scholar calculated the Earth's radius using trigonometry and the height of a mountain in modern-day Pakistan?",
    answer: "Al-Biruni",
    info: "His measurement was within 1% of the modern value — centuries before the technology we have today."
  },
  {
    question: "Which astronomer and mathematician corrected the Greek calculations of the solar year and the Earth's tilt?",
    answer: "Al-Battani",
    info: "He was known as the 'Ptolemy of the Arabs', referring to Claudius Ptolemy, an ancient Greek astronomer."
  },
  {
    question: "Which ancient instrument was refined by Islamic astronomers to tell time, find the Qibla direction, and calculate star positions?",
    answer: "The Astrolabe",
    info: "While originally Greek, Muslim engineers added complex plates and mathematical scales that made it the most essential tool for navigation and timekeeping for centuries."
  },
  {
    question: "Which planet is closest to the Sun?",
    answer: "Mercury",
    info: null
  }
];

/* Pick 5 random unique questions from the bank */
function pickRandomQuestions(bank, count) {
  var shuffled = bank.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled.slice(0, count);
}

var QUIZ_QUESTIONS = pickRandomQuestions(QUIZ_BANK, 5);


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
    QUIZ_QUESTIONS = pickRandomQuestions(QUIZ_BANK, 5);
    TOTAL = QUIZ_QUESTIONS.length;
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
    if      (score.p1 > score.p2) { title = '🏆 Winner!'; winner = 'Player 1 wins!'; }
    else if (score.p2 > score.p1) { title = '🏆 Winner!'; winner = 'Player 2 wins!'; }
    else                           { title = '🌟 Tie!';    winner = 'Both equally brilliant!'; }

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
    QUIZ_QUESTIONS = pickRandomQuestions(QUIZ_BANK, 5);
    TOTAL = QUIZ_QUESTIONS.length;
    renderChecks();
    loadQuestion();
  }

  window.addEventListener('load', init);
  return { showAnswer: showAnswer, pickWinner: pickWinner, next: next, restart: restart };
}());
