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
    const centerRunawayButton = () => {
    const container = document.querySelector('.container');
    if (!container || !badgeRunawayButton) return;
    badgeRunawayButton.style.transform = 'none';
    const rect = container.getBoundingClientRect();
    const btnWidth = badgeRunawayButton.offsetWidth;
    const btnHeight = badgeRunawayButton.offsetHeight;
    let centerX = rect.left + (rect.width / 2) - (btnWidth / 2);
    let positionY = rect.bottom + 15;
    centerX = Math.max(10, Math.min(centerX, window.innerWidth - btnWidth - 10));
    if (positionY + btnHeight > window.innerHeight) {
        positionY = rect.top - btnHeight - 15; 
    }

    badgeRunawayButton.style.left = `${centerX}px`;
    badgeRunawayButton.style.top = `${positionY}px`;
};

    const moveRunawayButton = () => {
        const zoneWidth = window.innerWidth;
        const zoneHeight = window.innerHeight;
        const buttonWidth = badgeRunawayButton.offsetWidth;
        const buttonHeight = badgeRunawayButton.offsetHeight;
        const safeX = Math.max(6, zoneWidth - buttonWidth - 6);
        const safeY = Math.max(6, zoneHeight - buttonHeight - 6);
        const nextX = Math.floor(Math.random() * safeX);
        const nextY = Math.floor(Math.random() * safeY);

        badgeRunawayButton.style.transform = 'none';
        badgeRunawayButton.style.left = `${nextX}px`;
        badgeRunawayButton.style.top = `${nextY}px`;
    };

    const shouldRunAway = () => Math.random() > 0.2;
    const detectPointer = (event) => {
        if (!shouldRunAway()) return;

        const pointerX = event.touches ? event.touches[0].clientX : event.clientX;
        const pointerY = event.touches ? event.touches[0].clientY : event.clientY;
        if (typeof pointerX !== 'number' || typeof pointerY !== 'number') return;

        const rect = badgeRunawayButton.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        const distance = Math.hypot(pointerX - centerX, pointerY - centerY);

        if (distance < 130) {
            moveRunawayButton();
        }
    };

    badgeRunawayButton.addEventListener('mouseenter', moveRunawayButton);
    badgeRunawayButton.addEventListener('pointerdown', (event) => {
        if (shouldRunAway()) {
            event.preventDefault();
            moveRunawayButton();
        }
    });

    document.addEventListener('mousemove', detectPointer);
    document.addEventListener('touchmove', detectPointer, { passive: true });

    badgeRunawayButton.addEventListener('click', () => {
        openVideo(
            'https://www.youtube.com/embed/u-fOF9Wlpd8?autoplay=1',
            'Parabéns, você resgatou um emblema!',
            'Parabéns'
        );
    });

    centerRunawayButton();
    window.addEventListener('resize', centerRunawayButton);
}

const dvdGif = document.getElementById('dvd-gif');
if (dvdGif) {
    let x = 0, y = 0, vx = 1.9, vy = 1.45;

    const animate = () => {
        const maxX = window.innerWidth - dvdGif.offsetWidth;
        const maxY = window.innerHeight - dvdGif.offsetHeight;
        x += vx; y += vy;
        if (x <= 0 || x >= maxX) vx *= -1;
        if (y <= 0 || y >= maxY) vy *= -1;
        dvdGif.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        requestAnimationFrame(animate);
    };

    dvdGif.complete ? animate() : dvdGif.addEventListener('load', animate);
}

const playerToggle = document.getElementById('player-toggle');
const playerContent = document.getElementById('player-content');

if (playerToggle && playerContent) {
    playerToggle.addEventListener('click', () => {
        playerContent.classList.toggle('is-active');
        playerToggle.querySelector('.icon').innerText = playerContent.classList.contains('is-active') ? '✕' : '🎵';
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
const fixedPhotoUrl = 'https://media.discordapp.net/attachments/1473740311519039673/1474872572771438793/ChatGPT_Image_21_de_fev._de_2026_17_56_37.png?ex=699b6d9f&is=699a1c1f&hm=05bba2b88c6dc7876c06490c9170f7510f0da4d4ea12a71dc3dfdd40b4ea8807&=&format=webp&quality=lossless&width=1376&height=917';

let scareCycles = 0;
let scareEnabled = false;

scareAudio.preload = 'auto';

const setPhotoAtRandomCorner = () => {
    if (!randomPhoto) return;

    const cornerPadding = 22 + Math.floor(Math.random() * 30);
    const jitter = Math.floor(Math.random() * 28);
    const corners = [
        { left: cornerPadding + jitter, top: cornerPadding + jitter },
        { left: window.innerWidth - randomPhoto.offsetWidth - cornerPadding - jitter, top: cornerPadding + jitter },
        { left: cornerPadding + jitter, top: window.innerHeight - randomPhoto.offsetHeight - cornerPadding - jitter },
        { left: window.innerWidth - randomPhoto.offsetWidth - cornerPadding - jitter, top: window.innerHeight - randomPhoto.offsetHeight - cornerPadding - jitter }
    ];
    const chosenCorner = corners[Math.floor(Math.random() * corners.length)];

    randomPhoto.style.left = `${Math.max(8, chosenCorner.left)}px`;
    randomPhoto.style.top = `${Math.max(8, chosenCorner.top)}px`;
};

const runJumpscare = () => {
    if (!randomPhotoLayer || !randomPhoto) return;

    randomPhoto.src = fixedPhotoUrl;
    randomPhoto.style.left = '50%';
    randomPhoto.style.top = '50%';
    randomPhotoLayer.classList.add('is-visible', 'is-jumpscare');
    document.body.classList.add('screen-shake');

    scareAudio.pause();
    scareAudio.currentTime = 0;
    scareAudio.volume = 1;
    scareAudio.playbackRate = 1.25;
    scareAudio.play().catch(() => {});

    setTimeout(() => {
        randomPhotoLayer.classList.remove('is-visible', 'is-jumpscare');
        document.body.classList.remove('screen-shake');
        scheduleScareCycle();
    }, 2400);
};

const runScareCycle = () => {
    if (!randomPhotoLayer || !randomPhoto) return;

    scareCycles += 1;

    if (scareCycles >= 5) {
        scareCycles = 0;
        runJumpscare();
        return;
    }

    randomPhoto.src = fixedPhotoUrl;
    randomPhotoLayer.classList.remove('is-jumpscare');
    setPhotoAtRandomCorner();
    randomPhotoLayer.classList.add('is-visible');

    scareAudio.pause();
    scareAudio.currentTime = 0;
    scareAudio.volume = 0.55;
    scareAudio.playbackRate = 1;
    scareAudio.play().catch(() => {});

    setTimeout(() => {
        randomPhotoLayer.classList.remove('is-visible');
        scheduleScareCycle();
    }, 1500);
};

const scheduleScareCycle = () => {
    if (!scareEnabled) return;
    const nextDelay = 9000 + Math.floor(Math.random() * 12000);
    setTimeout(runScareCycle, nextDelay);
};

const enableScareFeature = () => {
    if (scareEnabled) return;
    scareEnabled = true;
    scheduleScareCycle();
};

document.addEventListener('click', enableScareFeature, { once: true });
document.addEventListener('keydown', enableScareFeature, { once: true });
