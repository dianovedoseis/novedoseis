const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownEl = document.getElementById('countdown');
const countdownCards = Array.from(document.querySelectorAll('[data-countdown-unit]'));
let countdownRitualReady = false;

const countDownDate = new Date("2026-06-09T14:00:00-03:00").getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countDownDate - now;

    if (distance < 0) {
        clearInterval(interval);
        document.getElementById("countdown").innerHTML = "<h2>O abismo foi aberto!</h2>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(daysEl) daysEl.innerText = days;
    if(hoursEl) hoursEl.innerText = hours;
    if(minutesEl) minutesEl.innerText = minutes;
    if(secondsEl) secondsEl.innerText = seconds;
    if (countdownRitualReady) syncCountdownRitualState();
};

const interval = setInterval(updateCountdown, 1000);
updateCountdown();

const defaultPageTitle = document.title;
let faviconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel*="icon"]');
const defaultFaviconHref = faviconLink ? faviconLink.href : '';
let tabWatcherRestoreTimer = null;

const ensureFaviconLink = () => {
    if (faviconLink) return faviconLink;
    const link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
    faviconLink = link;
    return faviconLink;
};

const createWatcherFavicon = (eyeColor) => {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="56%">
                    <stop offset="0%" stop-color="${eyeColor}" stop-opacity="0.34"/>
                    <stop offset="60%" stop-color="${eyeColor}" stop-opacity="0.08"/>
                    <stop offset="100%" stop-color="${eyeColor}" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="sclera" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#f4eee8"/>
                    <stop offset="100%" stop-color="#d8ccc3"/>
                </linearGradient>
                <radialGradient id="iris" cx="50%" cy="50%" r="66%">
                    <stop offset="0%" stop-color="#ffd3cb"/>
                    <stop offset="28%" stop-color="${eyeColor}"/>
                    <stop offset="72%" stop-color="#7a1216"/>
                    <stop offset="100%" stop-color="#2a070b"/>
                </radialGradient>
            </defs>
            <circle cx="32" cy="32" r="22" fill="url(#glow)"/>
            <path d="M7 32c6-10 15-16 25-16s19 6 25 16c-6 10-15 16-25 16S13 42 7 32Z" fill="#140d0f" stroke="#6b2422" stroke-opacity="0.34" stroke-width="1.3"/>
            <path d="M10 32c5-8 13-13 22-13s17 5 22 13c-5 8-13 13-22 13S15 40 10 32Z" fill="url(#sclera)"/>
            <ellipse cx="32" cy="32" rx="11" ry="10" fill="url(#iris)"/>
            <ellipse cx="32" cy="32" rx="3.7" ry="8.8" fill="#080406"/>
            <ellipse cx="31.2" cy="31.5" rx="1.1" ry="3.6" fill="#18070a" opacity="0.7"/>
            <circle cx="36.6" cy="27.8" r="1.9" fill="#fff1ec" opacity="0.95"/>
            <path d="M10 32c5-8 13-13 22-13s17 5 22 13" fill="none" stroke="#2b1214" stroke-width="2.1" stroke-linecap="round" opacity="0.7"/>
            <path d="M10 32c5 8 13 13 22 13s17-5 22-13" fill="none" stroke="#2b1214" stroke-width="2.1" stroke-linecap="round" opacity="0.48"/>
        </svg>
    `;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const watcherFaviconHidden = createWatcherFavicon('#ff3b31');
const watcherFaviconReturn = createWatcherFavicon('#ff6e64');

const setTabWatcherState = ({ title, faviconHref }) => {
    document.title = title;
    const icon = ensureFaviconLink();
    icon.type = faviconHref.startsWith('data:image/svg+xml') ? 'image/svg+xml' : 'image/png';
    icon.href = faviconHref;
};

const restoreDefaultTabState = () => {
    if (tabWatcherRestoreTimer) {
        clearTimeout(tabWatcherRestoreTimer);
        tabWatcherRestoreTimer = null;
    }
    setTabWatcherState({
        title: defaultPageTitle,
        faviconHref: defaultFaviconHref
    });
};

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (tabWatcherRestoreTimer) {
            clearTimeout(tabWatcherRestoreTimer);
            tabWatcherRestoreTimer = null;
        }
        setTabWatcherState({
            title: 'VOLTE',
            faviconHref: watcherFaviconHidden
        });
        return;
    }

    setTabWatcherState({
        title: 'NOS VIMOS',
        faviconHref: watcherFaviconReturn
    });
    tabWatcherRestoreTimer = setTimeout(() => {
        restoreDefaultTabState();
    }, 1400);
});

const cursorShadowAura = document.createElement('div');
cursorShadowAura.id = 'cursor-shadow-aura';
cursorShadowAura.setAttribute('aria-hidden', 'true');
document.body.appendChild(cursorShadowAura);

let auraTargetX = window.innerWidth / 2;
let auraTargetY = window.innerHeight / 2;
let auraCurrentX = auraTargetX;
let auraCurrentY = auraTargetY;
let auraVisible = false;
let auraPulseTimer = null;

const showCursorAura = () => {
    if (auraVisible) return;
    auraVisible = true;
    document.body.classList.add('has-cursor-aura');
    cursorShadowAura.classList.add('is-visible');
};

const hideCursorAura = () => {
    auraVisible = false;
    document.body.classList.remove('has-cursor-aura');
    cursorShadowAura.classList.remove('is-visible');
};

const pulseCursorAura = () => {
    if (!auraVisible) return;
    cursorShadowAura.classList.remove('is-pulsing');
    void cursorShadowAura.offsetWidth;
    cursorShadowAura.classList.add('is-pulsing');
    if (auraPulseTimer) {
        clearTimeout(auraPulseTimer);
    }
    auraPulseTimer = setTimeout(() => {
        cursorShadowAura.classList.remove('is-pulsing');
        auraPulseTimer = null;
    }, 540);
};

const updateAuraTarget = (clientX, clientY) => {
    if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
    auraTargetX = clientX;
    auraTargetY = clientY;
    document.documentElement.style.setProperty('--cursor-reveal-x', `${clientX}px`);
    document.documentElement.style.setProperty('--cursor-reveal-y', `${clientY}px`);
    showCursorAura();
};

const animateCursorAura = () => {
    auraCurrentX += (auraTargetX - auraCurrentX) * 0.08;
    auraCurrentY += (auraTargetY - auraCurrentY) * 0.08;
    cursorShadowAura.style.transform = `translate3d(${auraCurrentX}px, ${auraCurrentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursorAura);
};

document.addEventListener('pointermove', (event) => updateAuraTarget(event.clientX, event.clientY));
document.addEventListener('mousemove', (event) => updateAuraTarget(event.clientX, event.clientY));
document.addEventListener('pointerdown', pulseCursorAura);
document.addEventListener('touchmove', (event) => {
    if (!event.touches || !event.touches[0]) return;
    updateAuraTarget(event.touches[0].clientX, event.touches[0].clientY);
}, { passive: true });
window.addEventListener('blur', hideCursorAura);
document.addEventListener('mouseleave', hideCursorAura);
animateCursorAura();

const videoModal = document.getElementById('video-modal');
const launchVideo = document.getElementById('launch-video');
const launchLink = document.querySelector('.launch-link');
const abyssTrigger = document.getElementById('abyss-trigger');
const shadowsATrigger = document.getElementById('shadows-a-trigger');
const warningModal = document.getElementById('warning-modal');
const copyrightTrigger = document.getElementById('copyright-trigger');
const parchmentModal = document.getElementById('parchment-modal');
const closeParchmentControls = document.querySelectorAll('[data-close-parchment]');
const chessTrigger = document.getElementById('chess-trigger');
const chessModal = document.getElementById('chess-modal');
const chessBoard = document.getElementById('chess-board');
const chessStatus = document.getElementById('chess-status');
const chessReset = document.getElementById('chess-reset');
const chessMeta = document.getElementById('chess-meta');
const chessMode = document.getElementById('chess-mode');
const chessServerUrl = document.getElementById('chess-server-url');
const chessRoomId = document.getElementById('chess-room-id');
const chessConnect = document.getElementById('chess-connect');
const closeChessControls = document.querySelectorAll('[data-close-chess]');
const badgeRunawayButton = document.getElementById('badge-runaway-button');
const badgeButtonZone = document.getElementById('badge-button-zone');
const closeModalControls = document.querySelectorAll('[data-close-modal]');
const secretCodeInput = document.getElementById('secret-code-input');
const secretCodeSubmit = document.getElementById('secret-code-submit');
const secretCodeFeedback = document.getElementById('secret-code-feedback');
const secretAccessHint = document.getElementById('secret-access-hint');
const inviteCodeInput = document.getElementById('invite-code-input');
const inviteCodeSubmit = document.getElementById('invite-code-submit');
const inviteCodeFeedback = document.getElementById('invite-code-feedback');
const secretChoiceModal = document.getElementById('secret-choice-modal');
const secretChoiceYes = document.getElementById('secret-choice-yes');
const secretChoiceNo = document.getElementById('secret-choice-no');
const closeSecretChoiceControls = document.querySelectorAll('[data-close-secret-choice]');
const secretMimimModal = document.getElementById('secret-mimim-modal');
const closeSecretMimimControls = document.querySelectorAll('[data-close-secret-mimim]');
const soulCookiePopup = document.getElementById('soul-cookie-popup');
const soulCookieAcceptButtons = document.querySelectorAll('[data-cookie-accept]');
const abyssProgressFill = document.getElementById('abyss-progress-fill');
const abyssProgressText = document.getElementById('abyss-progress-text');
const shadowToast = document.getElementById('shadow-toast');
const shadowChaseStatus = document.getElementById('shadow-chase-status');
const fragmentInventoryCount = document.getElementById('fragment-inventory-count');
const fragmentGrid = document.getElementById('fragment-grid');
const fragmentInventoryNote = document.getElementById('fragment-inventory-note');
const launchCursorImagePath = 'assets/foxpool-goku-6028390_640.png';
const LAUNCH_CURSOR_EFFECT_MS = 2000;
const LAUNCH_GOKU_APPROACH_MS = 5000;
const DISCORD_INVITE_CODE = 'jVc7Dd3Q9K';
const inviteFragments = Array.from(DISCORD_INVITE_CODE);
const DISCORD_INVITE_URL = `https://discord.gg/${DISCORD_INVITE_CODE}`;
const allSecretCodes = ['aquarios', 'tomate', 'soa', 'crota'];
const SHADOW_STORAGE_KEY = 'soa-shadow-arg-v3';
const shadowTrials = [
    {
        id: 'dvd',
        name: 'Eco VHS',
        clue: 'o espectro que rebate nas bordas',
        fragment: inviteFragments[0]
    },
    {
        id: 'badge',
        name: 'Emblema fugitivo',
        clue: 'o emblema odeia maos lentas',
        fragment: inviteFragments[1]
    },
    {
        id: 'tag',
        name: 'Tag do Abyss',
        clue: 'duas batidas em ABYSS provocam a caca',
        fragment: inviteFragments[2]
    },
    {
        id: 'terminal',
        name: 'Terminal falso',
        clue: 'o nome do abismo desperta a maquina',
        fragment: inviteFragments[3]
    },
    {
        id: 'parchment',
        name: 'Ritual 09 > 06',
        clue: 'o tempo cede quando o nono minuto chama o sexto segundo',
        fragment: inviteFragments[4]
    },
    {
        id: 'aquarios',
        name: 'Eco aquatico',
        clue: 'uma sombra responde a constelacoes',
        fragment: inviteFragments[5]
    },
    {
        id: 'tomate',
        name: 'Eco vermelho',
        clue: 'uma sombra responde a um fruto vermelho',
        fragment: inviteFragments[6]
    },
    {
        id: 'soa',
        name: 'Juramento',
        clue: 'algumas portas reconhecem siglas',
        fragment: inviteFragments[7]
    },
    {
        id: 'crota',
        name: 'Despertar',
        clue: 'um codigo acorda um prisioneiro antigo',
        fragment: inviteFragments[8]
    },
    {
        id: 'chess3',
        name: 'Trinca no tabuleiro',
        clue: 'mexa tres pecas no xadrez e o tabuleiro responde',
        fragment: inviteFragments[9]
    }
];
const shadowTrialMap = new Map(shadowTrials.map((trial) => [trial.id, trial]));
const readShadowState = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(SHADOW_STORAGE_KEY) || '{}');
        const solved = Array.isArray(parsed.solved)
            ? parsed.solved.filter((id) => shadowTrialMap.has(id))
            : [];
        const chessTrialMoveProgress = Number(parsed.chessTrialMoveProgress) || 0;
        return { solved, chessTrialMoveProgress };
    } catch (error) {
        return { solved: [], chessTrialMoveProgress: 0 };
    }
};
const shadowState = readShadowState();
const solvedShadowTrials = new Set(shadowState.solved);
const secretCodesTriggered = new Set(
    shadowState.solved.filter((id) => allSecretCodes.includes(id))
);
let chessTrialMoveProgress = shadowState.chessTrialMoveProgress;
let shadowToastTimer = null;
let shadowChaseStatusTimer = null;
let shadowRecentUnlockId = null;
let shadowRecentUnlockTimer = null;
const mimimAudio = new Audio('https://www.myinstants.com/media/sounds/snore-mimimimimimi.mp3');
mimimAudio.preload = 'auto';

const saveShadowState = () => {
    try {
        localStorage.setItem(SHADOW_STORAGE_KEY, JSON.stringify({
            solved: shadowTrials
                .map((trial) => trial.id)
                .filter((id) => solvedShadowTrials.has(id)),
            chessTrialMoveProgress
        }));
    } catch (error) {
        console.warn('Nao foi possivel salvar o progresso das sombras.', error);
    }
};

