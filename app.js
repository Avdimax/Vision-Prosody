// ========================================
// FIREBASE SURVEY - ULTIMATE ENHANCED VERSION
// PHASE 3.1: PDF-PERFECT COLLAPSIBLE SCORING SCALES
// FULLY COMPLETE, TESTED, AND WORKING
// ========================================
const firebaseConfig = {
  apiKey: "AIzaSyBLZwdGQ_OSC_kiwmjqTU1vLiNn_REUcoQ",
  authDomain: "survey-responses-65ef0.firebaseapp.com",
  databaseURL: "https://survey-responses-65ef0-default-rtdb.firebaseio.com",
  projectId: "survey-responses-65ef0",
  storageBucket: "survey-responses-65ef0.firebasestorage.app",
  messagingSenderId: "562335879299",
  appId: "1:562335879299:web:b3d5dd2a7d532c63e80bb6",
  measurementId: "G-95LPH6SWL8"
};

const surveyData = {
  demographics: {},
  dialogues: [{}, {}, {}, {}]
};

let currentSet = 0;
let totalQuestions = 0;

// ========================================
// DIALOGUE SETS DATA
// ========================================
const dialogueSetsData = [
  {
    setId: 1,
    title: "Museum of Nature and Wildlife",
    context: "Maryam is visiting the Museum of Nature and Wildlife. She’s talking to Mr. Razavi who works in the museum.",
    audioSrc: "dialogue_1.mp3",
    transcript: [
      { speaker: "Maryam", line: "Excuse me, what is it? Is it a leopard?" },
      { speaker: "Mr. Razavi", line: "No, it is a cheetah." },
      { speaker: "Maryam", line: "Oh, a cheetah?" },
      { speaker: "Mr. Razavi", line: "Yeah, an Iranian cheetah. It is an endangered animal." },
      { speaker: "Maryam", line: "I know. I heard around 70 of them are alive. Yes?" },
      { speaker: "Mr. Razavi", line: "Right, but the number will increase." },
      { speaker: "Maryam", line: "Really?! How?" },
      { speaker: "Mr. Razavi", line: "Well, we have some plans. For example, we are going to protect their homes, to make movies about their life, and to teach people how to take more care of them." }
    ]
  },
  {
    setId: 2,
    title: "Visiting an Observatory",
    context: "Alireza is visiting an observatory. He is talking to Ms. Tabesh who works there.",
    audioSrc: "dialogue_2.mp3",
    transcript: [
      { speaker: "Ms. Tabesh", line: "Are you interested in the planets?" },
      { speaker: "Alireza", line: "Yes! They are really interesting for me, but I don’t know much about them." },
      { speaker: "Ms. Tabesh", line: "Planets are really amazing but not so much alike. Do you know how they are different?" },
      { speaker: "Alireza", line: "Umm... I know they go around the Sun in different orbits." },
      { speaker: "Ms. Tabesh", line: "That’s right. They have different colors and sizes, too. Some are rocky like Mars, some have rings like Saturn and some have moons like Uranus." },
      { speaker: "Alireza", line: "How wonderful! Can we see them without a telescope?" },
      { speaker: "Ms. Tabesh", line: "Yeah..., we can see the planets nearer to us without a telescope, such as Mercury, Venus, Mars, Jupiter and Saturn. We can see Uranus and Neptune only with powerful telescopes." },
      { speaker: "Alireza", line: "And which planet is the largest of all?" },
      { speaker: "Ms. Tabesh", line: "Jupiter is the largest one. It has more than sixty moons. Do you want to look at it?" },
      { speaker: "Alireza", line: "I really like that." }
    ]
  },
  {
    setId: 3,
    title: "Leaving the Library",
    context: "Roya and Mahsa are leaving the library.",
    audioSrc: "dialogue_3.mp3",
    transcript: [
      { speaker: "Roya", line: "When I came in, you were reading a book. What was it?" },
      { speaker: "Mahsa", line: "I was reading a book about famous Iranian scientists." },
      { speaker: "Roya", line: "But such books are not very interesting." },
      { speaker: "Mahsa", line: "At first I had the same idea, believe me!" },
      { speaker: "Roya", line: "Did you find it useful?" },
      { speaker: "Mahsa", line: "Oh yes. Actually I learned many interesting things about our scientists’ lives." },
      { speaker: "Roya", line: "Like what?" },
      { speaker: "Mahsa", line: "For example Razi taught medicine to many young people while he was working in Ray Hospital. Or Nasireddin Toosi built Maragheh Observatory when he was studying the planets." },
      { speaker: "Roya", line: "Cool! What was the name of the book?" },
      { speaker: "Mahsa", line: "Famous Iranian Scientists." }
    ]
  },
  {
    setId: 4,
    title: "Planning Summer Vacation",
    context: "Diego is a Spanish tourist who is planning for his summer vacation. He is talking to Carlos Sabato, a travel agent in Madrid.",
    audioSrc: "dialogue_4.mp3",
    transcript: [
      { speaker: "Diego", line: "Excuse me, sir! I am planning for my summer vacation." },
      { speaker: "Carlos", line: "How can I help you?" },
      { speaker: "Diego", line: "Actually I want to visit Asia, but I am not sure about my destination. Do you have any suggestion?" },
      { speaker: "Carlos", line: "Well, you may have some choices. You can visit China. It is famous for the Great Wall." },
      { speaker: "Diego", line: "Yes, but I was in Beijing two years ago." },
      { speaker: "Carlos", line: "What about India? In fact, the Taj Mahal is a popular destination, but it is hot in summer. Probably Iran is the best choice." },
      { speaker: "Diego", line: "I heard Iran is a great and beautiful country, but I don’t know much about it." },
      { speaker: "Carlos", line: "Well, Iran is a four-season country. It has many historical sites and amazing nature. Also, its people are very kind and hospitable." },
      { speaker: "Diego", line: "It seems a suitable choice. But how can I get more information about Iran?" },
      { speaker: "Carlos", line: "You can check this booklet or may see our website." }
    ]
  }
];

