/*
  QN FF FALL 2026 | Day 1
  Chỉ cần sửa tên đội + link ảnh trong TEAM_CONFIG.
  Link ảnh có thể là JPG / PNG / WEBP / URL ảnh trực tiếp.
*/

const TEAM_CONFIG = [
  // PHOENIX ESPORT: để trống image để bạn thay bằng URL ảnh custom của bạn.
  { name: "PHOENIX ESPORT", image: "https://cdn.phototourl.com/free/2026-09-06-79536f58-9948-4efc-8efe-229e5fecacaf.png" },

  { name: "TEAM FLASH", image: "https://cdn.phototourl.com/free/2026-09-06-ca9ebffc-fef5-4128-ac32-ff284688a9d6.png" },
  { name: "HEAVY", image: "https://cdn.phototourl.com/free/2026-09-06-a703f445-a239-48e6-8acf-70f413cf1b92.png" },
  { name: "WAG", image: "https://cdn.phototourl.com/free/2026-09-06-827f7469-32a5-49cf-91d8-e39e8672ca11.png" },
  { name: "NOVA", image: "https://cdn.phototourl.com/member/2026-09-06-db318793-4bc7-4a16-93a3-7706147ca276.jpg" },
  { name: "FLUXO", image: "https://commons.wikimedia.org/wiki/Special:Redirect/file/FluxoGG.png" },
  { name: "BURIRAM UNITED ESPORT", image: "https://cdn.phototourl.com/member/2026-09-06-3e45c1a4-5ea8-4df2-8aa3-684ed71bc8f0.png" },
  { name: "AG GLOBAL", image: "https://cdn.phototourl.com/free/2026-09-06-b5b8264e-5efe-4dd4-aec6-cfe83f6f55f4.jpg" },
  { name: "ONIC OLYMPUS", image: "https://onic.gg/wp-content/uploads/2024/04/ONIC-Logo.png" },
  { name: "LION GROUP", image: "https://liquipedia.net/commons/images/7/7c/Lion_Esports_logo.png" },
  { name: "COPPER X", image: "https://liquipedia.net/commons/images/3/3c/Copper_X_logo.png" },
  { name: "ESVOS DEVIND", image: "https://liquipedia.net/freefire/File:EVOS_Esports_allmode.png" }
];

const STORAGE_KEY = "qn_ff_fall_2026_day1";

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (Array.isArray(data) && data.length === TEAM_CONFIG.length) return data;
    } catch {}
  }
  return TEAM_CONFIG.map(t => ({...t, booyah: 0, kill: 0, point: 0}));
}

let teams = loadData();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function sortedTeams() {
  return [...teams].sort((a,b) =>
    b.point - a.point ||
    b.booyah - a.booyah ||
    b.kill - a.kill
  );
}

function renderRanking() {
  const body = document.getElementById("rankingBody");
  body.innerHTML = sortedTeams().map((t, i) => `
    <div class="rank-row">
      <div class="rank-num">${i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : String(i+1).padStart(2,"0")}</div>
      <div class="team">
        <img class="team-logo" src="${esc(t.image)}" alt="" onerror="this.style.visibility='hidden'">
        <div class="team-name">${esc(t.name)}</div>
      </div>
      <div class="stat">${t.booyah}</div>
      <div class="stat">${t.kill}</div>
      <div class="points">${t.point}</div>
    </div>
  `).join("");
}

function renderAdmin() {
  const body = document.getElementById("adminBody");
  body.innerHTML = teams.map((t, i) => `
    <div class="admin-card">
      <div class="admin-team">
        <img class="admin-logo" src="${esc(t.image)}" alt="" onerror="this.style.visibility='hidden'">
        <div class="admin-name">${esc(t.name)}</div>
      </div>
      <div class="admin-controls">
        ${controlHTML(i, "booyah", "BOOYAH")}
        ${controlHTML(i, "kill", "KILL")}
        ${controlHTML(i, "point", "POINT")}
      </div>
    </div>
  `).join("");
}

function controlHTML(index, key, label) {
  return `
    <div class="control">
      <span>${label}</span>
      <div class="value">${teams[index][key]}</div>
      <button class="small-btn" onclick="changeStat(${index},'${key}',-1)">−</button>
      <button class="small-btn" onclick="changeStat(${index},'${key}',1)">+</button>
    </div>
  `;
}

function changeStat(index, key, amount) {
  teams[index][key] = Math.max(0, Number(teams[index][key]) + amount);
  save();
  renderRanking();
  renderAdmin();
  showToast(`${teams[index].name}: ${key.toUpperCase()} ${amount > 0 ? "+1" : "-1"}`);
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 1200);
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    document.getElementById("rankingView").classList.toggle("active-view", view === "ranking");
    document.getElementById("adminView").classList.toggle("active-view", view === "admin");
  });
});

document.getElementById("resetAll").addEventListener("click", () => {
  if (!confirm("Reset toàn bộ BOOYAH, KILL và POINT về 0?")) return;
  teams.forEach(t => { t.booyah = 0; t.kill = 0; t.point = 0; });
  save();
  renderRanking();
  renderAdmin();
  showToast("Đã RESET ALL");
});

renderRanking();
renderAdmin();
