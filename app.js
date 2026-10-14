const worlds = [
  {
    theme: "grassland",
    kicker: "WORLD 1 · EXPLORE & PLAN",
    title: "The Starting Point",
    summary:
      "Understand your options, build a college list, and create a realistic application timeline.",
    nodes: [
      ["What Is College?", "Minor"],
      ["What Matters to You?", "Minor"],
      ["Explore Majors and Careers", "Minor"],
      ["Build Your College List", "Major"],
      ["Reach, Target, and Likely", "Minor"],
      ["EA vs. ED vs. Regular Decision", "Minor"],
      ["Make Your Application Timeline", "Major"],
      ["Find Your Support Team", "Minor"],
      ["Starting Point Checkpoint", "Boss"],
    ],
  },
  {
    theme: "desert",
    kicker: "WORLD 2 · PREPARE MATERIALS",
    title: "Build Your Application",
    summary:
      "Gather the information and writing needed to submit strong, complete applications.",
    nodes: [
      ["Know Your Requirements", "Minor"],
      ["Gather Your School Records", "Minor"],
      ["SAT and ACT Basics", "Minor"],
      ["Build Your Activities List", "Major"],
      ["Ask for Recommendation Letters", "Major"],
      ["Personal Essay Brainstorm", "Minor"],
      ["Draft Your Personal Essay", "Major"],
      ["Supplemental Essay Workshop", "Major"],
      ["Review and Polish", "Minor"],
      ["Application Materials Checkpoint", "Boss"],
    ],
  },
  {
    theme: "arctic",
    kicker: "WORLD 3 · SUBMIT & TRACK",
    title: "The Application Quest",
    summary:
      "Complete applications accurately, submit them on time, and track what happens next.",
    nodes: [
      ["Meet the Common App", "Minor"],
      ["Create Your Application Accounts", "Major"],
      ["Understand Application Fees", "Minor"],
      ["Complete Your Application", "Major"],
      ["Review Before You Submit", "Minor"],
      ["Submit an Application", "Major"],
      ["Check Your Applicant Portals", "Major"],
      ["Interview Preparation", "Minor"],
      ["Decisions, Deferrals, and Waitlists", "Minor"],
      ["Submission Checkpoint", "Boss"],
    ],
  },
  {
    theme: "ocean",
    kicker: "WORLD 4 · MAKE IT AFFORDABLE",
    title: "Unlock Your Funding",
    summary:
      "Understand financial aid, find funding, and estimate what each college would actually cost.",
    nodes: [
      ["Sticker Price vs. Net Price", "Minor"],
      ["Types of Financial Aid", "Minor"],
      ["FAFSA Basics", "Minor"],
      ["Complete the FAFSA", "Major"],
      ["CSS Profile and College Forms", "Minor"],
      ["Find Scholarships", "Major"],
      ["Understand Your Aid Offers", "Minor"],
      ["Compare College Costs", "Major"],
      ["Ask for More Aid", "Minor"],
      ["Funding Checkpoint", "Boss"],
    ],
  },
  {
    theme: "space",
    kicker: "WORLD 5 · CHOOSE & PREPARE",
    title: "Your Next Chapter",
    summary:
      "Make an informed college decision and prepare for the transition.",
    nodes: [
      ["Compare Your Acceptances", "Minor"],
      ["Choose the Best Fit for You", "Major"],
      ["Understand the True Cost", "Minor"],
      ["Make Your Final Decision", "Major"],
      ["Confirm Enrollment", "Major"],
      ["Housing and Orientation", "Minor"],
      ["Find Your Campus Support", "Minor"],
      ["Plan Your College Budget", "Major"],
      ["Your First-Semester Checklist", "Minor"],
      ["Welcome to Your Next Chapter", "Boss"],
    ],
  },
];
const colleges = [
  ["Bunker Hill Community College", "Boston, MA", "2-year public"],
  ["University of Massachusetts Boston", "Boston, MA", "4-year public"],
  ["Massachusetts College of Art and Design", "Boston, MA", "4-year public"],
  ["Northeastern University", "Boston, MA", "4-year private"],
  ["Boston University", "Boston, MA", "4-year private"],
  ["Simmons University", "Boston, MA", "4-year private"],
];
const state = {
  world: 0,
  done: [new Set([0]), new Set(), new Set(), new Set(), new Set()],
  saved: [],
};
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
function buildHome() {
  $("#world-grid").innerHTML = worlds
    .map(
      (w, i) =>
        `<button class="world-tile ${w.theme}" data-open-world="${i}"><span class="num">WORLD ${i + 1}</span><h2>${w.title}</h2><p>${w.summary}</p><strong>${i === 0 ? "Open interactive world" : "Preview " + w.nodes.length + " nodes"} →</strong></button>`,
    )
    .join("");
  $$("[data-open-world]").forEach(
    (b) => (b.onclick = () => openWorld(+b.dataset.openWorld)),
  );
}
function showPage(id) {
  $$(".page").forEach((p) => p.classList.toggle("active", p.id === id));
}
function openWorld(i) {
  state.world = i;
  location.hash = `world-${i + 1}`;
  showPage("world");
  renderWorld();
  $("#terrain").scrollLeft = 0;
}
function renderWorld() {
  let w = worlds[state.world],
    done = state.done[state.world],
    next = w.nodes.findIndex((_, i) => !done.has(i)),
    pct = Math.round((done.size / w.nodes.length) * 100),
    lock =
      '<svg class="lock-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10"/><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M12 14.5v2.5"/></svg>';
  $("#terrain").className = `terrain ${w.theme}`;
  let long = w.nodes.length === 10,
    pathWrap = $(".path-wrap");
  pathWrap.classList.toggle("long-path", long);
  $("#road").setAttribute("viewBox", long ? "0 0 2900 430" : "0 0 2500 430");
  $("#road-path").setAttribute(
    "d",
    long
      ? "M70 290 C430 91 780 83 1020 223 C1260 376 1600 364 1810 198 C2000 58 2200 74 2320 120 C2400 165 2450 231 2500 231 C2600 231 2700 231 2800 231"
      : "M70 290 C380 91 680 83 880 223 C1080 376 1380 364 1560 198 C1720 58 2100 74 2400 231",
  );
  $("#world-kicker").textContent = w.kicker;
  $("#world-title").textContent = w.title;
  $("#world-summary").textContent = w.summary;
  $("#progress-count").textContent = `${done.size} of ${w.nodes.length} nodes`;
  $("#progress-bar").style.width = pct + "%";
  $("#next-node").textContent = next < 0 ? "World complete" : w.nodes[next][0];
  $("#college-list-btn").style.display = state.world === 0 ? "block" : "none";
  $("#list-count").textContent = state.saved.length;
  $("#nodes").innerHTML = w.nodes
    .map(
      (n, i) =>
        `<button class="node ${n[1] === "Major" ? "major" : n[1] === "Boss" ? "boss" : ""} ${done.has(i) ? "done" : i === next ? "current" : i > next && state.world === 0 ? "locked" : ""}" data-node="${i}"><span class="orb">${done.has(i) ? "✓" : i > next && state.world === 0 ? lock : i + 1}</span><strong>${n[0]}<small>${n[1]}</small></strong></button>`,
    )
    .join("");
  $("#world-switcher").innerHTML = worlds
    .map(
      (_, i) =>
        `<button class="${i === state.world ? "active" : ""}" data-switch="${i}" aria-label="Open world ${i + 1}">${i + 1}</button>`,
    )
    .join("");
  $$("[data-switch]").forEach(
    (b) => (b.onclick = () => openWorld(+b.dataset.switch)),
  );
  $$("[data-node]").forEach(
    (b) =>
      (b.onclick = () => {
        let i = +b.dataset.node;
        if (state.world === 0 && i > next)
          return toast("Complete the highlighted node first.");
        openNode(i);
      }),
  );
}
function openNode(i) {
  let w = worlds[state.world],
    n = w.nodes[i];
  if (state.world === 0 && i === 3) return openCollegeList();
  let body;
  if (state.world === 0 && i === 5)
    body =
      '<p>Application plans affect when you apply and whether you must attend if admitted.</p><div class="term-grid"><div class="term-row"><b>Early Action · EA</b><br>Apply earlier and receive a decision earlier. Usually not binding.</div><div class="term-row"><b>Early Decision · ED</b><br>A binding early plan. If admitted, you generally commit to attend under the agreement’s conditions.</div><div class="term-row"><b>Regular Decision · RD</b><br>Apply by the standard deadline and compare admission and aid offers before deciding.</div></div>';
  else if (state.world === 2 && i === 0)
    body =
      '<p>Common App is a shared application platform used by many colleges. Students create a profile, add colleges, review each college’s requirements, and submit applications. Some institutions use separate systems.</p><div class="lesson-card"><b>How it connects:</b> College Quest prepares and tracks the work; submission still happens in the official Common App.</div>';
  else
    body = `<p>${nodeDescription(state.world, i)}</p><div class="lesson-card"><b>Completion goal:</b> ${completionGoal(state.world, n[0])}</div>`;
  $("#node-content").innerHTML =
    `<span class="lesson-tag">WORLD ${state.world + 1} · ${n[1]} NODE</span><h2>${n[0]}</h2>${body}<div class="actions"><button class="complete" id="complete-node">${state.done[state.world].has(i) ? "Completed ✓" : "Mark complete"}</button><button class="secondary" data-close>Back to world</button></div>`;
  $("#node-dialog").showModal();
  $("#complete-node").onclick = () => {
    state.done[state.world].add(i);
    $("#node-dialog").close();
    renderWorld();
    toast("Node complete.");
  };
  $$("[data-close]").forEach(
    (b) => (b.onclick = () => b.closest("dialog").close()),
  );
}
function nodeDescription(world, i) {
  if (world === 0) {
    return [
      "Learn how two-year, four-year, public, private, and transfer pathways differ.",
      "Choose the college qualities that matter most to your goals and daily life.",
      "Explore possible majors and careers without committing permanently.",
      "",
      "Learn how reach, target, and likely categories can balance a list without guaranteeing admission.",
      "",
      "Create a calendar for deadlines, testing, essays, and recommendation requests.",
      "Identify people and programs that can support you.",
      "Review your list and timeline so every college has a next step.",
    ][i];
  }
  return "Learn the key idea for this step, then complete one practical task to move your application forward.";
}
function completionGoal(world, title) {
  if (title.includes("Checkpoint") || title.includes("Chapter"))
    return "Review the world’s work and identify anything still missing.";
  if (title.includes("Timeline"))
    return "Save at least one application deadline and preparation milestone.";
  if (title.includes("Essay"))
    return "Draft or revise the requested essay work.";
  if (title.includes("FAFSA"))
    return "Record the official next step and confirmation when completed.";
  return `Complete the activity for “${title}” and save the result.`;
}
function openCollegeList() {
  let saved =
    state.saved
      .map(
        (c, i) =>
          `<div class="college-row"><div><b>${c[0]}</b><span>${c[1]} · ${c[2]}</span></div><button class="add-college" data-remove="${i}">Remove</button></div>`,
      )
      .join("") || "<p>No colleges saved yet.</p>";
  $("#panel-content").innerHTML =
    `<span class="lesson-tag">WORLD 1 · MAJOR TASK</span><h2>Build Your College List</h2><p>Search the Boston-area college directory and save schools you want to research.</p><div class="saved-list">${saved}</div><div class="search"><input id="college-search" placeholder="Search by college name"><button id="search-btn">Search</button></div><div class="college-results" id="college-results"></div><div class="actions"><button class="complete" id="save-list">Save list & complete node</button></div>`;
  $("#panel-dialog").showModal();
  $("#search-btn").onclick = searchColleges;
  $("#college-search").onkeydown = (e) => {
    if (e.key === "Enter") searchColleges();
  };
  $$("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        state.saved.splice(+b.dataset.remove, 1);
        openCollegeList();
      }),
  );
  $("#save-list").onclick = () => {
    if (!state.saved.length) return toast("Add at least one college first.");
    state.done[0].add(3);
    $("#panel-dialog").close();
    renderWorld();
    toast("College list saved.");
  };
}
function searchColleges() {
  let q = $("#college-search").value.toLowerCase(),
    rows = colleges.filter(
      (c) =>
        c[0].toLowerCase().includes(q) &&
        !state.saved.some((s) => s[0] === c[0]),
    );
  $("#college-results").innerHTML =
    rows
      .map(
        (c) =>
          `<div class="college-row"><div><b>${c[0]}</b><span>${c[1]} · ${c[2]}</span></div><button class="add-college" data-add="${colleges.indexOf(c)}">Add</button></div>`,
      )
      .join("") || "<p>No new matches.</p>";
  $$("[data-add]").forEach(
    (b) =>
      (b.onclick = () => {
        state.saved.push(colleges[+b.dataset.add]);
        openCollegeList();
      }),
  );
}
function goHome() {
  location.hash = "home";
  showPage("home");
}
$("#back-btn").onclick = goHome;
$("#continue-btn").onclick = () => {
  let w = worlds[state.world],
    i = w.nodes.findIndex((_, x) => !state.done[state.world].has(x));
  openNode(i < 0 ? w.nodes.length - 1 : i);
};
$("#college-list-btn").onclick = openCollegeList;
$$(".close").forEach((b) => (b.onclick = () => b.closest("dialog").close()));
$("#terrain").addEventListener(
  "wheel",
  (e) => {
    if (e.target.closest(".hud") || Math.abs(e.deltaX) > Math.abs(e.deltaY))
      return;
    e.preventDefault();
    $("#terrain").scrollLeft += e.deltaY;
  },
  { passive: false },
);
window.onhashchange = route;
function route() {
  let m = location.hash.match(/world-(\d)/);
  if (m) openWorld(Math.min(4, +m[1] - 1));
  else showPage("home");
}
function toast(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2200);
}
buildHome();
route();
