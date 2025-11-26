// ========================================
// FIREBASE SURVEY - EFL DIALOGUE EVALUATION
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
// ========================================
// SURVEY DATA STRUCTURE
// ========================================

const surveyData = {
  demographics: {
    name: "",
    email: "",
    experience: ""
  },
  dialogues: [
    { setId: 1, structure: {}, speech: {}, comments: {} },
    { setId: 2, structure: {}, speech: {}, comments: {} },
    { setId: 3, structure: {}, speech: {}, comments: {} },
    { setId: 4, structure: {}, speech: {}, comments: {} }
  ]
};

let currentDialogueIndex = 0;
let currentTab = "structure";
let totalQuestions = 0;
let db = null;
let firebaseReady = false;

// ========================================
// DIALOGUE DATA
// ========================================

const dialogueSetsData = [
  {
    setId: 1,
    title: "Museum of Nature and Wildlife",
    context: "Maryam is visiting the Museum of Nature and Wildlife. She's talking to Mr. Razavi who works in the museum.",
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
      { speaker: "Alireza", line: "Yes! They are really interesting for me, but I don't know much about them." },
      { speaker: "Ms. Tabesh", line: "Planets are really amazing but not so much alike. Do you know how they are different?" },
      { speaker: "Alireza", line: "Umm... I know they go around the Sun in different orbits." },
      { speaker: "Ms. Tabesh", line: "That's right. They have different colors and sizes, too. Some are rocky like Mars, some have rings like Saturn and some have moons like Uranus." },
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
      { speaker: "Mahsa", line: "Oh yes. Actually I learned many interesting things about our scientists' lives." },
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
      { speaker: "Diego", line: "I heard Iran is a great and beautiful country, but I don't know much about it." },
      { speaker: "Carlos", line: "Well, Iran is a four-season country. It has many historical sites and amazing nature. Also, its people are very kind and hospitable." },
      { speaker: "Diego", line: "It seems a suitable choice. But how can I get more information about Iran?" },
      { speaker: "Carlos", line: "You can check this booklet or may see our website." }
    ]
  }
];

// ========================================
// RUBRIC CRITERIA DATA
// ========================================