const normalizeInviteCandidate = (value) => (
    value
        .trim()
        .replace(/^https?:\/\/(www\.)?discord\.gg\//i, '')
        .replace(/^discord\.gg\//i, '')
        .replace(/\s+/g, '')
);

const getShadowCompletionRatio = () => (
    shadowTrials.length ? solvedShadowTrials.size / shadowTrials.length : 0
);

const showShadowToast = (message, duration = 2600) => {
    if (!shadowToast) return;
    if (shadowToastTimer) clearTimeout(shadowToastTimer);
    shadowToast.textContent = message;
    shadowToast.classList.add('is-visible');
    shadowToastTimer = setTimeout(() => {
        shadowToast.classList.remove('is-visible');
    }, duration);
};

const setShadowChaseMessage = (message = '', { persist = false } = {}) => {
    if (!shadowChaseStatus) return;
    if (shadowChaseStatusTimer) {
        clearTimeout(shadowChaseStatusTimer);
        shadowChaseStatusTimer = null;
    }
    shadowChaseStatus.textContent = message;
    shadowChaseStatus.classList.toggle('is-visible', Boolean(message));
    if (message && !persist) {
        shadowChaseStatusTimer = setTimeout(() => {
            shadowChaseStatus.classList.remove('is-visible');
        }, 2200);
    }
};

const updateSecretAccessHint = () => {
    if (!secretAccessHint) return;
    if (solvedShadowTrials.size >= shadowTrials.length) {
        secretAccessHint.textContent = 'os ecos ja acordaram';
        return;
    }

    const nextClue = shadowTrials
        .filter((trial) => !solvedShadowTrials.has(trial.id))
        .map((trial) => trial.clue)[0];

    secretAccessHint.textContent = nextClue || 'as sombras escutam';
};

const appendFragmentToInput = (fragment) => {
    if (!inviteCodeInput || !fragment) return;
    inviteCodeInput.value += fragment;
    inviteCodeInput.focus();
};

const setFragmentInventoryMessage = (text) => {
    if (!fragmentInventoryNote) return;
    fragmentInventoryNote.textContent = text;
};

const renderFragmentInventory = () => {
    if (fragmentInventoryCount) {
        fragmentInventoryCount.textContent = `${solvedShadowTrials.size}/${shadowTrials.length}`;
    }

    if (!fragmentGrid) return;
    const fragmentItems = shadowTrials.map((trial, index) => {
        const isUnlocked = solvedShadowTrials.has(trial.id);
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `fragment-chip ${isUnlocked ? 'is-unlocked' : 'is-locked'}`;
        if (shadowRecentUnlockId === trial.id) chip.classList.add('is-recent');

        const name = document.createElement('span');
        name.className = 'fragment-slot-name';
        name.textContent = `${String(index + 1).padStart(2, '0')} ${trial.name}`;

        const meta = document.createElement('span');
        meta.className = 'fragment-slot-meta';
        meta.textContent = isUnlocked ? 'clique para inserir' : 'selado';

        const value = document.createElement('span');
        value.className = 'fragment-slot-value';
        value.textContent = isUnlocked ? trial.fragment : '??';

        chip.append(name, meta, value);
        chip.addEventListener('click', () => {
            if (isUnlocked) {
                appendFragmentToInput(trial.fragment);
                setFragmentInventoryMessage(`Fragmento ${trial.fragment} inserido na montagem.`);
            } else {
                setFragmentInventoryMessage(`Dica ${String(index + 1).padStart(2, '0')}: ${trial.clue}.`);
            }
        });
        return chip;
    });

    fragmentGrid.replaceChildren(...fragmentItems);

    if (fragmentInventoryNote) {
        fragmentInventoryNote.textContent = solvedShadowTrials.size >= shadowTrials.length
            ? 'Convite completo. Monte e abra pela caixa acima.'
            : 'Clique em um selo para ouvir a dica dele.';
    }
};

const renderAbyssProgressBar = () => {
    if (!abyssProgressFill || !abyssProgressText) return;
    const percentage = Math.round(getShadowCompletionRatio() * 100);
    abyssProgressFill.style.width = `${percentage}%`;
    abyssProgressText.innerText = solvedShadowTrials.size >= shadowTrials.length
        ? `Convite completo. ${shadowTrials.length}/${shadowTrials.length} fragmentos.`
        : `Fragmentos nas sombras... ${solvedShadowTrials.size}/${shadowTrials.length} (${percentage}%)`;
};

const renderShadowArg = () => {
    renderAbyssProgressBar();
    renderFragmentInventory();
    updateSecretAccessHint();
};

const unlockShadowTrial = (trialId, {
    toast,
    feedback,
    modalText,
    silent = false
} = {}) => {
    const trial = shadowTrialMap.get(trialId);
    if (!trial) return false;
    if (solvedShadowTrials.has(trialId)) {
        if (!silent && feedback) setSecretFeedback(feedback);
        return false;
    }

    solvedShadowTrials.add(trialId);
    if (allSecretCodes.includes(trialId)) secretCodesTriggered.add(trialId);
    saveShadowState();
    shadowRecentUnlockId = trialId;
    if (shadowRecentUnlockTimer) clearTimeout(shadowRecentUnlockTimer);
    shadowRecentUnlockTimer = setTimeout(() => {
        shadowRecentUnlockId = null;
        renderFragmentInventory();
    }, 1600);
    renderShadowArg();

    const unlockMessage = toast || `Fragmento ${trial.fragment} recuperado: ${trial.name}.`;
    showShadowToast(unlockMessage);
    if (feedback) setSecretFeedback(feedback);
    if (modalText) setShadowChaseMessage(modalText);
    return true;
};

const COUNTDOWN_RITUAL_TRIAL_ID = 'parchment';
const COUNTDOWN_RITUAL_MINUTES = 9;
const COUNTDOWN_RITUAL_SECONDS = 6;
let countdownRitualStep = 0;

function getCountdownCard(unit) {
    return countdownCards.find((card) => card.dataset.countdownUnit === unit) || null;
}

function getCountdownUnitValue(unit) {
    const valueMap = {
        days: daysEl,
        hours: hoursEl,
        minutes: minutesEl,
        seconds: secondsEl
    };
    return valueMap[unit]?.textContent?.trim() || '';
}

function getCountdownUnitNumber(unit) {
    return Number.parseInt(getCountdownUnitValue(unit), 10);
}

function updateCountdownRitualCards() {
    if (!countdownCards.length) return;

    countdownCards.forEach((card) => {
        card.classList.remove('is-armed', 'is-ritual-target', 'is-solved');
    });

    if (solvedShadowTrials.has(COUNTDOWN_RITUAL_TRIAL_ID)) {
        getCountdownCard('minutes')?.classList.add('is-solved');
        getCountdownCard('seconds')?.classList.add('is-solved');
        return;
    }

    if (countdownRitualStep === 1) {
        getCountdownCard('minutes')?.classList.add('is-armed');
        getCountdownCard('seconds')?.classList.add('is-ritual-target');
        return;
    }

    getCountdownCard('minutes')?.classList.add('is-ritual-target');
}

function resetCountdownRitual({
    toast = '',
    keepStatus = false
} = {}) {
    countdownRitualStep = 0;
    updateCountdownRitualCards();
    if (!keepStatus) setShadowChaseMessage('');
    if (toast) showShadowToast(toast, 2000);
}

function syncCountdownRitualState() {
    if (!countdownRitualReady) return;

    if (solvedShadowTrials.has(COUNTDOWN_RITUAL_TRIAL_ID)) {
        countdownRitualStep = 0;
        updateCountdownRitualCards();
        return;
    }

    if (countdownRitualStep === 1 && getCountdownUnitNumber('minutes') !== COUNTDOWN_RITUAL_MINUTES) {
        resetCountdownRitual({
            toast: 'O nono minuto passou. O ritual precisa recomecar.'
        });
        return;
    }

    updateCountdownRitualCards();
}

function handleCountdownRitualAttempt(unit) {
    if (!countdownRitualReady) return;

    if (solvedShadowTrials.has(COUNTDOWN_RITUAL_TRIAL_ID)) {
        setShadowChaseMessage('O relogio ja entregou esse fragmento.');
        return;
    }

    if (countdownRitualStep === 0) {
        if (unit !== 'minutes') {
            showShadowToast('O ritual comeca nos minutos.', 1800);
            return;
        }

        if (getCountdownUnitNumber('minutes') !== COUNTDOWN_RITUAL_MINUTES) {
            showShadowToast('Ainda nao e o nono minuto.', 1800);
            return;
        }

        countdownRitualStep = 1;
        updateCountdownRitualCards();
        setShadowChaseMessage('O nono minuto respondeu. Agora toque o sexto segundo.', { persist: true });
        return;
    }

    if (unit !== 'seconds') {
        resetCountdownRitual({
            toast: 'A ordem foi quebrada. O relogio se fechou.'
        });
        return;
    }

    if (getCountdownUnitNumber('seconds') !== COUNTDOWN_RITUAL_SECONDS) {
        resetCountdownRitual({
            toast: 'Ainda nao e o sexto segundo.'
        });
        return;
    }

    const unlocked = unlockShadowTrial(COUNTDOWN_RITUAL_TRIAL_ID, {
        toast: `O tempo cedeu o fragmento ${shadowTrialMap.get(COUNTDOWN_RITUAL_TRIAL_ID).fragment}.`,
        feedback: 'o ritual 09 > 06 abriu uma fissura',
        modalText: 'O sexto segundo respondeu. Fragmento recuperado.'
    });

    countdownRitualStep = 0;
    updateCountdownRitualCards();
    if (!unlocked) {
        setShadowChaseMessage('O relogio permanece em silencio.');
    }
}

if (countdownCards.length) {
    countdownCards.forEach((card) => {
        const unit = card.dataset.countdownUnit;
        card.addEventListener('click', () => handleCountdownRitualAttempt(unit));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleCountdownRitualAttempt(unit);
            }
        });
    });
    countdownRitualReady = true;
    syncCountdownRitualState();
}

renderShadowArg();
let startAbyssTagGame = () => {
    setShadowChaseMessage('Abyss ainda esta se formando.');
};

// --- LOGICA DO TERMINAL E SEQUÊNCIA DE CAOS (ABYSS) ---
const fakeTerminal = document.getElementById('fake-terminal');
const fakeTerminalOutput = document.getElementById('fake-terminal-output');
const fakeTerminalClose = document.getElementById('fake-terminal-close');
const chaosAudio = new Audio('https://www.myinstants.com/media/sounds/chicken-on-tree-screaming.mp3');
let terminalInputBuffer = "";
let terminalSequenceId = 0;

const fakeTerminalLogs = [
    '[BOOT]: Inicializando modulo de vigilancia...',
    '[REDE]: Tunel seguro estabelecido em 127.0.0.1:8080',
    '[SISTEMA]: Usuario identificado.',
    "[SISTEMA]: Iniciando download de 'foto-do-pe.zip'... (Brincadeira).",
    '[STATUS]: Nenhuma ameaca real detectada. Curta o site :)'
];

const appendFakeTerminalLine = (line) => {
    if (!fakeTerminalOutput) return;
    console.log(`%c${line}`, 'color:#6bff6b;font-family:Consolas,monospace;font-weight:700;');
    fakeTerminalOutput.textContent += line + "\n";
    fakeTerminalOutput.scrollTop = fakeTerminalOutput.scrollHeight;
};

const resetChaosSequence = () => {
    document.body.classList.remove('screen-shake');
    document.documentElement.style.transition = '';
    document.documentElement.style.filter = '';
    document.documentElement.style.transform = '';
    document.documentElement.style.background = '';
    document.body.style.opacity = '';
};

const startChaosSequence = (sequenceId) => {
    document.body.classList.add('screen-shake');
    document.documentElement.style.transition = "filter 0.18s linear, transform 0.18s linear";

    const chaosInterval = setInterval(() => {
        const randomHue = Math.floor(Math.random() * 360);
        document.documentElement.style.filter = `hue-rotate(${randomHue}deg) brightness(1.45) contrast(1.85)`;
        document.documentElement.style.transform = `rotate(${(Math.random() - 0.5) * 7}deg) scale(${1 + Math.random() * 0.08})`;
    }, 100);

    chaosAudio.currentTime = 0;
    chaosAudio.play().catch(() => {});
    setTimeout(() => {
        if (sequenceId !== terminalSequenceId) return;
        clearInterval(chaosInterval);
        chaosAudio.pause();
        resetChaosSequence();
        const unlocked = unlockShadowTrial('terminal', {
            toast: `O terminal cuspiu o fragmento ${shadowTrialMap.get('terminal').fragment}.`,
            feedback: 'o terminal abriu uma fenda no codigo',
            modalText: 'Terminal estabilizado. Fragmento recuperado.'
        });
        appendFakeTerminalLine(unlocked
            ? `[ABYSS]: Fragmento ${shadowTrialMap.get('terminal').fragment} armazenado.`
            : '[ABYSS]: Terminal ja drenado. Nenhum novo fragmento detectado.'
        );
    }, 1500);
};

const runFakeTerminalLogs = () => {
    if (!fakeTerminalOutput) return;
    const sequenceId = ++terminalSequenceId;
    fakeTerminalOutput.textContent = "";

    fakeTerminalLogs.forEach((line, index) => {
        setTimeout(() => {
            if (sequenceId !== terminalSequenceId) return;
            appendFakeTerminalLine(line);
            if (index === fakeTerminalLogs.length - 1) {
                setTimeout(() => startChaosSequence(sequenceId), 500);
            }
        }, 420 * index);
    });
};

