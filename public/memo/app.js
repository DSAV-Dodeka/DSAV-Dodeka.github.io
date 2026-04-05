// State
const state = {
    memoDate: '',
    cards: [
        {
            title: '',
            date: '',
            bullets: [''],
            isNew: false,
        },
        {
            title: '',
            date: '',
            bullets: [''],
            isNew: false,
        },
        {
            title: '',
            date: '',
            bullets: [''],
            isNew: false,
        },
    ],
    fourthSlot: {
        mode: 'update', // 'update' or 'card'
        update: {
            label: 'Update',
            title: '',
            body: '',
        },
        card: {
            title: '',
            date: '',
            bullets: [''],
            isNew: false,
        },
    },
};

function el(id) { return document.getElementById(id); }

function renderEditor() {
    const container = el('editor-cards');
    container.innerHTML = '';

    // Memo date
    el('memo-date-input').value = state.memoDate;

    // Cards 1-3
    state.cards.forEach((card, i) => {
        const div = document.createElement('div');
        div.className = 'card-editor';
        div.innerHTML = `
            <div class="card-editor-header">
                <h3>Mededeling ${i + 1}</h3>
                <div class="toggle-row">
                    <label><input type="checkbox" ${card.isNew ? 'checked' : ''} onchange="toggleNew(${i}, this.checked)"> Nieuw</label>
                </div>
            </div>
            <div class="field-group">
                <label>Titel</label>
                <input type="text" value="${escHtml(card.title)}" oninput="updateCard(${i}, 'title', this.value)">
            </div>
            <div class="field-group">
                <label>Datum</label>
                <input type="text" value="${escHtml(card.date)}" oninput="updateCard(${i}, 'date', this.value)" placeholder="bv. 11-04 of 11-04 t/m 18-04">
            </div>
            <div class="field-group">
                <label>Bullets (één per regel)</label>
                <textarea oninput="updateBullets(${i}, this.value)">${card.bullets.join('\n')}</textarea>
            </div>
        `;
        container.appendChild(div);
    });

    // Fourth slot
    const isUpdate = state.fourthSlot.mode === 'update';
    const fourthDiv = document.createElement('div');
    fourthDiv.className = 'card-editor';

    let fourthContent = `
        <div class="card-editor-header">
            <h3>Mededeling 4 / Update</h3>
            <div class="toggle-row">
                <label><input type="radio" name="fourth-mode" value="update" ${isUpdate ? 'checked' : ''} onchange="setFourthMode('update')"> Update</label>
                <label><input type="radio" name="fourth-mode" value="card" ${!isUpdate ? 'checked' : ''} onchange="setFourthMode('card')"> Mededeling 4</label>
            </div>
        </div>
    `;

    if (isUpdate) {
        fourthContent += `
            <div class="field-group">
                <label>Label (bv. Update, Herinnering, ...)</label>
                <input type="text" value="${escHtml(state.fourthSlot.update.label)}" oninput="updateFourthUpdate('label', this.value)">
            </div>
            <div class="field-group">
                <label>Titel</label>
                <input type="text" value="${escHtml(state.fourthSlot.update.title)}" oninput="updateFourthUpdate('title', this.value)">
            </div>
            <div class="field-group">
                <label>Tekst</label>
                <textarea oninput="updateFourthUpdate('body', this.value)">${state.fourthSlot.update.body}</textarea>
            </div>
        `;
    } else {
        const c = state.fourthSlot.card;
        fourthContent += `
            <div class="toggle-row" style="margin-bottom:12px">
                <label><input type="checkbox" ${c.isNew ? 'checked' : ''} onchange="toggleNewFourth(this.checked)"> Nieuw</label>
            </div>
            <div class="field-group">
                <label>Titel</label>
                <input type="text" value="${escHtml(c.title)}" oninput="updateFourthCard('title', this.value)">
            </div>
            <div class="field-group">
                <label>Datum</label>
                <input type="text" value="${escHtml(c.date)}" oninput="updateFourthCard('date', this.value)">
            </div>
            <div class="field-group">
                <label>Bullets (één per regel)</label>
                <textarea oninput="updateFourthBullets(this.value)">${c.bullets.join('\n')}</textarea>
            </div>
        `;
    }

    fourthDiv.innerHTML = fourthContent;
    container.appendChild(fourthDiv);
}

