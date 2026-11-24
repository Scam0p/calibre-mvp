const $ = (id) => document.getElementById(id);
const storageKey = 'calibre-demo-v2';
const protocols = {
  caffeine: { name: 'Earlier caffeine cut-off', label: 'EARLIER CAFFEINE CUT-OFF', delta: 14, baseline: 420, verdict: 'PROMISING SIGNAL', note: 'In this sample scenario, an earlier caffeine cut-off is associated with 14 additional minutes of sleep.' },
  walk: { name: 'Evening walk', label: 'EVENING WALK', delta: 8, baseline: 420, verdict: 'EARLY SIGNAL', note: 'In this sample scenario, an evening walk is associated with 8 additional minutes of sleep.' },
  screen: { name: 'Screen-off before bed', label: 'SCREEN-OFF BEFORE BED', delta: 5, baseline: 420, verdict: 'INCONCLUSIVE', note: 'This sample scenario shows a small difference. It is not enough to support a confident conclusion.' }
};
const defaults = { runs: 3, score: 78, streak: 3, selected: 'caffeine', entries: [] };
let state;
try { state = { ...defaults, ...(JSON.parse(localStorage.getItem(storageKey) || 'null') || {}) }; }
catch { state = { ...defaults }; }
let selected = state.selected in protocols ? state.selected : 'caffeine';

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify({ ...state, selected })); }
  catch { showToast('Browser storage is unavailable. Your changes may not persist.'); }
}
function showToast(message) {
  const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}
function render() {
  $('experimentsRun').textContent = String(state.runs).padStart(2, '0');
  $('calibrationScore').textContent = state.score;
  $('streakCount').textContent = `${String(state.streak).padStart(2, '0')} day streak`;
  const progress = Math.min(100, state.runs / 5 * 100);
  $('experimentProgress').style.width = `${progress}%`;
  $('goalText').textContent = `${Math.min(state.runs, 5)} of 5`;
  $('journeyCount').textContent = `${Math.min(state.runs, 5)} / 5`;
  $('journeyBar').style.width = `${progress}%`;
  const markers = Math.min(7, state.runs);
  $('markerText').textContent = `${markers} / 7`;
  $('momentumValue').textContent = state.runs >= 5 ? 'Steady' : 'Building';
  document.querySelectorAll('.momentum-dots i').forEach((dot, i) => dot.classList.toggle('done', i < markers));
  const next = $('nextMilestone');
  if (state.runs >= 5) {
    next.classList.add('complete'); next.querySelector('.milestone-icon').textContent = '✓';
    next.querySelector('.milestone-state').textContent = 'UNLOCKED';
    next.querySelector('strong').textContent = 'Evidence builder';
  }
  renderLedger();
}
function renderLedger() {
  const ledger = $('ledger');
  ledger.querySelectorAll('.ledger-row:not(.ledger-header)').forEach(row => row.remove());
  const samples = [
    { belief: 'Caffeine affects my sleep', confidence: 70, observation: '+14 min', detail: 'Sample observation', status: 'Signal', tone: 'positive' },
    { belief: 'A walk helps me unwind', confidence: 60, observation: '+8 min', detail: 'Sample observation', status: 'Signal', tone: 'positive' },
    { belief: 'Screens delay my sleep', confidence: 80, observation: 'Unclear', detail: 'Sample observation', status: 'Unclear', tone: 'neutral' }
  ];
  const entries = [...state.entries, ...samples].slice(0, 5);
  entries.forEach(entry => {
    const row = document.createElement('div'); row.className = 'ledger-row';
    const belief = document.createElement('span');
    const beliefStrong = document.createElement('strong'); beliefStrong.textContent = entry.belief || entry.name;
    const beliefSmall = document.createElement('small'); beliefSmall.textContent = `${entry.confidence}% confidence`;
    belief.append(beliefStrong, beliefSmall);
    const observation = document.createElement('span');
    const observationStrong = document.createElement('strong'); observationStrong.textContent = entry.observation || `+${entry.outcome} min`;
    const observationSmall = document.createElement('small'); observationSmall.textContent = entry.detail || 'Synthetic observation';
    observation.append(observationStrong, observationSmall);
    const status = document.createElement('span'); status.className = `readout ${entry.tone || (entry.verdict === 'INCONCLUSIVE' ? 'neutral' : 'positive')}`; status.textContent = entry.status || (entry.verdict === 'INCONCLUSIVE' ? 'Unclear' : 'Signal');
    row.append(belief, observation, status); ledger.append(row);
  });
}
function selectProtocol(key) {
  if (!(key in protocols)) return;
  selected = key;
  document.querySelectorAll('.protocol-option').forEach(button => button.classList.toggle('selected', button.dataset.protocol === key));
  state.selected = key; persist();
}
$('belief').addEventListener('input', event => { $('beliefValue').innerHTML = `${event.target.value}<span>%</span>`; });
document.querySelectorAll('.protocol-option').forEach(button => button.addEventListener('click', () => selectProtocol(button.dataset.protocol)));
$('runExperiment').addEventListener('click', () => {
  const protocol = protocols[selected];
  const confidence = Number($('belief').value);
  // The result is deterministic synthetic demo data, not a measurement or causal estimate.
  const observedPositive = protocol.delta > 0;
  const brier = Math.pow(confidence / 100 - (observedPositive ? 1 : 0), 2);
  const calibration = Math.round((1 - brier) * 100);
  state.runs += 1;
  state.score = Math.round((state.score * (state.runs - 1) + calibration) / state.runs);
  state.entries.unshift({ name: protocol.name, belief: confidence, confidence, outcome: protocol.delta, observation: protocol.verdict === 'INCONCLUSIVE' ? 'Unclear' : `+${protocol.delta} min`, detail: 'Synthetic observation', verdict: protocol.verdict, status: protocol.verdict === 'INCONCLUSIVE' ? 'Unclear' : 'Signal', tone: protocol.verdict === 'INCONCLUSIVE' ? 'neutral' : 'positive' });
  state.entries = state.entries.slice(0, 5);
  persist(); render();
  $('revealProtocol').textContent = protocol.label;
  $('revealNumber').textContent = protocol.verdict === 'INCONCLUSIVE' ? '+5' : `+${protocol.delta}`;
  $('revealText').textContent = protocol.note;
  $('baselineValue').textContent = protocol.baseline;
  $('testValue').textContent = protocol.baseline + protocol.delta;
  $('testBar').style.width = `${Math.min(95, 68 + protocol.delta * .45)}%`;
  const pill = $('verdictPill');
  pill.innerHTML = `<i></i> ${protocol.verdict}`;
  pill.style.background = protocol.verdict === 'INCONCLUSIVE' ? '#fff3e8' : '#edf5ef';
  pill.style.color = protocol.verdict === 'INCONCLUSIVE' ? '#a96f3d' : '#34795b';
  pill.querySelector('i').style.background = protocol.verdict === 'INCONCLUSIVE' ? '#c58a50' : '#4b9873';
  showToast('Sample experiment added to your local belief ledger.');
});
const date = new Date();
$('todayLabel').textContent = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase() + ' · YOUR PERSONAL LAB';
// Keep the selected protocol and demo state in sync after reload.
selectProtocol(selected);
render();