// --- LOGICA SKYRIM (CROTA) ---
const triggerSkyrimEasterEgg = () => {
    const skyrimVid = document.createElement('video');
    skyrimVid.src = 'assets/skyrin.mp4';
    skyrimVid.style.position = 'fixed';
    skyrimVid.style.top = '0';
    skyrimVid.style.left = '0';
    skyrimVid.style.width = '100vw';
    skyrimVid.style.height = '100vh';
    skyrimVid.style.backgroundColor = 'black';
    skyrimVid.style.zIndex = '999999';
    skyrimVid.style.opacity = '0';
    skyrimVid.style.transition = 'opacity 1.5s ease-in';
    
    document.body.appendChild(skyrimVid);
    document.body.style.transition = 'background-color 1s ease';
    document.body.style.backgroundColor = 'black';
    
    setTimeout(() => {
        skyrimVid.style.opacity = '1';
        skyrimVid.play();
        if (skyrimVid.requestFullscreen) skyrimVid.requestFullscreen();
        else if (skyrimVid.webkitRequestFullscreen) skyrimVid.webkitRequestFullscreen();
    }, 1000);

    skyrimVid.onended = () => {
        if (document.exitFullscreen) document.exitFullscreen();
        skyrimVid.remove();
        document.body.style.backgroundColor = '';
    };
};

// Captura de teclado para o buffer (Abyss)
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    terminalInputBuffer += e.key.toLowerCase();
    if (terminalInputBuffer.length > 15) terminalInputBuffer = terminalInputBuffer.slice(-15);

    if (terminalInputBuffer.includes('abyss')) {
        terminalInputBuffer = "";
        if (fakeTerminal) {
            fakeTerminal.classList.add('is-open');
            fakeTerminal.setAttribute('aria-hidden', 'false');
            runFakeTerminalLogs();
        }
    }
});

if (fakeTerminalClose) {
    fakeTerminalClose.addEventListener('click', () => {
        terminalSequenceId += 1;
        chaosAudio.pause();
        resetChaosSequence();
        fakeTerminal.classList.remove('is-open');
        fakeTerminal.setAttribute('aria-hidden', 'true');
    });
}

soulCookieAcceptButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!soulCookiePopup) return;
        soulCookiePopup.classList.add('is-hidden');
    });
});

let launchCursorTimer = null;
let launchCursorEffectId = 0;
let launchPointerX = window.innerWidth / 2;
let launchPointerY = window.innerHeight / 2;

const launchGokuCursorGhost = document.createElement('img');
launchGokuCursorGhost.id = 'launch-goku-cursor-ghost';
launchGokuCursorGhost.src = launchCursorImagePath;
launchGokuCursorGhost.alt = '';
launchGokuCursorGhost.setAttribute('aria-hidden', 'true');
launchGokuCursorGhost.decoding = 'async';
launchGokuCursorGhost.loading = 'eager';
document.body.appendChild(launchGokuCursorGhost);

const updateLaunchPointer = (clientX, clientY) => {
    if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
    launchPointerX = clientX;
    launchPointerY = clientY;
};

document.addEventListener('pointermove', (event) => updateLaunchPointer(event.clientX, event.clientY));
document.addEventListener('mousemove', (event) => updateLaunchPointer(event.clientX, event.clientY));
document.addEventListener('touchmove', (event) => {
    if (!event.touches || !event.touches[0]) return;
    updateLaunchPointer(event.touches[0].clientX, event.touches[0].clientY);
}, { passive: true });

const clearLaunchCursorEffect = () => {
    document.documentElement.classList.remove('cursor-prank-rotate', 'cursor-prank-goku');
    document.body.classList.remove('cursor-prank-rotate', 'cursor-prank-goku');
    launchGokuCursorGhost.classList.remove('is-visible', 'is-approaching');
    launchGokuCursorGhost.style.left = '-100px';
    launchGokuCursorGhost.style.top = '-100px';
};

const triggerLaunchCursorEffect = () => {
    const effectId = ++launchCursorEffectId;
    if (launchCursorTimer) clearTimeout(launchCursorTimer);
    clearLaunchCursorEffect();
    const useGokuCursor = Math.random() < 0.5;

    if (useGokuCursor) {
        launchGokuCursorGhost.style.left = `${launchPointerX}px`;
        launchGokuCursorGhost.style.top = `${launchPointerY}px`;
        document.documentElement.classList.add('cursor-prank-goku');
        document.body.classList.add('cursor-prank-goku');
        launchGokuCursorGhost.classList.add('is-visible');
        void launchGokuCursorGhost.offsetWidth;
        launchGokuCursorGhost.classList.add('is-approaching');
    } else {
        document.documentElement.classList.add('cursor-prank-rotate');
        document.body.classList.add('cursor-prank-rotate');
    }

    launchCursorTimer = setTimeout(() => {
        if (effectId !== launchCursorEffectId) return;
        clearLaunchCursorEffect();
    }, useGokuCursor ? LAUNCH_GOKU_APPROACH_MS : LAUNCH_CURSOR_EFFECT_MS);
};

const openVideo = (url, titleText, kickerText = 'Atenção') => {
    if (!videoModal || !launchVideo) return;
    const modalTitle = document.getElementById('video-modal-title');
    const modalKicker = document.querySelector('.video-modal-kicker');

    if (modalTitle) modalTitle.innerText = titleText;
    if (modalKicker) modalKicker.innerText = kickerText;
    launchVideo.src = url;
    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeVideoModal = () => {
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    launchVideo.src = '';
    document.body.style.overflow = '';
};

const openDiscordInvite = () => {
    window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
};

const openSecretChoiceModal = () => {
    if (!secretChoiceModal) return;
    secretChoiceModal.classList.add('is-open');
    secretChoiceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

const closeSecretChoiceModal = () => {
    if (!secretChoiceModal) return;
    secretChoiceModal.classList.remove('is-open');
    secretChoiceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

const openSecretMimimModal = () => {
    if (!secretMimimModal) return;
    secretMimimModal.classList.add('is-open');
    secretMimimModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    mimimAudio.currentTime = 0;
    mimimAudio.play().catch(() => {});
};

const closeSecretMimimModal = () => {
    if (!secretMimimModal) return;
    secretMimimModal.classList.remove('is-open');
    secretMimimModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    mimimAudio.pause();
};

const setSecretFeedback = (text) => {
    if (!secretCodeFeedback) return;
    secretCodeFeedback.textContent = text;
    secretCodeFeedback.classList.add('is-visible');
};

const setInviteFeedback = (text) => {
    if (!inviteCodeFeedback) return;
    inviteCodeFeedback.textContent = text;
    inviteCodeFeedback.classList.add('is-visible');
};

const handleInviteCodeSubmit = () => {
    if (!inviteCodeInput) return;
    const rawValue = inviteCodeInput.value || '';
    const normalizedInvite = normalizeInviteCandidate(rawValue);
    if (!normalizedInvite) return;

    if (normalizedInvite.toLowerCase() !== DISCORD_INVITE_CODE.toLowerCase()) {
        setInviteFeedback('a montagem ainda esta incorreta');
        showShadowToast('Os fragmentos nao se encaixaram ainda.');
        return;
    }

    if (solvedShadowTrials.size < shadowTrials.length) {
        setInviteFeedback('faltam fragmentos nas sombras');
        showShadowToast('Ainda faltam fragmentos antes da porta abrir.');
        return;
    }

    setInviteFeedback('convite montado. fenda aberta.');
    showShadowToast('Convite montado. A fenda para o Discord foi aberta.');
    openDiscordInvite();
};

const hasUnlockedAllSecretCodes = () => allSecretCodes.every((code) => secretCodesTriggered.has(code));

// --- GESTÃO DE CÓDIGOS DE INPUT (TOMATE, SOA, AQUARIOS, CROTA) ---
const handleSecretCodeSubmit = () => {
    if (!secretCodeInput) return;
    const rawCode = secretCodeInput.value || '';
    const trimmed = rawCode.trim();
    const code = trimmed.toLowerCase();
    if (!trimmed) return;

    if (normalizeInviteCandidate(trimmed).toLowerCase() === DISCORD_INVITE_CODE.toLowerCase()) {
        setSecretFeedback('esse codigo vai na caixa dos fragmentos');
        showShadowToast('Use a montagem lateral para o convite.');
        secretCodeInput.value = '';
        return;
    }

    if (code === 'aquarios' || code === 'quarios') {
        unlockShadowTrial('aquarios', {
            toast: `Fragmento ${shadowTrialMap.get('aquarios').fragment} arrancado do eco aquatico.`,
            feedback: 'achou que ia ter farpas ne'
        });
        openVideo('https://www.youtube-nocookie.com/embed/8hRmsQ-WjNc?autoplay=1&rel=0&modestbranding=1', 'achou que ia ter farpas né');
        secretCodeInput.value = '';
        return;
    }

    if (code === 'tomate') {
        unlockShadowTrial('tomate', {
            toast: `Fragmento ${shadowTrialMap.get('tomate').fragment} amadureceu nas sombras.`,
            feedback: 'tomate detectado'
        });
        openSecretChoiceModal();
        secretCodeInput.value = '';
        return;
    }

    if (code === 'soa') {
        unlockShadowTrial('soa', {
            toast: `Fragmento ${shadowTrialMap.get('soa').fragment} jurado ao SOA.`,
            feedback: 'Membros do SOA ate o dia 09/06'
        });
        openVideo('https://www.youtube.com/embed/tulP1Mc3-NU?autoplay=1', 'Membros do SOA até o dia 09/06');
        secretCodeInput.value = '';
        return;
    }

    // INTEGRAÇÃO CROTA
    if (code === 'crota') {
        unlockShadowTrial('crota', {
            toast: `Fragmento ${shadowTrialMap.get('crota').fragment} despertou com o prisioneiro.`,
            feedback: 'Hey, you. You\'re finally awake.'
        });
        triggerSkyrimEasterEgg();
        secretCodeInput.value = '';
        return;
    }

    if (hasUnlockedAllSecretCodes()) {
        setSecretFeedback('os codigos acabaram. o resto vive fora da caixa.');
    } else {
        setSecretFeedback('Quase... faltou o sacrificio');
    }
    openSecretMimimModal();
    secretCodeInput.value = '';
};

if (secretChoiceYes) {
    secretChoiceYes.addEventListener('click', () => {
        if (solvedShadowTrials.size >= shadowTrials.length) {
            openDiscordInvite();
            setSecretFeedback('as sombras aceitaram sua entrada.');
        } else {
            setSecretFeedback('a porta ainda esta quebrada. faltam fragmentos.');
            showShadowToast('A porta final ainda esta incompleta.');
        }
        closeSecretChoiceModal();
    });
}

if (secretChoiceNo) {
    secretChoiceNo.addEventListener('click', closeSecretChoiceModal);
}

closeSecretChoiceControls.forEach((el) => el.addEventListener('click', closeSecretChoiceModal));
closeSecretMimimControls.forEach((el) => el.addEventListener('click', closeSecretMimimModal));

if (secretCodeSubmit) {
    secretCodeSubmit.addEventListener('click', handleSecretCodeSubmit);
}

if (secretCodeInput) {
    secretCodeInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        handleSecretCodeSubmit();
    });
}

if (inviteCodeSubmit) {
    inviteCodeSubmit.addEventListener('click', handleInviteCodeSubmit);
}

if (inviteCodeInput) {
    inviteCodeInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        handleInviteCodeSubmit();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (secretChoiceModal && secretChoiceModal.classList.contains('is-open')) {
        closeSecretChoiceModal();
    }
    if (secretMimimModal && secretMimimModal.classList.contains('is-open')) {
        closeSecretMimimModal();
    }
});

if (launchLink) {
    launchLink.addEventListener('click', (e) => {
        e.preventDefault();
        triggerLaunchCursorEffect();
        openVideo('https://www.youtube.com/embed/fC7oUOUEEi4?autoplay=1', 'A equipe está trabalhando.');
    });
}

if (abyssTrigger) {
    let abyssClickTimer = null;
    let abyssArmTimer = null;
    const ABYSS_DOUBLE_CLICK_WINDOW_MS = 240;
    const clearAbyssTextSelection = () => {
        const selection = window.getSelection ? window.getSelection() : null;
        if (selection && typeof selection.removeAllRanges === 'function') {
            selection.removeAllRanges();
        }
    };
    const clearAbyssTriggerState = () => {
        abyssTrigger.classList.remove('is-arming', 'is-awakening');
    };
    const armAbyssTrigger = () => {
        if (abyssArmTimer) clearTimeout(abyssArmTimer);
        abyssTrigger.classList.remove('is-awakening');
        void abyssTrigger.offsetWidth;
        abyssTrigger.classList.add('is-arming');
        abyssArmTimer = setTimeout(() => {
            abyssTrigger.classList.remove('is-arming');
        }, 260);
    };
    const awakenAbyssTrigger = () => {
        if (abyssArmTimer) clearTimeout(abyssArmTimer);
        abyssTrigger.classList.remove('is-arming');
        void abyssTrigger.offsetWidth;
        abyssTrigger.classList.add('is-awakening');
        abyssArmTimer = setTimeout(clearAbyssTriggerState, 540);
    };

    abyssTrigger.addEventListener('click', (event) => {
        if (event.detail > 1) return;
        clearAbyssTextSelection();
        armAbyssTrigger();
        if (abyssClickTimer) clearTimeout(abyssClickTimer);
        abyssClickTimer = setTimeout(() => {
            clearAbyssTriggerState();
            openVideo('https://www.youtube.com/embed/KnHmoA6Op1o?autoplay=1', 'O segredo da bungie.');
        }, ABYSS_DOUBLE_CLICK_WINDOW_MS);
    });
    abyssTrigger.addEventListener('mousedown', (event) => {
        if (event.detail > 1) event.preventDefault();
    });
    abyssTrigger.addEventListener('dblclick', (event) => {
        event.preventDefault();
        clearAbyssTextSelection();
        if (abyssClickTimer) clearTimeout(abyssClickTimer);
        awakenAbyssTrigger();
        startAbyssTagGame();
    });
}