function renderPreview() {
    // Date — plain text, JS will scale it to fit title height
    const dateEl = el('preview-date');
    dateEl.textContent = state.memoDate;
    dateEl.parentElement.style.display = state.memoDate.trim() ? '' : 'none';

    // Cards 1-3
    const cardsContainer = el('preview-cards');
    cardsContainer.innerHTML = '';

    state.cards.forEach((card, i) => {
        cardsContainer.innerHTML += buildCardHtml(i + 1, card);
    });

    // Fourth slot
    const fourthContainer = el('preview-fourth');
    if (state.fourthSlot.mode === 'update') {
        const hasTitle = state.fourthSlot.update.title.trim().length > 0;
        const hasBody = state.fourthSlot.update.body.trim().length > 0;
        const hasLabel = state.fourthSlot.update.label.trim().length > 0;
        if (!hasTitle && !hasBody && !hasLabel) {
            fourthContainer.innerHTML = '';
        } else {
            fourthContainer.innerHTML = `
                <div class="memo-update">
                    <div style="display:flex;align-items:baseline;gap:4px;margin-bottom:2px;">
                        ${hasLabel ? `<span class="memo-update-label">${escHtml(state.fourthSlot.update.label)}:</span>` : ''}
                        ${hasTitle ? `<span class="memo-update-title">${escHtml(state.fourthSlot.update.title)}</span>` : ''}
                    </div>
                    ${hasBody ? `<div class="memo-update-body">${escHtml(state.fourthSlot.update.body)}</div>` : ''}
                </div>
            `;
        }
    } else {
        fourthContainer.innerHTML = buildCardHtml(4, state.fourthSlot.card);
    }

    // Auto-fit text if content overflows
    requestAnimationFrame(() => {
        syncDateHeight();
        fitCardDates();
        autoFitContent();
    });
}

// --- Shrink card dates if they overlap with the title ---
function fitCardDates() {
    document.querySelectorAll('.memo-card-header').forEach(header => {
        const title = header.querySelector('.memo-card-title');
        const date = header.querySelector('.memo-card-date');
        if (!title || !date) return;

        // Reset
        date.style.fontSize = '';

        // Get bounding rects — if date overlaps title, shrink date
        const titleRect = title.getBoundingClientRect();
        const dateRect = date.getBoundingClientRect();

        // Title right edge vs date left edge
        let fontSize = 0.85;
        let attempts = 0;
        while (titleRect.right > dateRect.left && fontSize > 0.5 && attempts < 10) {
            fontSize -= 0.05;
            date.style.fontSize = `${fontSize}rem`;
            // Re-check after resize
            const newDateRect = date.getBoundingClientRect();
            if (titleRect.right <= newDateRect.left) break;
            attempts++;
        }
    });
}

// --- Scale date text to exactly match title height ---
function syncDateHeight() {
    const dateEl = el('preview-date');
    const dateCol = document.querySelector('.memo-date-col');
    const measurer = el('date-measurer');
    if (!dateEl || !dateCol || !measurer) return;

    // Reset
    dateEl.style.letterSpacing = 'normal';
    dateEl.style.fontSize = '1.1rem';

    // Update measurer text to match
    measurer.textContent = state.memoDate;
    measurer.style.fontSize = '1.1rem';
    measurer.style.letterSpacing = 'normal';

    // The column height = title height (because of align-items: stretch)
    const targetHeight = dateCol.offsetHeight;

    // The measurer gives us the true horizontal text width (= vertical text run length)
    const naturalTextLength = measurer.offsetWidth;

    if (targetHeight <= 0 || naturalTextLength <= 0) return;

    const charCount = state.memoDate.length;

    if (naturalTextLength < targetHeight && charCount > 1) {
        // Need to spread: add letter-spacing to fill the gap
        const extraSpace = targetHeight - naturalTextLength;
        // letter-spacing adds space AFTER each char (including last), so divide by charCount
        const spacing = extraSpace / charCount;
        dateEl.style.letterSpacing = `${spacing}px`;
    } else if (naturalTextLength > targetHeight) {
        // Need to shrink font
        const ratio = targetHeight / naturalTextLength;
        const newSize = Math.max(0.6, ratio) * 1.1;
        dateEl.style.fontSize = `${newSize}rem`;
        // Re-measure and add spacing if now too short
        measurer.style.fontSize = `${newSize}rem`;
        const newLength = measurer.offsetWidth;
        if (newLength < targetHeight && charCount > 1) {
            const extra = targetHeight - newLength;
            dateEl.style.letterSpacing = `${extra / charCount}px`;
        }
    }
}

