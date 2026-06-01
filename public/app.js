const TRANSLATIONS = {
    en: {
        title: 'ElectraFlow <span>AI</span>',
        subtitle: 'Empowering Indian Voters with AI-Driven Information, Guidance & Election Education',
        placeholder: 'Ask about voter ID status, polling booth, or election guidelines...',
        askAi: 'Ask AI',
        quickSuggestions: 'Common Queries:',
        sugg1: 'How to register to vote in India?',
        sugg2: 'What documents do I need to vote?',
        sugg3: 'How to find my polling booth?',
        sugg4: 'What is the step by step process inside the polling station?',
        loading: 'Generating Indian Election AI Guide...',
        copyright: '&copy; 2026 ElectraFlow AI. All rights reserved.',
        disclaimer: 'Disclaimer: ElectraFlow AI is an independent, non-partisan AI guide. We do not represent the Election Commission of India (ECI) or any government entity. Please verify critical details directly with the official ECI portal.',
        stepsHeader: '<i class="fa-solid fa-list-ol"></i> Step-by-Step Guide',
        tipsHeader: '<i class="fa-regular fa-lightbulb"></i> Crucial Tips',
        themeTooltipDark: 'Switch to Light Mode for brighter theme',
        themeTooltipLight: 'Switch to Dark Mode for darker theme',
        langTooltip: 'Switch to Hindi for Hindi translation / हिंदी अनुवाद के लिए क्लिक करें',
        accessTooltipOff: 'Enable Accessibility Mode (simplified layout, higher contrast & clean spacing)',
        accessTooltipOn: 'Disable Accessibility Mode'
    },
    hi: {
        title: 'इलेक्ट्राफ्लो <span>AI</span>',
        subtitle: 'एआई-संचालित सूचना, मार्गदर्शन और चुनाव शिक्षा के साथ भारतीय मतदाताओं को सशक्त बनाना',
        placeholder: 'मतदाता पहचान पत्र, मतदान केंद्र या चुनाव दिशानिर्देशों के बारे में पूछें...',
        askAi: 'एआई से पूछें',
        quickSuggestions: 'सामान्य प्रश्न:',
        sugg1: 'भारत में मतदान के लिए पंजीकरण कैसे करें?',
        sugg2: 'वोट देने के लिए मुझे किन दस्तावेजों की आवश्यकता है?',
        sugg3: 'अपना मतदान केंद्र कैसे खोजें?',
        sugg4: 'मतदान केंद्र के अंदर चरण-दर-चरण प्रक्रिया क्या है?',
        loading: 'भारतीय चुनाव एआई गाइड तैयार किया जा रहा है...',
        copyright: '&copy; 2026 इलेक्ट्राफ्लो AI. सर्वाधिकार सुरक्षित।',
        disclaimer: 'अस्वीकरण: इलेक्ट्राफ्लो AI एक स्वतंत्र, गैर-पक्षपातपूर्ण एआई गाइड है। हम भारत निर्वाचन आयोग (ECI) या किसी सरकारी संस्था का प्रतिनिधित्व नहीं करते हैं। कृपया आधिकारिक ECI पोर्टल पर सीधे महत्वपूर्ण विवरणों की पुष्टि करें।',
        stepsHeader: '<i class="fa-solid fa-list-ol"></i> चरण-दर-चरण मार्गदर्शिका',
        tipsHeader: '<i class="fa-regular fa-lightbulb"></i> महत्वपूर्ण सुझाव',
        themeTooltipDark: 'चमकदार थीम के लिए लाइट मोड पर स्विच करें',
        themeTooltipLight: 'गहरे रंग की थीम के लिए डार्क मोड पर स्विच करें',
        langTooltip: 'अंग्रेजी में बदलें / Switch to English',
        accessTooltipOff: 'पहुंच-योग्यता मोड सक्षम करें (सरल लेआउट, उच्च-कंट्रास्ट और स्पष्ट रिक्ति)',
        accessTooltipOn: 'पहुंच-योग्यता मोड अक्षम करें'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const queryForm = document.getElementById('query-form');
    const queryInput = document.getElementById('query-input');
    const loader = document.getElementById('loader');
    const resultsPanel = document.getElementById('results-panel');
    const resultTitle = document.getElementById('result-title');
    const badgeSource = document.getElementById('badge-source');
    const badgeTime = document.getElementById('badge-time');
    const stepsContainer = document.getElementById('steps-container');
    const tipsContainer = document.getElementById('tips-container');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const languageToggleBtn = document.getElementById('language-toggle-btn');
    const accessibilityToggleBtn = document.getElementById('accessibility-toggle-btn');

    const submitBtn = queryForm.querySelector('.btn-submit');
    const submitBtnSpan = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('i');

    // State Initialization with localStorage
    let currentTheme = localStorage.getItem('electraflow_theme') || 'dark';
    let currentLang = localStorage.getItem('electraflow_lang') || 'en';
    let accessibilityMode = localStorage.getItem('electraflow_accessibility') === 'true';

    // Generate or retrieve Session ID
    let sessionId = localStorage.getItem('electraflow_session_id');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('electraflow_session_id', sessionId);
    }

    // Apply saved configurations
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    if (accessibilityMode) {
        document.body.classList.add('accessibility-mode');
        accessibilityToggleBtn.classList.add('active');
    }

    applyLanguage(currentLang);

    // Helper to toggle control state
    function toggleControls(disable) {
        queryInput.disabled = disable;
        submitBtn.disabled = disable;

        languageToggleBtn.disabled = disable;
        themeToggleBtn.disabled = disable;
        accessibilityToggleBtn.disabled = disable;

        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => btn.disabled = disable);
    }

    // Helper to trigger button cooldown timer
    function startCooldown(seconds) {
        queryForm.classList.add('cooldown');
        toggleControls(true);

        let remaining = seconds;
        submitBtnIcon.className = "fa-solid fa-hourglass-half fa-spin";

        const interval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(interval);
                queryForm.classList.remove('cooldown');
                submitBtnSpan.textContent = TRANSLATIONS[currentLang].askAi;
                submitBtnIcon.className = "fa-solid fa-arrow-right";
                toggleControls(false);
            } else {
                submitBtnSpan.textContent = currentLang === 'en' ? `Wait ${remaining}s...` : `प्रतीक्षा करें ${remaining}s...`;
            }
        }, 1000);

        submitBtnSpan.textContent = currentLang === 'en' ? `Wait ${remaining}s...` : `प्रतीक्षा करें ${remaining}s...`;
    }

    // Set up Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('electraflow_theme', currentTheme);
        updateTooltips(currentLang);
    });

    // Set up Language Toggle
    languageToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        localStorage.setItem('electraflow_lang', currentLang);
        applyLanguage(currentLang);
    });

    // Set up Accessibility Toggle
    accessibilityToggleBtn.addEventListener('click', () => {
        accessibilityMode = !accessibilityMode;
        document.body.classList.toggle('accessibility-mode', accessibilityMode);
        accessibilityToggleBtn.classList.toggle('active', accessibilityMode);
        localStorage.setItem('electraflow_accessibility', accessibilityMode);
        updateTooltips(currentLang);
    });

    // Translate dynamic labels/tooltips
    function applyLanguage(lang) {
        const t = TRANSLATIONS[lang];
        if (!t) return;

        // Title
        document.querySelector('.logo-area h1').innerHTML = t.title;

        // Subtitle
        document.querySelector('.subtitle').textContent = t.subtitle;

        // Input placeholder
        queryInput.placeholder = t.placeholder;

        // Submit button
        submitBtnSpan.textContent = t.askAi;

        // Suggestions title
        const suggTitle = document.querySelector('.suggestions-container .suggestions-title');
        if (suggTitle) suggTitle.textContent = t.quickSuggestions;

        // Suggestion buttons
        const suggBtns = document.querySelectorAll('.suggestion-btn');
        if (suggBtns.length >= 4) {
            suggBtns[0].textContent = lang === 'en' ? 'How to register?' : 'पंजीकरण कैसे करें?';
            suggBtns[0].setAttribute('data-query', t.sugg1);

            suggBtns[1].textContent = lang === 'en' ? 'Required ID cards' : 'आवश्यक पहचान पत्र';
            suggBtns[1].setAttribute('data-query', t.sugg2);

            suggBtns[2].textContent = lang === 'en' ? 'Find polling booth' : 'मतदान केंद्र खोजें';
            suggBtns[2].setAttribute('data-query', t.sugg3);

            suggBtns[3].textContent = lang === 'en' ? 'Voting process' : 'मतदान प्रक्रिया';
            suggBtns[3].setAttribute('data-query', t.sugg4);
        }

        // Loader text
        const loaderText = document.querySelector('.loader-container p');
        if (loaderText) loaderText.textContent = t.loading;

        // Footer copyright
        const copyrightText = document.getElementById('footer-copyright');
        if (copyrightText) copyrightText.innerHTML = t.copyright;

        // Footer disclaimer
        const disclaimerText = document.getElementById('footer-disclaimer');
        if (disclaimerText) disclaimerText.textContent = t.disclaimer;

        // Dynamic result headers
        const stepsHeader = document.querySelector('.steps-section h3');
        if (stepsHeader) stepsHeader.innerHTML = t.stepsHeader;

        const tipsHeader = document.querySelector('.tips-section h3');
        if (tipsHeader) tipsHeader.innerHTML = t.tipsHeader;

        // Language toggle button text
        const langBtnText = document.querySelector('#language-toggle-btn .lang-text');
        if (langBtnText) {
            langBtnText.textContent = lang === 'en' ? 'HI' : 'EN';
        }

        updateTooltips(lang);
    }

    function updateTooltips(lang) {
        const t = TRANSLATIONS[lang];

        // Language Tooltip
        const langTooltip = document.getElementById('lang-tooltip');
        if (langTooltip) langTooltip.textContent = t.langTooltip;

        // Theme Tooltip
        const themeTooltip = document.getElementById('theme-tooltip');
        const isLight = document.body.classList.contains('light-theme');
        if (themeTooltip) {
            themeTooltip.textContent = isLight ? t.themeTooltipLight : t.themeTooltipDark;
        }

        // Accessibility Tooltip
        const accessTooltip = document.getElementById('access-tooltip');
        const isAccess = document.body.classList.contains('accessibility-mode');
        if (accessTooltip) {
            accessTooltip.textContent = isAccess ? t.accessTooltipOn : t.accessTooltipOff;
        }
    }

    // Set up form submission
    queryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const queryText = queryInput.value.trim();
        if (!queryText) return;

        await submitQuery(queryText, currentLang, accessibilityMode);
    });

    // Set up quick suggestion buttons
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            if (queryForm.classList.contains('submitting') || queryForm.classList.contains('cooldown')) {
                return;
            }
            const queryText = btn.getAttribute('data-query');
            queryInput.value = queryText;

            await submitQuery(queryText, currentLang, accessibilityMode);
        });
    });

    // Core Submit logic
    async function submitQuery(query, language, accessibilityMode) {
        if (queryForm.classList.contains('submitting') || queryForm.classList.contains('cooldown')) {
            return;
        }

        // Show loader, hide results
        loader.classList.remove('hidden');
        resultsPanel.classList.add('hidden');

        queryForm.classList.add('submitting');
        toggleControls(true);

        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-session-id': sessionId
                },
                body: JSON.stringify({
                    query,
                    language,
                    accessibilityMode,
                    sessionId
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    const payload = await response.json();
                    renderResults(payload.data, payload.meta);
                    startCooldown(15);
                    return;
                }
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const payload = await response.json();

            if (payload.status === 'success' && payload.data) {
                renderResults(payload.data, payload.meta);
            } else {
                showError(currentLang === 'en' ? "Malformed response received from the server." : "सर्वर से विकृत प्रतिक्रिया प्राप्त हुई।");
            }
        } catch (err) {
            console.error("Submission failed:", err);
            showError(currentLang === 'en'
                ? "Could not reach ElectraFlow API. Please verify your connection."
                : "इलेक्ट्राफ्लो एपीआई तक नहीं पहुंचा जा सका। कृपया अपने कनेक्शन की पुष्टि करें।");
        } finally {
            loader.classList.add('hidden');
            queryForm.classList.remove('submitting');
            if (!queryForm.classList.contains('cooldown')) {
                toggleControls(false);
            }
        }
    }

    // Render results in DOM
    function renderResults(data, meta) {
        // 1. Setup Title
        resultTitle.textContent = data.title || (currentLang === 'en' ? "Indian Voter Guide" : "भारतीय मतदाता गाइड");

        // 2. Setup Badges
        badgeSource.textContent = meta.source || "Gemini";
        if (meta.source === 'Cache') {
            badgeSource.classList.add('cache-source');
        } else {
            badgeSource.classList.remove('cache-source');
        }
        badgeTime.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${meta.responseTime} ms`;

        // 3. Clear container
        stepsContainer.innerHTML = '';
        tipsContainer.innerHTML = '';

        // 4. Fill Steps
        if (data.steps && data.steps.length > 0) {
            data.steps.forEach((step, index) => {
                const stepEl = document.createElement('div');
                stepEl.className = 'step-item';
                stepEl.style.animationDelay = `${index * 0.1}s`;
                stepEl.innerHTML = `
                    <span class="step-num">${currentLang === 'en' ? 'Step' : 'चरण'} ${index + 1}</span>
                    <span class="step-text">${step}</span>
                `;
                stepsContainer.appendChild(stepEl);
            });
        } else {
            stepsContainer.innerHTML = `<div class="step-text">${currentLang === 'en' ? 'No step-by-step instructions generated.' : 'कोई चरण-दर-चरण निर्देश नहीं मिले।'}</div>`;
        }

        // 5. Fill Tips
        if (data.tips && data.tips.length > 0) {
            data.tips.forEach((tip, index) => {
                const tipEl = document.createElement('div');
                tipEl.className = 'tip-card';
                tipEl.style.animationDelay = `${(index * 0.1) + 0.3}s`;
                tipEl.innerHTML = `
                    <i class="fa-solid fa-circle-info tip-icon"></i>
                    <span class="tip-text">${tip}</span>
                `;
                tipsContainer.appendChild(tipEl);
            });
        } else {
            tipsContainer.innerHTML = `<div class="tip-text">${currentLang === 'en' ? 'No additional tips.' : 'कोई अतिरिक्त सुझाव नहीं।'}</div>`;
        }

        // Show panel
        resultsPanel.classList.remove('hidden');
    }

    // Render error cards
    function showError(msg) {
        resultTitle.textContent = currentLang === 'en' ? "Error Occurred" : "त्रुटि हुई";
        badgeSource.textContent = currentLang === 'en' ? "Error" : "त्रुटि";
        badgeSource.classList.remove('cache-source');
        badgeTime.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Alert`;

        stepsContainer.innerHTML = `
            <div class="step-item" style="color: #ef4444;">
                <span class="step-num"><i class="fa-solid fa-circle-exclamation"></i> ${currentLang === 'en' ? 'Failed' : 'विफल'}</span>
                <span class="step-text">${msg}</span>
            </div>
        `;

        tipsContainer.innerHTML = `
            <div class="tip-card" style="border-color: rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.05);">
                <i class="fa-solid fa-lightbulb tip-icon" style="color: #f87171;"></i>
                <span class="tip-text">${currentLang === 'en' ? 'Ensure your local server is running by typing "node server.js" in the terminal.' : 'सुनिश्चित करें कि आपका स्थानीय सर्वर चल रहा है।'}</span>
            </div>
        `;

        resultsPanel.classList.remove('hidden');
    }
});