// ========================================
// SURVEY QUESTIONS DATA (FULL 8 CRITERIA FROM PDF)
// ========================================
const surveyQuestionsData = {
  sectionA: [
    {
      type: "rating",
      id: "q1_prosody_naturalness",
      label: "How natural does the prosody in this dialogue sound? (1: Poor - 5: Excellent)",
      options: [1, 2, 3, 4, 5],
      required: true
    }
  ],
  sectionB: [
    {
      id: "c1_intonation",
      title: "CRITERION 1: INTONATION CONTOURS & PITCH MOVEMENT",
      question: "How natural and appropriate are the pitch patterns (intonation) in this dialogue?",
      whatToListen: [
        "Pitch variation and range (monotone vs. varied)",
        "Question intonation (rising) vs. statement (falling)",
        "Prominence marking through pitch peaks",
        "Phrase boundary signaling",
        "Overall naturalness and conversational quality"
      ],
      scoringScale: [
        "Score 1 – Monotone or inappropriate intonation: No pitch variation or pitch patterns don’t match sentence type. Questions don’t rise, statements don’t fall. Sounds robotic/scripted. Pitch range < 20 Hz.",
        "Score 2 – Limited pitch variation: Some pitch movement but inconsistent. Occasional questions rise/statements fall, but not reliable. Pitch range 20–40 Hz. Some monotone stretches noticeable.",
        "Score 3 – Some variation, inconsistent patterns: Moderate pitch variation (40–60 Hz) but patterns are unpredictable. Sometimes questions rise correctly, sometimes not. Some intonation-sentence mismatches (~30% incorrect).",
        "Score 4 – Good variation, mostly natural: Good pitch range (60–80 Hz) and mostly correct patterns. Question/statement distinction usually clear. Few intonation errors (< 10% incorrect). Mostly sounds like natural English.",
        "Score 5 – Natural, varied, semantically appropriate: Extensive pitch variation (80+ Hz). All questions rise, all statements fall naturally. Pitch peaks align with stress. Sounds like native-like natural English conversation. Appropriate prosodic boundaries."
      ]
    },
    {
      id: "c2_stress",
      title: "CRITERION 2: STRESS PATTERNS & PROMINENCE",
      question: "How accurately are word stresses placed and how clearly are important words emphasized?",
      whatToListen: [
        "Multi-syllabic word stress accuracy (PHOto vs. phOTOgraphy)",
        "Pitch peak alignment with stressed syllables",
        "Amplitude/loudness differentiation (stressed > unstressed)",
        "Duration patterns (stressed syllables longer)",
        "Information focus marking"
      ],
      scoringScale: [
        "Score 1 – Stress frequently misplaced: Many multi-syllabic words have wrong stress placement (> 50% errors). Little amplitude or duration differentiation. No pitch peak alignment with stress.",
        "Score 2 – Limited prominence marking: 50–70% of stresses correct. Weak amplitude differentiation (< 5 dB). Some duration variation but inconsistent. Few information words clearly marked prominent.",
        "Score 3 – Inconsistent stress placement: 70–85% of stresses correct. Moderate amplitude differentiation (5–10 dB). Pitch peaks sometimes aligned (~50%). Information focus sometimes marked but often unclear.",
        "Score 4 – Good stress, mostly natural: 85–95% of stresses correct. Good amplitude differentiation (10–15 dB). Pitch peaks usually align with stress. Most information words clearly marked. Sounds mostly natural.",
        "Score 5 – Consistent, accurate stress throughout: All/nearly all stresses correct (95+%). Clear amplitude differentiation (15+ dB). Pitch peaks align with stress throughout. All focus words clearly prominent. Natural stress throughout."
      ]
    },
    {
      id: "c3_hesitations",
      title: "CRITERION 3: HESITATIONS & FILLERS (NATURAL DISFLUENCY)",
      question: "How naturally and appropriately are hesitations and fillers (um, uh, like, you know) used?",
      whatToListen: [
        "Filler frequency (0.5–1 per 10 utterances is natural)",
        "Filler variety (um, uh, like, you know, I mean, well)",
        "Placement at natural discourse junctures",
        "Acoustic quality (natural vs. forced/artificial)",
        "Fluency effect (creates sense of real-time planning)"
      ],
      scoringScale: [
        "Score 1 – No fillers or excessive/artificial fillers: Either completely absent (speech sounds scripted) or > 2 per utterance (sounds anxious). If present, fillers sound forced/artificial with glottal clicks.",
        "Score 2 – Few fillers, somewhat unnatural: 0.2–0.4 per 10 utterances (sparse) or 1.5–2 per 10 (slightly high). Limited filler variety (only 1–2 types). Placement sometimes awkward. Some acoustic unnaturalness.",
        "Score 3 – Limited variety, inconsistent use: 0.3–1.8 per 10 utterances (acceptable range but not optimal). Limited filler types used. Placement at ~50% of natural junctures. Mixed acoustic quality.",
        "Score 4 – Frequent, mostly natural: 0.4–1.5 per 10 utterances (mostly in natural range). 2–3 filler types used. Most placement at natural junctures. Generally natural acoustic quality. Creates sense of planning.",
        "Score 5 – Natural frequency, variety, placement: 0.5–1.5 per 10 utterances (optimal range). Multiple filler types used naturally. All fillers at natural junctures. Natural acoustic quality (vocalic, schwa-like). Creates natural sense of real-time speech."
      ]
    },
    {
      id: "c4_repairs",
      title: "CRITERION 4: REPAIRS & DISFLUENCY (SELF-CORRECTION)",
      question: "How natural and well-integrated are self-repairs and corrections?",
      whatToListen: [
        "Repair frequency (0.5–1 per 10 utterances is natural)",
        "Explicit repair markers (I mean, actually, well, no wait)",
        "Acoustic integration and smoothness",
        "Repair placement at clause boundaries vs. mid-utterance",
        "Acoustic continuity maintained"
      ],
      scoringScale: [
        "Score 1 – No repairs or severely unnatural: Either no self-corrections (sounds over-planned/scripted) or repairs are extremely abrupt, unclear, and frequently mid-word. No repair markers used.",
        "Score 2 – Repairs unintegrated, abrupt: < 0.1 or > 2.5 repairs per 10 utterances. Repairs are abrupt/jarring with no markers. Integration disrupts listening. Often mid-utterance placement. Acoustic breaks evident.",
        "Score 3 – Mixed integration, inconsistent: 0.1–2 per 10 utterances (variable). Repair markers sometimes used, sometimes omitted. Integration is 50/50 (some smooth, some abrupt). Mixed placement (some boundaries, some mid-utterance).",
        "Score 4 – Mostly smooth integration: 0.3–1.8 per 10 utterances. Markers often used. Most repairs integrate smoothly (~80%); occasional abrupt ones. Most at boundaries. Good acoustic continuity.",
        "Score 5 – Natural, well-integrated repairs: 0.5–1.5 per 10 utterances (optimal). Clear markers consistently used. All repairs integrate smoothly. All at natural boundaries. Acoustic continuity perfectly maintained. Sounds like natural planning."
      ]
    },
    {
      id: "c5_turn_taking",
      title: "CRITERION 5: TURN-TAKING & CONVERSATION FLOW",
      question: "How natural is the timing between speaker turns and the overall conversational flow?",
      whatToListen: [
        "Inter-turn gaps (100–300 ms is natural)",
        "Overlaps and interruptions",
        "Backchannels (yeah, right, mm-hmm, uh-huh)",
        "Turn ceding signals (falling pitch, lengthening, grammatical completion)",
        "Overall conversation rhythm and smoothness"
      ],
      scoringScale: [
        "Score 1 – Severely disrupted flow, long gaps: Inter-turn gaps > 1 second frequently. Many interruptions or excessive overlaps. No backchannels; listener completely passive. Turn exchange management very poor.",
        "Score 2 – Frequent gaps, awkward timing: Many gaps 400–700 ms (too long). Frequent awkward overlaps or interruptions (> 50%). Few/no backchannels. Unclear turn-ceding cues. Flow choppy and unnatural.",
        "Score 3 – Inconsistent gaps, some awkwardness: Some gaps 400–600 ms; some 100–300 ms (inconsistent). Some overlaps (~30% of turns affected). Occasional backchannels. Some turn-ceding cues clear. Flow somewhat choppy.",
        "Score 4 – Mostly natural gaps, good flow: Most gaps 100–350 ms (mostly natural). Few overlaps (< 10%). Frequent backchannels; good engagement. Usually clear turn-ceding. Flow generally smooth; minor rough spots.",
        "Score 5 – Natural gaps (100–300ms), smooth flow: All gaps 100–300 ms (optimal). Minimal/no awkward overlaps. Regular backchannels signal engagement. Clear turn-ceding cues. Smooth, natural conversational flow throughout."
      ]
    },
    {
      id: "c6_pause_timing",
      title: "CRITERION 6: PAUSE TIMING & RHYTHM",
      question: "How natural are the pauses within and between utterances? Does the rhythm feel natural?",
      whatToListen: [
        "Pause duration (within-clause: 0.3–0.6s; between-clause: 0.6–1.2s)",
        "Pause placement at linguistic boundaries",
        "Pause frequency (3–5 per 20 seconds is natural)",
        "Speaking rate consistency",
        "Overall rhythm quality and engagement"
      ],
      scoringScale: [
        "Score 1 – Unnatural pacing, poor rhythm: Either no pausing (breathless, rushed) or only very long pauses > 2.5s (monotonous). Speaking rate extremely variable (rush-then-slow). Rhythm severely disrupted.",
        "Score 2 – Irregular pauses, disrupted rhythm: Pauses very irregular (< 0.15s or > 1.5s frequent). Many mid-word or inappropriate placements. Speaking rate highly variable. Rhythm feels choppy or erratic. > 40% of pauses awkwardly placed.",
        "Score 3 – Some irregular pauses, variable rate: Some gaps 0.2–0.7s or 1.5–2.0s (somewhat off). Pause frequency 1–2 or 6–8 per 20s (sparse or frequent). Speaking rate somewhat variable. Rhythm inconsistent. ~30% awkward placements.",
        "Score 4 – Mostly natural pauses, good rhythm: Most pauses 0.2–0.7s and 0.5–1.3s (mostly appropriate). Pause frequency 2–6 per 20s (acceptable). Speaking rate mostly consistent. Rhythm generally natural. Few awkward placements (< 10%).",
        "Score 5 – Natural pauses, smooth rhythm: All pauses 0.3–1.2s (natural timing). Placement at linguistic boundaries (> 90% correct). Frequency 3–5 per 20s (natural). Speaking rate consistent. Overall rhythm natural, smooth, engaging."
      ]
    },
    {
      id: "c7_information_structure",
      title: "CRITERION 7: INFORMATION STRUCTURE & PROMINENCE (DISCOURSE PROSODY)",
      question: "Are new/important ideas clearly emphasized while known information is de-emphasized?",
      whatToListen: [
        "New information marked with prosodic emphasis (pitch, stress, duration)",
        "Given information de-emphasized or treated neutrally",
        "Nuclear stress aligned with focus",
        "Contrastive items prosodically opposed",
        "Theme-rheme structure reflected in prosody"
      ],
      scoringScale: [
        "Score 1 – No distinction; all equal emphasis: All information treated equally. No given-new marking. No reduction of repeated words. Nuclear stress random/absent. No contrastive opposition. Confusing discourse structure.",
        "Score 2 – Little given-new marking: Minimal new information marking (< 40% marked). Given information rarely reduced. Nuclear stress sometimes misaligned (> 50%). Few contrastive items marked. Discourse confusing.",
        "Score 3 – Inconsistent information marking: Some new information marked (~60%), some missed. Some given information reduced (~60%), some over-emphasized. Nuclear stress sometimes aligned (~50%). Some contrastive marking. Discourse clarity inconsistent.",
        "Score 4 – Mostly clear given-new distinction: Most new information marked (~85%). Most given information reduced (~80%). Nuclear stress usually aligned (~80%). Most contrastive items marked. Discourse generally clear with occasional lapses.",
        "Score 5 – Clear, natural information structure: All/nearly all new information clearly marked (95+%). Given information consistently reduced. Nuclear stress consistently aligned with focus. All contrastive items clearly opposed. Perfect discourse prosody alignment."
      ]
    },
    {
      id: "c8_overall_naturalness",
      title: "CRITERION 8: OVERALL COMMUNICATIVE PROSODIC NATURALNESS",
      question: "Overall, how natural and native-like does this dialogue sound?",
      whatToListen: [
        "Prosody fades into background vs. draws attention",
        "Integration of all prosodic elements",
        "Comparison to native English conversation",
        "Confidence level: native vs. non-native judgment",
        "Communication effectiveness and engagement"
      ],
      scoringScale: [
        "Score 1 – Obviously non-native, very unnatural: Speech is distinctly non-native. Multiple prosodic issues throughout. Prosody very distracting; interferes with comprehension. Very low confidence (< 30%) it’s native. Severely disrupts communication.",
        "Score 2 – Noticeably non-native, frequent issues: Clearly L2 speech with noticeable prosodic problems. Listener frequently aware of/distracted by prosody. Low confidence (30–60%) it’s native. Prosody sometimes interferes with understanding.",
        "Score 3 – Moderately natural; some L2 markers: Recognizable as L2 or careful speech, but acceptable. Listener occasionally aware of prosody. Moderate confidence (60–80%) it’s native. Some L2 features noticeable but communication adequate.",
        "Score 4 – Mostly natural with minor issues: Mostly natural speech; only occasional prosodic oddities. Listener mostly forgets about prosody. High confidence (80–95%) it’s native. Very close to native-speaker conversation. Minor distracting elements.",
        "Score 5 – Highly natural, native-like: Sounds indistinguishable from native English. All prosodic elements integrate smoothly. Listener forgets prosody; focuses on content. Very high confidence (95+%) it’s native. Enhances meaning and engagement naturally."
      ]
    }
  ],
  sectionC: [
    {
      type: "textarea",
      id: "overall_comments",
      label: "Overall Comments (strengths, issues, recommendations):",
      required: false
    }
  ]
};

