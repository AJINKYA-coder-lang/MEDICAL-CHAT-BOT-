// State management
let currentState = {
    activeTab: 'chat',
    selectedSymptoms: [],
    messages: [
        { role: 'bot', text: "Hello! I'm your MediMind Assistant. I can help with symptom analysis, general medical info, or health tracking. How are you feeling today?", time: 'Just now' }
    ],
    reminders: []
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const tabTitle = document.getElementById('tab-title');
const tabSubtitle = document.getElementById('tab-subtitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderReminders();
    initializeUserProfile();
});

function initializeUserProfile() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        document.getElementById('user-display-name').textContent = user.name;
        document.getElementById('user-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;

        // Update first bot message with personalized greeting
        const firstMsg = document.querySelector('.message.bot .message-content');
        if (firstMsg) {
            firstMsg.textContent = `Hello ${user.name}! I'm your MediMind Assistant. How are you feeling today?`;
        }
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function setupEventListeners() {
    // Send message on click
    sendBtn.addEventListener('click', () => handleUserInput());

    // Send message on Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    // Symptom selection
    document.querySelectorAll('.symptom-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('selected');
            const symptom = item.dataset.symptom;
            if (currentState.selectedSymptoms.includes(symptom)) {
                currentState.selectedSymptoms = currentState.selectedSymptoms.filter(s => s !== symptom);
            } else {
                currentState.selectedSymptoms.push(symptom);
            }
        });
    });

    // Analyze symptoms
    const analyzeBtn = document.querySelector('.analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => analyzeSymptoms());
    }

    // Add reminder
    const addRemBtn = document.getElementById('add-reminder-btn');
    if (addRemBtn) {
        addRemBtn.addEventListener('click', () => addReminder());
    }
}

// Tab Switching logic
function switchTab(tabId) {
    // Update Sidebar UI
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');

    // Update Content Visibility
    document.querySelectorAll('.tab-content').forEach(section => section.classList.remove('active'));
    document.getElementById(`${tabId}-section`).classList.add('active');

    // Update Header
    const tabData = {
        'chat': { title: 'Medical Assistant', subtitle: 'How can I help you today?' },
        'symptoms': { title: 'Symptom Checker', subtitle: 'Identify potential issues based on symptoms.' },
        'reminders': { title: 'Medication Reminders', subtitle: 'Stay on track with your prescriptions.' },
        'vitals': { title: 'Health Dashboard', subtitle: 'Your real-time health metrics.' }
    };

    tabTitle.textContent = tabData[tabId].title;
    tabSubtitle.textContent = tabData[tabId].subtitle;
    currentState.activeTab = tabId;
}

// Chat Logic
async function handleUserInput() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage('user', text);
    userInput.value = '';

    // Simulate AI thinking
    const typingMsg = addMessage('bot', '...', true);

    setTimeout(() => {
        const response = getAIResponse(text);
        updateBotMessage(typingMsg, response);
    }, 1500);
}

function sendQuickMessage(text) {
    userInput.value = text;
    handleUserInput();
}

function addMessage(role, text, isTyping = false) {
    const div = document.createElement('div');
    div.className = `message ${role}`;

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    div.appendChild(content);
    div.appendChild(time);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return div;
}

function updateBotMessage(msgElement, newText) {
    const content = msgElement.querySelector('.message-content');
    content.textContent = newText;
}

function getAIResponse(input) {
    const lowInput = input.toLowerCase();

    if (lowInput.includes('headache')) {
        return "I'm sorry you're feeling a headache. If it's a tension headache, rest and hydration might help. However, if it's severe or sudden, please consult a doctor.";
    } else if (lowInput.includes('fever')) {
        return "A fever is usually a sign that your body is fighting off an infection. Monitor your temperature and stay hydrated. If it goes above 103°F (39.4°C), seek medical attention.";
    } else if (lowInput.includes('hello') || lowInput.includes('hi')) {
        return "Hello! I'm here to assist with your medical queries and health tracking. How are you feeling?";
    } else if (lowInput.includes('chest pain')) {
        return "URGENT: Chest pain can be serious. If you feel pressure, tightness, or pain that radiates to your arm/jaw, call emergency services immediately.";
    } else {
        return "That's an interesting question. While I'm an AI, I can suggest looking into healthy habits or checking specific symptoms in our Symptom Checker tab for a more detailed analysis.";
    }
}

// Symptom Checker Logic
function analyzeSymptoms() {
    const resultDiv = document.getElementById('analysis-result');
    const resultText = document.getElementById('result-text');

    if (currentState.selectedSymptoms.length === 0) {
        alert('Please select at least one symptom.');
        return;
    }

    resultDiv.classList.remove('hidden');
    resultText.textContent = "Analyzing your symptoms: " + currentState.selectedSymptoms.join(', ') + "...";

    setTimeout(() => {
        let analysis = "Based on your selection, you might be experiencing a common seasonal illness. ";
        if (currentState.selectedSymptoms.includes('Fever') && currentState.selectedSymptoms.includes('Cough')) {
            analysis = "The combination of Fever and Cough suggests a respiratory infection like the Flu or a cold. Monitor your breathing and rest.";
        } else if (currentState.selectedSymptoms.includes('Headache') && currentState.selectedSymptoms.includes('Nausea')) {
            analysis = "Headache and Nausea can sometimes indicate a migraine or dehydration. Ensure you are getting electrolytes.";
        }
        resultText.textContent = analysis;
    }, 2000);
}