function buildCardHtml(num, card) {
    const bulletsHtml = card.bullets
        .filter(b => b.trim())
        .map(b => `<li>${escHtml(b)}</li>`)
        .join('');

    return `
        <div class="memo-card">
            ${card.isNew ? '<span class="memo-card-new">NIEUW</span>' : ''}
            <div class="memo-card-header">
                <span class="memo-card-number">${num}</span>
                <span class="memo-card-title">${escHtml(card.title)}</span>
                <span class="memo-card-date">${escHtml(card.date)}</span>
            </div>
            <div class="memo-card-body">
                <ul>${bulletsHtml}</ul>
            </div>
        </div>
    `;
}

// --- Editor actions ---
function updateMemoDate(val) {
    state.memoDate = val;
    renderPreview();
}

function updateCard(i, field, val) {
    state.cards[i][field] = val;
    renderPreview();
}

function updateBullets(i, val) {
    state.cards[i].bullets = val.split('\n');
    renderPreview();
}

function toggleNew(i, checked) {
    state.cards[i].isNew = checked;
    renderPreview();
}

function setFourthMode(mode) {
    state.fourthSlot.mode = mode;
    renderEditor();
    renderPreview();
}

function updateFourthUpdate(field, val) {
    state.fourthSlot.update[field] = val;
    renderPreview();
}

function updateFourthCard(field, val) {
    state.fourthSlot.card[field] = val;
    renderPreview();
}

function updateFourthBullets(val) {
    state.fourthSlot.card.bullets = val.split('\n');
    renderPreview();
}

function toggleNewFourth(checked) {
    state.fourthSlot.card.isNew = checked;
    renderPreview();
}

// --- Native export dimensions (must match deco.png) ---
const EXPORT_W = 1414;
const EXPORT_H = 2000;
const DISPLAY_W = 500;
const DISPLAY_H = Math.round(DISPLAY_W * (EXPORT_H / EXPORT_W)); // 707

// --- Auto-fit: shrink content if it overflows the fixed memo ---
function autoFitContent() {
    const content = document.querySelector('.memo-content');
    const memo = document.querySelector('.memo');
    const memoInner = document.querySelector('.memo-inner');
    if (!content || !memo || !memoInner) return;

    // Reset any previous scaling
    content.style.transform = '';
    content.style.transformOrigin = '';
    content.style.height = '';

    const memoHeight = memo.offsetHeight;
    const innerHeight = memoInner.scrollHeight;

    if (innerHeight > memoHeight) {
        // How much space the header + datum take (everything except .memo-content)
        const contentTop = content.offsetTop;
        const padding = 36; // bottom padding of memo-inner
        const availableForContent = memoHeight - contentTop - padding;
        const contentNaturalHeight = content.scrollHeight;

        if (contentNaturalHeight > availableForContent && contentNaturalHeight > 0) {
            const scale = Math.max(0.65, availableForContent / contentNaturalHeight);
            content.style.transform = `scale(${scale})`;
            content.style.transformOrigin = 'top left';
            // Set explicit height so parent clips correctly
            content.style.height = `${availableForContent}px`;
        }
    }
}

// --- Download ---
async function downloadMemo() {
    const memoEl = document.querySelector('.memo');
    const btn = el('download-btn');
    btn.textContent = 'Bezig...';
    btn.disabled = true;

    try {
        // Use the memo's actual rendered size and scale to exact export dimensions
        const renderedW = memoEl.offsetWidth;
        const renderedH = memoEl.offsetHeight;
        const exportScale = EXPORT_W / renderedW;

        const canvas = await html2canvas(memoEl, {
            scale: exportScale,
            useCORS: true,
            backgroundColor: '#001D48',
            width: renderedW,
            height: renderedH,
        });

        // Convert to JPEG with good quality (WhatsApp compresses anyway)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const link = document.createElement('a');
        const datePart = state.memoDate.trim() ? state.memoDate.replace(/\//g, '-') : 'geen-datum';
        link.download = `dodeka_memo_${datePart}.jpg`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error('Download failed:', err);
        alert('Download mislukt. Probeer het opnieuw.');
    } finally {
        btn.textContent = '⬇ Download als JPG';
        btn.disabled = false;
    }
}

function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderEditor();
    renderPreview();
});