const criteriaData = {
  structure: [
    {
      id: "s1_grammar_vocab",
      title: "CRITERION S1: Grammar, Syntax, Vocabulary, and Word Choice",
      question: "How natural and authentic are the grammatical structures and vocabulary choices, including flexibility and idiomatic use?",
      whatToEvaluate: [
        "Blend of simple/complex structures (e.g., full sentences vs. fragments/ellipsis).",
        "Avoidance of overly formal/perfect grammar (e.g., contractions, incomplete utterances).",
        "Alignment with real-life EFL speech (e.g., minor errors for authenticity in L2 contexts).",
        "Use of everyday, idiomatic words/collocations (e.g., 'cool!' vs. formal jargon).",
        "Lexical diversity (type-token ratio ∼0.4-0.6 for natural dialogues).",
        "Avoidance of rare/textbook-specific terms (e.g., cultural adaptations)."
      ],
      scoringScale: [
        "Score 1 – Rigid, textbook-like grammar and simplistic/formal vocab: All full, error-free sentences (¿90% complete clauses); no ellipsis or fragments; limited diversity (TTR ¡0.2); rare idioms (¡10%). Sounds scripted and unnatural.",
        "Score 2 – Limited flexibility and basic variety: 70-90% full sentences; rare ellipsis (¡10%); TTR 0.2-0.3; occasional idioms (10-20%); some context mismatches. Overemphasis on accuracy leads to stiffness.",
        "Score 3 – Inconsistent mix with moderate diversity: 50-70% varied structures; some ellipsis/fragments (∼20-30%); TTR 0.3-0.4; idioms in ∼30-50% appropriate spots. Balanced but unpredictable.",
        "Score 4 – Good variety and mostly idiomatic: 70-90% natural blend; frequent ellipsis (∼40%); TTR 0.4-0.5; frequent idioms/collocations (∼60-80%). Sounds conversational.",
        "Score 5 – Highly natural, spontaneous structures and diverse vocab: Seamless mix (¿90% varied); abundant ellipsis/fragments; TTR ¿0.5; abundant idioms (¿80%); perfectly fits context."
      ]
    },
    {
      id: "s2_cohesion_pragmatics",
      title: "CRITERION S2: Cohesion, Coherence, and Pragmatic Considerations",
      question: "How logically do ideas progress with effective discourse markers, politeness strategies, and speech acts?",
      whatToEvaluate: [
        "Logical flow and thematic consistency (e.g., smooth topic shifts).",
        "Use of markers (e.g., 'well,' 'so,' 'and also').",
        "Overall discourse organization (theme-rheme structure).",
        "Politeness (e.g., hedges like 'kind of,' indirectness).",
        "Speech acts (e.g., requests, apologies) in context.",
        "Social nuance (e.g., avoidance of direct commands)."
      ],
      scoringScale: [
        "Score 1 – Disjointed flow with inappropriate or absent pragmatics: Abrupt shifts (¿50% illogical); no connectors; direct/impolite acts (¿50% mismatches); no hedges/indirectness.",
        "Score 2 – Weak cohesion and limited pragmatics: 30-50% logical flow; rare markers (¡20%); 30-50% appropriate acts; rare hedges (¡20%). Frequent gaps in coherence.",
        "Score 3 – Inconsistent flow and pragmatics: 50-70% logical; markers in ∼30-50% spots; 50-70% appropriate acts; hedges in ∼30-50%. Moderate coherence with occasional disruptions.",
        "Score 4 – Good cohesion and mostly appropriate pragmatics: 70-90% logical; markers effectively used (∼60-80%); 70-90% fitting acts; frequent hedges (∼60-80%).",
        "Score 5 – Seamless coherence and highly natural pragmatics: Fully logical (¿90%); markers integrate perfectly (¿80%); fully appropriate (¿90%); seamless hedges/indirectness."
      ]
    },
    {
      id: "s3_tone_cultural",
      title: "CRITERION S3: Tone, Register, and Cultural Relevance",
      question: "How well does the tone/register align with context and cultural norms?",
      whatToEvaluate: [
        "Appropriate formality/emotion (e.g., casual with excitement).",
        "Cultural elements (e.g., Iranian/English norms, no biases).",
        "Sentiment variation (e.g., positive/negative cues)."
      ],
      scoringScale: [
        "Score 1 – Mismatched tone/register: Overly formal/flat (¿50% mismatches); cultural biases evident. No sentiment variation.",
        "Score 2 – Basic alignment, some biases: 30-50% appropriate; limited emotion (¡20% varied). Noticeable cultural gaps.",
        "Score 3 – Inconsistent tone: 50-70% fitting; some emotion (∼30-50%). Moderate cultural relevance.",
        "Score 4 – Good alignment, mostly cultural: 70-90% appropriate; varied emotion (∼60-80%). Minor biases.",
        "Score 5 – Perfectly natural tone: Fully aligned (¿90%); rich emotion and cultural integration. Bias-free, engaging."
      ]
    }
  ],
  speech: [
    {
      id: "p1_intonation_stress",
      title: "CRITERION P1: Intonation Contours, Pitch Movement, Stress Patterns, and Prominence",
      question: "How natural and appropriate are the intonation, pitch patterns, and stress/prominence in this dialogue?",
      whatToListen: [
        "Pitch variation and range (monotone vs. varied).",
        "Question intonation (rising) vs. statement (falling).",
        "Prominence marking through pitch peaks.",
        "Phrase boundary signaling.",
        "Overall naturalness and conversational quality.",
        "Multi-syllabic word stress accuracy.",
        "Pitch peak alignment with stressed syllables.",
        "Amplitude/loudness differentiation (stressed > unstressed).",
        "Duration patterns (stressed syllables longer).",
        "Information focus marking."
      ],
      scoringScale: [
        "Score 1 – Monotone/inappropriate intonation and misplaced stress: No pitch variation; questions don't rise; ¿50% stress errors; no differentiation. Sounds robotic/scripted; pitch range <20 Hz.",
        "Score 2 – Limited pitch variation and prominence: Some movement but inconsistent; 50–70% stress correct; weak amplitude (¡5 dB). Pitch range 20–40 Hz; some monotone stretches.",
        "Score 3 – Some variation and inconsistent stress: Moderate range (40–60 Hz) but unpredictable; ∼30% intonation mismatches; 70–85% stress correct; moderate differentiation (5–10 dB).",
        "Score 4 – Good variation and mostly natural stress: Range 60–80 Hz; usually correct patterns (¡10% errors); 85–95% stress correct; good amplitude (10–15 dB). Mostly native-like.",
        "Score 5 – Natural, varied, semantically appropriate intonation and stress: Extensive range (80+ Hz); all patterns align; ¿95% stress correct; clear differentiation (15+ dB). Sounds like native conversation."
      ]
    },
    {
      id: "p2_disfluency_turns",
      title: "CRITERION P2: Hesitations, Fillers, Repairs, Turn-Taking, and Conversation Flow",
      question: "How naturally are disfluencies (hesitations, fillers, repairs) and turn-taking used to convey spontaneity and flow?",
      whatToListen: [
        "Filler/repair frequency (0.5–1 per 10 utterances natural).",
        "Variety and placement (e.g., 'um,' 'I mean' at junctures).",
        "Acoustic quality (natural vs. forced).",
        "Effect on fluency (creates real-time planning feel).",
        "Inter-turn gaps (100–300 ms natural).",
        "Overlaps/interruptions and backchannels (e.g., 'uh-huh').",
        "Turn-ceding signals (falling pitch, completion).",
        "Overall rhythm and engagement."
      ],
      scoringScale: [
        "Score 1 – Absent/excessive disfluencies and severely disrupted turns: No disfluencies (scripted) or ¿2 per utterance (anxious); gaps ¿1s; no backchannels. Abrupt/jarring; very poor management.",
        "Score 2 – Unnatural/abrupt disfluencies and awkward timing: Sparse/high frequency (¡0.2 or ¿2 per 10); limited variety; gaps 400–700 ms; ¿50% overlaps. Disrupts flow; choppy.",
        "Score 3 – Inconsistent disfluencies and turns: Acceptable range (0.3–1.8 per 10) but mixed integration (∼50% natural); mixed gaps (∼30% affected); occasional backchannels.",
        "Score 4 – Mostly natural disfluencies and turns: Optimal range (0.4–1.5 per 10); smooth integration (∼80%); gaps 100–350 ms; ¡10% overlaps. Smooth with minor issues.",
        "Score 5 – Highly natural disfluencies and optimal flow: Perfect frequency/variety; seamless, enhances authenticity; all gaps 100–300 ms; regular backchannels. Native-like engagement."
      ]
    },
    {
      id: "p3_pause_rhythm",
      title: "CRITERION P3: Pause Timing, Rhythm, and Information Structure",
      question: "How natural are pauses, rhythm, and the prosodic marking of information structure?",
      whatToListen: [
        "Pause duration/placement (0.3–1.2s at boundaries).",
        "Frequency (3–5 per 20s natural).",
        "Speaking rate consistency.",
        "Rhythm quality and engagement.",
        "New info marked (pitch/stress/duration).",
        "Given info reduced/neutral.",
        "Nuclear stress alignment with focus.",
        "Contrastive opposition.",
        "Theme-rheme reflection in prosody."
      ],
      scoringScale: [
        "Score 1 – Unnatural pacing and no information distinction: No pauses or ¿2.5s (breathless/monotonous); erratic rate; all equal prominence; confusing discourse (no marking).",
        "Score 2 – Disrupted rhythm and minimal marking: Irregular pauses (¡0.15s or ¿1.5s frequent); choppy; ¡40% new marked; discourse unclear.",
        "Score 3 – Variable pauses and inconsistent marking: Somewhat off (∼30% awkward); inconsistent rate; ∼60% marked; moderate clarity.",
        "Score 4 – Mostly natural rhythm and clear marking: Appropriate durations (¡10% awkward); generally smooth; ∼85% effective; occasional lapses.",
        "Score 5 – Smooth, engaging rhythm and natural structure: Optimal timing/frequency; consistent and natural; ¿95% aligned; perfect discourse prosody."
      ]
    }
  ]
};

