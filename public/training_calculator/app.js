// Sprint Training Calculator JavaScript

// Data from provided JSON
const percentages = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7];
const percentageLabels = ['100%', '95%', '90%', '85%', '80%', '75%', '70%'];

const conversionTables = {
    "100m": {
        "10.0": [10.0, 10.52631579, 11.11111111, 11.76470588, 12.5, 13.33333333, 14.28571429],
        "10.5": [10.5, 11.05263158, 11.66666667, 12.35294118, 13.125, 14.0, 15.0],
        "11.0": [11.0, 11.57894737, 12.22222222, 12.94117647, 13.75, 14.66666667, 15.71428571],
        "11.5": [11.5, 12.10526316, 12.77777778, 13.52941176, 14.375, 15.33333333, 16.42857143],
        "12.0": [12.0, 12.63157895, 13.33333333, 14.11764706, 15.0, 16.0, 17.14285714],
        "12.5": [12.5, 13.15789474, 13.88888889, 14.70588235, 15.625, 16.66666667, 17.85714286],
        "13.0": [13.0, 13.68421053, 14.44444444, 15.29411765, 16.25, 17.33333333, 18.57142857],
        "13.5": [13.5, 14.21052632, 15.0, 15.88235294, 16.875, 18.0, 19.28571429],
        "14.0": [14.0, 14.73684211, 15.55555556, 16.47058824, 17.5, 18.66666667, 20.0],
        "14.5": [14.5, 15.26315789, 16.11111111, 17.05882353, 18.125, 19.33333333, 20.71428571],
        "15.0": [15.0, 15.78947368, 16.66666667, 17.64705882, 18.75, 20.0, 21.42857143],
        "15.5": [15.5, 16.31578947, 17.22222222, 18.23529412, 19.375, 20.66666667, 22.14285714],
        "16.0": [16.0, 16.84210526, 17.77777778, 18.82352941, 20.0, 21.33333333, 22.85714286],
        "16.5": [16.5, 17.36842105, 18.33333333, 19.41176471, 20.625, 22.0, 23.57142857],
        "17.0": [17.0, 17.89473684, 18.88888889, 20.0, 21.25, 22.66666667, 24.28571429]
    },
    "200m": {
        "20.0": [20.0, 21.05263158, 22.22222222, 23.52941176, 25.0, 26.66666667, 28.57142857],
        "21.0": [21.0, 22.10526316, 23.33333333, 24.70588235, 26.25, 28.0, 30.0],
        "22.0": [22.0, 23.15789474, 24.44444444, 25.88235294, 27.5, 29.33333333, 31.42857143],
        "23.0": [23.0, 24.21052632, 25.55555556, 27.05882353, 28.75, 30.66666667, 32.85714286],
        "24.0": [24.0, 25.26315789, 26.66666667, 28.23529412, 30.0, 32.0, 34.28571429],
        "25.0": [25.0, 26.31578947, 27.77777778, 29.41176471, 31.25, 33.33333333, 35.71428571],
        "26.0": [26.0, 27.36842105, 28.88888889, 30.58823529, 32.5, 34.66666667, 37.14285714],
        "27.0": [27.0, 28.42105263, 30.0, 31.76470588, 33.75, 36.0, 38.57142857],
        "28.0": [28.0, 29.47368421, 31.11111111, 32.94117647, 35.0, 37.33333333, 40.0],
        "29.0": [29.0, 30.52631579, 32.22222222, 34.11764706, 36.25, 38.66666667, 41.42857143],
        "30.0": [30.0, 31.57894737, 33.33333333, 35.29411765, 37.5, 40.0, 42.85714286],
        "31.0": [31.0, 32.63157895, 34.44444444, 36.47058824, 38.75, 41.33333333, 44.28571429],
        "32.0": [32.0, 33.68421053, 35.55555556, 37.64705882, 40.0, 42.66666667, 45.71428571]
    },
    "400m": {
        "50.0": [50.0, 52.63157895, 55.55555556, 58.82352941, 62.5, 66.66666667, 71.42857143],
        "52.0": [52.0, 54.73684211, 57.77777778, 61.17647059, 65.0, 69.33333333, 74.28571429],
        "54.0": [54.0, 56.84210526, 60.0, 63.52941176, 67.5, 72.0, 77.14285714],
        "56.0": [56.0, 58.94736842, 62.22222222, 65.88235294, 70.0, 74.66666667, 80.0],
        "58.0": [58.0, 61.05263158, 64.44444444, 68.23529412, 72.5, 77.33333333, 82.85714286],
        "60.0": [60.0, 63.15789474, 66.66666667, 70.58823529, 75.0, 80.0, 85.71428571],
        "62.0": [62.0, 65.26315789, 68.88888889, 72.94117647, 77.5, 82.66666667, 88.57142857],
        "64.0": [64.0, 67.36842105, 71.11111111, 75.29411765, 80.0, 85.33333333, 91.42857143],
        "66.0": [66.0, 69.47368421, 73.33333333, 77.64705882, 82.5, 88.0, 94.28571429],
        "68.0": [68.0, 71.57894737, 75.55555556, 80.0, 85.0, 90.66666667, 97.14285714],
        "70.0": [70.0, 73.68421053, 77.77777778, 82.35294118, 87.5, 93.33333333, 100.0],
        "72.0": [72.0, 75.78947368, 80.0, 84.70588235, 90.0, 96.0, 102.8571429],
        "74.0": [74.0, 77.89473684, 82.22222222, 87.05882353, 92.5, 98.66666667, 105.7142857],
        "76.0": [76.0, 80.0, 84.44444444, 89.41176471, 95.0, 101.3333333, 108.5714286],
        "78.0": [78.0, 82.10526316, 86.66666667, 91.76470588, 97.5, 104.0, 111.4285714],
        "80.0": [80.0, 84.21052632, 88.88888889, 94.11764706, 100.0, 106.6666667, 114.2857143]
    }
};

