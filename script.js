/* script.js */

// --------- Tab Navigation ---------
const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.section');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active from all tabs and sections
        navTabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        // Activate clicked tab and corresponding section
        tab.classList.add('active');
        const sectionId = `${tab.dataset.section}-section`;
        document.getElementById(sectionId).classList.add('active');
    });
});

// --------- Theme Toggle ---------
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('dark-theme');
});

// --------- Emergency Modal ---------
const emergencyBtn = document.getElementById('emergencyBtn');
const emergencyModal = document.getElementById('emergencyModal');
const closeModal = document.getElementById('closeModal');
emergencyBtn.addEventListener('click', () => {
    emergencyModal.style.display = 'block';
});
closeModal.addEventListener('click', () => {
    emergencyModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === emergencyModal) emergencyModal.style.display = 'none';
});

// --------- Chat Functionality ---------
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const charCounter = document.getElementById('charCounter');

messageInput.addEventListener('input', () => {
    charCounter.textContent = `${messageInput.value.length}/500`;
});

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    appendMessage('user', text);
    messageInput.value = '';
    charCounter.textContent = '0/500';
    setTimeout(() => {
        appendMessage('bot', getBotReply(text));
    }, 700);
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender === 'bot' ? 'bot-message' : 'user-message'}`;
    msgDiv.innerHTML = `
        <div class="message-avatar">${sender === 'bot' ? '🧠' : '🙂'}</div>
        <div class="message-content">
            <p>${escapeHTML(text)}</p>
            <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

let chatState = {
    mood: null,
    askedReason: false,
    sharedHappyReason: false,
    followUpStage: 0,
};

function getBotReply(userText) {
    userText = userText.toLowerCase();

    // Greeting or casual start
    if (/hello|hi|hey|yo|wassup|sup/i.test(userText)) {
        return "Hey there! 😊 It's nice to see you. How are you feeling today?";
    }

    // Mood Detection
    if (/sad|upset|bad|down|depressed|tired|cry/i.test(userText)) {
        chatState.mood = "sad";
        chatState.askedReason = false;
        chatState.followUpStage = 0;
        return "I'm really sorry you're feeling this way. 😔 Want to talk about what’s bothering you?";
    }

    if (/angry|mad|frustrated|irritated|rage|annoyed/i.test(userText)) {
        chatState.mood = "angry";
        chatState.followUpStage = 0;
        return "I get that. It’s totally okay to feel angry. 😤 Want to tell me what caused it?";
    }

    if (/anxious|nervous|panic|scared|worried/i.test(userText)) {
        chatState.mood = "anxious";
        chatState.followUpStage = 0;
        return "Anxiety can be really heavy to carry 😟. Want to share what’s making you feel that way?";
    }

    if (/lonely|alone|ignored|isolated/i.test(userText)) {
        chatState.mood = "lonely";
        chatState.followUpStage = 0;
        return "Feeling lonely is hard 💔. But I'm here now. Do you want to talk about it?";
    }

    if (/happy|good|great|awesome|excited|joy|delighted/i.test(userText)) {
        chatState.mood = "happy";
        chatState.sharedHappyReason = false;
        chatState.followUpStage = 0;
        return "That’s wonderful to hear! 😄 What’s been bringing you joy today?";
    }

    if (/bored|boring|nothing to do/i.test(userText)) {
        chatState.mood = "bored";
        return "Boredom strikes hard sometimes 😅. Want a few fun ideas to kill time?";
    }

    // Conversation flow based on mood
    switch (chatState.mood) {
        case "sad":
            if (!chatState.askedReason) {
                chatState.askedReason = true;
                return "I'm listening. ❤️ What happened that made you feel this way?";
            } else if (chatState.followUpStage === 0) {
                chatState.followUpStage++;
                return "That sounds really rough. 😞 Sometimes even a little thing can hurt a lot.";
            } else if (chatState.followUpStage === 1) {
                chatState.followUpStage++;
                return "Have you been able to talk to someone about this? Or done anything that helped a bit?";
            } else {
                return "I'm really glad you're opening up to me. You're not alone. 💛";
            }

        case "angry":
            if (chatState.followUpStage === 0) {
                chatState.followUpStage++;
                return "Tell me more about it. Sometimes just letting it out can ease the weight.";
            } else if (chatState.followUpStage === 1) {
                chatState.followUpStage++;
                return "Would taking a walk, journaling, or even punching a pillow help right now?";
            } else {
                return "Anger is valid. But don’t let it burn you out. How about write about it in the journal section might as well help you 🧘";
            }

        case "anxious":
            if (chatState.followUpStage === 0) {
                chatState.followUpStage++;
                return "Deep breaths. Inhale... hold... exhale. 🌬️ Let’s take it one step at a time.";
            } else if (chatState.followUpStage === 1) {
                chatState.followUpStage++;
                return "Do you want to talk through the thing that’s worrying you?";
            } else {
                return "I'm proud of you for being honest about your anxiety. You're doing better than you think.";
            }

        case "lonely":
            if (chatState.followUpStage === 0) {
                chatState.followUpStage++;
                return "Loneliness hits hard sometimes. Want to tell me what’s been making you feel that way?";
            } else if (chatState.followUpStage === 1) {
                return "You matter, even if it doesn’t feel that way sometimes. Want to do a fun activity together?";
            }

        case "happy":
            if (!chatState.sharedHappyReason) {
                chatState.sharedHappyReason = true;
                return "That sounds amazing! 😊 Do you usually do something to celebrate good moments?";
            } else if (chatState.followUpStage === 0) {
                chatState.followUpStage++;
                return "I love that vibe! 🥳 Maybe you can share that happiness with someone else too?";
            } else {
                return "Happiness is contagious. Thanks for bringing your sunshine here today. 🌞";
            }

        case "bored":
            return "How about a quick game, journaling your thoughts, doodling, or even watching a funny cat video? 😺 Or I can ask you a fun question!";

        default:
            return "Thanks for sharing that. I’m always here to listen. Want to talk about something else or change the topic?";
    }
}



