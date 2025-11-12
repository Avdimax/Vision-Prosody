// ========================================
// FIREBASE SURVEY - COMPLETE WORKING VERSION FOR COMMUNICATIVE PROSODY ASSESSMENT
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
  dialogues: [{}, {}, {}, {}]  // Adjusted for 4 dialogues
};

let currentDialogue = 0;
let totalQuestions = 0;
const totalSteps = 5;  // Demographics + 4 dialogues

document.addEventListener('DOMContentLoaded', function() {
  if (typeof firebase !== 'undefined') {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized');
    } catch (e) {
      console.log('Firebase already initialized');
    }
  }
  
  // Add smooth scroll behavior to form inputs
  addScrollListenersToFormInputs();
  
  // Initialize progress
  calculateTotalQuestions();
  updateProgress();
});

// ========================================
// AUTO-SCROLL FUNCTIONALITY
// ========================================
function addScrollListenersToFormInputs() {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });
  });
}

// ========================================
// PROGRESS BAR UPDATE - Question-Based
// ========================================
function calculateTotalQuestions() {
  const allRequired = document.querySelectorAll('input[required], textarea[required], select[required]');
  const groups = {};
  allRequired.forEach(input => {
    const name = input.name || input.id;
    if (!groups[name]) groups[name] = [];
    groups[name].push(input);
  });
  totalQuestions = Object.keys(groups).length;
  console.log('Total questions:', totalQuestions);
}

function getCompletedCount() {
  let completed = 0;
  const allRequired = document.querySelectorAll('input[required], textarea[required], select[required]');
  const groups = {};
  allRequired.forEach(input => {
    const name = input.name || input.id;
    if (!groups[name]) groups[name] = [];
    groups[name].push(input);
  });

  for (let name in groups) {
    const inputs = groups[name];
    let isFilled = false;
    const type = inputs[0].type;

    if (type === 'radio' || type === 'checkbox') {
      isFilled = inputs.some(i => i.checked);
    } else if (inputs[0].tagName === 'TEXTAREA' || type === 'text' || type === 'date' || type === 'email') {
      isFilled = inputs[0].value.trim() !== '';
    } else if (inputs[0].tagName === 'SELECT') {
      isFilled = inputs[0].value !== '';
    }

    if (isFilled) completed++;
  }
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

// Debounce function for performance
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Live updates
document.addEventListener('input', debounce(updateProgress));
document.addEventListener('change', debounce(updateProgress));

// ========================================
// NAVIGATION
// ========================================
function startSurvey() {
  hideAllSections();
  showSection('demographicsSection');
  updateProgress();  // Initial update
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAllSections() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.remove('active'));
}

function showSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Re-attach scroll listeners
    setTimeout(() => {
      addScrollListenersToFormInputs();
    }, 100);
    
    updateProgress();  // Update on section show
  }
}

// ========================================
// DEMOGRAPHICS
// ========================================
function submitDemographics() {
  const form = document.getElementById('demographicsForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  surveyData.demographics = {
    raterName: document.getElementById('raterName').value.trim(),
    date: document.getElementById('date').value,
    raterID: document.getElementById('raterID').value.trim(),
    email: document.getElementById('email').value.trim(),
    qualifications: Array.from(document.querySelectorAll('input[name="qualifications"]:checked')).map(cb => cb.value),
    nationality: document.getElementById('nationality').value.trim(),
    nativeLanguageVariety: document.getElementById('nativeLanguageVariety').value
  };

  console.log('Demographics saved:', surveyData.demographics);
  currentDialogue = 1;
  hideAllSections();
  showSection('dialogue1Section');
}

// ========================================
// DIALOGUE NAVIGATION
// ========================================
function nextDialogue(num) {
  const formId = `dialogue${num}Form`;
  const form = document.getElementById(formId);
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  saveDialogueData(num);
  if (num < 4) {  // Adjusted for 4 dialogues
    currentDialogue = num + 1;
    hideAllSections();
    showSection(`dialogue${currentDialogue}Section`);
  } else {
    submitSurvey();
  }
}