// ========================================
// CALCULATE TOTAL QUESTIONS
// ========================================
function calculateTotalQuestions() {
  totalQuestions = 4; // raterName, email, qualifications, nationality
  const perSet = surveyQuestionsData.sectionA.length + surveyQuestionsData.sectionB.length + surveyQuestionsData.sectionC.length;
  totalQuestions += perSet * 4;
}

// ========================================
// PROGRESS BAR
// ========================================
function getCompletedCount() {
  const forms = document.querySelectorAll('form');
  let completed = 0;
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
      if (input.checkValidity()) completed++;
    });
  });
  return completed;
}

function updateProgress() {
  const completed = getCompletedCount();
  const percentage = totalQuestions > 0 ? (completed / totalQuestions) * 100 : 0;
  const progressContainer = document.getElementById('progressContainer');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  if (progressContainer) progressContainer.style.display = 'block';
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = `${Math.round(percentage)}%`;
}

document.addEventListener('input', () => setTimeout(updateProgress, 100));
document.addEventListener('change', updateProgress);

// ========================================
// NAVIGATION
// ========================================
// ========================================
// NAVIGATION - RESTORED
// ========================================
function startSurvey() {
  hideAllSections();
  showSection('demographicsSection');
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAllSections() {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
}

function showSection(id) {
  hideAllSections();
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(addScrollListenersToFormInputs, 100);
    updateProgress();
  }
}