const defaultPRs = {
    "60m": 7.6,
    "100m": 12.04,
    "200m": 24.16,
    "400m": 58.04
};

const distances = ["60m", "80m", "100m", "120m", "150m", "180m", "200m", "250m", "300m", "400m"];
const percentagesList = [100, 95, 90, 85, 80, 75, 70];
const durationsList = [20, 25, 30, 35, 40, 45, 50, 55, 60];

let currentTrainingMode = 'distance';

let trainingRuns = [
    { "id": 1, "distance": "100m", "customDistance": "", "percentage": 85, "customPercentage": "" },
    { "id": 2, "distance": "120m", "customDistance": "", "percentage": 90, "customPercentage": "" },
    { "id": 3, "distance": "150m", "customDistance": "", "percentage": 95, "customPercentage": "" }
];

let durationRuns = [
    { "id": 1, "duration": 20, "customDuration": "", "percentage": 85, "customPercentage": "" },
    { "id": 2, "duration": 25, "customDuration": "", "percentage": 90, "customPercentage": "" },
    { "id": 3, "duration": 30, "customDuration": "", "percentage": 95, "customPercentage": "" }
];

let runCounter = 6;
let durationRunCounter = 4;

// Utility functions
function interpolate(x, x1, y1, x2, y2) {
    return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
}

function calculateTimeForDistance(targetDistance, pr100m, pr200m, pr400m) {
    // Use power law interpolation/extrapolation between known distances
    if (targetDistance <= 60) {
        const ratio = Math.pow(targetDistance / 100, 0.9);
        return pr100m * ratio;
    } else if (targetDistance <= 100) {
        const pr60m = pr100m * Math.pow(60 / 100, 0.9);
        return interpolate(targetDistance, 60, pr60m, 100, pr100m);
    } else if (targetDistance <= 200) {
        return interpolate(targetDistance, 100, pr100m, 200, pr200m);
    } else if (targetDistance <= 400) {
        return interpolate(targetDistance, 200, pr200m, 400, pr400m);
    } else {
        const ratio = Math.pow(targetDistance / 400, 1.1);
        return pr400m * ratio;
    }
}