function previousDialogue(num) {
  saveDialogueData(num);
  if (num === 1) {
    hideAllSections();
    showSection('demographicsSection');
  } else {
    currentDialogue = num - 1;
    hideAllSections();
    showSection(`dialogue${currentDialogue}Section`);
  }
}

// ========================================
// SAVE DIALOGUE DATA
// ========================================
function saveDialogueData(num) {
  const formId = `dialogue${num}Form`;
  const form = document.getElementById(formId);
  if (!form) return;

  const fd = new FormData(form);
  surveyData.dialogues[num - 1] = {
    dialogueNumber: num,
    sectionA: {
      q1_prosody_naturalness: fd.get(`d${num}_q1_prosody_naturalness`) || '',
      q2_expectancy: fd.get(`d${num}_q2_expectancy`) || ''
    },
    sectionB: {
      c1_intonation: {
        score: parseInt(fd.get(`d${num}_c1_intonation`)) || null,
        comments: fd.get(`d${num}_c1_comments`) || ''
      },
      c2_stress: {
        score: parseInt(fd.get(`d${num}_c2_stress`)) || null,
        comments: fd.get(`d${num}_c2_comments`) || ''
      },
      c3_rhythm: {
        score: parseInt(fd.get(`d${num}_c3_rhythm`)) || null,
        comments: fd.get(`d${num}_c3_comments`) || ''
      },
      c4_pacing: {
        score: parseInt(fd.get(`d${num}_c4_pacing`)) || null,
        comments: fd.get(`d${num}_c4_comments`) || ''
      },
      c5_chunking: {
        score: parseInt(fd.get(`d${num}_c5_chunking`)) || null,
        comments: fd.get(`d${num}_c5_comments`) || ''
      },
      c6_emotion: {
        score: parseInt(fd.get(`d${num}_c6_emotion`)) || null,
        comments: fd.get(`d${num}_c6_comments`) || ''
      },
      c7_information: {
        score: parseInt(fd.get(`d${num}_c7_information`)) || null,
        comments: fd.get(`d${num}_c7_comments`) || ''
      },
      c8_overall: {
        score: parseInt(fd.get(`d${num}_c8_overall`)) || null,
        comments: fd.get(`d${num}_c8_comments`) || ''
      }
    },
    sectionC: {
      q4_suggestions: fd.get(`d${num}_q4_suggestions`) || ''
    }
  };

  console.log(`Dialogue ${num} saved`);
}

// ========================================
// SUBMIT TO FIREBASE
// ========================================
async function submitSurvey() {
  const form = document.getElementById('dialogue4Form');  // Adjusted for Dialogue 4
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  saveDialogueData(4);

  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Submitting...';
  btn.disabled = true;

  try {
    const timestamp = new Date();
    const raterName = surveyData.demographics.raterName || surveyData.demographics.raterID || 'Anonymous';
    const participantID = `${raterName}_${Date.now()}`;

    const finalData = {
      participantID: participantID,
      submissionTimestamp: timestamp.toISOString(),
      submissionDateLocal: timestamp.toLocaleString(),
      demographics: surveyData.demographics,
      dialogues: surveyData.dialogues,
      deviceInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    console.log('📤 Submitting to Firebase...');

    if (typeof firebase !== 'undefined' && firebase.database) {
      const database = firebase.database();
      const dbPath = `responses/${participantID}`;
      await database.ref(dbPath).set(finalData);
      console.log('✅ Data saved to Firebase!');
    } else {
      console.warn('Firebase not available');
    }

    // Hide progress bar
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
      progressContainer.style.display = 'none';
    }

    // Show confirmation
    hideAllSections();
    showSection('confirmationSection');

    const confirmationDetails = document.getElementById('confirmationDetails');
    if (confirmationDetails) {
      confirmationDetails.innerHTML = `
        <h2>✅ Submission Complete!</h2>
        <p><strong>Participant ID:</strong><br><code>${participantID}</code></p>
        <p><strong>Submitted:</strong><br>${timestamp.toLocaleString()}</p>
        <p><strong>Status:</strong><br>✅ Saved to database</p>
      `;
    }
  } catch (error) {
    console.error('Submission error:', error);
    btn.textContent = originalText;
    btn.disabled = false;
    alert('Error submitting survey. Please try again.');
  }
}