closeModalControls.forEach(el => el.addEventListener('click', closeVideoModal));

if (shadowsATrigger && warningModal) {
    const warningCountdown = document.getElementById('warning-countdown');
    let closingTimeout = null;
    let countdownInterval = null;

    const tryCloseSite = () => {
        window.open('', '_self');
        window.close();
        setTimeout(() => {
            document.body.innerHTML = '';
            location.href = 'about:blank';
        }, 180);
    };

    const openWarningAndClose = () => {
        if (closingTimeout) clearTimeout(closingTimeout);
        if (countdownInterval) clearInterval(countdownInterval);
        warningModal.classList.add('is-open');
        warningModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        let secondsLeft = 3;
        if (warningCountdown) warningCountdown.innerText = `Fechando em ${secondsLeft}...`;
        countdownInterval = setInterval(() => {
            secondsLeft -= 1;
            if (secondsLeft <= 0) {
                if (warningCountdown) warningCountdown.innerText = 'Fechando...';
                clearInterval(countdownInterval);
                countdownInterval = null;
                return;
            }
            if (warningCountdown) warningCountdown.innerText = `Fechando em ${secondsLeft}...`;
        }, 1000);
        closingTimeout = setTimeout(() => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            tryCloseSite();
        }, 3200);
    };

    shadowsATrigger.addEventListener('click', openWarningAndClose);
    shadowsATrigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openWarningAndClose();
        }
    });
}

if (copyrightTrigger && parchmentModal) {
    const parchmentSound = new Audio('https://actions.google.com/sounds/v1/foley/paper_rustle.ogg');
    const parchmentCloseButton = parchmentModal.querySelector('.parchment-close');
    const parchmentScroll = parchmentModal.querySelector('.parchment-scroll');
    const parchmentTyping = parchmentModal.querySelector('.parchment-typing');
    const parchmentSecret = parchmentModal.querySelector('#parchment-secret');
    const parchmentHoldFill = parchmentModal.querySelector('#parchment-hold-fill');
    const parchmentHoldHint = parchmentModal.querySelector('#parchment-hold-hint');
    const parchmentMessage = '100% oliginal';
    const PARCHMENT_TYPE_DELAY_MS = 170;
    const PARCHMENT_TYPE_START_DELAY_MS = 980;
    const PARCHMENT_HOLD_MS = 3000;
    let parchmentTypeInterval = null;
    let parchmentTypeStartTimeout = null;
    let parchmentHoldTimeout = null;
    let parchmentHoldFrame = null;
    let parchmentHoldActive = false;
    let parchmentHoldStartAt = 0;
    parchmentSound.preload = 'auto';
    parchmentSound.volume = 0.95;

    const stopTypingEffect = () => {
        if (parchmentTypeStartTimeout) {
            clearTimeout(parchmentTypeStartTimeout);
            parchmentTypeStartTimeout = null;
        }
        if (parchmentTypeInterval) {
            clearInterval(parchmentTypeInterval);
            parchmentTypeInterval = null;
        }
        if (parchmentTyping) {
            parchmentTyping.classList.remove('is-typing');
            parchmentTyping.classList.remove('is-complete');
        }
    };

    const startTypingEffect = () => {
        if (!parchmentTyping) return;
        stopTypingEffect();
        parchmentTyping.textContent = '';
        parchmentTyping.classList.add('is-typing');
        let cursor = 0;
        parchmentTypeStartTimeout = setTimeout(() => {
            parchmentTypeInterval = setInterval(() => {
                cursor += 1;
                parchmentTyping.textContent = parchmentMessage.slice(0, cursor);
                if (cursor >= parchmentMessage.length) {
                    clearInterval(parchmentTypeInterval);
                    parchmentTypeInterval = null;
                    parchmentTyping.classList.remove('is-typing');
                    parchmentTyping.classList.add('is-complete');
                }
            }, PARCHMENT_TYPE_DELAY_MS);
        }, PARCHMENT_TYPE_START_DELAY_MS);
    };

    const resetParchmentHoldState = ({ keepReveal = false } = {}) => {
        if (parchmentHoldTimeout) {
            clearTimeout(parchmentHoldTimeout);
            parchmentHoldTimeout = null;
        }
        if (parchmentHoldFrame) {
            cancelAnimationFrame(parchmentHoldFrame);
            parchmentHoldFrame = null;
        }
        parchmentHoldActive = false;
        if (parchmentScroll) parchmentScroll.classList.remove('is-holding');
        if (!keepReveal && parchmentScroll) parchmentScroll.classList.remove('is-secret-revealed');
        if (parchmentSecret) parchmentSecret.setAttribute('aria-hidden', keepReveal ? 'false' : 'true');
        if (parchmentHoldFill) parchmentHoldFill.style.transform = keepReveal ? 'scaleX(1)' : 'scaleX(0)';
    };

    const tickParchmentHold = () => {
        if (!parchmentHoldActive || !parchmentHoldFill) return;
        const progress = Math.min(1, (performance.now() - parchmentHoldStartAt) / PARCHMENT_HOLD_MS);
        parchmentHoldFill.style.transform = `scaleX(${progress})`;
        if (progress < 1) {
            parchmentHoldFrame = requestAnimationFrame(tickParchmentHold);
        }
    };

    const revealParchmentSecret = () => {
        parchmentHoldActive = false;
        if (parchmentScroll) {
            parchmentScroll.classList.remove('is-holding');
            parchmentScroll.classList.add('is-secret-revealed');
        }
        if (parchmentSecret) parchmentSecret.setAttribute('aria-hidden', 'false');
        if (parchmentHoldFill) parchmentHoldFill.style.transform = 'scaleX(1)';
        if (parchmentHoldHint) parchmentHoldHint.textContent = '';
        setShadowChaseMessage('');
        resetParchmentHoldState({ keepReveal: true });
    };

    const startParchmentHold = (event) => {
        if (!parchmentScroll || !parchmentModal.classList.contains('is-open')) return;
        if (event.target instanceof Element && event.target.closest('.parchment-close')) return;
        if (parchmentScroll.classList.contains('is-secret-revealed')) return;

        resetParchmentHoldState();
        parchmentHoldActive = true;
        parchmentHoldStartAt = performance.now();
        parchmentScroll.classList.add('is-holding');
        if (parchmentHoldHint) parchmentHoldHint.textContent = 'segure... a tinta esta cedendo';
        parchmentHoldTimeout = setTimeout(revealParchmentSecret, PARCHMENT_HOLD_MS);
        tickParchmentHold();
    };

    const stopParchmentHold = () => {
        if (!parchmentHoldActive) return;
        resetParchmentHoldState();
        if (parchmentHoldHint) parchmentHoldHint.textContent = 'segure o pergaminho por 3 segundos';
    };

    const openParchmentModal = () => {
        const triggerRect = copyrightTrigger.getBoundingClientRect();
        const startX = triggerRect.left + (triggerRect.width / 2);
        const startY = triggerRect.top + (triggerRect.height / 2);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const dx = centerX - startX;
        const dy = centerY - startY;

        parchmentModal.style.setProperty('--paper-start-x', `${startX}px`);
        parchmentModal.style.setProperty('--paper-start-y', `${startY}px`);
        parchmentModal.style.setProperty('--paper-dx', `${dx}px`);
        parchmentModal.style.setProperty('--paper-dy', `${dy}px`);
        parchmentModal.classList.remove('is-open');
        void parchmentModal.offsetWidth;
        parchmentModal.classList.add('is-open');
        parchmentModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        resetParchmentHoldState();
        if (parchmentHoldHint) parchmentHoldHint.textContent = 'segure o pergaminho por 3 segundos';
        parchmentSound.currentTime = 0;
        parchmentSound.play().catch(() => {});
        startTypingEffect();
    };

    const closeParchmentModal = () => {
        parchmentModal.classList.remove('is-open');
        parchmentModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        parchmentSound.pause();
        stopTypingEffect();
        resetParchmentHoldState();
        if (parchmentHoldHint) parchmentHoldHint.textContent = 'segure o pergaminho por 3 segundos';
        if (parchmentTyping) parchmentTyping.textContent = parchmentMessage;
    };

    copyrightTrigger.addEventListener('click', openParchmentModal);
    copyrightTrigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openParchmentModal();
        }
    });
    closeParchmentControls.forEach(el => el.addEventListener('click', closeParchmentModal));
    if (parchmentScroll) {
        parchmentScroll.addEventListener('pointerdown', startParchmentHold);
        parchmentScroll.addEventListener('pointerup', stopParchmentHold);
        parchmentScroll.addEventListener('pointerleave', stopParchmentHold);
        parchmentScroll.addEventListener('pointercancel', stopParchmentHold);
    }
    if (parchmentCloseButton) {
        parchmentCloseButton.addEventListener('click', closeParchmentModal);
    }
    document.addEventListener('pointerup', stopParchmentHold);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && parchmentModal.classList.contains('is-open')) {
            closeParchmentModal();
        }
    });
}