// ========================================
// INITIALIZE FIREBASE
// ========================================

function initializeFirebase() {
  if (typeof firebase === "undefined") {
    console.warn("Firebase SDK not loaded yet, retrying...");
    setTimeout(initializeFirebase, 500);
    return;
  }

  try {
    if (firebase.apps && firebase.apps.length > 0) {
      db = firebase.database();
      firebaseReady = true;
      return;
    }

    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    firebaseReady = true;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    setTimeout(initializeFirebase, 1000);
  }
}

// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(pageId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });
  
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ========================================
// RENDER DIALOGUE PAGES
// ========================================

function renderAllDialogues() {
  const container = document.getElementById("dialoguesContainer");
  container.innerHTML = "";

  dialogueSetsData.forEach((dialogue, index) => {
    const section = document.createElement("section");
    section.id = `dialogueSection_${index}`;
    section.className = `section dialogue-section`;
    section.innerHTML = renderDialogueHTML(dialogue, index);
    container.appendChild(section);
  });
}

function renderDialogueHTML(dialogue, index) {
  const transcriptHTML = dialogue.transcript
    .map(
      (line) =>
        `<div class="transcript-line">
          <strong class="speaker-name">${line.speaker}:</strong>
          <span class="speaker-line">${escapeHtml(line.line)}</span>
        </div>`
    )
    .join("");

  const structureHTML = renderCriteriaHTML(criteriaData.structure, index, "structure");
  const speechHTML = renderCriteriaHTML(criteriaData.speech, index, "speech");

  return `
    <div class="survey-container">
      <h1>Dialogue ${index + 1} of 4: ${dialogue.title}</h1>
      <p class="dialogue-context"><strong>Context:</strong> ${dialogue.context}</p>

      <div class="audio-container">
        <h3>Audio Recording</h3>
        <audio class="audio-player" controls>
          <source src="${dialogue.audioSrc}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>
      </div>

      <div class="dialogue-transcript">
        <h3>Transcript</h3>
        <div class="transcript-content">${transcriptHTML}</div>
      </div>

      <div class="tab-container">
        <button type="button" class="tab-button active" onclick="switchTab(${index}, 'structure')">Structure (3)</button>
        <button type="button" class="tab-button" onclick="switchTab(${index}, 'speech')">Speech (3)</button>
      </div>

      <div id="structureTab_${index}" class="criteria-section active">
        ${structureHTML}
      </div>

      <div id="speechTab_${index}" class="criteria-section">
        ${speechHTML}
      </div>

      <div class="button-group">
        ${index > 0 ? `<button type="button" class="btn btn-secondary" onclick="goToDialogue(${index - 1})">← Previous Dialogue</button>` : ""}
        ${index < 3 ? `<button type="button" class="btn btn-primary" onclick="goToDialogue(${index + 1})">Next Dialogue →</button>` : `<button type="button" class="btn btn-primary" onclick="submitSurvey()">Submit Survey</button>`}
      </div>
    </div>
  `;
}