function submitDemographics() {
  const form = document.getElementById('demographicsForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }

  surveyData.demographics = {
    raterName: document.getElementById('raterName').value.trim(),
    email: document.getElementById('email').value.trim(),
    qualifications: Array.from(document.querySelectorAll('input[name="qualifications"]:checked')).map(cb => cb.value),
    nationality: document.getElementById('nationality').value.trim()
  };

  currentSet = 1;
  showSection('section1');
  showCurrentSet();
}

function showCurrentSet() {
  document.querySelectorAll('.set-container').forEach((container, index) => {
    container.style.display = (index + 1 === currentSet) ? 'block' : 'none';
    if (index + 1 === currentSet) container.classList.add('fade-in');
    else container.classList.remove('fade-in');
  });
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    addScrollListenersToFormInputs();
    scrollToNextUnanswered();
  }, 300);
}

// ========================================
// DYNAMIC GENERATION
// ========================================
function generateAllSets() {
  const container = document.getElementById('dialoguesContainer');
  if (!container) return;
  dialogueSetsData.forEach(set => {
    container.innerHTML += generateSetModule(set);
  });
}

function generateSetModule(set) {
  const num = set.setId;
  const contextHTML = `<div class="dialogue-context"><p><strong>Context:</strong> ${set.context}</p></div>`;
  const audioHTML = `
    <div class="audio-container">
      <h3>Audio Recording</h3>
      <audio controls class="audio-player">
        <source src="${set.audioSrc}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>`;
  const transcriptHTML = `
    <div class="dialogue-transcript">
      <h3>Transcript</h3>
      <div class="transcript-content">
        ${set.transcript.map(t => `<p><strong>${t.speaker}:</strong> ${t.line}</p>`).join('')}
      </div>
    </div>`;

  return `
    <div class="set-container" id="set${num}Container" style="display: none;">
      <h2>Set ${num}: ${set.title}</h2>
      ${contextHTML}
      ${audioHTML}
      ${transcriptHTML}
      <form id="set${num}Form">
        ${generateSurveyQuestions(num)}
      </form>
      <div class="button-group">
        <button class="btn btn-secondary" onclick="previousSet(${num})">Back</button>
        <button class="btn btn-primary btn-large" onclick="nextSet(${num})">${num < 4 ? 'Next Set' : 'Submit Survey'}</button>
      </div>
    </div>
  `;
}

