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

console.log('app.js loaded');  // Diagnostic

// ... (dialogueSetsData remains the same)

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
    // ... (c1_intonation, c2_stress, etc., remain the same, matching PDF)
  ],
  sectionC: [
    // ... (open comments remain the same)
  ]
};

// ========================================
// PROGRESS CALCULATION (Fixed undefined with defaults)
// ========================================
function calculateTotalQuestions() {
  totalQuestions = 0;

  // Demographics: required fields (name, nationality, qualifications - count as 3)
  totalQuestions += 3;

  // For each of 4 sets
  dialogueSetsData.forEach(() => {
    // Section A: number of questions (safe check for length)
    totalQuestions += surveyQuestionsData.sectionA?.length || 0;

    // Section B: number of criteria (scores only, comments optional)
    totalQuestions += surveyQuestionsData.sectionB?.length || 0;

    // Section C: number of open comments (optional, but count for progress)
    totalQuestions += surveyQuestionsData.sectionC?.length || 0;
  });
  console.log('Total questions calculated:', totalQuestions);  // Diagnostic
}

// ========================================
// COMPLETED COUNT FOR PROGRESS
// ========================================
function getCompletedCount() {
  let completed = 0;
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const groups = form.querySelectorAll('.form-group, .rating-group');
    groups.forEach(group => {
      const inputs = group.querySelectorAll('input[required], select[required], textarea[required]');
      if (inputs.length > 0) {
        let isFilled = true;
        inputs.forEach(input => {
          if (input.type === 'checkbox') {
            if (!group.querySelector('input[type="checkbox"]:checked')) isFilled = false;
          } else if (input.type === 'radio') {
            if (!group.querySelector('input[type="radio"]:checked')) isFilled = false;
          } else if (input.value.trim() === '') {
            isFilled = false;
          }
        });
        if (isFilled) completed++;
      }
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
  console.log('Progress updated:', percentage + '%');  // Diagnostic
}

// Debounce for performance
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
  console.log('Start Survey button clicked');
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
  console.log('Submit Demographics button clicked');
  const form = document.getElementById('demographicsForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  surveyData.demographics = {
    raterName: document.getElementById('raterName')?.value.trim() || '',
    email: document.getElementById('email')?.value.trim() || '',
    qualifications: Array.from(document.querySelectorAll('input[name="qualifications"]:checked')).map(cb => cb.value),
    nationality: document.getElementById('nationality')?.value.trim() || ''
  };

  console.log('Demographics saved:', surveyData.demographics);
  currentSet = 1;
  showSection('section1');
  showCurrentSet();
}

// ... (rest of the JS code: showCurrentSet, generateAllSets, generateSetModule, generateSurveyQuestions, saveSetData, nextSet, previousSet, submitSurvey, addScrollListenersToFormInputs)

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
  
  // Initialize progress (call calculate first to avoid undefined)
  calculateTotalQuestions();
  updateProgress();

  // Bind button events
  const startButton = document.getElementById('startSurveyButton');
  if (startButton) {
    startButton.addEventListener('click', startSurvey);
  }

  const backButton = document.getElementById('backToIntroButton');
  if (backButton) {
    backButton.addEventListener('click', () => showSection('introSection'));
  }

  const submitDemographicsButton = document.getElementById('submitDemographicsButton');
  if (submitDemographicsButton) {
    submitDemographicsButton.addEventListener('click', submitDemographics);
  }
});