function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
}

// --------- Mood Quick Selector (Chat Panel) ---------
const moodSlider = document.getElementById('moodSlider');
moodSlider.addEventListener('input', () => {
    const status = document.getElementById('avatarStatus');
    const value = moodSlider.value;
    if (value <= 3) status.textContent = "Feeling low 😢";
    else if (value <= 7) status.textContent = "Feeling okay 🙂";
    else status.textContent = "Feeling great 😄";
});

// --------- Avatar Customization ---------
const colorBtns = document.querySelectorAll('.color-btn');
const avatar = document.getElementById('avatar');
colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        avatar.className = 'avatar'; // reset
        avatar.classList.add(`avatar-${btn.dataset.color}`);
    });
});

// --------- Mood Tracker ---------
const dailyMoodSlider = document.getElementById('dailyMoodSlider');
const moodDescription = document.getElementById('moodDescription');
const saveMoodBtn = document.getElementById('saveMoodBtn');
const moodCalendar = document.getElementById('moodCalendar');
const avgMood = document.getElementById('avgMood');
const moodStreak = document.getElementById('moodStreak');
const bestMood = document.getElementById('bestMood');

let moodData = JSON.parse(localStorage.getItem('moodData') || '[]');

function updateMoodDescription(val) {
    if (val <= 2) moodDescription.textContent = "Very sad";
    else if (val <= 4) moodDescription.textContent = "A bit down";
    else if (val <= 6) moodDescription.textContent = "Feeling neutral";
    else if (val <= 8) moodDescription.textContent = "Pretty good";
    else moodDescription.textContent = "Very happy!";
}
dailyMoodSlider.addEventListener('input', () => updateMoodDescription(dailyMoodSlider.value));
updateMoodDescription(dailyMoodSlider.value);

saveMoodBtn.addEventListener('click', () => {
    const today = new Date().toISOString().slice(0,10);
    // Remove existing entry for today
    moodData = moodData.filter(m => m.date !== today);
    moodData.push({date: today, mood: Number(dailyMoodSlider.value)});
    localStorage.setItem('moodData', JSON.stringify(moodData));
    renderMoodCalendar();
    renderMoodStats();
});