function renderCriteriaHTML(criteria, dialogueIndex, type) {
  return criteria
    .map((criterion) => {
      const critKey = criterion.id;
      const heading = criterion.whatToEvaluate ? "What to Evaluate" : "What to Listen For";
      const itemsHTML = (criterion.whatToEvaluate || criterion.whatToListen)
        .map((item) => `<li>${item}</li>`)
        .join("");

      return `
        <div class="criterion-block">
          <h3 class="criterion-title">${criterion.title}</h3>
          <p class="criterion-question"><strong>${criterion.question}</strong></p>
          
          <div class="criterion-content">
            <strong>${heading}:</strong>
            <ul class="listen-list">${itemsHTML}</ul>
          </div>

          <div class="rating-group">
            <label class="form-label">Rating (1-5)</label>
            <div class="rating-scale">
              ${[1, 2, 3, 4, 5]
                .map(
                  (score) => `
                <label class="rating-label">
                  <input type="radio" name="${type}_${dialogueIndex}_${critKey}" value="${score}" 
                    onchange="handleRating(${dialogueIndex}, '${type}', '${critKey}', ${score})">
                  <span class="rating-value">${score}</span>
                </label>
              `
                )
                .join("")}
            </div>
            <div class="scale-labels">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <button type="button" class="collapsible-trigger" id="${critKey}_trigger_${dialogueIndex}" onclick="toggleScoringScale('${critKey}_${dialogueIndex}')">
            <span class="trigger-text">Show Scoring Scale</span>
            <span class="arrow-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
          </button>

          <div class="collapsible-content" id="${critKey}_scale_${dialogueIndex}">
            ${criterion.scoringScale
              .map(
                (scale, idx) => `
              <div class="scale-item">
                ${escapeHtml(scale)}
              </div>
            `
              )
              .join("")}
          </div>

          <div class="form-group">
            <label class="form-label">Optional Comments</label>
            <textarea class="form-control textarea-mobile" id="${type}_${dialogueIndex}_${critKey}_comment" 
              placeholder="Add any qualitative observations..." rows="3"></textarea>
          </div>
        </div>
      `;
    })
    .join("");
}

