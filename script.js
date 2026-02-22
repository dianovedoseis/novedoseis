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
const closeChessControls = document.querySelectorAll('[data-close-chess]');
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
    const parchmentTyping = parchmentModal.querySelector('.parchment-typing');
    const parchmentMessage = '100% oliginal';
    const PARCHMENT_TYPE_DELAY_MS = 170;
    const PARCHMENT_TYPE_START_DELAY_MS = 980;
    let parchmentTypeInterval = null;
    let parchmentTypeStartTimeout = null;
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
    if (parchmentCloseButton) {
        parchmentCloseButton.addEventListener('click', closeParchmentModal);
    }
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
        const inBounds = (f, r) => f >= 0 && f < 8 && r >= 1 && r <= 8;
        const toSquare = (f, r) => `${files[f]}${r}`;
        const fromSquare = (square) => ({ file: files.indexOf(square[0]), rank: Number(square[1]) });
        const squareColorClass = (square) => {
            const fileIndex = files.indexOf(square[0]);
            const rank = Number(square[1]);
            return (fileIndex + rank) % 2 === 0 ? 'dark' : 'light';
        };

        const createFallbackGame = () => {
            let board = {};
            let turn = 'w';

            const placeBackRank = (rank, color) => {
                const pieces = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
                for (let i = 0; i < 8; i++) {
                    board[toSquare(i, rank)] = { type: pieces[i], color };
                }
            };

            const reset = () => {
                board = {};
                turn = 'w';
                placeBackRank(1, 'w');
                placeBackRank(8, 'b');
                for (let i = 0; i < 8; i++) {
                    board[toSquare(i, 2)] = { type: 'p', color: 'w' };
                    board[toSquare(i, 7)] = { type: 'p', color: 'b' };
                }
            };

            const get = (square) => board[square] || null;

            const pushRayMoves = (from, directions, color, moves) => {
                const start = fromSquare(from);
                directions.forEach(([df, dr]) => {
                    let f = start.file + df;
                    let r = start.rank + dr;
                    while (inBounds(f, r)) {
                        const sq = toSquare(f, r);
                        const target = get(sq);
                        if (!target) {
                            moves.push(sq);
                        } else {
                            if (target.color !== color) moves.push(sq);
                            break;
                        }
                        f += df;
                        r += dr;
                    }
                });
            };

            const legalMovesFrom = (from) => {
                const piece = get(from);
                if (!piece || piece.color !== turn) return [];
                const moves = [];
                const { file, rank } = fromSquare(from);

                if (piece.type === 'p') {
                    const dir = piece.color === 'w' ? 1 : -1;
                    const startRank = piece.color === 'w' ? 2 : 7;
                    const one = toSquare(file, rank + dir);
                    if (inBounds(file, rank + dir) && !get(one)) {
                        moves.push(one);
                        const two = toSquare(file, rank + (2 * dir));
                        if (rank === startRank && !get(two)) moves.push(two);
                    }
                    [-1, 1].forEach(df => {
                        const nf = file + df;
                        const nr = rank + dir;
                        if (!inBounds(nf, nr)) return;
                        const targetSq = toSquare(nf, nr);
                        const target = get(targetSq);
                        if (target && target.color !== piece.color) moves.push(targetSq);
                    });
                    return moves;
                }

                if (piece.type === 'n') {
                    const jumps = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
                    jumps.forEach(([df, dr]) => {
                        const nf = file + df;
                        const nr = rank + dr;
                        if (!inBounds(nf, nr)) return;
                        const sq = toSquare(nf, nr);
                        const target = get(sq);
                        if (!target || target.color !== piece.color) moves.push(sq);
                    });
                    return moves;
                }

                if (piece.type === 'b') {
                    pushRayMoves(from, [[1, 1], [1, -1], [-1, 1], [-1, -1]], piece.color, moves);
                    return moves;
                }

                if (piece.type === 'r') {
                    pushRayMoves(from, [[1, 0], [-1, 0], [0, 1], [0, -1]], piece.color, moves);
                    return moves;
                }

                if (piece.type === 'q') {
                    pushRayMoves(from, [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]], piece.color, moves);
                    return moves;
                }

                if (piece.type === 'k') {
                    const around = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
                    around.forEach(([df, dr]) => {
                        const nf = file + df;
                        const nr = rank + dr;
                        if (!inBounds(nf, nr)) return;
                        const sq = toSquare(nf, nr);
                        const target = get(sq);
                        if (!target || target.color !== piece.color) moves.push(sq);
                    });
                }
                return moves;
            };

            const move = ({ from, to, promotion = 'q' }) => {
                const piece = get(from);
                if (!piece || piece.color !== turn) return null;
                const legal = legalMovesFrom(from);
                if (!legal.includes(to)) return null;
                const moved = { ...piece };
                if (moved.type === 'p') {
                    const toRank = Number(to[1]);
                    if ((moved.color === 'w' && toRank === 8) || (moved.color === 'b' && toRank === 1)) {
                        moved.type = promotion || 'q';
                    }
                }
                board[to] = moved;
                delete board[from];
                turn = turn === 'w' ? 'b' : 'w';
                return moved;
            };

            reset();
            return {
                get,
                move,
                reset,
                turn: () => turn,
                moves: ({ square, verbose }) => {
                    const list = legalMovesFrom(square);
                    return verbose ? list.map(to => ({ to })) : list;
                },
                in_checkmate: () => false,
                in_draw: () => false,
                in_check: () => false
            };
        };

        const game = typeof Chess !== 'undefined' ? new Chess() : createFallbackGame();
        const usingFallback = typeof Chess === 'undefined';
        const humanColor = 'w';
        const aiColor = 'b';
        const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
        let selectedSquare = null;
        let legalTargets = [];
        let aiThinking = false;
        let aiTimeoutId = null;

        const getAllMovesFor = (color) => {
            const moves = [];
            for (let rank = 1; rank <= 8; rank++) {
                for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
                    const from = `${files[fileIdx]}${rank}`;
                    const piece = game.get(from);
                    if (!piece || piece.color !== color) continue;
                    const targets = game.moves({ square: from, verbose: true });
                    targets.forEach(target => {
                        const to = target.to;
                        moves.push({ from, to });
                    });
                }
            }
            return moves;
        };

        const pickFallbackAiMove = () => {
            const moves = getAllMovesFor(aiColor);
            if (!moves.length) return null;
            let bestScore = -Infinity;
            let bestMoves = [];
            moves.forEach(move => {
                const captured = game.get(move.to);
                let score = captured ? (pieceValues[captured.type] || 0) : 0;
                score += Math.random() * 0.2;
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [move];
                } else if (Math.abs(score - bestScore) < 0.0001) {
                    bestMoves.push(move);
                }
            });
            return bestMoves[Math.floor(Math.random() * bestMoves.length)];
        };

        const runFallbackAiTurn = () => {
            if (!usingFallback) return;
            if (game.turn() !== aiColor) return;
            if (aiThinking) return;
            aiThinking = true;
            updateStatus();
            aiTimeoutId = setTimeout(() => {
                const move = pickFallbackAiMove();
                if (move) game.move({ from: move.from, to: move.to, promotion: 'q' });
                aiThinking = false;
                aiTimeoutId = null;
                clearSelection();
                renderBoard();
            }, 360);
        };

        const updateStatus = () => {
            if (usingFallback) {
                const turnName = game.turn() === 'w' ? 'Brancas' : 'Pretas';
                if (aiThinking) {
                    chessStatus.innerText = 'Modo offline: IA pensando...';
                    return;
                }
                chessStatus.innerText = `Modo offline: vez das ${turnName.toLowerCase()}.`;
                return;
            }
            if (game.in_checkmate()) {
                chessStatus.innerText = `Xeque-mate. ${game.turn() === 'w' ? 'Pretas' : 'Brancas'} venceram.`;
                return;
            }
            if (game.in_draw()) {
                chessStatus.innerText = 'Empate.';
                return;
            }
            const turnName = game.turn() === 'w' ? 'Brancas' : 'Pretas';
            const checkText = game.in_check() ? ' em xeque' : '';
            chessStatus.innerText = `Vez das ${turnName.toLowerCase()}${checkText}.`;
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
                    squareEl.textContent = piece ? pieceGlyph[`${piece.color}${piece.type}`] : '';
                    chessBoard.appendChild(squareEl);
                }
            }
            updateStatus();
        };

        const selectSquare = (square) => {
            if (usingFallback && (aiThinking || game.turn() !== humanColor)) return;
            const piece = game.get(square);
            if (!piece || piece.color !== game.turn()) {
                clearSelection();
                renderBoard();
                return;
            }
            selectedSquare = square;
            legalTargets = game.moves({ square, verbose: true }).map(move => move.to);
            renderBoard();
        };

        const tryMove = (from, to) => {
            const move = game.move({ from, to, promotion: 'q' });
            if (!move) {
                selectSquare(to);
                return false;
            }
            clearSelection();
            renderBoard();
            if (usingFallback) runFallbackAiTurn();
            return true;
        };

        chessBoard.addEventListener('click', (event) => {
            if (usingFallback && (aiThinking || game.turn() !== humanColor)) return;
            const squareEl = event.target.closest('.chess-square');
            if (!squareEl) return;
            const clicked = squareEl.dataset.square;
            if (!clicked) return;
            if (!selectedSquare) {
                selectSquare(clicked);
                return;
            }
            if (clicked === selectedSquare) {
                clearSelection();
                renderBoard();
                return;
            }
            if (legalTargets.includes(clicked)) {
                tryMove(selectedSquare, clicked);
                return;
            }
            selectSquare(clicked);
        });

        chessReset.addEventListener('click', () => {
            if (aiTimeoutId) {
                clearTimeout(aiTimeoutId);
                aiTimeoutId = null;
            }
            aiThinking = false;
            game.reset();
            clearSelection();
            renderBoard();
            runFallbackAiTurn();
        });

        renderBoard();
    }
}

if (badgeRunawayButton && badgeButtonZone) {
    const containerEl = document.querySelector('.container');
    const BUTTON_PADDING = 8;
    const START_BOTTOM_OFFSET = 14;
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
const fixedPhotoUrl = 'https://cdn.discordapp.com/attachments/1457504428553670796/1475203496713261107/soa2..png?ex=699ca1d1&is=699b5051&hm=b41682ac655a58da7a257d759aa2c48d92616cbbb8876eaeb0223cb7800b3a14&';

let scareCycles = 0;
let scareEnabled = false;
let scareAudioUnlocked = false;
scareAudio.preload = 'auto';

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



