function renderMoodCalendar() {
    // Show last 7 days
    moodCalendar.innerHTML = '';
    const days = [];
    for (let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d);
    }
    days.forEach(d => {
        const dateStr = d.toISOString().slice(0,10);
        const entry = moodData.find(m => m.date === dateStr);
        const mood = entry ? entry.mood : null;
        const div = document.createElement('div');
        div.className = 'calendar-cell';
        if (mood) div.classList.add(`mood-${Math.round(mood)}`);
        div.title = d.toLocaleDateString();
        div.textContent = d.getDate();
        moodCalendar.appendChild(div);
    });
}
function renderMoodStats() {
    if (!moodData.length) {
        avgMood.textContent = '-';
        moodStreak.textContent = '0';
        bestMood.textContent = '-';
        return;
    }
    // Only last 7 days
    const last7 = [];
    for (let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0,10);
        const entry = moodData.find(m => m.date === dateStr);
        if (entry) last7.push(entry.mood);
    }
    if (last7.length) {
        avgMood.textContent = (last7.reduce((a,b)=>a+b,0)/last7.length).toFixed(1);
        bestMood.textContent = Math.max(...last7);
        // Streak: consecutive days with entry
        let streak = 0;
        for (let i=last7.length-1; i>=0; i--) {
            if (last7[i]) streak++;
            else break;
        }
        moodStreak.textContent = streak;
    }
}
renderMoodCalendar();
renderMoodStats();

// --------- Breathing Exercise ---------
const breathingCircle = document.getElementById('breathingCircle');
const breathingText = document.getElementById('breathingText');
const breathingCounter = document.getElementById('breathingCounter');
const startBreathingBtn = document.getElementById('startBreathingBtn');
const pauseBreathingBtn = document.getElementById('pauseBreathingBtn');
const stopBreathingBtn = document.getElementById('stopBreathingBtn');
const breathingPattern = document.getElementById('breathingPattern');
const sessionDuration = document.getElementById('sessionDuration');

let breathingTimer = null, breathingPaused = false, breathingStep = 0, breathingSteps = [], breathingSessionEnd = 0;

const patterns = {
    '4-4-4-4': [
        {label: 'Inhale', seconds: 4},
        {label: 'Hold', seconds: 4},
        {label: 'Exhale', seconds: 4},
        {label: 'Hold', seconds: 4}
    ],
    '4-7-8': [
        {label: 'Inhale', seconds: 4},
        {label: 'Hold', seconds: 7},
        {label: 'Exhale', seconds: 8}
    ],
    '6-6': [
        {label: 'Inhale', seconds: 6},
        {label: 'Exhale', seconds: 6}
    ]
};

function startBreathing() {
    breathingPaused = false;
    breathingStep = 0;
    breathingSteps = patterns[breathingPattern.value];
    breathingSessionEnd = Date.now() + Number(sessionDuration.value)*60*1000;
    startBreathingBtn.style.display = 'none';
    pauseBreathingBtn.style.display = '';
    stopBreathingBtn.style.display = '';
    nextBreathingStep();
}
function nextBreathingStep() {
    if (Date.now() > breathingSessionEnd) return stopBreathing();
    const step = breathingSteps[breathingStep % breathingSteps.length];
    breathingText.textContent = step.label;
    let count = step.seconds;
    breathingCounter.textContent = count;
    breathingCircle.className = 'breathing-circle ' + step.label.toLowerCase();
    breathingTimer = setInterval(() => {
        if (breathingPaused) return;
        count--;
        breathingCounter.textContent = count;
        if (count <= 0) {
            clearInterval(breathingTimer);
            breathingStep++;
            nextBreathingStep();
        }
    }, 1000);
}
function pauseBreathing() {
    breathingPaused = !breathingPaused;
    pauseBreathingBtn.textContent = breathingPaused ? 'Resume' : 'Pause';
}
function stopBreathing() {
    clearInterval(breathingTimer);
    breathingText.textContent = 'Ready to breathe?';
    breathingCounter.textContent = '';
    breathingCircle.className = 'breathing-circle';
    startBreathingBtn.style.display = '';
    pauseBreathingBtn.style.display = 'none';
    stopBreathingBtn.style.display = 'none';
    pauseBreathingBtn.textContent = 'Pause';
}

startBreathingBtn.addEventListener('click', startBreathing);
pauseBreathingBtn.addEventListener('click', pauseBreathing);
stopBreathingBtn.addEventListener('click', stopBreathing);

// --------- Sleep Tracker ---------
const bedtime = document.getElementById('bedtime');
const wakeTime = document.getElementById('wakeTime');
const sleepQuality = document.getElementById('sleepQuality');
const sleepNotes = document.getElementById('sleepNotes');
const saveSleepBtn = document.getElementById('saveSleepBtn');
const avgSleepHours = document.getElementById('avgSleepHours');
const sleepScore = document.getElementById('sleepScore');
const sleepConsistency = document.getElementById('sleepConsistency');

