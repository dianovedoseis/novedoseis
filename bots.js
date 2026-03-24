const BOT_CONFIG = {
    guardian: {
        name: 'Abyss Guardian',
        description: 'Moderacao, automacao e recursos personalizados para servidores do Discord.',
        image: 'assets/abyssguardianlogo.png',
        agreeLabel: 'Concordo com os documentos do Abyss Guardian',
        documents: [
            {
                title: 'Termos de Servico',
                path: 'assets/abyss_guardian_terms.md'
            },
            {
                title: 'Politica de Privacidade',
                path: 'assets/abyss_guardian_privacy.md'
            }
        ]
    },
    dj: {
        name: 'Abyss DJ',
        description: 'Musica, filas e controle de reproducao com integracoes de audio.',
        image: 'assets/abyssDJ.png',
        agreeLabel: 'Concordo com os documentos do Abyss DJ',
        documents: [
            {
                title: 'Termo de Uso',
                path: 'assets/TERMO_DE_USO.dj.md'
            },
            {
                title: 'Politica de Privacidade',
                path: 'assets/POLITICA_DE_PRIVACIDADE.dj.md'
            }
        ]
    }
};

const CONSENT_STORAGE_KEY = 'soa-bot-doc-consent-v1';

const botLinks = Array.from(document.querySelectorAll('[data-bot-link]'));
const selectedBotImage = document.getElementById('selected-bot-image');
const selectedBotName = document.getElementById('selected-bot-name');
const selectedBotDescription = document.getElementById('selected-bot-description');
const docOneSource = document.getElementById('doc-one-source');
const docTwoSource = document.getElementById('doc-two-source');
const docsFeedback = document.getElementById('docs-feedback');
const docOneTitle = document.getElementById('doc-one-title');
const docTwoTitle = document.getElementById('doc-two-title');
const docOneContent = document.getElementById('doc-one-content');
const docTwoContent = document.getElementById('doc-two-content');
const agreeButton = document.getElementById('agree-button');
const agreeStatus = document.getElementById('agree-status');

const documentCache = new Map();
const consentState = readConsentState();

let activeBotId = null;
let activeLoadToken = 0;

function readConsentState() {
    try {
        const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (error) {
        return {};
    }
}

function saveConsentState() {
    try {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentState));
    } catch (error) {
        console.warn('Nao foi possivel salvar a concordancia dos documentos.', error);
    }
}

function escapeHtml(value = '') {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function formatInlineMarkdown(text) {
    return escapeHtml(text)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function looksMojibake(text) {
    return /\u00C3.|\u00C2.|\u00E2[\u0080-\u00BF]/.test(text);
}

function repairLikelyUtf8Text(text) {
    if (!looksMojibake(text)) return text;

    try {
        const bytes = Uint8Array.from(text, (character) => character.charCodeAt(0) & 0xff);
        return new TextDecoder('utf-8').decode(bytes);
    } catch (error) {
        return text;
    }
}

function countMojibakeArtifacts(text) {
    const matches = text.match(/\u00C3.|\u00C2.|\u00E2[\u0080-\u00BF]/g);
    return matches ? matches.length : 0;
}

function normalizeMarkdownText(text) {
    const repaired = repairLikelyUtf8Text(text);
    return countMojibakeArtifacts(repaired) < countMojibakeArtifacts(text) ? repaired : text;
}

function parseMarkdown(markdown) {
    const lines = normalizeMarkdownText(markdown)
        .replace(/\r\n?/g, '\n')
        .split('\n');

    const htmlParts = [];
    let paragraphLines = [];
    let listItems = [];

    const flushParagraph = () => {
        if (!paragraphLines.length) return;
        const paragraphHtml = paragraphLines
            .map((line) => formatInlineMarkdown(line.trim()))
            .join('<br>');
        htmlParts.push(`<p>${paragraphHtml}</p>`);
        paragraphLines = [];
    };

    const flushList = () => {
        if (!listItems.length) return;
        const listHtml = listItems
            .map((item) => `<li>${formatInlineMarkdown(item)}</li>`)
            .join('');
        htmlParts.push(`<ul>${listHtml}</ul>`);
        listItems = [];
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        if (!trimmed) {
            flushParagraph();
            flushList();
            return;
        }

        if (/^---+$/.test(trimmed)) {
            flushParagraph();
            flushList();
            htmlParts.push('<hr>');
            return;
        }

        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            flushParagraph();
            flushList();
            const level = Math.min(headingMatch[1].length, 4);
            htmlParts.push(`<h${level}>${formatInlineMarkdown(headingMatch[2])}</h${level}>`);
            return;
        }

        const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
        if (listMatch) {
            flushParagraph();
            listItems.push(listMatch[1]);
            return;
        }

        paragraphLines.push(trimmed);
    });

    flushParagraph();
    flushList();

    return htmlParts.join('');
}

async function loadMarkdownDocument(path) {
    if (documentCache.has(path)) {
        return documentCache.get(path);
    }

    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`Falha ao carregar ${path}`);
    }

    const buffer = await response.arrayBuffer();
    const text = normalizeMarkdownText(new TextDecoder('utf-8').decode(buffer));
    documentCache.set(path, text);
    return text;
}

