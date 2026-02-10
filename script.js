import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: 'AIzaSyCiRRjPQS2moa-QV_tMZSaMOZaGH8yGdb8',
  authDomain: 'trackers-65d3e.firebaseapp.com',
  projectId: 'trackers-65d3e',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= LOADER ================= */

const loader = document.createElement('div');
loader.className =
  'fixed inset-0 bg-black/40 z-[9999] hidden flex items-center justify-center';
loader.innerHTML = `
  <div class="h-12 w-12 rounded-full border-4 border-slate-300 border-t-indigo-600 animate-spin"></div>
`;
document.body.appendChild(loader);

const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () =>
  requestAnimationFrame(() => loader.classList.add('hidden'));

/* ================= DOM ================= */

const datePicker = document.querySelector('.datePicker');
const habitListWrapper = document.querySelector('.habitListWrapper');
const openNewHabitForm = document.querySelector('.openNewHabitForm');
const newHabitBox = document.querySelector('.newHabitBox');
const cancelNewHabitButton = document.querySelector('.cancelNewHabitButton');
const createNewHabitButton = document.querySelector('.createNewHabitButton');
const newHabitName = document.querySelector('.newHabitName');
const newHabitType = document.querySelector('.newHabitType');

datePicker.value = new Date().toISOString().split('T')[0];

/* ================= OVERLAY ================= */

const overlay = document.createElement('div');
overlay.className =
  'fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center';

overlay.innerHTML = `
  <div class="bg-white w-full h-full max-w-5xl p-6 overflow-y-auto relative">
    <button class="closeOverlay absolute top-4 right-4 text-xl">✕</button>

    <h2 class="overlayTitle text-2xl font-bold mb-4"></h2>

    <!-- Month & Year only -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <input type="month" class="statsMonth border p-2 rounded-lg w-full" />
      <select class="statsYear border p-2 rounded-lg w-full"></select>
    </div>

    <div class="border-2 border-slate-300 rounded-lg p-4">
      <canvas id="habitChart" height="260"></canvas>
    </div>

    <div class="overlaySummary mt-4 font-bold"></div>
    <div class="statsBreakdown mt-4 grid grid-cols-2 gap-3 text-sm font-bold"></div>

    <button
      class="deleteHabit mt-6 bg-red-600 text-white font-bold uppercase w-full py-3 rounded-lg"
    >
      Delete Habit
    </button>
  </div>
`;

document.body.appendChild(overlay);
overlay.querySelector('.closeOverlay').onclick = () =>
  overlay.classList.add('hidden');

let activeChart = null;

/* ================= HELPERS ================= */