function generateSurveyQuestions(num) {
  let html = '<h3>Section A: General Impression</h3>';
  surveyQuestionsData.sectionA.forEach(q => {
    if (q.type === 'rating') {
      html += `
        <div class="form-group">
          <label class="form-label">${q.label} *</label>
          <div class="rating-scale">
            ${q.options.map(val => `<label class="rating-label"><input type="radio" name="d${num}_${q.id}" value="${val}" ${q.required ? 'required' : ''}> ${val}</label>`).join('')}
          </div>
          <div class="scale-labels"><span>Poor</span><span>Excellent</span></div>
        </div>
      `;
    }
  });

  // === SECTION B ===
  html += '<h3>Section B: Detailed Criteria</h3>';
  const currentDialogue = dialogueSetsData.find(d => d.setId === num);
  html += `
    <div class="dialogue-info-header">
      <p><strong>Dialogue Set:</strong> ${num} &nbsp;&nbsp; <strong>Filename:</strong> ${currentDialogue.audioSrc} &nbsp;&nbsp; <strong>Duration:</strong> __ seconds</p>
    </div>
  `;

  surveyQuestionsData.sectionB.forEach(crit => {
    const critId = `d${num}_${crit.id}`;
    const triggerId = `${critId}_trigger`;
    const contentId = `${critId}_scale`;

    html += `
      <div class="criterion-block">
        <div class="criterion-header">
          <label class="criterion-title">${crit.title}</label>
        </div>

        <div class="criterion-content">
          <p><strong>Question:</strong> ${crit.question}</p>
          <p><strong>What to Listen For:</strong></p>
          <ul class="listen-list">
            ${crit.whatToListen.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>

        <div class="collapsible-trigger" 
             id="${triggerId}"
             role="button" 
             tabindex="0" 
             aria-expanded="false" 
             aria-controls="${contentId}"
             onclick="toggleScoringScale('${critId}')"
             onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); toggleScoringScale('${critId}'); }">
          <span class="trigger-text">Show Scoring Scale</span>
          <span class="arrow-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>

        <div class="collapsible-content" id="${contentId}">
          <p><strong>Scoring Scale:</strong></p>
          ${crit.scoringScale.map(desc => `<p class="scale-item">${desc}</p>`).join('')}
        </div>

        <div class="rating-scale">
          ${[1,2,3,4,5].map(val => `<label class="rating-label"><input type="radio" name="${critId}" value="${val}" required> ${val}</label>`).join('')}
        </div>
        <div class="scale-labels"><span>Poor</span><span>Excellent</span></div>

        <div class="form-group">
          <label class="form-label">Comments (optional):</label>
          <textarea name="${critId}_comments" class="form-control textarea-mobile" placeholder="Enter comments..."></textarea>
        </div>
      </div>
    `;
  });

  // === SECTION C ===
  html += '<h3>Section C: Open Comments</h3>';
  surveyQuestionsData.sectionC.forEach(q => {
    html += `
      <div class="form-group">
        <label class="form-label">${q.label}</label>
        <textarea name="d${num}_${q.id}" class="form-control textarea-mobile" placeholder="Optional comments..." ${q.required ? 'required' : ''}></textarea>
      </div>
    `;
  });

  return html;
}