function findNearestTableValues(distance, time) {
    const table = conversionTables[distance];
    if (!table) return null;

    const times = Object.keys(table).map(parseFloat).sort((a, b) => a - b);
    const roundedTime = Math.round(time * 2) / 2;
    const exactKey = roundedTime.toFixed(1);

    if (table[exactKey]) {
        return table[exactKey];
    }

    let lowerTime = null, upperTime = null;
    for (let i = 0; i < times.length - 1; i++) {
        if (time >= times[i] && time <= times[i + 1]) {
            lowerTime = times[i];
            upperTime = times[i + 1];
            break;
        }
    }

    if (lowerTime !== null && upperTime !== null) {
        const lowerKey = lowerTime.toFixed(1);
        const upperKey = upperTime.toFixed(1);
        const lowerValues = table[lowerKey];
        const upperValues = table[upperKey];

        if (lowerValues && upperValues) {
            return lowerValues.map((val, idx) =>
                interpolate(time, lowerTime, val, upperTime, upperValues[idx])
            );
        }
    }

    if (time < times[0]) {
        const ratio = time / times[0];
        const firstKey = times[0].toFixed(1);
        return table[firstKey].map(val => val * ratio);
    } else if (time > times[times.length - 1]) {
        const ratio = time / times[times.length - 1];
        const lastKey = times[times.length - 1].toFixed(1);
        return table[lastKey].map(val => val * ratio);
    }

    return percentages.map(p => time / p);
}

function calculateDistanceForDuration(targetDuration, pr100m, pr200m, pr400m) {
    // Estimate distance based on duration and PRs
    // This uses a simplified model where we interpolate between known PR times

    if (targetDuration <= pr100m) {
        // For very short durations, estimate based on 100m PR
        return 100 * (targetDuration / pr100m);
    } else if (targetDuration <= pr200m) {
        // Between 100m and 200m PR times
        return interpolate(targetDuration, pr100m, 100, pr200m, 200);
    } else if (targetDuration <= pr400m) {
        // Between 200m and 400m PR times
        return interpolate(targetDuration, pr200m, 200, pr400m, 400);
    } else {
        // For longer durations, extrapolate beyond 400m
        const ratio = targetDuration / pr400m;
        return 400 * Math.pow(ratio, 0.9); // Slightly sublinear scaling
    }
}

// Training mode management
function switchTrainingMode(mode) {
    currentTrainingMode = mode;

    // Update toggle buttons
    document.getElementById('distance-mode-btn').classList.toggle('active', mode === 'distance');
    document.getElementById('duration-mode-btn').classList.toggle('active', mode === 'duration');

    // Show/hide content
    document.getElementById('distance-mode').classList.toggle('hidden', mode !== 'distance');
    document.getElementById('duration-mode').classList.toggle('hidden', mode !== 'duration');

    // Update table headers
    updateTableHeaders();

    // Update overview
    updateSchemaOverview();
}

function updateTableHeaders() {
    const thead = document.getElementById('schema-table-head');
    if (currentTrainingMode === 'distance') {
        thead.innerHTML = `
            <tr>
                <th>Loopje</th>
                <th>Afstand</th>
                <th>Intensiteit</th>
                <th>Doeltijd</th>
            </tr>
        `;
    } else {
        thead.innerHTML = `
            <tr>
                <th>Loopje</th>
                <th>Duur</th>
                <th>Intensiteit</th>
                <th>Geschatte Afstand</th>
            </tr>
        `;
    }
}

// Training runs management
function addTrainingRun() {
    const newRun = {
        "id": runCounter++,
        "distance": "100m",
        "customDistance": "",
        "percentage": 85,
        "customPercentage": ""
    };
    trainingRuns.push(newRun);
    renderTrainingRuns();
    updateSchemaOverview();
}

function deleteTrainingRun(id) {
    trainingRuns = trainingRuns.filter(run => run.id !== id);
    renderTrainingRuns();
    updateSchemaOverview();
}