function formatAcceptedDate(isoString) {
    try {
        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(new Date(isoString));
    } catch (error) {
        return isoString;
    }
}

function setFeedback(message, isError = false) {
    docsFeedback.textContent = message;
    docsFeedback.classList.toggle('is-error', isError);
}

function setLoadingState(bot) {
    docOneTitle.textContent = bot.documents[0].title;
    docTwoTitle.textContent = bot.documents[1].title;
    docOneContent.classList.add('is-loading');
    docTwoContent.classList.add('is-loading');
    docOneContent.textContent = 'Carregando documento...';
    docTwoContent.textContent = 'Carregando documento...';
}

function renderDocument(target, markdown) {
    target.classList.remove('is-loading');
    target.innerHTML = parseMarkdown(markdown) || '<p class="doc-empty">Documento vazio.</p>';
}

function renderErrorState(message) {
    const errorMarkup = `<p class="doc-empty">${escapeHtml(message)}</p>`;
    docOneContent.classList.remove('is-loading');
    docTwoContent.classList.remove('is-loading');
    docOneContent.innerHTML = errorMarkup;
    docTwoContent.innerHTML = errorMarkup;
}

function renderBotLinks(botId) {
    botLinks.forEach((link) => {
        const isActive = link.dataset.botLink === botId;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function syncBotHeader(bot) {
    selectedBotImage.src = bot.image;
    selectedBotImage.alt = `Logo do ${bot.name}`;
    selectedBotName.textContent = bot.name;
    selectedBotDescription.textContent = bot.description;
    docOneSource.href = bot.documents[0].path;
    docOneSource.textContent = `Abrir ${bot.documents[0].title} (.md)`;
    docTwoSource.href = bot.documents[1].path;
    docTwoSource.textContent = `Abrir ${bot.documents[1].title} (.md)`;
}

function updateAgreeState(botId) {
    const bot = BOT_CONFIG[botId];
    const acceptance = consentState[botId];

    if (acceptance && acceptance.acceptedAt) {
        agreeButton.textContent = 'Concordancia registrada';
        agreeButton.classList.add('is-agreed');
        agreeStatus.textContent = `Concordancia salva em ${formatAcceptedDate(acceptance.acceptedAt)} neste navegador.`;
        return;
    }

    agreeButton.textContent = bot.agreeLabel;
    agreeButton.classList.remove('is-agreed');
    agreeStatus.textContent = 'Nenhuma concordancia registrada neste navegador.';
}

function getBotIdFromLocation() {
    const searchParams = new URLSearchParams(window.location.search);
    const requestedBot = searchParams.get('bot');
    return BOT_CONFIG[requestedBot] ? requestedBot : 'guardian';
}

function updateHistory(botId, method) {
    const url = new URL(window.location.href);
    url.searchParams.set('bot', botId);
    window.history[method]({ botId }, '', url);
}

async function selectBot(botId, { historyMode = null } = {}) {
    const safeBotId = BOT_CONFIG[botId] ? botId : 'guardian';
    const bot = BOT_CONFIG[safeBotId];
    const loadToken = ++activeLoadToken;

    activeBotId = safeBotId;
    renderBotLinks(safeBotId);
    syncBotHeader(bot);
    updateAgreeState(safeBotId);
    setLoadingState(bot);
    setFeedback(`Carregando os documentos de ${bot.name}...`);

    if (historyMode === 'pushState' || historyMode === 'replaceState') {
        updateHistory(safeBotId, historyMode);
    }

    try {
        const [documentOne, documentTwo] = await Promise.all([
            loadMarkdownDocument(bot.documents[0].path),
            loadMarkdownDocument(bot.documents[1].path)
        ]);

        if (loadToken !== activeLoadToken) return;

        renderDocument(docOneContent, documentOne);
        renderDocument(docTwoContent, documentTwo);
        setFeedback(`Documentos de ${bot.name} carregados. Leia os dois paineis abaixo e confirme com o botao.`);
    } catch (error) {
        if (loadToken !== activeLoadToken) return;

        console.error(error);
        renderErrorState(
            'Nao foi possivel carregar os arquivos .md. Se esta pagina estiver aberta como arquivo local, use um servidor local para liberar a leitura dos documentos.'
        );
        setFeedback('Falha ao carregar os documentos desta selecao.', true);
    }
}

botLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const botId = link.dataset.botLink;
        if (!botId || botId === activeBotId) return;
        selectBot(botId, { historyMode: 'pushState' });
    });
});

agreeButton.addEventListener('click', () => {
    if (!activeBotId || !BOT_CONFIG[activeBotId]) return;

    consentState[activeBotId] = {
        acceptedAt: new Date().toISOString()
    };
    saveConsentState();
    updateAgreeState(activeBotId);
    setFeedback(`Concordancia com ${BOT_CONFIG[activeBotId].name} registrada neste navegador.`);
});

window.addEventListener('popstate', () => {
    selectBot(getBotIdFromLocation());
});

selectBot(getBotIdFromLocation(), { historyMode: 'replaceState' });