// Reminders Logic
function addReminder() {
    const name = document.getElementById('med-name').value;
    const time = document.getElementById('med-time').value;

    if (!name || !time) return;

    currentState.reminders.push({ name, time, id: Date.now() });
    document.getElementById('med-name').value = '';
    document.getElementById('med-time').value = '';
    renderReminders();
}

function renderReminders() {
    const list = document.getElementById('reminders-list');
    list.innerHTML = '<h3>Upcoming</h3>';

    if (currentState.reminders.length === 0) {
        list.innerHTML += '<p class="empty">No reminders set.</p>';
        return;
    }

    currentState.reminders.forEach(rem => {
        const item = document.createElement('div');
        item.className = 'reminder-item';
        item.style = 'background: white; padding: 15px; border-radius: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);';
        item.innerHTML = `
            <div>
                <strong>${rem.name}</strong>
                <p style="font-size: 0.8rem; color: #64748b;">Every day at ${rem.time}</p>
            </div>
            <i class="fas fa-trash" style="color: #f43f5e; cursor: pointer;" onclick="deleteReminder(${rem.id})"></i>
        `;
        list.appendChild(item);
    });
}

// Profile Dashboard Logic
function initializeProfileDashboard() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;

    // Set text values
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('dashboard-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;

    // Set health values (load from user object or use defaults)
    document.getElementById('profile-blood').value = user.bloodGroup || 'B+';
    document.getElementById('profile-height').value = user.height || '175';
    document.getElementById('profile-weight').value = user.weight || '70';
    document.getElementById('profile-age').value = user.age || '25';
    document.getElementById('profile-gender').value = user.gender || 'Male';

    // Set medical history
    document.getElementById('profile-allergies').value = user.allergies || 'None';
    document.getElementById('profile-conditions').value = user.conditions || 'None';

    // Set Emergency & Doctor
    document.getElementById('profile-emergency-name').value = user.emergencyName || 'Jane Doe';
    document.getElementById('profile-emergency-phone').value = user.emergencyPhone || '+1 234 567 890';
    document.getElementById('profile-doctor').value = user.doctor || 'Dr. Sarah Smith';
    document.getElementById('profile-clinic').value = user.clinic || 'Central Medical Care';

    // Set join date (formatted)
    const joinDate = user.id ? new Date(user.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 12, 2024';
    document.getElementById('info-joined').textContent = joinDate;
}

let isEditMode = false;
function toggleEditMode() {
    isEditMode = !isEditMode;
    const inputs = document.querySelectorAll('.profile-input');
    const selects = document.querySelectorAll('.profile-select');
    const textareas = document.querySelectorAll('.profile-textarea');
    const actions = document.getElementById('edit-actions');
    const editBtn = document.querySelector('.edit-profile-btn');

    inputs.forEach(input => input.disabled = !isEditMode);
    selects.forEach(select => select.disabled = !isEditMode);
    textareas.forEach(ta => ta.disabled = !isEditMode);
    actions.classList.toggle('hidden', !isEditMode);
    editBtn.style.display = isEditMode ? 'none' : 'block';
}

function saveProfileChanges() {
    const blood = document.getElementById('profile-blood').value;
    const height = document.getElementById('profile-height').value;
    const weight = document.getElementById('profile-weight').value;
    const age = document.getElementById('profile-age').value;
    const gender = document.getElementById('profile-gender').value;
    const allergies = document.getElementById('profile-allergies').value;
    const conditions = document.getElementById('profile-conditions').value;
    const emergencyName = document.getElementById('profile-emergency-name').value;
    const emergencyPhone = document.getElementById('profile-emergency-phone').value;
    const doctor = document.getElementById('profile-doctor').value;
    const clinic = document.getElementById('profile-clinic').value;

    let user = JSON.parse(localStorage.getItem('currentUser'));
    user.bloodGroup = blood;
    user.height = height;
    user.weight = weight;
    user.age = age;
    user.gender = gender;
    user.allergies = allergies;
    user.conditions = conditions;
    user.emergencyName = emergencyName;
    user.emergencyPhone = emergencyPhone;
    user.doctor = doctor;
    user.clinic = clinic;

    // Update currentUser in storage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Update in global users list as well
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }

    toggleEditMode();
    alert('Profile updated successfully!');
}

// Update initialization to include profile dashboard
const originalInit = document.addEventListener('DOMContentLoaded', () => {
    // This is already handled in the previous script block, but we ensure profile dashboard is ready
    initializeProfileDashboard();
});

