const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const countDownDate = new Date("2026-06-09T00:00:00").getTime();

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
};

const interval = setInterval(updateCountdown, 1000);
updateCountdown();

const videoModal = document.getElementById('video-modal');
const launchVideo = document.getElementById('launch-video');
const launchLink = document.querySelector('.launch-link');
const abyssTrigger = document.getElementById('abyss-trigger');
const badgeRunawayButton = document.getElementById('badge-runaway-button');
const badgeButtonZone = document.getElementById('badge-button-zone');
const closeModalControls = document.querySelectorAll('[data-close-modal]');

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

if (launchLink) {
    launchLink.addEventListener('click', (e) => {
        e.preventDefault();
        openVideo('https://www.youtube.com/embed/fC7oUOUEEi4?autoplay=1', 'A equipe está trabalhando.');
    });
}

if (abyssTrigger) {
    abyssTrigger.addEventListener('click', () => {
        openVideo('https://www.youtube.com/embed/KnHmoA6Op1o?autoplay=1', 'O segredo da bungie.');
    });
}

closeModalControls.forEach(el => el.addEventListener('click', closeVideoModal));

if (badgeRunawayButton && badgeButtonZone) {
    const BUTTON_PADDING = 8;
    const ESCAPE_DISTANCE = 72;
    const DETECTION_RADIUS = 120;
    const INITIAL_FREEZE_MS = 800;
    let x = 0;
    let y = 0;
    let canRunAway = false;

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

    const placeAtCenter = () => {
        x = (badgeButtonZone.clientWidth - badgeRunawayButton.offsetWidth) / 2;
        y = (badgeButtonZone.clientHeight - badgeRunawayButton.offsetHeight) / 2;
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

    badgeButtonZone.addEventListener('mousemove', detectPointer);
    badgeButtonZone.addEventListener('touchmove', detectPointer, { passive: true });
    badgeRunawayButton.addEventListener('mouseenter', (e) => moveRunawayButton(e.clientX, e.clientY));
    badgeRunawayButton.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        moveRunawayButton(e.clientX, e.clientY);
    });

    window.addEventListener('load', placeAtCenter);
    window.addEventListener('resize', placeAtCenter);
    setTimeout(placeAtCenter, 100);
    setTimeout(() => { canRunAway = true; }, INITIAL_FREEZE_MS);

    badgeRunawayButton.addEventListener('click', () => {
        openVideo('https://www.youtube.com/embed/u-fOF9Wlpd8?autoplay=1', 'Parabéns, você resgatou um emblema!', 'Parabéns');
    });
}

const dvdGif = document.getElementById('dvd-gif');
if (dvdGif) {
    let dx = 0, dy = 0, vx = 1.9, vy = 1.45;
    const animate = () => {
        const maxX = window.innerWidth - dvdGif.offsetWidth;
        const maxY = window.innerHeight - dvdGif.offsetHeight;
        dx += vx; dy += vy;
        if (dx <= 0 || dx >= maxX) vx *= -1;
        if (dy <= 0 || dy >= maxY) vy *= -1;
        dvdGif.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        requestAnimationFrame(animate);
    };
    dvdGif.complete ? animate() : dvdGif.addEventListener('load', animate);
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
const fixedPhotoUrl = 'https://cdn.discordapp.com/attachments/1473740311519039673/1474872572771438793/ChatGPT_Image_21_de_fev._de_2026_17_56_37.png?ex=699b6d9f&is=699a1c1f&hm=05bba2b88c6dc7876c06490c9170f7510f0da4d4ea12a71dc3dfdd40b4ea8807&';

let scareCycles = 0;
let scareEnabled = false;
scareAudio.preload = 'auto';

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

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});
