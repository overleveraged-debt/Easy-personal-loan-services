// Form steps management
let currentStep = 1;
const totalSteps = 4;

// Initialize step indicators
function updateStepIndicators() {
    for (let i = 1; i <= totalSteps; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        if (i <= currentStep) {
            indicator.className = 'w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold';
        } else {
            indicator.className = 'w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-bold';
        }
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progress}%`;
}

// Show specific step
function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('hidden');
    });

    // Show current step
    document.getElementById(`step-${stepNumber}`).classList.remove('hidden');

    currentStep = stepNumber;
    updateStepIndicators();
    updateProgressBar();
}

// Step 1 form submission
document.getElementById('step-1-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate phone number
    const phone = document.getElementById('phone').value;
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    showStep(2);
});

// Step 2 form submission
document.getElementById('step-2-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate age
    const dob = new Date(document.getElementById('dob').value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    if (age < 18) {
        document.getElementById('age-error').classList.remove('hidden');
        return;
    }

    document.getElementById('age-error').classList.add('hidden');
    showStep(3);
});

// Step 3 form submission
document.getElementById('step-3-form').addEventListener('submit', function(e) {
    e.preventDefault();

    showStep(4);
});

// Back button handlers
document.getElementById('back-step-2').addEventListener('click', () => showStep(1));
document.getElementById('back-step-3').addEventListener('click', () => showStep(2));

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateStepIndicators();
    updateProgressBar();
});