// ========================================
// EVENT HANDLERS
// ========================================

function handleRating(dialogueIndex, type, critKey, score) {
  surveyData.dialogues[dialogueIndex][type][critKey] = score;
  updateProgress();
  
  setTimeout(() => {
    scrollToNextCriterion(dialogueIndex, type);
  }, 100);
}

// ========================================
// FIXED: SCROLL TO NEXT CRITERION
// ========================================

function scrollToNextCriterion(dialogueIndex, currentType) {
  const section = document.getElementById(`dialogueSection_${dialogueIndex}`);
  if (!section) return;

  const currentTabId = currentType === "structure" ? "structureTab" : "speechTab";
  const currentTabSection = document.getElementById(`${currentTabId}_${dialogueIndex}`);
  if (!currentTabSection) return;

  const allCriteriaInTab = Array.from(currentTabSection.querySelectorAll(".criterion-block"));
  
  const unratedInCurrentTab = allCriteriaInTab.find((block) => {
    const inputs = block.querySelectorAll('input[type="radio"]');
    return !Array.from(inputs).some((input) => input.checked);
  });

  if (unratedInCurrentTab) {
    fullScreenCenter(unratedInCurrentTab);
    return;
  }

  const otherType = currentType === "structure" ? "speech" : "structure";
  const otherTabId = currentType === "structure" ? "speechTab" : "structureTab";
  const otherTabSection = document.getElementById(`${otherTabId}_${dialogueIndex}`);
  
  if (otherTabSection) {
    const allCriteriaInOtherTab = Array.from(otherTabSection.querySelectorAll(".criterion-block"));
    
    const unratedInOtherTab = allCriteriaInOtherTab.find((block) => {
      const inputs = block.querySelectorAll('input[type="radio"]');
      return !Array.from(inputs).some((input) => input.checked);
    });

    if (unratedInOtherTab) {
      switchTab(dialogueIndex, otherType);
      setTimeout(() => {
        fullScreenCenter(unratedInOtherTab);
      }, 200);
      return;
    }
  }

  const buttonGroup = section.querySelector(".button-group");
  if (buttonGroup) {
    fullScreenCenter(buttonGroup);
  }
}

// ========================================
// FIXED: TOGGLE SCORING SCALE (COLLAPSIBLE)
// ========================================

function toggleScoringScale(critId) {
  const content = document.getElementById(`${critId}_scale`);
  const trigger = document.getElementById(`${critId}_trigger`);

  if (!content || !trigger) return;

  const isOpen = content.classList.contains("open");
  
  if (!isOpen) {
    // OPENING: Add "open" class
    content.classList.add("open");
    const text = trigger.querySelector(".trigger-text");
    text.textContent = "Hide Scoring Scale";
    
    // Force layout recalculation and scroll into view
    setTimeout(() => {
      fullScreenCenter(content);
    }, 100);
  } else {
    // CLOSING: Remove "open" class
    content.classList.remove("open");
    const text = trigger.querySelector(".trigger-text");
    text.textContent = "Show Scoring Scale";
  }
}