function getDaysInRange(start, end) {
  const days = [];
  let d = new Date(start);
  const last = new Date(end);
  while (d <= last) {
    days.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function getMonthRange(year, month, isCurrentMonth) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;

  let end;
  if (isCurrentMonth) {
    end = new Date().toISOString().split('T')[0];
  } else {
    end = new Date(year, month, 0).toISOString().split('T')[0];
  }

  return { start, end };
}

/* ================= UI ================= */

openNewHabitForm.onclick = () => newHabitBox.classList.remove('hidden');
cancelNewHabitButton.onclick = () => newHabitBox.classList.add('hidden');

/* ================= ADD HABIT ================= */

createNewHabitButton.onclick = async () => {
  const name = newHabitName.value.trim();
  const type = newHabitType.value;
  if (!name || type === 'select') return alert('Invalid input');

  showLoader();
  try {
    await addDoc(collection(db, 'trackers'), {
      habitName: name,
      habitType: type,
      createdOn: serverTimestamp(),
    });
    newHabitName.value = '';
    newHabitType.selectedIndex = 0;
    newHabitBox.classList.add('hidden');
  } finally {
    hideLoader();
  }
};

/* ================= TEMPLATES ================= */

const typeNumber = `
<div class="habitUpdater flex gap-x-4 font-bold">
  <div class="habitAction bg-slate-800 text-white p-2 rounded-lg w-full text-center" data-action="add">Add</div>
  <div class="habitAction bg-slate-200 p-2 rounded-lg w-full text-center" data-action="reduce">Reduce</div>
</div>
`;

const typeText = `
<div class="habitUpdater flex gap-x-4 font-bold">
  <div class="habitAction bg-slate-800 text-white p-2 rounded-lg w-full text-center" data-action="yes">Yes</div>
  <div class="habitAction bg-slate-200 p-2 rounded-lg w-full text-center" data-action="no">No</div>
</div>
`;

/* ================= RENDER HABIT ================= */

function renderHabit(docSnap) {
  const h = docSnap.data();
  const div = document.createElement('div');

  div.className =
    'habitBox bg-slate-100 shadow-2xl rounded-lg px-4 py-10 flex flex-col gap-y-3';
  div.dataset.id = docSnap.id;
  div.dataset.type = h.habitType;

  div.innerHTML = `
    <div class="flex justify-between font-bold">
      <span class="uppercase">${h.habitName}</span>
      <span class="currentState">-</span>
    </div>
    ${h.habitType === 'count' ? typeNumber : typeText}
    <button class="openStats font-bold uppercase text-indigo-600 text-sm text-right">
      Stats
    </button>
  `;

  habitListWrapper.appendChild(div);
}

/* ================= LOAD DAILY ================= */

async function loadHabitForDate(id, type, el) {
  const snap = await getDoc(doc(db, 'trackers', id, 'logs', datePicker.value));
  el.querySelector('.currentState').innerText = snap.exists()
    ? snap.data().value
    : type === 'count'
    ? '0'
    : '-';
}

/* ================= ACTIONS ================= */

function attachActions() {
  document.querySelectorAll('.habitAction').forEach((btn) => {
    btn.onclick = async () => {
      showLoader();

      const box = btn.closest('.habitBox');
      const id = box.dataset.id;
      const type = box.dataset.type;
      const stateEl = box.querySelector('.currentState');

      let val;
      if (type === 'count') {
        const cur = Number(stateEl.innerText) || 0;
        val = btn.dataset.action === 'add' ? cur + 1 : Math.max(0, cur - 1);
      } else {
        val = btn.dataset.action === 'yes' ? 'Yes' : 'No';
      }

      await setDoc(doc(db, 'trackers', id, 'logs', datePicker.value), {
        value: val,
        updatedOn: serverTimestamp(),
      });

      stateEl.innerText = val;
      hideLoader();
    };
  });

  document.querySelectorAll('.openStats').forEach((btn) => {
    btn.onclick = () => openOverlay(btn.closest('.habitBox'));
  });
}

/* ================= STATS OVERLAY ================= */

async function openOverlay(box) {
  showLoader();
  overlay.classList.remove('hidden');

  const habitId = box.dataset.id;
  const habitType = box.dataset.type;
  const title = box.querySelector('span').innerText;

  overlay.querySelector('.overlayTitle').innerText = title;

  const monthInput = overlay.querySelector('.statsMonth');
  const yearSelect = overlay.querySelector('.statsYear');
  const breakdownEl = overlay.querySelector('.statsBreakdown');

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  monthInput.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  yearSelect.innerHTML = '';
  for (let y = currentYear; y >= currentYear - 5; y--) {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  }
  yearSelect.value = currentYear;

  const logsSnap = await getDocs(collection(db, 'trackers', habitId, 'logs'));
  const allLogs = {};
  logsSnap.forEach((d) => (allLogs[d.id] = d.data().value));

  function render() {
    const [yy, mm] = monthInput.value.split('-').map(Number);
    const isCurrent = yy === currentYear && mm === currentMonth;

    const { start, end } = getMonthRange(yy, mm, isCurrent);
    const days = getDaysInRange(start, end);

    const labels = [];
    const values = [];

    let yes = 0,
      no = 0,
      total = 0,
      active = 0;

    days.forEach((day) => {
      const v = allLogs[day];
      if (v === undefined) return;

      labels.push(day.slice(8));
      active++;

      if (habitType === 'count') {
        values.push(Number(v));
        total += Number(v);
      } else {
        values.push(v === 'Yes' ? 1 : 0);
        if (v === 'Yes') yes++;
        if (v === 'No') no++;
      }
    });

    if (activeChart) activeChart.destroy();

    activeChart = new Chart(document.getElementById('habitChart'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: title,
            data: values,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79,70,229,0.15)',
            tension: 0.35,
            fill: true,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    const missed = days.length - active;

    breakdownEl.innerHTML =
      habitType === 'text'
        ? `
          <div class="bg-green-100 p-3 rounded">Yes: ${yes}</div>
          <div class="bg-red-100 p-3 rounded">No: ${no}</div>
          <div class="bg-slate-100 p-3 rounded col-span-2">Missed: ${missed}</div>
        `
        : `
          <div class="bg-indigo-100 p-3 rounded">Total: ${total}</div>
          <div class="bg-slate-100 p-3 rounded">Days: ${active}</div>
          <div class="bg-slate-100 p-3 rounded">Avg: ${
            active ? (total / active).toFixed(1) : 0
          }</div>
          <div class="bg-red-100 p-3 rounded">Missed: ${missed}</div>
        `;
  }

  monthInput.onchange = render;
  yearSelect.onchange = () => {
    const [_, m] = monthInput.value.split('-');
    monthInput.value = `${yearSelect.value}-${m}`;
    render();
  };

  render();

  overlay.querySelector('.deleteHabit').onclick = async () => {
    if (!confirm('Delete habit and all logs?')) return;
    for (const l of logsSnap.docs) await deleteDoc(l.ref);
    await deleteDoc(doc(db, 'trackers', habitId));
    overlay.classList.add('hidden');
  };

  hideLoader();
}

/* ================= FETCH HABITS ================= */

const q = query(collection(db, 'trackers'), orderBy('createdOn', 'desc'));

showLoader();
onSnapshot(q, async (snap) => {
  habitListWrapper.innerHTML = '';
  for (const d of snap.docs) renderHabit(d);
  for (const box of document.querySelectorAll('.habitBox')) {
    await loadHabitForDate(box.dataset.id, box.dataset.type, box);
  }
  attachActions();
  hideLoader();
});

/* ================= DATE CHANGE ================= */

datePicker.onchange = async () => {
  showLoader();
  for (const box of document.querySelectorAll('.habitBox')) {
    await loadHabitForDate(box.dataset.id, box.dataset.type, box);
  }
  hideLoader();
};
