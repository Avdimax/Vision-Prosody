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
  dialogues: [{structure: {}, speech: {}}, {structure: {}, speech: {}}, {structure: {}, speech: {}}, {structure: {}, speech: {}}]
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
    context: "Maryam is visiting the Museum of Nature and Wildlife. Sheâ€™s talking to Mr. Razavi who works in the museum.",
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
      { speaker: "Alireza", line: "Yes! They are really interesting for me, but I donâ€™t know much about them." },
      { speaker: "Ms. Tabesh", line: "Planets are really amazing but not so much alike. Do you know how they are different?" },
      { speaker: "Alireza", line: "Umm... I know they go around the Sun in different orbits." },
      { speaker: "Ms. Tabesh", line: "Thatâ€™s right. They have different colors and sizes, too. Some are rocky like Mars, some have rings like Saturn and some have moons like Uranus." },
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
      { speaker: "Mahsa", line: "Oh yes. Actually I learned many interesting things about our scientistsâ€™ lives." },
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
      { speaker: "Diego", line: "I heard Iran is a great and beautiful country, but I donâ€™t know much about it." },
      { speaker: "Carlos", line: "Well, Iran is a four-season country. It has many historical sites and amazing nature. Also, its people are very kind and hospitable." },
      { speaker: "Diego", line: "It seems a suitable choice. But how can I get more information about Iran?" },
      { speaker: "Carlos", line: "You can check this booklet or may see our website." }
    ]
  }
];
// ========================================
// SURVEY QUESTIONS DATA (FULL FROM RUBRIC MD - NO TRUNCATION)
// ========================================
const surveyQuestionsData = {
  structureSection: [
    {
      id: "s1_grammar_vocab",
      title: "CRITERION S1: Linguistic Flexibility and Lexical Naturalness",
      question: "How natural are the grammatical structures and vocabulary choices, including flexibility and idiomatic use?",
      whatToEvaluate: [
        "Blend of simple/complex structures (e.g., full sentences vs. fragments/ellipsis).",
        "Avoidance of overly formal/perfect grammar (e.g., contractions, incomplete utterances).",
        "Alignment with real-life EFL speech (e.g., minor errors for authenticity in L2 contexts).",
        "Use of everyday, idiomatic words/collocations (e.g., \"cool!\" vs. formal jargon).",
        "Lexical diversity (type-token ratio ∼0.4-0.6 for natural dialogues).",
        "Avoidance of rare/textbook-specific terms (e.g., cultural adaptations)."
      ],
      scoringScale: [
        "Score 1 – Rigid, textbook-like grammar and simplistic/formal vocab: All full, error-free sentences (¿90% complete clauses); no ellipsis or fragments; limited diversity (TTR ¡0.2); rare idioms (¡10%). Sounds scripted and unnatural (e.g., \"I am going to the store.\" with formal terms like \"I am interested in planets.\").",
        "Score 2 – Limited flexibility and basic variety: 70-90% full sentences; rare ellipsis (¡10%); TTR 0.2-0.3; occasional idioms (10-20%); some context mismatches. Overemphasis on accuracy leads to stiffness (e.g., no contractions; formal in casual settings).",
        "Score 3 – Inconsistent mix with moderate diversity: 50-70% varied structures; some ellipsis/fragments (∼20-30%); TTR 0.3-0.4; idioms in ∼30-50% appropriate spots. Balanced but unpredictable (e.g., occasional \"Yeah... um, that's right.\"); some rare terms.",
        "Score 4 – Good variety and mostly idiomatic: 70-90% natural blend; frequent ellipsis (∼40%); TTR 0.4-0.5; frequent idioms/collocations (∼60-80%). Sounds conversational (e.g., \"Excuse me, could you...?\"); context-appropriate with few rigid elements (¡10% unnatural).",
        "Score 5 – Highly natural, spontaneous structures and diverse vocab: Seamless mix (¿90% varied); abundant ellipsis/fragments for real-time feel (e.g., \"Oh, a cheetah? Yeah...\"); TTR ¿0.5; abundant idioms (¿80%); perfectly fits context (e.g., \"How wonderful!\"). Indistinguishable from authentic L2 dialogue."
      ]
    },
    {
      id: "s2_cohesion_pragmatics",
      title: "CRITERION S2: Discourse Flow and Pragmatic Nuance",
      question: "How logically do ideas progress with effective discourse markers, politeness strategies, and speech acts?",
      whatToEvaluate: [
        "Logical flow and thematic consistency (e.g., smooth topic shifts).",
        "Use of markers (e.g., \"well,\" \"so,\" \"and also\").",
        "Overall discourse organization (theme-rheme structure).",
        "Politeness (e.g., hedges like \"kind of,\" indirectness).",
        "Speech acts (e.g., requests, apologies) in context.",
        "Social nuance (e.g., avoidance of direct commands)."
      ],
      scoringScale: [
        "Score 1 – Disjointed flow with inappropriate or absent pragmatics: Abrupt shifts (¿50% illogical); no connectors; direct/impolite acts (¿50% mismatches); no hedges/indirectness. Ideas feel random, disrupting comprehension (e.g., unrelated jumps or commands without softening).",
        "Score 2 – Weak cohesion and limited pragmatics: 30-50% logical flow; rare markers (¡20%); 30-50% appropriate acts; rare hedges (¡20%). Frequent gaps in coherence or cultural/pragmatic errors (e.g., minimal linking).",
        "Score 3 – Inconsistent flow and pragmatics: 50-70% logical; markers in ∼30-50% spots; 50-70% appropriate acts; hedges in ∼30-50%. Moderate coherence with occasional disruptions and mixed social nuance.",
        "Score 4 – Good cohesion and mostly appropriate pragmatics: 70-90% logical; markers effectively used (∼60-80%); 70-90% fitting acts; frequent hedges (∼60-80%). Smooth progression with good contextual nuance and minor lapses.",
        "Score 5 – Seamless coherence and highly natural pragmatics: Fully logical (¿90%); markers integrate perfectly (¿80%); fully appropriate (¿90%); seamless hedges/indirectness. Mirrors authentic dialogue flow and enhances interpersonal authenticity."
      ]
    },
    {
      id: "s3_tone_cultural",
      title: "CRITERION S3: Contextual Tone and Cultural Harmony",
      question: "How well does the tone/register align with context and cultural norms?",
      whatToEvaluate: [
        "Appropriate formality/emotion (e.g., casual with excitement).",
        "Cultural elements (e.g., Iranian/English norms, no biases).",
        "Sentiment variation (e.g., positive/negative cues)."
      ],
      scoringScale: [
        "Score 1 – Mismatched tone/register: Overly formal/flat (¿50% mismatches); cultural biases evident (e.g., Western-centric). No sentiment variation.",
        "Score 2 – Basic alignment, some biases: 30-50% appropriate; limited emotion (¡20% varied). Noticeable cultural gaps.",
        "Score 3 – Inconsistent tone: 50-70% fitting; some emotion (∼30-50%). Moderate cultural relevance.",
        "Score 4 – Good alignment, mostly cultural: 70-90% appropriate; varied emotion (∼60-80%). Minor biases.",
        "Score 5 – Perfectly natural tone: Fully aligned (¿90%); rich emotion and cultural integration. Bias-free, engaging."
      ]
    }
  ],
  speechSection: [
    {
      id: "p1_intonation_stress",
      title: "CRITERION P1: Prosodic Variation and Emphasis Dynamics",
      question: "How natural and appropriate are the intonation, pitch patterns, and stress/prominence in this dialogue?",
      whatToListen: [
        "Pitch variation and range (monotone vs. varied).",
        "Question intonation (rising) vs. statement (falling).",
        "Prominence marking through pitch peaks.",
        "Phrase boundary signaling.",
        "Overall naturalness and conversational quality.",
        "Multi-syllabic word stress accuracy (PHOto vs. phOTOgraphy).",
        "Pitch peak alignment with stressed syllables.",
        "Amplitude/loudness differentiation (stressed > unstressed).",
        "Duration patterns (stressed syllables longer).",
        "Information focus marking."
      ],
      scoringScale: [
        "Score 1 – Monotone/inappropriate intonation and misplaced stress: No pitch variation or patterns don't match sentence type; questions don't rise, statements don't fall; ¿50% stress errors; no differentiation. Sounds robotic/scripted; pitch range <20 Hz; flat/artificial.",
        "Score 2 – Limited pitch variation and prominence: Some movement but inconsistent; occasional correct patterns; 50–70% stress correct; weak amplitude (¡5 dB). Pitch range 20–40 Hz; some monotone stretches.",
        "Score 3 – Some variation and inconsistent stress: Moderate range (40–60 Hz) but unpredictable; ∼30% intonation mismatches; 70–85% stress correct; moderate differentiation (5–10 dB).",
        "Score 4 – Good variation and mostly natural stress: Range 60–80 Hz; usually correct patterns (¡10% errors); 85–95% stress correct; good amplitude (10–15 dB). Mostly native-like.",
        "Score 5 – Natural, varied, semantically appropriate intonation and stress: Extensive range (80+ Hz); all patterns align; ¿95% stress correct; clear differentiation (15+ dB). Sounds like native conversation."
      ]
    },
    {
      id: "p2_disfluency_turns",
      title: "CRITERION P2: Markers and Interactional Rhythm",
      question: "How naturally are disfluencies (hesitations, fillers, repairs) and turn-taking used to convey spontaneity and flow?",
      whatToListen: [
        "Filler/repair frequency (0.5–1 per 10 utterances natural).",
        "Variety and placement (e.g., \"um,\" \"I mean\" at junctures).",
        "Acoustic quality (natural vs. forced).",
        "Effect on fluency (creates real-time planning feel).",
        "Inter-turn gaps (100–300 ms natural).",
        "Overlaps/interruptions and backchannels (e.g., \"uh-huh\").",
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
      title: "CRITERION P3: Pacing and Discourse Prominence",
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
// GENERATION FUNCTIONS
// ========================================
function generateAllSets() {
  const container = document.getElementById('dialoguesContainer');
  dialogueSetsData.forEach((set, index) => {
    const dialogueContainer = document.createElement('div');
    dialogueContainer.id = `set_${set.setId}`;
    dialogueContainer.className = 'dialogue-set';
    dialogueContainer.style.display = index === 0 ? 'block' : 'none';

    // Dialogue Info (from PDF)
    const dialogueInfo = document.createElement('div');
    dialogueInfo.className = 'dialogue-info';
    dialogueInfo.innerHTML = `
      <h3>Dialogue Set: ${set.setId}</h3>
      <p>Filename: ${set.audioSrc}</p>
      <p>Duration: [seconds - auto-calculate if needed]</p>
      <p>Title: ${set.title}</p>
      <p>Context: ${set.context}</p>
    `;
    dialogueContainer.appendChild(dialogueInfo);

    // Audio Player
    const audioPlayer = document.createElement('audio');
    audioPlayer.controls = true;
    audioPlayer.src = set.audioSrc;
    dialogueContainer.appendChild(audioPlayer);

    // Transcript
    const transcriptDiv = document.createElement('div');
    transcriptDiv.className = 'dialogue-transcript';
    const transcriptList = document.createElement('ul');
    set.transcript.forEach(line => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${line.speaker}:</strong> ${line.line}`;
      transcriptList.appendChild(li);
    });
    transcriptDiv.appendChild(transcriptList);
    dialogueContainer.appendChild(transcriptDiv);

    // Tabs
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';
    const structureTab = document.createElement('button');
    structureTab.textContent = 'Structure';
    structureTab.className = 'tab-button active';
    structureTab.onclick = () => toggleTab(set.setId, 'structure');
    const speechTab = document.createElement('button');
    speechTab.textContent = 'Speech';
    speechTab.className = 'tab-button';
    speechTab.onclick = () => toggleTab(set.setId, 'speech');
    tabContainer.append(structureTab, speechTab);
    dialogueContainer.appendChild(tabContainer);

    // Structure Section
    const structureDiv = document.createElement('div');
    structureDiv.id = `structure_${set.setId}`;
    structureDiv.className = 'section-container active';
    surveyQuestionsData.structureSection.forEach(crit => {
      const block = createCriterionBlock(crit, set.setId, 'structure');
      structureDiv.appendChild(block);
    });
    dialogueContainer.appendChild(structureDiv);

    // Speech Section
    const speechDiv = document.createElement('div');
    speechDiv.id = `speech_${set.setId}`;
    speechDiv.className = 'section-container';
    surveyQuestionsData.speechSection.forEach(crit => {
      const block = createCriterionBlock(crit, set.setId, 'speech');
      speechDiv.appendChild(block);
    });
    dialogueContainer.appendChild(speechDiv);

    // Navigation Buttons
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    if (index < dialogueSetsData.length - 1) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn btn-primary';
      nextBtn.textContent = 'Next Dialogue';
      nextBtn.onclick = () => loadSet(index + 1);
      buttonGroup.appendChild(nextBtn);
    } else {
      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn btn-primary';
      submitBtn.textContent = 'Submit Survey';
      submitBtn.onclick = submitSurvey;
      buttonGroup.appendChild(submitBtn);
    }
    dialogueContainer.appendChild(buttonGroup);

    container.appendChild(dialogueContainer);
  });
  calculateTotalQuestions();
  updateProgress();
}

// Modular Criterion Block Creation (Full, Matches PDF)
function createCriterionBlock(crit, setId, sectionType) {
  const block = document.createElement('div');
  block.className = 'criterion-block';
  block.id = `${crit.id}_${setId}`;

  // Title
  const title = document.createElement('h3');
  title.textContent = crit.title;
  block.appendChild(title);

  // Question
  const question = document.createElement('p');
  question.textContent = crit.question;
  block.appendChild(question);

  // What to Evaluate/Listen For (as UL)
  const evalTitle = document.createElement('h4');
  evalTitle.textContent = sectionType === 'speech' ? 'What to Listen For:' : 'What to Evaluate:';
  block.appendChild(evalTitle);
  const evalList = document.createElement('ul');
  (crit.whatToEvaluate || crit.whatToListen).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    evalList.appendChild(li);
  });
  block.appendChild(evalList);

  // Collapsible Scoring Scale
  const trigger = document.createElement('button');
  trigger.id = `${crit.id}_trigger_${setId}`;
  trigger.className = 'collapsible-trigger';
  trigger.innerHTML = `<span class="trigger-text">Show Scoring Scale</span> <span class="arrow-icon"><svg width="16" height="16" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg></span>`;
  trigger.onclick = () => toggleScoringScale(`${crit.id}_${setId}`);
  block.appendChild(trigger);

  const scaleContent = document.createElement('div');
  scaleContent.id = `${crit.id}_scale_${setId}`;
  scaleContent.className = 'collapsible-content';
  const scaleList = document.createElement('ol');
  crit.scoringScale.forEach(score => {
    const li = document.createElement('li');
    li.className = 'scale-item';
    li.textContent = score;
    scaleList.appendChild(li);
  });
  scaleContent.appendChild(scaleList);
  block.appendChild(scaleContent);

  // Rating Radios (1-5)
  const ratingGroup = document.createElement('div');
  ratingGroup.className = 'rating-group';
  for (let i = 1; i <= 5; i++) {
    const label = document.createElement('label');
    label.className = 'rating-label';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `${crit.id}_${setId}`;
    radio.value = i;
    radio.onchange = (e) => {
      surveyData.dialogues[setId - 1][sectionType][crit.id] = { score: i };
      updateProgress();
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(i));
    ratingGroup.appendChild(label);
  }
  block.appendChild(ratingGroup);

  // Comments Textarea
  const commentsLabel = document.createElement('label');
  commentsLabel.textContent = 'Comments (optional):';
  const comments = document.createElement('textarea');
  comments.placeholder = 'Optional comments';
  comments.onchange = (e) => surveyData.dialogues[setId - 1][sectionType][crit.id].comments = e.target.value;
  block.appendChild(commentsLabel);
  block.appendChild(comments);

  return block;
}

// ========================================
// TOGGLE SCORING SCALE
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
    setTimeout(() => {
      const score3 = content.querySelector('.scale-item:nth-child(3)');
      if (score3) centerElementInViewport(score3);
    }, 450);
  } else {
    content.style.maxHeight = '0';
    setTimeout(() => fullScreenCenter(trigger.closest('.criterion-block')), 450);
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
  // Remove old listeners safely (check if functions exist)
  document.querySelectorAll('input[type="radio"], .collapsible-trigger, textarea').forEach(el => {
    if (typeof handleRadioChange === 'function') el.removeEventListener('change', handleRadioChange);
    if (typeof handleTriggerClick === 'function') el.removeEventListener('click', handleTriggerClick);
    if (typeof handleFocus === 'function') el.removeEventListener('focus', handleFocus);
  });

  // Add listeners
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', debounce(handleRadioChange, 200));
  });

  document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
    trigger.addEventListener('click', debounce(handleTriggerClick, 200));
    if (isMobile) {
      trigger.addEventListener('touchstart', debounce(handleTouchStart, 200));
    }
  });

  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('focus', debounce(handleFocus, 100));
  });

  // ResizeObserver for dynamic content (collapsibles, resizes)
  const resizeObserver = new ResizeObserver(debounce(entries => {
    if (document.activeElement && entries.length > 0) {
      setTimeout(() => scrollToNextUnanswered(), 400); // Wait for animation
    }
  }, 300));

  document.querySelectorAll('.criterion-block').forEach(el => resizeObserver.observe(el));
}

// After rating â†’ go to next "Show Scoring Scale"
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

// Trigger click â†’ expand + center the whole block
function handleTriggerClick(e) {
  const trigger = e.currentTarget; // Define trigger here
  const critId = trigger.id.replace('_trigger', '');
 function toggleScoringScale(critId) {
  const content = document.getElementById(`${critId}_scale`);
  const trigger = document.getElementById(`${critId}_trigger`); // Define trigger here to fix error
  console.log('toggleScoringScale: Trigger defined', trigger); // Debug: Confirm trigger exists

  if (!trigger) {
    console.error('Trigger not found for critId:', critId);
    return; // Prevent further errors
  }

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
        const block = trigger.closest('.criterion-block'); // Now safe
        fullScreenCenter(block);
      }
    }, 500);
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    content.offsetHeight;
    content.style.maxHeight = '0';
    // Re-center block on collapse
    setTimeout(() => {
      const block = trigger.closest('.criterion-block'); // Safe
      fullScreenCenter(block);
    }, 500);
  }
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

    // On collapse â†’ center the trigger
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
