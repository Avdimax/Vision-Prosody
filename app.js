// Firebase Config
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

// Survey Data Structure
const surveyData = {
  demographics: {},
  dialogues: [{}, {}, {}, {}, {}]
};

let currentDialogue = 0;
const totalSections = 7; // Intro + Demographics + 5 Dialogues

// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
  if (typeof firebase !== 'undefined') {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized');
    } catch (e) {
      console.warn('Firebase already initialized or error:', e);
    }
  }
  
  // Show progress bar
  document.getElementById('progressContainer').style.display = 'block';
  
  // Auto-scroll on focus
  addScrollListenersToFormInputs();
  
  // Update progress for intro
  updateProgress(1 / totalSections, 'Introduction');
});

// Auto-Scroll Function
function addScrollListenersToFormInputs() {
  const inputs = document.querySelectorAll('input, textarea, select, audio');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150); // Slight delay for keyboard appearance
    });
  });
}

// Navigation Helpers
function hideAllSections() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => s.classList.remove('active'));
}

function showSection(id) {
  hideAllSections();
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => addScrollListenersToFormInputs(), 100);
  }
}

function goToIntro() {
  updateProgress(1 / totalSections, 'Introduction');
  showSection('introSection');
}

// Progress Update
function updateProgress(progress, text) {
  const fill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  if (fill && progressText) {
    fill.style.width = `${progress * 100}%`;
    progressText.textContent = text;
  }
}

// Start Survey
function startSurvey() {
  updateProgress(2 / totalSections, 'Demographics');
  showSection('demographicsSection');
}

// Submit Demographics
function submitDemographics() {
  const form = document.getElementById('demographicsForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  surveyData.demographics = {
    firstName: document.getElementById('firstName').value.trim(),
    age: document.getElementById('age').value.trim(),
    nationality: document.getElementById('nationality').value.trim(),
    educationLevel: document.getElementById('educationLevel').value,
    nativeLanguageVariety: document.getElementById('nativeLanguageVariety').value
  };

  console.log('✅ Demographics saved:', surveyData.demographics);
  currentDialogue = 1;
  updateProgress(3 / totalSections, 'Dialogue 1');
  showSection('dialogue1Section');
}

// Dialogue Navigation
function nextDialogue(num) {
  const formId = `dialogue${num}Form`;
  const form = document.getElementById(formId);
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  saveDialogueData(num);
  if (num < 5) {
    currentDialogue = num + 1;
    updateProgress((num + 2) / totalSections, `Dialogue ${currentDialogue}`);
    showSection(`dialogue${currentDialogue}Section`);
  } else {
    submitSurvey();
  }
}

function previousDialogue(num) {
  saveDialogueData(num);
  if (num === 1) {
    updateProgress(2 / totalSections, 'Demographics');
    showSection('demographicsSection');
  } else {
    currentDialogue = num - 1;
    updateProgress((currentDialogue + 2) / totalSections, `Dialogue ${currentDialogue}`);
    showSection(`dialogue${currentDialogue}Section`);
  }
}

// Save Dialogue Data
function saveDialogueData(num) {
  const formId = `dialogue${num}Form`;
  const form = document.getElementById(formId);
  if (!form) return;

  const fd = new FormData(form);
  surveyData.dialogues[num - 1] = {
    dialogueNumber: num,
    sectionA: {
      q1_naturalness: fd.get(`d${num}_q1_naturalness`)?.trim() || '',
      q2_expectancy: fd.get(`d${num}_q2_expectancy`)?.trim() || ''
    },
    sectionB: {
      q1_grammar: parseInt(fd.get(`d${num}_q1_grammar`)) || null,
      q3_pacing: parseInt(fd.get(`d${num}_q3_pacing`)) || null,
      q5_pragmatics: parseInt(fd.get(`d${num}_q5_pragmatics`)) || null,
      q7_prosodic: parseInt(fd.get(`d${num}_q7_prosodic`)) || null,
      q8_cultural: parseInt(fd.get(`d${num}_q8_cultural`)) || null,
      q9_dynamics: parseInt(fd.get(`d${num}_q9_dynamics`)) || null
    },
    sectionC: {
      q4_suggestions: fd.get(`d${num}_q4_suggestions`)?.trim() || ''
    }
  };

  console.log(`✅ Dialogue ${num} saved:`, surveyData.dialogues[num - 1]);
}

// Submit Survey
async function submitSurvey() {
  const form = document.getElementById('dialogue5Form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  saveDialogueData(5);

  const btn = event?.target;
  let originalText = '';
  if (btn) {
    originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;
  }

  try {
    const timestamp = new Date();
    const firstName = surveyData.demographics.firstName || 'Anonymous';
    const participantID = `${firstName}_${Date.now()}`;

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

    console.log('📤 Submitting data:', finalData);

    // Save to Firebase
    if (typeof firebase !== 'undefined' && firebase.database) {
      const database = firebase.database();
      const dbPath = `responses/${participantID}`;
      await database.ref(dbPath).set(finalData);
      console.log('✅ Saved to Firebase');
    } else {
      console.warn('⚠️ Firebase not available - local save only');
    }

    // Local JSON Download
    const jsonBlob = new Blob([JSON.stringify(finalData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey_responses_${participantID}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('✅ Local JSON downloaded');

    // Show Confirmation
    updateProgress(1, 'Complete');
    showSection('confirmationSection');

    const confirmationDetails = document.getElementById('confirmationDetails');
    if (confirmationDetails) {
      confirmationDetails.innerHTML = `
        <p><strong>Participant ID:</strong> ${participantID}</p>
        <p><strong>Submitted:</strong> ${timestamp.toLocaleString()}</p>
        <p><strong>Status:</strong> Saved successfully</p>
      `;
    }
  } catch (error) {
    console.error('❌ Submission error:', error);
    alert('Error submitting. Please check console and try again.');
  } finally {
    if (btn) {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }
}