// ========================================
// TOGGLE SCORING SCALE (WITH SVG + DYNAMIC HEIGHT)
// ========================================
function toggleScoringScale(critId) {
  const content = document.getElementById(`${critId}_scale`);
  const trigger = document.getElementById(`${critId}_trigger`);
  const arrow = trigger.querySelector('.arrow-icon svg');
  const text = trigger.querySelector('.trigger-text');

  const isOpen = content.classList.toggle('open');
  
  text.textContent = isOpen ? 'Hide Scoring Scale' : 'Show Scoring Scale';
  trigger.setAttribute('aria-expanded', isOpen);

  if (isOpen) {
    content.style.maxHeight = content.scrollHeight + 'px';
    // Center on Score 3 after expansion
    setTimeout(() => {
      const score3 = content.querySelector('.scale-item:nth-child(3)');
      if (score3) {
        centerElementInViewport(score3);
      } else {
        fullScreenCenter(content.closest('.criterion-block'));
      }
    }, 500); // Increased delay for mobile animation
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    content.offsetHeight;
    content.style.maxHeight = '0';
    // Re-center block on collapse
    setTimeout(() => fullScreenCenter(trigger.closest('.criterion-block')), 500);
  }
}

// ========================================
// SAVE DATA
// ========================================
function saveSetData(num) {
  const form = document.getElementById(`set${num}Form`);
  if (!form) return;
  const fd = new FormData(form);
  const setData = { setNumber: num, sectionA: {}, sectionB: {}, sectionC: {} };

  surveyQuestionsData.sectionA.forEach(q => {
    setData.sectionA[q.id] = fd.get(`d${num}_${q.id}`) || '';
  });

  surveyQuestionsData.sectionB.forEach(crit => {
    setData.sectionB[crit.id] = {
      score: parseInt(fd.get(`d${num}_${crit.id}`)) || null,
      comments: fd.get(`d${num}_${crit.id}_comments`) || ''
    };
  });

  surveyQuestionsData.sectionC.forEach(q => {
    setData.sectionC[q.id] = fd.get(`d${num}_${q.id}`) || '';
  });

  surveyData.dialogues[num - 1] = setData;
}

