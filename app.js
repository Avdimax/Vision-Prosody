// ========================================
// FIREBASE SURVEY - ULTIMATE ENHANCED VERSION FOR COMMUNICATIVE PROSODY ASSESSMENT
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
  dialogues: [{}, {}, {}, {}]  // For 4 sets/dialogues
};

let currentSet = 0;  // Track current set within Section 1
let totalQuestions = 0;
const totalSteps = 3;  // Welcome/Demographics + Section 1 (all sets) + Confirmation

console.log('app.js loaded');  // Diagnostic to confirm script execution

// ... (rest of the data structures: dialogueSetsData, surveyQuestionsData)

// ========================================
// PROGRESS CALCULATION
// ========================================
// ... (calculateTotalQuestions, getCompletedCount, updateProgress, debounce)

// ========================================
// NAVIGATION
// ========================================
function startSurvey() {
  console.log('Start Survey button clicked');  // Diagnostic
  hideAllSections();
  showSection('demographicsSection');
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
    setTimeout(() => {
      addScrollListenersToFormInputs();
    }, 100);
    updateProgress();
  }
}

// Submit demographics and move to Section 1, showing first set
function submitDemographics() {
  console.log('Submit Demographics button clicked');  // Diagnostic
  const form = document.getElementById('demographicsForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  surveyData.demographics = {
    raterName: document.getElementById('raterName').value.trim(),
    email: document.getElementById('email').value.trim(),
    qualifications: Array.from(document.querySelectorAll('input[name="qualifications"]:checked')).map(cb => cb.value),
    nationality: document.getElementById('nationality').value.trim()
  };

  console.log('Demographics saved:', surveyData.demographics);
  currentSet = 1;
  showSection('section1');
  showCurrentSet();
}

// ... (rest of showCurrentSet, generateAllSets, etc.)

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  if (typeof firebase !== 'undefined') {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized');
    } catch (e) {
      console.log('Firebase already initialized or error:', e);
    }
  }
  
  // Generate all sets dynamically in Section 1
  generateAllSets();
  
  // Add smooth scroll behavior to form inputs
  addScrollListenersToFormInputs();
  
  // Initialize progress
  calculateTotalQuestions();
  updateProgress();

  // Bind button events (replaces inline onclick)
  const startButton = document.getElementById('startSurveyButton');
  if (startButton) {
    startButton.addEventListener('click', startSurvey);
  }

  const backButton = document.getElementById('backToIntroButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      console.log('Back to Intro button clicked');  // Diagnostic
      showSection('introSection');
    });
  }

  const submitDemographicsButton = document.getElementById('submitDemographicsButton');
  if (submitDemographicsButton) {
    submitDemographicsButton.addEventListener('click', submitDemographics);
  }
});