if (chessTrigger && chessModal) {
    const openChessModal = () => {
        chessModal.classList.add('is-open');
        chessModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (chessMode && chessMode.value === 'online' && window.__chessConnectOnline) {
            window.__chessConnectOnline(true);
        }
    };

    const closeChessModal = () => {
        chessModal.classList.remove('is-open');
        chessModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    chessTrigger.addEventListener('click', openChessModal);
    chessTrigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openChessModal();
        }
    });
    closeChessControls.forEach(el => el.addEventListener('click', closeChessModal));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chessModal.classList.contains('is-open')) {
            closeChessModal();
        }
    });

    if (chessBoard && chessStatus && chessReset) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const pieceGlyph = {
            wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
            bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚'
        };
        const squareColorClass = (square) => {
            const fileIndex = files.indexOf(square[0]);
            const rank = Number(square[1]);
            return (fileIndex + rank) % 2 === 0 ? 'dark' : 'light';
        };
        const loadScriptOnce = (src) => new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[data-chess-loader="${src}"]`);
            if (existing) {
                existing.addEventListener('load', resolve, { once: true });
                existing.addEventListener('error', reject, { once: true });
                return;
            }
            const scriptEl = document.createElement('script');
            scriptEl.src = src;
            scriptEl.async = true;
            scriptEl.dataset.chessLoader = src;
            scriptEl.onload = () => resolve();
            scriptEl.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
            document.head.appendChild(scriptEl);
        });
        const getChessCtor = async () => {
            if (typeof window.Chess === 'function') return window.Chess;
            if (window.Chess && typeof window.Chess.Chess === 'function') return window.Chess.Chess;
            if (window.chessjs && typeof window.chessjs.Chess === 'function') return window.chessjs.Chess;
            const fallbacks = [
                'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.13.4/chess.min.js',
                'https://cdn.jsdelivr.net/npm/chess.js@1.3.1/dist/chess.min.js'
            ];
            for (let i = 0; i < fallbacks.length; i++) {
                try {
                    await loadScriptOnce(fallbacks[i]);
                } catch {}
                if (typeof window.Chess === 'function') return window.Chess;
                if (window.Chess && typeof window.Chess.Chess === 'function') return window.Chess.Chess;
                if (window.chessjs && typeof window.chessjs.Chess === 'function') return window.chessjs.Chess;
            }
            return null;
        };

        const methodCall = (obj, names, fallback = false) => {
            for (let i = 0; i < names.length; i++) {
                const fn = obj[names[i]];
                if (typeof fn === 'function') return fn.call(obj);
            }
            return fallback;
        };

        const createOfflineChessEngine = () => {
            const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
            const fileToIndex = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
            const indexToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const knightSteps = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
            const kingSteps = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
            const history = [];
            let board = {};
            let turnColor = 'w';
            let castling = { w: { k: true, q: true }, b: { k: true, q: true } };
            let epSquare = '-';
            let halfmoveClock = 0;
            let fullmoveNumber = 1;
            const positionCounts = new Map();

            const sq = (f, r) => `${indexToFile[f]}${r}`;
            const parseSq = (square) => ({ f: fileToIndex[square[0]], r: Number(square[1]) });
            const inBounds = (f, r) => f >= 0 && f < 8 && r >= 1 && r <= 8;
            const clonePiece = (piece) => piece ? { type: piece.type, color: piece.color } : null;
            const opposite = (color) => color === 'w' ? 'b' : 'w';

            const boardKey = () => {
                let placement = '';
                for (let r = 8; r >= 1; r--) {
                    let empties = 0;
                    for (let f = 0; f < 8; f++) {
                        const p = board[sq(f, r)];
                        if (!p) {
                            empties += 1;
                            continue;
                        }
                        if (empties > 0) {
                            placement += String(empties);
                            empties = 0;
                        }
                        const letter = p.color === 'w' ? p.type.toUpperCase() : p.type;
                        placement += letter;
                    }
                    if (empties > 0) placement += String(empties);
                    if (r > 1) placement += '/';
                }
                const castlingText =
                    `${castling.w.k ? 'K' : ''}${castling.w.q ? 'Q' : ''}${castling.b.k ? 'k' : ''}${castling.b.q ? 'q' : ''}` || '-';
                return `${placement} ${turnColor} ${castlingText} ${epSquare}`;
            };

            const recordPosition = () => {
                const key = boardKey();
                positionCounts.set(key, (positionCounts.get(key) || 0) + 1);
            };

            const get = (square) => clonePiece(board[square]) || null;

            const kingSquare = (color) => {
                for (let r = 1; r <= 8; r++) {
                    for (let f = 0; f < 8; f++) {
                        const square = sq(f, r);
                        const p = board[square];
                        if (p && p.type === 'k' && p.color === color) return square;
                    }
                }
                return null;
            };

            const isSquareAttacked = (square, byColor) => {
                const { f, r } = parseSq(square);
                const pawnRank = byColor === 'w' ? r - 1 : r + 1;
                for (let df = -1; df <= 1; df += 2) {
                    const pf = f + df;
                    if (!inBounds(pf, pawnRank)) continue;
                    const pawn = board[sq(pf, pawnRank)];
                    if (pawn && pawn.color === byColor && pawn.type === 'p') return true;
                }
                for (let i = 0; i < knightSteps.length; i++) {
                    const nf = f + knightSteps[i][0];
                    const nr = r + knightSteps[i][1];
                    if (!inBounds(nf, nr)) continue;
                    const p = board[sq(nf, nr)];
                    if (p && p.color === byColor && p.type === 'n') return true;
                }
                const rayChecks = [
                    { dirs: [[1, 0], [-1, 0], [0, 1], [0, -1]], types: ['r', 'q'] },
                    { dirs: [[1, 1], [1, -1], [-1, 1], [-1, -1]], types: ['b', 'q'] }
                ];
                for (let i = 0; i < rayChecks.length; i++) {
                    const entry = rayChecks[i];
                    for (let d = 0; d < entry.dirs.length; d++) {
                        let rf = f + entry.dirs[d][0];
                        let rr = r + entry.dirs[d][1];
                        while (inBounds(rf, rr)) {
                            const p = board[sq(rf, rr)];
                            if (p) {
                                if (p.color === byColor && entry.types.includes(p.type)) return true;
                                break;
                            }
                            rf += entry.dirs[d][0];
                            rr += entry.dirs[d][1];
                        }
                    }
                }
                for (let i = 0; i < kingSteps.length; i++) {
                    const kf = f + kingSteps[i][0];
                    const kr = r + kingSteps[i][1];
                    if (!inBounds(kf, kr)) continue;
                    const p = board[sq(kf, kr)];
                    if (p && p.color === byColor && p.type === 'k') return true;
                }
                return false;
            };

            const snapshot = () => ({
                board: Object.fromEntries(Object.entries(board).map(([k, v]) => [k, clonePiece(v)])),
                turnColor,
                castling: { w: { ...castling.w }, b: { ...castling.b } },
                epSquare,
                halfmoveClock,
                fullmoveNumber
            });

            const restore = (state) => {
                board = state.board;
                turnColor = state.turnColor;
                castling = state.castling;
                epSquare = state.epSquare;
                halfmoveClock = state.halfmoveClock;
                fullmoveNumber = state.fullmoveNumber;
            };

            const applyMove = (move, keepHistory = true) => {
                if (keepHistory) history.push(snapshot());
                const piece = board[move.from];
                const target = board[move.to];
                delete board[move.from];

                if (move.flags.includes('e')) {
                    const { f, r } = parseSq(move.to);
                    const capRank = piece.color === 'w' ? r - 1 : r + 1;
                    delete board[sq(f, capRank)];
                }

                if (move.flags.includes('k')) {
                    if (piece.color === 'w') {
                        board.f1 = board.h1;
                        delete board.h1;
                    } else {
                        board.f8 = board.h8;
                        delete board.h8;
                    }
                }

                if (move.flags.includes('q')) {
                    if (piece.color === 'w') {
                        board.d1 = board.a1;
                        delete board.a1;
                    } else {
                        board.d8 = board.a8;
                        delete board.a8;
                    }
                }

                board[move.to] = { type: move.promotion || piece.type, color: piece.color };

                if (piece.type === 'k') {
                    castling[piece.color].k = false;
                    castling[piece.color].q = false;
                }
                if (piece.type === 'r') {
                    if (move.from === 'a1') castling.w.q = false;
                    if (move.from === 'h1') castling.w.k = false;
                    if (move.from === 'a8') castling.b.q = false;
                    if (move.from === 'h8') castling.b.k = false;
                }
                if (target && target.type === 'r') {
                    if (move.to === 'a1') castling.w.q = false;
                    if (move.to === 'h1') castling.w.k = false;
                    if (move.to === 'a8') castling.b.q = false;
                    if (move.to === 'h8') castling.b.k = false;
                }

                epSquare = '-';
                if (piece.type === 'p') {
                    const fromRank = Number(move.from[1]);
                    const toRank = Number(move.to[1]);
                    if (Math.abs(toRank - fromRank) === 2) {
                        epSquare = `${move.from[0]}${(fromRank + toRank) / 2}`;
                    }
                }

                if (piece.type === 'p' || target || move.flags.includes('e')) halfmoveClock = 0;
                else halfmoveClock += 1;
                if (piece.color === 'b') fullmoveNumber += 1;
                turnColor = opposite(turnColor);
                if (keepHistory) recordPosition();
            };

            const undo = () => {
                const prev = history.pop();
                if (prev) restore(prev);
            };

            const generatePseudo = (color, fromFilter = null) => {
                const result = [];
                for (let r = 1; r <= 8; r++) {
                    for (let f = 0; f < 8; f++) {
                        const from = sq(f, r);
                        if (fromFilter && from !== fromFilter) continue;
                        const piece = board[from];
                        if (!piece || piece.color !== color) continue;

                        if (piece.type === 'p') {
                            const dir = color === 'w' ? 1 : -1;
                            const startRank = color === 'w' ? 2 : 7;
                            const promoRank = color === 'w' ? 8 : 1;
                            const oneR = r + dir;
                            if (inBounds(f, oneR) && !board[sq(f, oneR)]) {
                                const to = sq(f, oneR);
                                if (oneR === promoRank) ['q', 'r', 'b', 'n'].forEach((pr) => result.push({ from, to, piece: 'p', color, flags: 'p', promotion: pr }));
                                else result.push({ from, to, piece: 'p', color, flags: 'n' });
                                const twoR = r + (2 * dir);
                                if (r === startRank && !board[sq(f, twoR)]) result.push({ from, to: sq(f, twoR), piece: 'p', color, flags: 'b' });
                            }
                            for (let df = -1; df <= 1; df += 2) {
                                const cf = f + df;
                                const cr = r + dir;
                                if (!inBounds(cf, cr)) continue;
                                const to = sq(cf, cr);
                                const target = board[to];
                                if (target && target.color !== color) {
                                    if (cr === promoRank) ['q', 'r', 'b', 'n'].forEach((pr) => result.push({ from, to, piece: 'p', color, flags: 'cp', captured: target.type, promotion: pr }));
                                    else result.push({ from, to, piece: 'p', color, flags: 'c', captured: target.type });
                                }
                                if (epSquare === to) result.push({ from, to, piece: 'p', color, flags: 'e', captured: 'p' });
                            }
                            continue;
                        }

                        if (piece.type === 'n') {
                            for (let i = 0; i < knightSteps.length; i++) {
                                const nf = f + knightSteps[i][0];
                                const nr = r + knightSteps[i][1];
                                if (!inBounds(nf, nr)) continue;
                                const to = sq(nf, nr);
                                const target = board[to];
                                if (!target) result.push({ from, to, piece: 'n', color, flags: 'n' });
                                else if (target.color !== color) result.push({ from, to, piece: 'n', color, flags: 'c', captured: target.type });
                            }
                            continue;
                        }

                        const sliders = piece.type === 'b'
                            ? [[1, 1], [1, -1], [-1, 1], [-1, -1]]
                            : piece.type === 'r'
                                ? [[1, 0], [-1, 0], [0, 1], [0, -1]]
                                : piece.type === 'q'
                                    ? [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]
                                    : null;

                        if (sliders) {
                            for (let i = 0; i < sliders.length; i++) {
                                let rf = f + sliders[i][0];
                                let rr = r + sliders[i][1];
                                while (inBounds(rf, rr)) {
                                    const to = sq(rf, rr);
                                    const target = board[to];
                                    if (!target) result.push({ from, to, piece: piece.type, color, flags: 'n' });
                                    else {
                                        if (target.color !== color) result.push({ from, to, piece: piece.type, color, flags: 'c', captured: target.type });
                                        break;
                                    }
                                    rf += sliders[i][0];
                                    rr += sliders[i][1];
                                }
                            }
                            continue;
                        }

                        if (piece.type === 'k') {
                            for (let i = 0; i < kingSteps.length; i++) {
                                const kf = f + kingSteps[i][0];
                                const kr = r + kingSteps[i][1];
                                if (!inBounds(kf, kr)) continue;
                                const to = sq(kf, kr);
                                const target = board[to];
                                if (!target) result.push({ from, to, piece: 'k', color, flags: 'n' });
                                else if (target.color !== color) result.push({ from, to, piece: 'k', color, flags: 'c', captured: target.type });
                            }
                            if (!isSquareAttacked(from, opposite(color))) {
                                if (castling[color].k) {
                                    const rank = color === 'w' ? 1 : 8;
                                    const f1 = sq(5, rank);
                                    const g1 = sq(6, rank);
                                    if (!board[f1] && !board[g1] && !isSquareAttacked(f1, opposite(color)) && !isSquareAttacked(g1, opposite(color))) {
                                        result.push({ from, to: g1, piece: 'k', color, flags: 'k' });
                                    }
                                }
                                if (castling[color].q) {
                                    const rank = color === 'w' ? 1 : 8;
                                    const d1 = sq(3, rank);
                                    const c1 = sq(2, rank);
                                    const b1 = sq(1, rank);
                                    if (!board[d1] && !board[c1] && !board[b1] && !isSquareAttacked(d1, opposite(color)) && !isSquareAttacked(c1, opposite(color))) {
                                        result.push({ from, to: c1, piece: 'k', color, flags: 'q' });
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            };

            const generateLegal = (color, fromFilter = null) => {
                const pseudo = generatePseudo(color, fromFilter);
                const legal = [];
                for (let i = 0; i < pseudo.length; i++) {
                    const state = snapshot();
                    applyMove(pseudo[i], false);
                    const kingSq = kingSquare(color);
                    const illegal = !kingSq || isSquareAttacked(kingSq, opposite(color));
                    restore(state);
                    if (!illegal) legal.push(pseudo[i]);
                }
                return legal;
            };

            const load = (fen) => {
                const parts = String(fen || '').trim().split(/\s+/);
                if (parts.length < 4) return false;
                const [placement, side, castlingPart, epPart, half = '0', full = '1'] = parts;
                const rows = placement.split('/');
                if (rows.length !== 8) return false;
                const nextBoard = {};
                for (let i = 0; i < rows.length; i++) {
                    let f = 0;
                    const r = 8 - i;
                    for (let j = 0; j < rows[i].length; j++) {
                        const ch = rows[i][j];
                        if (/\d/.test(ch)) {
                            f += Number(ch);
                            continue;
                        }
                        const color = ch === ch.toUpperCase() ? 'w' : 'b';
                        const type = ch.toLowerCase();
                        if (!['p', 'n', 'b', 'r', 'q', 'k'].includes(type) || f > 7) return false;
                        nextBoard[sq(f, r)] = { type, color };
                        f += 1;
                    }
                    if (f !== 8) return false;
                }
                board = nextBoard;
                turnColor = side === 'b' ? 'b' : 'w';
                castling = {
                    w: { k: castlingPart.includes('K'), q: castlingPart.includes('Q') },
                    b: { k: castlingPart.includes('k'), q: castlingPart.includes('q') }
                };
                epSquare = epPart === '-' ? '-' : epPart;
                halfmoveClock = Number(half) || 0;
                fullmoveNumber = Number(full) || 1;
                history.length = 0;
                positionCounts.clear();
                recordPosition();
                return true;
            };

            const fen = () => `${boardKey()} ${halfmoveClock} ${fullmoveNumber}`;

            const moves = ({ square, verbose } = {}) => {
                const legal = generateLegal(turnColor, square || null);
                if (verbose) return legal.map((m) => ({ ...m }));
                return legal.map((m) => m.to);
            };

            const move = ({ from, to, promotion = 'q' }) => {
                const legal = generateLegal(turnColor, from);
                const desiredPromotion = String(promotion || 'q').toLowerCase();
                const match = legal.find((m) => m.to === to && (!m.promotion || m.promotion === desiredPromotion));
                if (!match) return null;
                const chosen = { ...match };
                if (chosen.promotion) chosen.promotion = desiredPromotion;
                applyMove(chosen, true);
                return chosen;
            };

            const inCheck = () => {
                const ksq = kingSquare(turnColor);
                if (!ksq) return false;
                return isSquareAttacked(ksq, opposite(turnColor));
            };

            const inCheckmate = () => inCheck() && generateLegal(turnColor).length === 0;
            const inStalemate = () => !inCheck() && generateLegal(turnColor).length === 0;
            const inThreefold = () => (positionCounts.get(boardKey()) || 0) >= 3;
            const insufficientMaterial = () => {
                const pieces = Object.values(board);
                const nonKings = pieces.filter((p) => p.type !== 'k');
                if (nonKings.length === 0) return true;
                if (nonKings.length === 1 && ['b', 'n'].includes(nonKings[0].type)) return true;
                if (nonKings.every((p) => p.type === 'b')) {
                    const bishopSquares = Object.entries(board)
                        .filter(([, p]) => p.type === 'b')
                        .map(([square]) => {
                            const { f, r } = parseSq(square);
                            return (f + r) % 2;
                        });
                    return bishopSquares.every((v) => v === bishopSquares[0]);
                }
                return false;
            };
            const inDraw = () => inStalemate() || inThreefold() || insufficientMaterial() || halfmoveClock >= 100;
            const gameOver = () => inCheckmate() || inDraw();

            const reset = () => load(START_FEN);
            reset();

            return {
                get,
                moves,
                move,
                turn: () => turnColor,
                load,
                fen,
                reset,
                in_check: inCheck,
                in_checkmate: inCheckmate,
                in_stalemate: inStalemate,
                in_threefold_repetition: inThreefold,
                insufficient_material: insufficientMaterial,
                in_draw: inDraw,
                game_over: gameOver,
                isCheck: inCheck,
                isCheckmate: inCheckmate,
                isStalemate: inStalemate,
                isThreefoldRepetition: inThreefold,
                isInsufficientMaterial: insufficientMaterial,
                isDraw: inDraw,
                isGameOver: gameOver
            };
        };

        const initChess = async () => {
            const ChessCtor = await getChessCtor();
            const game = ChessCtor ? new ChessCtor() : createOfflineChessEngine();
            let selectedSquare = null;
            let legalTargets = [];
            let mode = chessMode ? chessMode.value : 'local';
            let onlineSocket = null;
            let onlineConnected = false;
            let onlineRoom = '';
            let playerColor = null;
            let isConnecting = false;
            const onlineOnlyControls = Array.from(chessModal.querySelectorAll('.chess-online-only'));
            const localHumanColor = 'w';
            const localAiColor = 'b';
            let aiThinking = false;
            let aiMoveTimer = null;

            const pieceBaseValue = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
            const pst = {
                p: [0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
                n: [-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
                b: [-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
                r: [0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
                q: [-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
                k: [-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20]
            };

            const isCheck = () => methodCall(game, ['in_check', 'isCheck'], false);
            const isCheckmate = () => methodCall(game, ['in_checkmate', 'isCheckmate'], false);
            const isDraw = () => methodCall(game, ['in_draw', 'isDraw'], false);
            const isStalemate = () => methodCall(game, ['in_stalemate', 'isStalemate'], false);
            const isThreefold = () => methodCall(game, ['in_threefold_repetition', 'isThreefoldRepetition'], false);
            const isInsufficient = () => methodCall(game, ['insufficient_material', 'isInsufficientMaterial'], false);
            const isGameOver = () => methodCall(game, ['game_over', 'isGameOver'], false);
            const turn = () => game.turn();

            const setMeta = (text) => {
                if (chessMeta) chessMeta.innerText = text;
            };

            const updateConnectButton = () => {
                if (!chessConnect) return;
                chessConnect.innerText = onlineConnected ? 'Desconectar' : (isConnecting ? 'Conectando...' : 'Conectar');
                chessConnect.classList.toggle('is-disconnect', onlineConnected);
                chessConnect.disabled = isConnecting;
            };

            const syncModeUi = () => {
                const isOnlineMode = mode === 'online';
                onlineOnlyControls.forEach((el) => {
                    el.classList.toggle('is-hidden', !isOnlineMode);
                });
            };

            const setOnlineInputsEnabled = (enabled) => {
                if (chessServerUrl) chessServerUrl.disabled = !enabled;
                if (chessRoomId) chessRoomId.disabled = !enabled;
            };

            const sendOnlineMessage = (payload) => {
                if (!onlineSocket || onlineSocket.readyState !== WebSocket.OPEN) return;
                onlineSocket.send(JSON.stringify(payload));
            };

            const disconnectOnline = () => {
                if (onlineSocket) {
                    onlineSocket.close();
                    onlineSocket = null;
                }
                onlineConnected = false;
                isConnecting = false;
                playerColor = null;
                onlineRoom = '';
                setOnlineInputsEnabled(true);
                updateConnectButton();
            };

            const findKingSquare = (color) => {
                for (let rank = 1; rank <= 8; rank++) {
                    for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
                        const square = `${files[fileIdx]}${rank}`;
                        const piece = game.get(square);
                        if (piece && piece.type === 'k' && piece.color === color) return square;
                    }
                }
                return null;
            };

            const canPlayNow = () => {
                if (mode !== 'online') return !aiThinking && turn() === localHumanColor;
                if (!onlineConnected || !playerColor) return false;
                return turn() === playerColor;
            };

            const evaluatePosition = () => {
                let score = 0;
                for (let rank = 1; rank <= 8; rank++) {
                    for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
                        const square = `${files[fileIdx]}${rank}`;
                        const piece = game.get(square);
                        if (!piece) continue;
                        const table = pst[piece.type] || new Array(64).fill(0);
                        const idx = (8 - rank) * 8 + fileIdx;
                        const mirrorIdx = (rank - 1) * 8 + fileIdx;
                        const positional = piece.color === 'w' ? table[idx] : table[mirrorIdx];
                        const value = (pieceBaseValue[piece.type] || 0) + positional;
                        score += piece.color === localAiColor ? value : -value;
                    }
                }
                return score;
            };

            const applySearchMove = (candidate) => {
                return game.move({
                    from: candidate.from,
                    to: candidate.to,
                    promotion: candidate.promotion || 'q'
                });
            };

            const searchBest = (depth, alpha, beta) => {
                if (isCheckmate()) return turn() === localAiColor ? -100000 - depth : 100000 + depth;
                if (isDraw()) return 0;
                if (depth === 0) return evaluatePosition();

                const moves = game.moves({ verbose: true });
                if (!moves.length) return evaluatePosition();

                const maximizing = turn() === localAiColor;
                let best = maximizing ? -Infinity : Infinity;
                const canUndo = typeof game.undo === 'function';

                for (let i = 0; i < moves.length; i++) {
                    const prevFen = canUndo ? null : game.fen();
                    const played = applySearchMove(moves[i]);
                    if (!played) continue;
                    const score = searchBest(depth - 1, alpha, beta);
                    if (canUndo) game.undo();
                    else game.load(prevFen);

                    if (maximizing) {
                        if (score > best) best = score;
                        if (best > alpha) alpha = best;
                    } else {
                        if (score < best) best = score;
                        if (best < beta) beta = best;
                    }
                    if (beta <= alpha) break;
                }
                return best;
            };

            const chooseAiMove = () => {
                const moves = game.moves({ verbose: true });
                if (!moves.length) return null;
                let bestMove = moves[0];
                let bestScore = -Infinity;
                const canUndo = typeof game.undo === 'function';
                const depth = moves.length <= 16 ? 4 : 3;

                for (let i = 0; i < moves.length; i++) {
                    const prevFen = canUndo ? null : game.fen();
                    const played = applySearchMove(moves[i]);
                    if (!played) continue;
                    const score = searchBest(depth - 1, -Infinity, Infinity);
                    if (canUndo) game.undo();
                    else game.load(prevFen);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = moves[i];
                    }
                }
                return bestMove;
            };

            const runLocalAiIfNeeded = () => {
                if (mode !== 'local') return;
                if (aiThinking || isGameOver()) return;
                if (turn() !== localAiColor) return;
                aiThinking = true;
                renderBoard();
                if (aiMoveTimer) clearTimeout(aiMoveTimer);
                aiMoveTimer = setTimeout(() => {
                    const move = chooseAiMove();
                    if (move) {
                        game.move({
                            from: move.from,
                            to: move.to,
                            promotion: move.promotion || 'q'
                        });
                    }
                    aiThinking = false;
                    aiMoveTimer = null;
                    clearSelection();
                    renderBoard();
                }, 150);
            };

            const updateStatus = () => {
                if (isCheckmate()) {
                    chessStatus.innerText = `Xeque-mate. ${turn() === 'w' ? 'Pretas' : 'Brancas'} venceram.`;
                    return;
                }
                if (isDraw()) {
                    if (isStalemate()) chessStatus.innerText = 'Empate por afogamento.';
                    else if (isThreefold()) chessStatus.innerText = 'Empate por repeticao.';
                    else if (isInsufficient()) chessStatus.innerText = 'Empate por material insuficiente.';
                    else chessStatus.innerText = 'Empate.';
                    return;
                }
                const turnName = turn() === 'w' ? 'Brancas' : 'Pretas';
                const checkText = isCheck() ? ' em xeque' : '';
                if (mode === 'online') {
                    if (!onlineConnected) {
                        chessStatus.innerText = `Aguardando conexao online...`;
                        return;
                    }
                    const owner = turn() === playerColor ? 'sua vez' : 'vez do oponente';
                    chessStatus.innerText = `Vez das ${turnName.toLowerCase()}${checkText} (${owner}).`;
                    return;
                }
                if (aiThinking) {
                    chessStatus.innerText = 'IA pensando...';
                    return;
                }
                const owner = turn() === localHumanColor ? 'sua vez' : 'vez da IA';
                chessStatus.innerText = `Vez das ${turnName.toLowerCase()}${checkText} (${owner}).`;
            };

            const clearSelection = () => {
                selectedSquare = null;
                legalTargets = [];
            };

            const renderBoard = () => {
                chessBoard.innerHTML = '';
                for (let rank = 8; rank >= 1; rank--) {
                    for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
                        const square = `${files[fileIdx]}${rank}`;
                        const piece = game.get(square);
                        const squareEl = document.createElement('button');
                        squareEl.type = 'button';
                        squareEl.className = `chess-square ${squareColorClass(square)}`;
                        squareEl.dataset.square = square;
                        if (selectedSquare === square) squareEl.classList.add('is-selected');
                        if (legalTargets.includes(square)) squareEl.classList.add('is-target');
                        if (isCheck() && square === findKingSquare(turn())) squareEl.classList.add('is-check');
                        squareEl.textContent = piece ? pieceGlyph[`${piece.color}${piece.type}`] : '';
                        chessBoard.appendChild(squareEl);
                    }
                }
                if (mode === 'online') {
                    if (!onlineConnected) setMeta('Modo online: aguardando 2 jogadores');
                    else {
                        const colorText = playerColor === 'w' ? 'Brancas' : 'Pretas';
                        setMeta(`Modo online: sala ${onlineRoom} (${colorText})`);
                    }
                } else {
                    setMeta('Modo local: voce (brancas) vs IA (pretas)');
                }
                updateStatus();
            };

            const pickPromotion = (from, to) => {
                const piece = game.get(from);
                if (!piece || piece.type !== 'p') return 'q';
                const rank = Number(to[1]);
                if ((piece.color === 'w' && rank !== 8) || (piece.color === 'b' && rank !== 1)) return 'q';
                const answer = prompt('Promocao: q (rainha), r (torre), b (bispo), n (cavalo)', 'q');
                const normalized = String(answer || 'q').toLowerCase().trim();
                return ['q', 'r', 'b', 'n'].includes(normalized) ? normalized : 'q';
            };

            const tryMove = (from, to, source = 'local', incomingPromotion = 'q') => {
                const promotion = source === 'local' ? pickPromotion(from, to) : incomingPromotion;
                const move = game.move({ from, to, promotion });
                if (!move) {
                    selectSquare(to);
                    return false;
                }
                if (source === 'local' && !solvedShadowTrials.has('chess3')) {
                    chessTrialMoveProgress = Math.min(chessTrialMoveProgress + 1, 3);
                    saveShadowState();
                    if (chessTrialMoveProgress >= 3) {
                        unlockShadowTrial('chess3', {
                            toast: `O tabuleiro cedeu o fragmento ${shadowTrialMap.get('chess3').fragment}.`,
                            feedback: 'o xadrez observou suas tres jogadas'
                        });
                    } else {
                        showShadowToast(`Tabuleiro das sombras ${chessTrialMoveProgress}/3.`);
                    }
                }
                clearSelection();
                if (mode === 'online' && source !== 'remote') {
                    sendOnlineMessage({
                        type: 'move',
                        from: move.from,
                        to: move.to,
                        promotion: move.promotion || promotion || 'q',
                        caption: game.fen()
                    });
                }
                renderBoard();
                runLocalAiIfNeeded();
                return true;
            };

            const selectSquare = (square) => {
                if (!canPlayNow() || isGameOver()) return;
                const piece = game.get(square);
                if (!piece || piece.color !== turn() || (mode === 'online' && piece.color !== playerColor)) {
                    clearSelection();
                    renderBoard();
                    return;
                }
                selectedSquare = square;
                legalTargets = game.moves({ square, verbose: true }).map((m) => m.to);
                renderBoard();
            };

            chessBoard.addEventListener('click', (event) => {
                if (!canPlayNow() || isGameOver()) return;
                const squareEl = event.target.closest('.chess-square');
                if (!squareEl) return;
                const clicked = squareEl.dataset.square;
                if (!clicked) return;
                if (!selectedSquare) return selectSquare(clicked);
                if (clicked === selectedSquare) {
                    clearSelection();
                    return renderBoard();
                }
                if (legalTargets.includes(clicked)) return tryMove(selectedSquare, clicked);
                selectSquare(clicked);
            });

            const handleOnlineMessage = (rawMessage) => {
                let payload;
                try {
                    payload = JSON.parse(rawMessage);
                } catch {
                    return;
                }
                if (!payload || typeof payload !== 'object') return;

                if (payload.type === 'waiting') {
                    setMeta('Online: aguardando segundo jogador...');
                    return;
                }

                if (payload.type === 'joined') {
                    onlineConnected = true;
                    isConnecting = false;
                    playerColor = payload.color === 'w' || payload.color === 'b' ? payload.color : null;
                    onlineRoom = payload.room || 'auto';
                    if (typeof payload.fen === 'string' && payload.fen) game.load(payload.fen);
                    clearSelection();
                    updateConnectButton();
                    renderBoard();
                    return;
                }

                if (payload.type === 'state' && typeof payload.fen === 'string' && payload.fen) {
                    game.load(payload.fen);
                    clearSelection();
                    renderBoard();
                    return;
                }

                if (payload.type === 'move') {
                    if (typeof payload.fen === 'string' && payload.fen) {
                        game.load(payload.fen);
                        clearSelection();
                        renderBoard();
                        return;
                    }
                    if (payload.from && payload.to) {
                        tryMove(payload.from, payload.to, 'remote', payload.promotion || 'q');
                    }
                    return;
                }

                if (payload.type === 'reset') {
                    if (payload.fen && typeof payload.fen === 'string') game.load(payload.fen);
                    else game.reset();
                    clearSelection();
                    renderBoard();
                }
            };

            const connectOnline = (preferAutoMatch = false) => {
                if (!chessServerUrl) return;
                if (onlineConnected || isConnecting) return;

                const url = chessServerUrl.value.trim();
                if (!url) {
                    setMeta('Informe o servidor WS');
                    return;
                }

                isConnecting = true;
                updateConnectButton();
                setMeta('Conectando...');
                setOnlineInputsEnabled(false);

                try {
                    onlineSocket = new WebSocket(url);
                } catch {
                    isConnecting = false;
                    updateConnectButton();
                    setMeta('URL do servidor invalida');
                    setOnlineInputsEnabled(true);
                    return;
                }

                onlineSocket.addEventListener('open', () => {
                    const room = chessRoomId ? chessRoomId.value.trim() : '';
                    const useAuto = preferAutoMatch || !room;
                    if (useAuto) sendOnlineMessage({ type: 'join-auto' });
                    else sendOnlineMessage({ type: 'join', room });
                    sendOnlineMessage({ type: 'state-request' });
                });

                onlineSocket.addEventListener('message', (event) => handleOnlineMessage(event.data));

                onlineSocket.addEventListener('close', () => {
                    onlineConnected = false;
                    isConnecting = false;
                    playerColor = null;
                    onlineRoom = '';
                    setOnlineInputsEnabled(true);
                    updateConnectButton();
                    renderBoard();
                });

                onlineSocket.addEventListener('error', () => {
                    isConnecting = false;
                    updateConnectButton();
                    setMeta('Falha na conexao online');
                });
            };

            window.__chessConnectOnline = connectOnline;

            if (chessMode) {
                chessMode.addEventListener('change', () => {
                    mode = chessMode.value === 'online' ? 'online' : 'local';
                    clearSelection();
                    if (mode === 'local') {
                        disconnectOnline();
                        runLocalAiIfNeeded();
                    } else {
                        if (aiMoveTimer) {
                            clearTimeout(aiMoveTimer);
                            aiMoveTimer = null;
                        }
                        aiThinking = false;
                        connectOnline(true);
                    }
                    syncModeUi();
                    renderBoard();
                });
            }

            if (chessConnect) {
                chessConnect.addEventListener('click', () => {
                    mode = 'online';
                    if (chessMode) chessMode.value = 'online';
                    if (onlineConnected || isConnecting) {
                        disconnectOnline();
                        renderBoard();
                    } else {
                        connectOnline(true);
                    }
                });
            }

            chessReset.addEventListener('click', () => {
                game.reset();
                clearSelection();
                if (aiMoveTimer) {
                    clearTimeout(aiMoveTimer);
                    aiMoveTimer = null;
                }
                aiThinking = false;
                if (mode === 'online' && onlineConnected) {
                    sendOnlineMessage({ type: 'reset', fen: game.fen() });
                }
                renderBoard();
                runLocalAiIfNeeded();
            });

            updateConnectButton();
            syncModeUi();
            renderBoard();
            runLocalAiIfNeeded();
        };

        initChess();
    }
}

if (badgeRunawayButton && badgeButtonZone) {
    const containerEl = document.querySelector('.container');
    const BUTTON_PADDING = 8;
    const START_BOTTOM_OFFSET = 10;
    const ESCAPE_DISTANCE = 130;
    const DETECTION_RADIUS = 180;
    const INITIAL_FREEZE_MS = 250;
    const ESCAPE_SOUND_URL = 'https://www.myinstants.com/media/sounds/drip-goku-meme-song-original-dragon-ball-super-music-clash-of-gods-in-description.mp3';
    const ESCAPE_SOUND_START = 0.32;
    const ESCAPE_SOUND_DURATION_MS = 420;
    const ESCAPE_SOUND_COOLDOWN_MS = 220;
    const ESCAPE_SOUND_STEP_SECONDS = ESCAPE_SOUND_DURATION_MS / 1000;
    let x = 0;
    let y = 0;
    let canRunAway = false;
    let escapeSoundCursor = ESCAPE_SOUND_START;
    const escapeAudio = new Audio(ESCAPE_SOUND_URL);
    let escapeAudioTimeout = null;
    let lastEscapeSoundMs = 0;
    let escapeAudioUnlocked = false;
    escapeAudio.preload = 'auto';
    escapeAudio.volume = 1;

    const removeEscapeUnlockListeners = () => {
        document.removeEventListener('pointerdown', unlockEscapeAudio);
        document.removeEventListener('touchstart', unlockEscapeAudio);
        document.removeEventListener('keydown', unlockEscapeAudio);
    };

    const unlockEscapeAudio = () => {
        if (escapeAudioUnlocked) return;
        escapeAudio.muted = true;
        escapeAudio.currentTime = ESCAPE_SOUND_START;
        escapeAudio.play()
            .then(() => {
                escapeAudio.pause();
                escapeAudio.muted = false;
                escapeAudioUnlocked = true;
                removeEscapeUnlockListeners();
            })
            .catch(() => {
                escapeAudio.muted = false;
            });
    };

    const playEscapeSlice = () => {
        const now = performance.now();
        if (now - lastEscapeSoundMs < ESCAPE_SOUND_COOLDOWN_MS) return;
        lastEscapeSoundMs = now;
        if (escapeAudioTimeout) clearTimeout(escapeAudioTimeout);
        if (!Number.isFinite(escapeAudio.duration) || escapeAudio.duration <= 0) {
            escapeSoundCursor = ESCAPE_SOUND_START;
        } else if (escapeSoundCursor >= escapeAudio.duration) {
            escapeSoundCursor = ESCAPE_SOUND_START;
        }
        escapeAudio.pause();
        escapeAudio.currentTime = escapeSoundCursor;
        escapeAudio.play().catch(() => {});
        escapeAudioTimeout = setTimeout(() => {
            escapeAudio.pause();
            if (Number.isFinite(escapeAudio.duration) && escapeAudio.duration > 0) {
                escapeSoundCursor = Math.min(escapeAudio.currentTime, escapeAudio.duration);
            } else {
                escapeSoundCursor += ESCAPE_SOUND_STEP_SECONDS;
            }
        }, ESCAPE_SOUND_DURATION_MS);
    };

    const applyPosition = () => {
        badgeRunawayButton.style.left = `${x}px`;
        badgeRunawayButton.style.top = `${y}px`;
    };

    const keepInsideZone = () => {
        const maxX = badgeButtonZone.clientWidth - badgeRunawayButton.offsetWidth - BUTTON_PADDING;
        const maxY = badgeButtonZone.clientHeight - badgeRunawayButton.offsetHeight - BUTTON_PADDING;
        x = Math.max(BUTTON_PADDING, Math.min(x, Math.max(BUTTON_PADDING, maxX)));
        y = Math.max(BUTTON_PADDING, Math.min(y, Math.max(BUTTON_PADDING, maxY)));
    };

    const placeAtStart = () => {
        x = (badgeButtonZone.clientWidth - badgeRunawayButton.offsetWidth) / 2;
        y = badgeButtonZone.clientHeight - badgeRunawayButton.offsetHeight - START_BOTTOM_OFFSET;
        keepInsideZone();
        applyPosition();
    };

    const moveRunawayButton = (pointerX, pointerY) => {
        if (!canRunAway) return;
        const rect = badgeRunawayButton.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        const deltaX = centerX - pointerX;
        const deltaY = centerY - pointerY;
        const magnitude = Math.hypot(deltaX, deltaY) || 1;
        x += (deltaX / magnitude) * ESCAPE_DISTANCE;
        y += (deltaY / magnitude) * ESCAPE_DISTANCE;
        keepInsideZone();
        applyPosition();
        playEscapeSlice();
    };

    const detectPointer = (event) => {
        const pointerX = event.touches ? event.touches[0].clientX : event.clientX;
        const pointerY = event.touches ? event.touches[0].clientY : event.clientY;
        if (typeof pointerX !== 'number' || typeof pointerY !== 'number') return;
        const rect = badgeRunawayButton.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        if (Math.hypot(pointerX - centerX, pointerY - centerY) < DETECTION_RADIUS) {
            moveRunawayButton(pointerX, pointerY);
        }
    };

    const pointerZoneEl = containerEl || badgeButtonZone;
    pointerZoneEl.addEventListener('mousemove', detectPointer);
    pointerZoneEl.addEventListener('touchmove', detectPointer, { passive: true });
    document.addEventListener('pointerdown', unlockEscapeAudio);
    document.addEventListener('touchstart', unlockEscapeAudio, { passive: true });
    document.addEventListener('keydown', unlockEscapeAudio);
    window.__unlockEscapeAudio = unlockEscapeAudio;
    badgeRunawayButton.addEventListener('mouseenter', (e) => moveRunawayButton(e.clientX, e.clientY));
    badgeRunawayButton.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        moveRunawayButton(e.clientX, e.clientY);
    });

    const syncBadgeZoneToContainer = () => {
        if (!containerEl) return;
        badgeButtonZone.style.left = '0px';
        badgeButtonZone.style.top = '0px';
        badgeButtonZone.style.width = containerEl.clientWidth + 'px';
        badgeButtonZone.style.height = containerEl.clientHeight + 'px';
    };

    const syncLayoutAndPlaceButton = () => {
        syncBadgeZoneToContainer();
        placeAtStart();
    };

    window.addEventListener('load', syncLayoutAndPlaceButton);
    window.addEventListener('resize', syncLayoutAndPlaceButton);
    setTimeout(syncLayoutAndPlaceButton, 100);

    if (typeof ResizeObserver !== 'undefined' && containerEl) {
        const containerObserver = new ResizeObserver(syncLayoutAndPlaceButton);
        containerObserver.observe(containerEl);
    }
    setTimeout(() => { canRunAway = true; }, INITIAL_FREEZE_MS);

    badgeRunawayButton.addEventListener('click', () => {
        unlockShadowTrial('badge', {
            toast: `O emblema deixou cair o fragmento ${shadowTrialMap.get('badge').fragment}.`,
            feedback: 'o emblema finalmente cedeu'
        });
        openVideo('https://www.youtube.com/embed/u-fOF9Wlpd8?autoplay=1', 'Parabéns, você resgatou um emblema!', 'Parabéns');
    });
}

const dvdGif = document.getElementById('dvd-gif');
if (dvdGif) {
    let dx = Math.max(0, window.innerWidth * 0.1);
    let dy = Math.max(0, window.innerHeight * 0.1);
    let vx = 1.9;
    let vy = 1.45;
    let dvdClickCount = 0;
    const DVD_TARGET_CLICKS = 5;

    if (solvedShadowTrials.has('dvd')) {
        dvdGif.classList.add('is-unlocked');
    }

    const isPointerInsideDvd = (clientX, clientY) => {
        const rect = dvdGif.getBoundingClientRect();
        return (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
        );
    };

    const handleDvdInteraction = () => {
        if (solvedShadowTrials.has('dvd')) {
            showShadowToast('O eco VHS ja foi quebrado.');
            return;
        }

        dvdClickCount += 1;
        dvdGif.classList.add('is-awake');
        setTimeout(() => dvdGif.classList.remove('is-awake'), 260);

        if (dvdClickCount >= DVD_TARGET_CLICKS) {
            const unlocked = unlockShadowTrial('dvd', {
                toast: `O DVD rachou e soltou o fragmento ${shadowTrialMap.get('dvd').fragment}.`,
                feedback: 'o espectro rebateu ate quebrar'
            });
            if (unlocked) dvdGif.classList.add('is-unlocked');
            return;
        }

        setSecretFeedback(`eco VHS detectado: ${dvdClickCount}/${DVD_TARGET_CLICKS}`);
        showShadowToast(`Eco VHS ${dvdClickCount}/${DVD_TARGET_CLICKS}`);
    };

    const animateBackgroundGif = () => {
        const gifWidth = dvdGif.offsetWidth;
        const gifHeight = dvdGif.offsetHeight;
        const maxX = Math.max(0, window.innerWidth - gifWidth);
        const maxY = Math.max(0, window.innerHeight - gifHeight);
        dx += vx;
        dy += vy;

        if (dx <= 0 || dx >= maxX) {
            vx *= -1;
            dx = Math.max(0, Math.min(dx, maxX));
        }

        if (dy <= 0 || dy >= maxY) {
            vy *= -1;
            dy = Math.max(0, Math.min(dy, maxY));
        }
        dvdGif.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        requestAnimationFrame(animateBackgroundGif);
    };

    const startBackgroundGif = () => requestAnimationFrame(animateBackgroundGif);
    dvdGif.complete ? startBackgroundGif() : dvdGif.addEventListener('load', startBackgroundGif, { once: true });
    document.addEventListener('pointerdown', (event) => {
        if (!isPointerInsideDvd(event.clientX, event.clientY)) return;
        handleDvdInteraction();
    });
}

const hunterGifSrc = 'assets/gifzin.gif';
const hunterGifFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='none'/%3E%3Cg%3E%3Cpath d='M48 12c12 0 22 8 24 20l2 14c1 10-3 20-11 26l-3 2v10c0 2-2 4-4 4H40c-2 0-4-2-4-4V74l-3-2c-8-6-12-16-11-26l2-14c2-12 12-20 24-20z' fill='%23202020'/%3E%3Crect x='28' y='38' width='40' height='24' rx='10' fill='%23101010'/%3E%3Ccircle cx='40' cy='50' r='4' fill='%23d9eef7'/%3E%3Ccircle cx='56' cy='50' r='4' fill='%23d9eef7'/%3E%3C/g%3E%3C/svg%3E";

const cursorHunterGif = document.createElement('img');
cursorHunterGif.id = 'cursor-hunter-gif';
cursorHunterGif.src = hunterGifSrc;
cursorHunterGif.alt = 'Cacador de cursor';
cursorHunterGif.setAttribute('aria-hidden', 'true');
cursorHunterGif.decoding = 'async';
cursorHunterGif.loading = 'eager';
document.body.appendChild(cursorHunterGif);

cursorHunterGif.addEventListener('error', () => {
    if (cursorHunterGif.src !== hunterGifFallback) {
        cursorHunterGif.src = hunterGifFallback;
    }
});

{
    const CAPTURE_RADIUS = 42;
    const IDLE_ACCEL = 0.038;
    const IDLE_MAX_SPEED = 2.35;
    const TAG_ACCEL = 0.16;
    const TAG_MAX_SPEED = 6.4;
    const FRICTION = 0.986;
    const ABYSS_TAG_DURATION_MS = 12000;
    const ABYSS_TAG_COOLDOWN_MS = 1400;
    const FOLLOW_OFFSET_X = 124;
    const FOLLOW_OFFSET_Y = 74;
    const HUNTER_GIF_FACES_RIGHT_NATIVELY = true;

    let x = Math.max(0, window.innerWidth * 0.7);
    let y = Math.max(0, window.innerHeight * 0.2);
    let vx = -1.2;
    let vy = 0.9;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let pointerKnown = false;
    let pointerLastSeen = 0;
    let hunterStarted = false;
    let facingScaleX = 1;
    let visualTiltDeg = 0;
    let abyssTagActive = false;
    let abyssTagEndsAt = 0;
    let abyssTagCooldownUntil = 0;
    let abyssTagLastSecond = null;

    const mapRoute = [
        [0.12, 0.12], [0.5, 0.08], [0.86, 0.16], [0.9, 0.5],
        [0.84, 0.84], [0.48, 0.92], [0.15, 0.82], [0.08, 0.45]
    ];
    let mapIndex = 0;

    const updatePointer = (clientX, clientY) => {
        if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
        pointerX = clientX;
        pointerY = clientY;
        pointerKnown = true;
        pointerLastSeen = performance.now();
    };

    document.addEventListener('pointermove', (event) => updatePointer(event.clientX, event.clientY));
    document.addEventListener('mousemove', (event) => updatePointer(event.clientX, event.clientY));
    document.addEventListener('touchmove', (event) => {
        if (!event.touches || !event.touches[0]) return;
        updatePointer(event.touches[0].clientX, event.touches[0].clientY);
    }, { passive: true });

    const keepInside = () => {
        const maxX = Math.max(0, window.innerWidth - cursorHunterGif.offsetWidth);
        const maxY = Math.max(0, window.innerHeight - cursorHunterGif.offsetHeight);
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
    };

    const applyHunterTransform = () => {
        cursorHunterGif.style.transform =
            `translate3d(${x}px, ${y}px, 0) scaleX(${facingScaleX}) rotate(${visualTiltDeg}deg)`;
    };

    const finishAbyssTagGame = () => {
        if (!abyssTagActive) return;
        abyssTagActive = false;
        abyssTagLastSecond = null;
        cursorHunterGif.classList.remove('is-tag-mode', 'is-catching');
        unlockShadowTrial('tag', {
            toast: `Voce escapou do Abyss. Fragmento ${shadowTrialMap.get('tag').fragment} recuperado.`,
            feedback: 'voce venceu a caca do Abyss'
        });
        setShadowChaseMessage('Abyss perdeu o rastro. Fragmento recuperado.');
    };

    const failAbyssTagGame = () => {
        abyssTagActive = false;
        abyssTagLastSecond = null;
        abyssTagCooldownUntil = performance.now() + ABYSS_TAG_COOLDOWN_MS;
        cursorHunterGif.classList.remove('is-tag-mode');
        cursorHunterGif.classList.add('is-catching');
        setTimeout(() => cursorHunterGif.classList.remove('is-catching'), 420);
        showShadowToast('Abyss te marcou. Tente de novo.');
        setSecretFeedback('Abyss venceu essa rodada');
        setShadowChaseMessage('Abyss te marcou. Provoque-o de novo.', { persist: false });
    };

    startAbyssTagGame = () => {
        const now = performance.now();
        if (abyssTagActive) {
            setShadowChaseMessage('Abyss ja esta correndo atras de voce.', { persist: true });
            return;
        }
        if (now < abyssTagCooldownUntil) {
            setShadowChaseMessage('Abyss ainda esta rindo. Espere um instante.');
            return;
        }

        abyssTagActive = true;
        abyssTagEndsAt = now + ABYSS_TAG_DURATION_MS;
        abyssTagLastSecond = null;
        cursorHunterGif.classList.add('is-tag-mode');
        showShadowToast('Abyss acordou. Nao deixe ele tocar em voce.');
        setSecretFeedback('Abyss aceitou brincar');
        setShadowChaseMessage(`Tag do Abyss: sobreviva por ${Math.ceil(ABYSS_TAG_DURATION_MS / 1000)}s.`, {
            persist: true
        });
    };

    const animateHunter = (timestamp) => {
        const halfW = cursorHunterGif.offsetWidth / 2;
        const halfH = cursorHunterGif.offsetHeight / 2;
        const centerX = x + halfW;
        const centerY = y + halfH;

        if (abyssTagActive && timestamp >= abyssTagEndsAt) {
            finishAbyssTagGame();
        }

        const shouldPatrolMap = !pointerKnown || (timestamp - pointerLastSeen > 2200);
        let targetX;
        let targetY;

        if (shouldPatrolMap) {
            const point = mapRoute[mapIndex];
            targetX = point[0] * window.innerWidth;
            targetY = point[1] * window.innerHeight;
            if (Math.hypot(targetX - centerX, targetY - centerY) < 50) {
                mapIndex = (mapIndex + 1) % mapRoute.length;
            }
        } else if (abyssTagActive) {
            targetX = pointerX;
            targetY = pointerY;
        } else {
            const followSide = pointerX >= centerX ? -1 : 1;
            targetX = pointerX + (followSide * FOLLOW_OFFSET_X);
            targetY = pointerY + FOLLOW_OFFSET_Y;
        }

        const deltaX = targetX - centerX;
        const deltaY = targetY - centerY;
        const dist = Math.hypot(deltaX, deltaY) || 1;
        const activeAccel = abyssTagActive ? TAG_ACCEL : IDLE_ACCEL;
        const activeMaxSpeed = abyssTagActive ? TAG_MAX_SPEED : IDLE_MAX_SPEED;
        vx += (deltaX / dist) * activeAccel;
        vy += (deltaY / dist) * activeAccel;
        vx *= FRICTION;
        vy *= FRICTION;

        const speed = Math.hypot(vx, vy);
        if (speed > activeMaxSpeed) {
            const factor = activeMaxSpeed / speed;
            vx *= factor;
            vy *= factor;
        }

        if (Math.abs(vx) > 0.08) {
            const movementSign = vx >= 0 ? 1 : -1;
            facingScaleX = HUNTER_GIF_FACES_RIGHT_NATIVELY ? movementSign : -movementSign;
        }
        visualTiltDeg = Math.max(-9, Math.min(9, vy * 1.8));

        x += vx;
        y += vy;

        const maxX = Math.max(0, window.innerWidth - cursorHunterGif.offsetWidth);
        const maxY = Math.max(0, window.innerHeight - cursorHunterGif.offsetHeight);
        if (x <= 0 || x >= maxX) vx *= -0.9;
        if (y <= 0 || y >= maxY) vy *= -0.9;
        keepInside();

        if (pointerKnown) {
            const distanceToPointer = Math.hypot(pointerX - (x + halfW), pointerY - (y + halfH));
            cursorHunterGif.classList.toggle('is-catching', abyssTagActive && distanceToPointer <= CAPTURE_RADIUS * 1.6);

            if (abyssTagActive) {
                const secondsLeft = Math.max(0, Math.ceil((abyssTagEndsAt - timestamp) / 1000));
                if (secondsLeft !== abyssTagLastSecond) {
                    abyssTagLastSecond = secondsLeft;
                    setShadowChaseMessage(`Tag do Abyss: sobreviva por ${secondsLeft}s.`, { persist: true });
                }
            }

            if (abyssTagActive && distanceToPointer <= CAPTURE_RADIUS) {
                failAbyssTagGame();
            }
        } else {
            cursorHunterGif.classList.remove('is-catching');
        }

        applyHunterTransform();
        requestAnimationFrame(animateHunter);
    };

    const startHunter = () => {
        if (hunterStarted) return;
        hunterStarted = true;
        keepInside();
        applyHunterTransform();
        requestAnimationFrame(animateHunter);
    };

    window.addEventListener('resize', keepInside);
    cursorHunterGif.complete ? startHunter() : cursorHunterGif.addEventListener('load', startHunter, { once: true });
    setTimeout(startHunter, 60);
}

const playerToggle = document.getElementById('player-toggle');
const playerContent = document.getElementById('player-content');
if (playerToggle && playerContent) {
    playerToggle.addEventListener('click', () => {
        playerContent.classList.toggle('is-active');
        playerToggle.querySelector('.icon').innerText = playerContent.classList.contains('is-active') ? 'X' : 'M';
    });
}

document.addEventListener('keydown', event => {
    if (
        event.ctrlKey && (event.key === 'u' || event.key === 'U' || event.key === 's' || event.key === 'S') ||
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && (event.key === 'I' || event.key === 'J' || event.key === 'C'))
    ) {
        event.preventDefault();
        runJumpscare();
        return false;
    }
});

const randomPhotoLayer = document.getElementById('random-photo-layer');
const randomPhoto = document.getElementById('random-photo');
const scareAudio = new Audio('https://www.myinstants.com/media/sounds/xenoverse-goku-noise.mp3');
const fixedPhotoUrl = 'assets/LOGO%20SOA2.png';
const fallbackPhotoDataUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23110f1a'/%3E%3Cstop offset='1' stop-color='%23312942'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='450' fill='url(%23bg)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f5f2ff' font-size='40' font-family='Arial,sans-serif'%3Efoto indisponivel%3C/text%3E%3C/svg%3E";

let scareCycles = 0;
let scareEnabled = false;
let scareAudioUnlocked = false;
scareAudio.preload = 'auto';

if (randomPhoto) {
    randomPhoto.addEventListener('error', () => {
        if (randomPhoto.src === fallbackPhotoDataUrl) return;
        randomPhoto.src = fallbackPhotoDataUrl;
    });
}

const removeScareUnlockListeners = () => {
    document.removeEventListener('pointerdown', unlockScareAudio);
    document.removeEventListener('touchstart', unlockScareAudio);
    document.removeEventListener('keydown', unlockScareAudio);
};

const unlockScareAudio = () => {
    if (typeof window.__unlockEscapeAudio === 'function') {
        window.__unlockEscapeAudio();
    }
    if (scareAudioUnlocked) return;
    scareAudio.muted = true;
    scareAudio.currentTime = 0;
    scareAudio.play()
        .then(() => {
            scareAudio.pause();
            scareAudio.muted = false;
            scareAudioUnlocked = true;
            removeScareUnlockListeners();
        })
        .catch(() => {
            scareAudio.muted = false;
        });
};

const setPhotoAtRandomCorner = () => {
    if (!randomPhoto) return;
    const cornerPadding = 30;
    const corners = [
        { left: cornerPadding, top: cornerPadding },
        { left: window.innerWidth - randomPhoto.offsetWidth - cornerPadding, top: cornerPadding },
        { left: cornerPadding, top: window.innerHeight - randomPhoto.offsetHeight - cornerPadding },
        { left: window.innerWidth - randomPhoto.offsetWidth - cornerPadding, top: window.innerHeight - randomPhoto.offsetHeight - cornerPadding }
    ];
    const chosen = corners[Math.floor(Math.random() * corners.length)];
    randomPhoto.style.left = `${chosen.left}px`;
    randomPhoto.style.top = `${chosen.top}px`;
};

const runJumpscare = () => {
    if (!randomPhotoLayer || !randomPhoto) return;
    randomPhoto.src = fixedPhotoUrl;
    randomPhoto.style.left = '50%';
    randomPhoto.style.top = '50%';
    randomPhotoLayer.classList.add('is-visible', 'is-jumpscare');
    document.body.classList.add('screen-shake');
    scareAudio.currentTime = 0;
    scareAudio.play().catch(() => {});
    setTimeout(() => {
        randomPhotoLayer.classList.remove('is-visible', 'is-jumpscare');
        document.body.classList.remove('screen-shake');
        scheduleScareCycle();
    }, 2400);
};

const runScareCycle = () => {
    if (!randomPhotoLayer || !randomPhoto) return;
    scareCycles++;
    if (scareCycles >= 5) {
        scareCycles = 0;
        runJumpscare();
        return;
    }
    randomPhoto.src = fixedPhotoUrl;
    randomPhotoLayer.classList.remove('is-jumpscare');
    setPhotoAtRandomCorner();
    randomPhotoLayer.classList.add('is-visible');
    scareAudio.volume = 0.5;
    scareAudio.play().catch(() => {});
    setTimeout(() => {
        randomPhotoLayer.classList.remove('is-visible');
        scheduleScareCycle();
    }, 1500);
};

const scheduleScareCycle = () => {
    if (!scareEnabled) return;
    setTimeout(runScareCycle, 9000 + Math.random() * 12000);
};

const enableScareFeature = () => {
    if (scareEnabled) return;
    scareEnabled = true;
    scheduleScareCycle();
};

document.addEventListener('click', enableScareFeature, { once: true });
document.addEventListener('keydown', enableScareFeature, { once: true });
document.addEventListener('pointerdown', unlockScareAudio);
document.addEventListener('touchstart', unlockScareAudio, { passive: true });
document.addEventListener('keydown', unlockScareAudio);

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});