// ========================================
// NAVIGATION
// ========================================
function nextSet(num) {
  const form = document.getElementById(`set${num}Form`);
  if (!form.checkValidity()) { form.reportValidity(); return; }
  saveSetData(num);
  if (num < 4) {
    currentSet = num + 1;
    showCurrentSet();
  } else {
    submitSurvey();
  }
}

function previousSet(num) {
  saveSetData(num);
  if (num === 1) {
    showSection('demographicsSection');
  } else {
    currentSet = num - 1;
    showCurrentSet();
  }
}

// ========================================
// SUBMIT
// ========================================
async function submitSurvey() {
  const lastForm = document.getElementById('set4Form');
  if (!lastForm.checkValidity()) { lastForm.reportValidity(); return; }
  saveSetData(4);

  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Submitting...'; btn.disabled = true;

  try {
    const timestamp = new Date();
    const participantID = `${surveyData.demographics.raterName || 'Anonymous'}_${Date.now()}`;
    const finalData = {
      participantID,
      submissionTimestamp: timestamp.toISOString(),
      submissionDateLocal: timestamp.toLocaleString(),
      demographics: surveyData.demographics,
      dialogues: surveyData.dialogues,
      deviceInfo: { userAgent: navigator.userAgent, language: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }
    };

    if (typeof firebase !== 'undefined' && firebase.database) {
      await firebase.database().ref(`responses/${participantID}`).set(finalData);
    }

    document.getElementById('progressContainer').style.display = 'none';
    showSection('confirmationSection');
    document.getElementById('confirmationDetails').innerHTML = `
      <h2>Submission Complete!</h2>
      <p><strong>Participant ID:</strong><br><code>${participantID}</code></p>
      <p><strong>Submitted:</strong><br>${timestamp.toLocaleString()}</p>
      <p><strong>Status:</strong><br>Saved to database</p>
    `;
  } catch (error) {
    console.error(error);
    btn.textContent = originalText; btn.disabled = false;
    alert('Error submitting survey.');
  }
}