let sleepData = JSON.parse(localStorage.getItem('sleepData') || '[]');

saveSleepBtn.addEventListener('click', () => {
    const today = new Date().toISOString().slice(0,10);
    // Remove existing entry for today
    sleepData = sleepData.filter(s => s.date !== today);
    sleepData.push({
        date: today,
        bedtime: bedtime.value,
        wakeTime: wakeTime.value,
        quality: Number(sleepQuality.value),
        notes: sleepNotes.value
    });
    localStorage.setItem('sleepData', JSON.stringify(sleepData));
    renderSleepStats();
});

function renderSleepStats() {
    if (!sleepData.length) {
        avgSleepHours.textContent = '-';
        sleepScore.textContent = '-';
        sleepConsistency.textContent = '-';
        return;
    }
    // Only last 7 days
    const last7 = [];
    for (let i=6; i>=0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0,10);
        const entry = sleepData.find(s => s.date === dateStr);
        if (entry) last7.push(entry);
    }
    // Average sleep hours
    let totalHours = 0, count = 0, totalQuality = 0, consistency = 0;
    last7.forEach(e => {
        if (e.bedtime && e.wakeTime) {
            let [bh, bm] = e.bedtime.split(':').map(Number);
            let [wh, wm] = e.wakeTime.split(':').map(Number);
            let hours = (wh + wm/60) - (bh + bm/60);
            if (hours < 0) hours += 24;
            totalHours += hours;
            count++;
        }
        if (e.quality) totalQuality += e.quality;
        if (e.bedtime && e.wakeTime) consistency++;
    });
    avgSleepHours.textContent = count ? (totalHours/count).toFixed(1)+'h' : '-';
    sleepScore.textContent = count ? (totalQuality/count).toFixed(1) : '-';
    sleepConsistency.textContent = Math.round(consistency/7*100)+'%';
}
renderSleepStats();

// --------- Journal ---------
const journalDate = document.getElementById('journalDate');
const journalTextarea = document.getElementById('journalTextarea');
const saveJournalBtn = document.getElementById('saveJournalBtn');
const wordCount = document.getElementById('wordCount');
const journalEntries = document.getElementById('journalEntries');
const promptBtns = document.querySelectorAll('.prompt-btn');

let journalData = JSON.parse(localStorage.getItem('journalData') || '[]');

function updateJournalDate() {
    const today = new Date();
    journalDate.textContent = today.toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'short', day:'numeric'});
}
updateJournalDate();

journalTextarea.addEventListener('input', () => {
    const words = journalTextarea.value.trim().split(/\s+/).filter(Boolean).length;
    wordCount.textContent = `${words} word${words!==1?'s':''}`;
});

saveJournalBtn.addEventListener('click', () => {
    const today = new Date().toISOString().slice(0,10);
    // Remove existing entry for today
    journalData = journalData.filter(j => j.date !== today);
    journalData.unshift({
        date: today,
        text: journalTextarea.value
    });
    localStorage.setItem('journalData', JSON.stringify(journalData));
    renderJournalEntries();
    journalTextarea.value = '';
    wordCount.textContent = '0 words';
});

function renderJournalEntries() {
    journalEntries.innerHTML = '';
    journalData.slice(0,7).forEach(entry => {
        const div = document.createElement('div');
        div.className = 'journal-entry';
        div.innerHTML = `
            <div class="entry-date">${new Date(entry.date).toLocaleDateString()}</div>
            <div class="entry-text">${escapeHTML(entry.text).replace(/\n/g,'<br>')}</div>
        `;
        journalEntries.appendChild(div);
    });
}
renderJournalEntries();

promptBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        journalTextarea.value += (journalTextarea.value ? '\n' : '') + btn.dataset.prompt + ' ';
        journalTextarea.focus();
        journalTextarea.dispatchEvent(new Event('input'));
    });
});

// --------- Tap Indicator (Avatar) ---------
const tapIndicator = document.getElementById('tapIndicator');
avatar.addEventListener('click', () => {
    tapIndicator.style.opacity = 0;
    setTimeout(() => tapIndicator.style.opacity = 1, 2000);
});
