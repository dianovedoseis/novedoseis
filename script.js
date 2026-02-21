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
const closeModalControls = document.querySelectorAll('[data-close-modal]');

const openVideo = (url, titleText) => {
    if (!videoModal || !launchVideo) return;
    const modalTitle = document.getElementById('video-modal-title');
    
    if (modalTitle) modalTitle.innerText = titleText;
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