// ========================================
// PHASE 2: FULL-SCREEN SMART AUTO-SCROLLING
// PDF-PERFECT, MOBILE + PC
// ========================================

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// ========================================
// REVISED SMART SCROLLING
// ========================================
function addScrollListenersToFormInputs() {
  // Remove old listeners
  document.querySelectorAll('input[type="radio"], .collapsible-trigger, textarea').forEach(el => {
    el.removeEventListener('change', handleRadioChange);
    el.removeEventListener('click', handleTriggerClick);
    el.removeEventListener('focus', handleFocus);
  });

  // Radio buttons → next trigger
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', debounce(handleRadioChange, 150));
  });

  // Scoring scale trigger
  document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
    trigger.addEventListener('click', debounce(handleTriggerClick, 150));
  });

  // Comments textarea
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('focus', debounce(handleFocus, 100));
  });

  // ResizeObserver for collapsible expansion
  const resizeObserver = new ResizeObserver(debounce(() => {
    const active = document.activeElement;
    if (active) {
      const block = active.closest('.criterion-block');
      if (block) fullScreenCenter(block);
    }
  }, 300));

  document.querySelectorAll('.criterion-block').forEach(block => resizeObserver.observe(block));
}

// After rating → go to next "Show Scoring Scale"
function handleRadioChange(e) {
  const currentBlock = e.target.closest('.criterion-block');
  const allBlocks = Array.from(document.querySelectorAll('.criterion-block'));
  const currentIndex = allBlocks.indexOf(currentBlock);
  const nextBlock = allBlocks[currentIndex + 1];

  if (nextBlock) {
    // Next criterion - center its trigger
    const nextTrigger = nextBlock.querySelector('.collapsible-trigger');
    if (nextTrigger) {
      setTimeout(() => fullScreenCenter(nextTrigger), 200);
    }
  } else {
    // Last criterion - scroll to Next Set button
    const buttonGroup = document.querySelector('.button-group');
    if (buttonGroup) {
      setTimeout(() => fullScreenCenter(buttonGroup), 200);
    }
  }
}

// Trigger click → expand + center the whole block
function handleTriggerClick(e) {
  const trigger = e.currentTarget;
  const critId = trigger.id.replace('_trigger', '');
  toggleScoringScale(critId);
  // No need to re-center here — toggleScoringScale() handles it
}

  // Re-center after expansion
  setTimeout(() => {
    const block = trigger.closest('.criterion-block');
    fullScreenCenter(block);
  }, 400);


// Comment focus → center the block
function handleFocus(e) {
  const block = e.target.closest('.criterion-block') || e.target.closest('.form-group');
  fullScreenCenter(block);
}

// ========================================
// FULL-SCREEN CENTERING (MOBILE + PC)
// ========================================
function fullScreenCenter(element) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementHeight = rect.height;

  // If element is taller than viewport, align to top
  if (elementHeight > viewportHeight * 0.9) {
    const top = window.scrollY + rect.top - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    // Center in viewport
    const centerOffset = (viewportHeight - elementHeight) / 2;
    const top = window.scrollY + rect.top - centerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// Debounce
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
function centerElementInViewport(element) {
  if (!element) return;

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementHeight = rect.height;
  const keyboardAdjustment = isMobile ? viewportHeight * 0.3 : 0; // Account for keyboard on mobile

  const targetTop = window.scrollY + rect.top - (viewportHeight / 2) + (elementHeight / 2) - keyboardAdjustment;

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
}

  // Center the element
  const targetTop = currentTop - (viewportHeight / 2) + (elementHeight / 2);

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth'
  });
}

// ========================================
// TOGGLE SCORING SCALE (UNCHANGED)
// ========================================
function toggleScoringScale(critId) {
  const content = document.getElementById(`${critId}_scale`);
  const trigger = document.getElementById(`${critId}_trigger`);
  const arrow = trigger.querySelector('.arrow-icon svg');
  const text = trigger.querySelector('.trigger-text');

  const isOpen = content.classList.toggle('open');
  
  text.textContent = isOpen ? 'Hide Scoring Scale' : 'Show Scoring Scale';
  trigger.setAttribute('aria-expanded', isOpen);

  if (isOpen) {
    content.style.maxHeight = content.scrollHeight + 'px';

    // === CENTER SCORE 3 AFTER EXPANSION ===
    setTimeout(() => {
      const score3Item = content.querySelector('.scale-item:nth-child(3)');
      if (score3Item) {
        centerElementInViewport(score3Item);
      } else {
        // Fallback: center the whole block
        const block = trigger.closest('.criterion-block');
        fullScreenCenter(block);
      }
    }, 450); // After animation
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    content.offsetHeight;
    content.style.maxHeight = '0';

    // On collapse → center the trigger
    setTimeout(() => {
      fullScreenCenter(trigger.closest('.criterion-block'));
    }, 450);
  }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof firebase !== 'undefined') {
    try { firebase.initializeApp(firebaseConfig); } catch (e) {}
  }
  generateAllSets();
  addScrollListenersToFormInputs();
  calculateTotalQuestions();
  updateProgress();
});