function renderTrainingRuns() {
    const container = document.getElementById('training-runs');
    container.innerHTML = '';

    trainingRuns.forEach((run, index) => {
        const row = document.createElement('tr');
        row.className = 'training-run-row';

        const distanceCell = run.distance ? 
            `<select class="form-control-compact" onchange="updateRunDistance(${run.id}, this.value)">
                <option value="">Aangepast...</option>
                ${distances.map(d => `<option value="${d}" ${run.distance === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>` :
            `<div class="input-group-compact">
                <select class="form-control-compact" onchange="updateRunDistance(${run.id}, this.value)">
                    <option value="" selected>Aangepast...</option>
                    ${distances.map(d => `<option value="${d}">${d}</option>`).join('')}
                </select>
                <input type="number" class="form-control-compact" min="60" max="400" 
                       value="${run.customDistance}" placeholder="meter"
                       onchange="updateRunCustomDistance(${run.id}, this.value)">
            </div>`;

        const percentageCell = run.percentage ? 
            `<select class="form-control-compact" onchange="updateRunPercentage(${run.id}, this.value)">
                <option value="">Aangepast...</option>
                ${percentagesList.map(p => `<option value="${p}" ${run.percentage === p ? 'selected' : ''}>${p}%</option>`).join('')}
            </select>` :
            `<div class="input-group-compact">
                <select class="form-control-compact" onchange="updateRunPercentage(${run.id}, this.value)">
                    <option value="" selected>Aangepast...</option>
                    ${percentagesList.map(p => `<option value="${p}">${p}%</option>`).join('')}
                </select>
                <input type="number" class="form-control-compact" min="50" max="100" 
                       value="${run.customPercentage}" placeholder="%"
                       onchange="updateRunCustomPercentage(${run.id}, this.value)">
            </div>`;

        row.innerHTML = `
            <td>Loopje ${index + 1}</td>
            <td>${distanceCell}</td>
            <td>${percentageCell}</td>
            <td>
                <button class="btn-compact btn-danger" onclick="deleteTrainingRun(${run.id})" title="Verwijderen">
                    ×
                </button>
            </td>
        `;

        container.appendChild(row);
    });
}

function updateRunDistance(id, value) {
    const run = trainingRuns.find(r => r.id === id);
    if (run) {
        run.distance = value;
        if (value) run.customDistance = "";
        renderTrainingRuns();
        updateSchemaOverview();
    }
}

function updateRunCustomDistance(id, value) {
    const run = trainingRuns.find(r => r.id === id);
    if (run) {
        run.customDistance = value;
        if (value) run.distance = "";
        renderTrainingRuns();
        updateSchemaOverview();
    }
}

function updateRunPercentage(id, value) {
    const run = trainingRuns.find(r => r.id === id);
    if (run) {
        run.percentage = parseInt(value);
        if (value) run.customPercentage = "";
        renderTrainingRuns();
        updateSchemaOverview();
    }
}

function updateRunCustomPercentage(id, value) {
    const run = trainingRuns.find(r => r.id === id);
    if (run) {
        run.customPercentage = value;
        if (value) run.percentage = "";
        renderTrainingRuns();
        updateSchemaOverview();
    }
}

// Duration runs management
function addDurationRun() {
    const newRun = {
        "id": durationRunCounter++,
        "duration": 20,
        "customDuration": "",
        "percentage": 85,
        "customPercentage": ""
    };
    durationRuns.push(newRun);
    renderDurationRuns();
    updateSchemaOverview();
}

function deleteDurationRun(id) {
    durationRuns = durationRuns.filter(run => run.id !== id);
    renderDurationRuns();
    updateSchemaOverview();
}

function renderDurationRuns() {
    const container = document.getElementById('duration-runs');
    container.innerHTML = '';

    durationRuns.forEach((run, index) => {
        const row = document.createElement('tr');
        row.className = 'training-run-row';

        const durationCell = run.duration ? 
            `<select class="form-control-compact" onchange="updateDurationRunDuration(${run.id}, this.value)">
                <option value="">Aangepast...</option>
                ${durationsList.map(d => `<option value="${d}" ${run.duration === d ? 'selected' : ''}>${d}s</option>`).join('')}
            </select>` :
            `<div class="input-group-compact">
                <select class="form-control-compact" onchange="updateDurationRunDuration(${run.id}, this.value)">
                    <option value="" selected>Aangepast...</option>
                    ${durationsList.map(d => `<option value="${d}">${d}s</option>`).join('')}
                </select>
                <input type="number" class="form-control-compact" min="15" max="120" 
                       value="${run.customDuration}" placeholder="sec"
                       onchange="updateDurationRunCustomDuration(${run.id}, this.value)">
            </div>`;

        const percentageCell = run.percentage ? 
            `<select class="form-control-compact" onchange="updateDurationRunPercentage(${run.id}, this.value)">
                <option value="">Aangepast...</option>
                ${percentagesList.map(p => `<option value="${p}" ${run.percentage === p ? 'selected' : ''}>${p}%</option>`).join('')}
            </select>` :
            `<div class="input-group-compact">
                <select class="form-control-compact" onchange="updateDurationRunPercentage(${run.id}, this.value)">
                    <option value="" selected>Aangepast...</option>
                    ${percentagesList.map(p => `<option value="${p}">${p}%</option>`).join('')}
                </select>
                <input type="number" class="form-control-compact" min="50" max="100" 
                       value="${run.customPercentage}" placeholder="%"
                       onchange="updateDurationRunCustomPercentage(${run.id}, this.value)">
            </div>`;

        row.innerHTML = `
            <td>Loopje ${index + 1}</td>
            <td>${durationCell}</td>
            <td>${percentageCell}</td>
            <td>
                <button class="btn-compact btn-danger" onclick="deleteDurationRun(${run.id})" title="Verwijderen">
                    ×
                </button>
            </td>
        `;

        container.appendChild(row);
    });
}

function updateDurationRunDuration(id, value) {
    const run = durationRuns.find(r => r.id === id);
    if (run) {
        run.duration = parseInt(value);
        if (value) run.customDuration = "";
        renderDurationRuns();
        updateSchemaOverview();
    }
}

function updateDurationRunCustomDuration(id, value) {
    const run = durationRuns.find(r => r.id === id);
    if (run) {
        run.customDuration = value;
        if (value) run.duration = "";
        renderDurationRuns();
        updateSchemaOverview();
    }
}

function updateDurationRunPercentage(id, value) {
    const run = durationRuns.find(r => r.id === id);
    if (run) {
        run.percentage = parseInt(value);
        if (value) run.customPercentage = "";
        renderDurationRuns();
        updateSchemaOverview();
    }
}

function updateDurationRunCustomPercentage(id, value) {
    const run = durationRuns.find(r => r.id === id);
    if (run) {
        run.customPercentage = value;
        if (value) run.percentage = "";
        renderDurationRuns();
        updateSchemaOverview();
    }
}

// Schema overview
function updateSchemaOverview() {
    const pr100m = parseFloat(document.getElementById('pr-100m').value);
    const pr200m = parseFloat(document.getElementById('pr-200m').value);
    const pr400m = parseFloat(document.getElementById('pr-400m').value);

    if (isNaN(pr100m) || isNaN(pr200m) || isNaN(pr400m)) return;

    const tbody = document.getElementById('schema-overview-body');
    tbody.innerHTML = '';

    if (currentTrainingMode === 'distance') {
        trainingRuns.forEach((run, index) => {
            const distance = run.distance ? parseInt(run.distance) : parseInt(run.customDistance);
            const percentage = run.percentage ? run.percentage / 100 : parseFloat(run.customPercentage) / 100;
            const distanceDisplay = run.distance || `${run.customDistance}m`;
            const percentageDisplay = run.percentage ? `${run.percentage}%` : `${run.customPercentage}%`;

            if (distance && percentage) {
                const baseTime = calculateTimeForDistance(distance, pr100m, pr200m, pr400m);
                const targetTime = baseTime / percentage;

                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>Loopje ${index + 1}</td>
                    <td>${distanceDisplay}</td>
                    <td>${percentageDisplay}</td>
                    <td class="target-time">${targetTime.toFixed(2)}s</td>
                `;

                tbody.appendChild(row);
            }
        });
    } else {
        durationRuns.forEach((run, index) => {
            const duration = run.duration ? run.duration : parseFloat(run.customDuration);
            const percentage = run.percentage ? run.percentage / 100 : parseFloat(run.customPercentage) / 100;
            const durationDisplay = run.duration ? `${run.duration}s` : `${run.customDuration}s`;
            const percentageDisplay = run.percentage ? `${run.percentage}%` : `${run.customPercentage}%`;

            if (duration && percentage) {
                // Calculate the target duration at the specified percentage
                const targetDuration = duration / percentage;

                // Estimate the distance they would cover in that time
                const estimatedDistance = calculateDistanceForDuration(targetDuration, pr100m, pr200m, pr400m);

                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>Loopje ${index + 1}</td>
                    <td>${durationDisplay}</td>
                    <td>${percentageDisplay}</td>
                    <td class="target-distance">${Math.round(estimatedDistance)}m</td>
                `;

                tbody.appendChild(row);
            }
        });
    }
}

// Conversion calculator
function toggleConversion() {
    const content = document.getElementById('conversion-content');
    const toggle = document.getElementById('conversion-toggle');
    const header = document.querySelector('.conversion-header');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        content.classList.add('visible');
        toggle.textContent = '▲';
        header.classList.add('expanded');
    } else {
        content.classList.remove('visible');
        content.classList.add('hidden');
        toggle.textContent = '▼';
        header.classList.remove('expanded');
    }
}

function updateConversionResult() {
    const baseDistance = document.getElementById('base-distance').value;
    const yourTime = parseFloat(document.getElementById('your-time').value);
    const targetDistance = parseInt(document.getElementById('target-distance').value);
    const targetPercentage = parseInt(document.getElementById('target-percentage').value);

    if (!yourTime || !targetDistance || !targetPercentage) return;

    const pr100m = parseFloat(document.getElementById('pr-100m').value);
    const pr200m = parseFloat(document.getElementById('pr-200m').value);
    const pr400m = parseFloat(document.getElementById('pr-400m').value);

    // Calculate expected time for target distance at 100%
    const expectedTime = calculateTimeForDistance(targetDistance, pr100m, pr200m, pr400m);

    // Apply percentage
    const resultTime = expectedTime / (targetPercentage / 100);

    const resultDiv = document.getElementById('conversion-result');
    resultDiv.innerHTML = `
        <h3>Resultaat</h3>
        <div class="result-time">${resultTime.toFixed(2)}s</div>
        <div class="result-explanation">
            Voor ${targetDistance}m op ${targetPercentage}% intensiteit
        </div>
    `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize training runs
    renderTrainingRuns();
    renderDurationRuns();
    updateTableHeaders();

    // PR inputs event listeners
    ['pr-60m', 'pr-100m', 'pr-200m', 'pr-400m'].forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', updateSchemaOverview);
        input.addEventListener('change', updateSchemaOverview);
    });

    // Conversion calculator event listeners
    document.getElementById('base-distance').addEventListener('change', function () {
        const distance = this.value;
        const timeInput = document.getElementById('your-time');

        switch (distance) {
            case '60m':
                timeInput.value = document.getElementById('pr-60m').value;
                break;
            case '100m':
                timeInput.value = document.getElementById('pr-100m').value;
                break;
            case '200m':
                timeInput.value = document.getElementById('pr-200m').value;
                break;
            case '400m':
                timeInput.value = document.getElementById('pr-400m').value;
                break;
        }
        updateConversionResult();
    });

    ['your-time', 'target-distance', 'target-percentage'].forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', updateConversionResult);
        element.addEventListener('change', updateConversionResult);
    });

    // Initial calculations
    updateSchemaOverview();
    updateConversionResult();
});