function switchTab(dialogueIndex, tab) {
  document.querySelectorAll(`#dialogueSection_${dialogueIndex} .tab-button`).forEach((btn, idx) => {
    btn.classList.toggle("active", idx === (tab === "structure" ? 0 : 1));
  });

  document.querySelectorAll(`#dialogueSection_${dialogueIndex} .criteria-section`).forEach((section) => {
    section.classList.remove("active");
  });

  document.getElementById(`${tab}Tab_${dialogueIndex}`).classList.add("active");

  setTimeout(() => {
    const firstCriterion = document.querySelector(`#${tab}Tab_${dialogueIndex} .criterion-block`);
    if (firstCriterion) {
      fullScreenCenter(firstCriterion);
    }
  }, 100);
}

function goToDialogue(index) {
  document.querySelectorAll(".dialogue-section").forEach((section) => {
    section.classList.remove("active");
  });
  
  document.getElementById(`dialogueSection_${index}`).classList.add("active");
  currentDialogueIndex = index;
  
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========================================
// SMOOTH CENTERING FUNCTION
// ========================================

function fullScreenCenter(element) {
  if (!element) return;

  requestAnimationFrame(() => {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementHeight = rect.height;

    let targetScroll;
    
    if (elementHeight >= viewportHeight * 0.8) {
      targetScroll = window.scrollY + rect.top - 20;
    } else {
      const centerOffset = (viewportHeight - elementHeight) / 2;
      targetScroll = window.scrollY + rect.top - centerOffset;
    }

    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: "smooth"
    });
  });
}

// ========================================
// PROGRESS BAR
// ========================================

function updateProgress() {
  let answered = 0;
  surveyData.dialogues.forEach((dialogue) => {
    answered += Object.keys(dialogue.structure).length;
    answered += Object.keys(dialogue.speech).length;
  });

  const totalCriteria = 24;
  const percentage = Math.round((answered / totalCriteria) * 100);

  document.getElementById("progressFill").style.width = `${percentage}%`;
  document.getElementById("progressText").textContent = `${percentage}%`;
}

// ========================================
// FORM SUBMISSION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initializeFirebase();
  renderAllDialogues();
  calculateTotalQuestions();

  document.getElementById("demographicsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("raterName").value.trim();
    const email = document.getElementById("raterEmail").value.trim();
    const experience = document.getElementById("experienceLevel").value;

    if (!name || !email) {
      alert("Please fill in all required fields.");
      return;
    }

    surveyData.demographics = { name, email, experience };
    
    showPage("dialogueSection_0");
    goToDialogue(0);
  });
});

function calculateTotalQuestions() {
  totalQuestions = 24;
}

function submitSurvey() {
  if (!firebaseReady || !db) {
    alert("Firebase is initializing. Please wait a moment and try again.");
    console.log("Firebase status - Ready:", firebaseReady, "DB:", db ? "exists" : "null");
    return;
  }

  surveyData.dialogues.forEach((dialogue, dIdx) => {
    const section = document.getElementById(`dialogueSection_${dIdx}`);
    if (!section) return;

    criteriaData.structure.forEach((crit) => {
      const commentArea = section.querySelector(
        `#structure_${dIdx}_${crit.id}_comment`
      );
      if (commentArea && commentArea.value) {
        dialogue.comments[`${crit.id}_comment`] = commentArea.value;
      }
    });

    criteriaData.speech.forEach((crit) => {
      const commentArea = section.querySelector(
        `#speech_${dIdx}_${crit.id}_comment`
      );
      if (commentArea && commentArea.value) {
        dialogue.comments[`${crit.id}_comment`] = commentArea.value;
      }
    });
  });

  const timestamp = new Date().toISOString();
  const surveyRef = db.ref(`surveys/${timestamp.replace(/[:.]/g, "-")}`);

  surveyRef
    .set(surveyData)
    .then(() => {
      document.getElementById("confirmRaterName").textContent = surveyData.demographics.name;
      document.getElementById("confirmRaterEmail").textContent = surveyData.demographics.email;
      document.getElementById("confirmTimestamp").textContent = new Date().toLocaleString();

      showPage("confirmationSection");
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch((error) => {
      alert("Error saving survey: " + error.message);
      console.error("Firebase error:", error);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
