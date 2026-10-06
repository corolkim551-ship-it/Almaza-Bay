const HOTELS=["Jaz Almaza Beach","Jaz Elite Crystal","Jaz Oriental","Jaz Tamerina","Jaz Neo Almazino","Jaz Viva Casa Maza","Jaz Viva Villagio","Jaz Viva Blu"];
const DEPTS=["Kitchen","Engineering","HR","IT","FO","FB","Recreation"];
const SYSTEMS={
 "Winter Project":{code:"WP",desc:"Strategic projects & portfolio delivery",icon:"✦"},
 "Maintenance":{code:"MT",desc:"Preventive maintenance & operational reliability",icon:"⌁"},
 "Manufacturing":{code:"MF",desc:"Production, assets & manufacturing delivery",icon:"◈"}
};
const SEED={
"Winter Project":[
["AC Unit Maintenance - Room 1024","Completed","Engineering","2025-10-12","Jaz Almaza Beach",100,"High"],
["Fire Alarm System Check","On Going","IT","2025-10-14","Jaz Elite Crystal",62,"High"],
["Guest Room Deep Cleaning","On Going","FO","2025-10-15","Jaz Oriental",55,"Medium"],
["Kitchen Equipment Repair","Not Started","Kitchen","2025-10-16","Jaz Tamerina",0,"High"],
["Pool Water Analysis","Completed","Recreation","2025-10-10","Jaz Neo Almazino",100,"Medium"],
["Laundry Machine Service","On Going","Engineering","2025-10-17","Jaz Viva Casa Maza",72,"Medium"],
["HR Training Session","Not Started","HR","2025-10-18","Jaz Viva Villagio",0,"Low"],
["POS System Update","On Going","IT","2025-10-20","Jaz Viva Blu",48,"High"],
["Guest Room Furniture Check","Completed","FO","2025-10-11","Jaz Almaza Beach",100,"Low"],
["Pest Control Monthly Service","Not Started","Recreation","2025-10-22","Jaz Elite Crystal",0,"Medium"]
],
"Maintenance":[
["HVAC Preventive Service","Completed","Engineering","2025-10-09","Jaz Almaza Beach",100,"High"],
["Generator Inspection","On Going","Engineering","2025-10-13","Jaz Elite Crystal",68,"High"],
["Kitchen Exhaust Service","On Going","Kitchen","2025-10-15","Jaz Oriental",54,"Medium"],
["Guest Room Plumbing","Not Started","Engineering","2025-10-18","Jaz Tamerina",0,"High"],
["Pool Pump Maintenance","Completed","Recreation","2025-10-08","Jaz Neo Almazino",100,"Medium"],
["IT Room Cooling Check","On Going","IT","2025-10-19","Jaz Viva Blu",70,"High"]
],
"Manufacturing":[
["Laundry Line Upgrade","On Going","Engineering","2025-10-16","Jaz Almaza Beach",58,"High"],
["Kitchen Fabrication Batch A","Completed","Kitchen","2025-10-11","Jaz Elite Crystal",100,"Medium"],
["Furniture Production Run","On Going","FO","2025-10-21","Jaz Oriental",44,"Medium"],
["Maintenance Parts Batch","Not Started","Engineering","2025-10-24","Jaz Tamerina",0,"High"],
["Recreation Equipment Build","On Going","Recreation","2025-10-26","Jaz Viva Villagio",63,"Low"]
]};
let DATA=JSON.parse(localStorage.getItem("winterProV4")||"null")||SEED;
let session=null,currentSystem="Winter Project",editing=-1;

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const save=()=>localStorage.setItem("winterProV4",JSON.stringify(DATA));
const list=()=>DATA[currentSystem];
const counts=a=>({completed:a.filter(x=>x[1]==="Completed").length,ongoing:a.filter(x=>x[1]==="On Going").length,not:a.filter(x=>x[1]==="Not Started").length});
const progress=a=>a.length?Math.round(a.reduce((s,x)=>s+Number(x[5]||0),0)/a.length):0;
const statusClass=s=>s==="Completed"?"completed":s==="On Going"?"ongoing":"notstarted";
const fmtDate=s=>new Date(s+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});

$("loginForm").onsubmit=e=>{e.preventDefault();const u=$("loginUser").value.trim(),p=$("loginPass").value;if((u==="admin"&&p==="admin00")||(u==="operator"&&p==="operator00")){session={user:u,role:u==="admin"?"Administrator":"Project Operator",admin:u==="admin"};$("loginError").textContent="";showSystems()}else $("loginError").textContent="Invalid username or password."};
$("togglePass").onclick=()=>{const x=$("loginPass");x.type=x.type==="password"?"text":"password";$("togglePass").textContent=x.type==="password"?"SHOW":"HIDE"};
function showSystems(){$("loginView").classList.add("hidden");$("systemView").classList.remove("hidden");$("sessionName").textContent=`${session.user} · ${session.role}`;renderSystemCards()}
function renderSystemCards(){$("systemCards").innerHTML=Object.entries(SYSTEMS).map(([name,s])=>{const a=DATA[name],c=counts(a),p=progress(a);return `<button class="system-card" onclick="enterSystem('${name}')"><div class="system-card-top"><span class="system-icon">${s.icon}</span><small>${s.code} / WORKSPACE</small></div><div class="system-card-copy"><h2>${name}</h2><p>${s.desc}</p></div><div class="system-progress"><div class="progress-number"><b>${p}%</b><span>overall progress</span></div><div class="system-track"><i style="width:${p}%"></i></div></div><div class="system-footer"><span><b>${a.length}</b>Projects</span><span><b>${c.completed}</b>Completed</span><span><b>${c.ongoing}</b>Ongoing</span><em>Open workspace ↗</em></div></button>`}).join("")}
function enterSystem(name){currentSystem=name;$("systemView").classList.add("hidden");$("appView").classList.remove("hidden");$("activeSystem").textContent=name;$("topSystem").textContent=name.toUpperCase();$("topUser").textContent=session.user;$("topRole").textContent=session.role;$("avatar").textContent=session.user.slice(0,2).toUpperCase();$("navCount").textContent=list().length;showPage("dashboard")}
function openSystems(){$("appView").classList.add("hidden");$("systemView").classList.remove("hidden");renderSystemCards()}
function logout(){session=null;$("appView").classList.add("hidden");$("systemView").classList.add("hidden");$("loginView").classList.remove("hidden");$("loginPass").value=""}

document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>showPage(b.dataset.page));
function showPage(page){document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("topPage").textContent=({dashboard:"Executive Dashboard",projects:"Projects",reports:"Reports & Analytics",settings:"Settings"})[page];({dashboard,projects:projectsPage,reports,reports,settings}[page]||dashboard)()}

function dashboard(){
 const a=list(),c=counts(a),p=progress(a);
 const hotelRows=HOTELS.map(h=>{const x=a.filter(v=>v[4]===h);return {h,p:progress(x),n:x.length,c:counts(x)}})
 const deptRows=DEPTS.map(d=>{const x=a.filter(v=>v[2]===d);return {d,p:progress(x),n:x.length,c:counts(x)}})
 $("page").innerHTML=`<section class="hero-banner"><div class="hero-copy"><div class="eyebrow">LIVE PORTFOLIO · ${esc(currentSystem.toUpperCase())}</div><h1>Executive <em>control.</em></h1><p>One view across every hotel, department and project milestone.</p><div class="hero-meta"><span><i></i>Live data</span><span>Updated just now</span></div></div><div class="hero-score"><div class="score-ring" style="--score:${p}"><div><b>${p}%</b><small>portfolio<br>progress</small></div></div></div></section>
<section class="kpi-row">
<div class="kpi"><span class="kpi-icon gold">◈</span><div><small>TOTAL PROJECTS</small><b>${a.length}</b><em>Portfolio size</em></div></div>
<div class="kpi"><span class="kpi-icon green">✓</span><div><small>COMPLETED</small><b>${c.completed}</b><em>${a.length?Math.round(c.completed/a.length*100):0}% of projects</em></div></div>
<div class="kpi"><span class="kpi-icon blue">↗</span><div><small>ON GOING</small><b>${c.ongoing}</b><em>Currently executing</em></div></div>
<div class="kpi"><span class="kpi-icon gray">○</span><div><small>NOT STARTED</small><b>${c.not}</b><em>Awaiting start</em></div></div>
</section>
<div class="section-grid">
<section class="panel hotel-panel"><div class="panel-head"><div><span class="section-tag">PROPERTY PERFORMANCE</span><h2>Hotel progress</h2></div><button onclick="showPage('projects')" class="quiet-btn">View projects ↗</button></div>
<div class="hotel-grid">${hotelRows.map(x=>`<div class="hotel-card"><div class="hotel-top"><div class="hotel-thumb">${hotelInitial(x.h)}</div><div><b>${esc(x.h)}</b><small>${x.n} project${x.n===1?"":"s"}</small></div><strong>${x.p}%</strong></div><div class="thin-track"><i style="width:${x.p}%"></i></div><div class="hotel-state"><span class="dot green-dot"></span>${x.c.completed} done <span class="dot blue-dot"></span>${x.c.ongoing} ongoing <span class="dot gray-dot"></span>${x.c.not} left</div></div>`).join("")}</div></section>
<section class="panel department-panel"><div class="panel-head"><div><span class="section-tag">DEPARTMENT HEALTH</span><h2>Delivery by department</h2></div></div>
<div class="dept-list">${deptRows.map(x=>`<div class="dept-row"><div class="dept-name"><b>${esc(x.d)}</b><span>${x.n} projects</span></div><div class="dept-bar"><i style="width:${x.p}%"></i></div><strong>${x.p}%</strong><div class="dept-counts"><span>${x.c.completed} done</span><span>${x.c.ongoing} live</span><span>${x.c.not} left</span></div></div>`).join("")}</div></section>
</div>
<section class="panel projects-panel"><div class="panel-head"><div><span class="section-tag">PROJECT CONTROL</span><h2>Latest activity</h2></div><div class="head-actions">${session.admin||true?`<button class="primary-btn small" onclick="openCreate()">＋ Add project</button>`:""}<button onclick="showPage('projects')" class="quiet-btn">All projects ↗</button></div></div>
<div class="activity-list">${a.slice(0,6).map((x,i)=>`<div class="activity"><span class="activity-no">${String(i+1).padStart(2,"0")}</span><div class="activity-main"><b>${esc(x[0])}</b><small>${esc(x[4])} · ${esc(x[2])} · Due ${fmtDate(x[3])}</small></div><span class="pill ${statusClass(x[1])}">${esc(x[1])}</span><div class="activity-progress"><span>${x[5]}%</span><i><b style="width:${x[5]}%"></b></i></div><span class="priority ${x[6].toLowerCase()}">${x[6]}</span>${session.admin?`<button class="row-edit" onclick="openEdit(${i})">Edit</button>`:""}</div>`).join("")}</div></section>`;
}
function hotelInitial(n){return n.split(" ").map(x=>x[0]).slice(0,2).join("")}

function projectsPage(){
 $("page").innerHTML=`<div class="page-title"><div><span class="section-tag">${esc(currentSystem.toUpperCase())} / PROJECT REGISTER</span><h1>Projects</h1><p>Filter, create and manage every project inside this workspace.</p></div><button class="primary-btn" onclick="openCreate()">＋ Add project</button></div>
<section class="panel table-panel"><div class="filter-bar"><div class="filter-search"><span>⌕</span><input id="projectSearch" placeholder="Search project name..."></div><select id="hotelFilter"><option value="all">All hotels</option>${HOTELS.map(x=>`<option>${esc(x)}</option>`).join("")}</select><select id="statusFilter"><option value="all">All statuses</option><option>Completed</option><option>On Going</option><option>Not Started</option></select><select id="deptFilter"><option value="all">All departments</option>${DEPTS.map(x=>`<option>${x}</option>`).join("")}</select><button class="reset-btn" onclick="resetFilters()">Reset</button></div><div class="table-wrap"><table><thead><tr><th>Project</th><th>Hotel</th><th>Department</th><th>Status</th><th>Progress</th><th>Due date</th><th>Priority</th><th></th></tr></thead><tbody id="rows"></tbody></table></div></section>`;
["projectSearch","hotelFilter","statusFilter","deptFilter"].forEach(id=>$(id).oninput=renderRows);renderRows();
}
function renderRows(){
 const q=($("projectSearch")?.value||"").toLowerCase(),hf=$("hotelFilter")?.value||"all",sf=$("statusFilter")?.value||"all",df=$("deptFilter")?.value||"all";
 const arr=list().map((p,i)=>({p,i})).filter(o=>(!q||o.p[0].toLowerCase().includes(q)||o.p[4].toLowerCase().includes(q))&&(hf==="all"||o.p[4]===hf)&&(sf==="all"||o.p[1]===sf)&&(df==="all"||o.p[2]===df));
 $("rows").innerHTML=arr.map(o=>{const p=o.p;return `<tr><td><div class="project-cell"><span>${hotelInitial(p[4])}</span><div><b>${esc(p[0])}</b><small>Project #${String(o.i+1).padStart(3,"0")}</small></div></div></td><td>${esc(p[4])}</td><td><span class="dept-badge ${p[2].toLowerCase()}">${esc(p[2])}</span></td><td><span class="pill ${statusClass(p[1])}">${esc(p[1])}</span></td><td><div class="row-progress"><i style="width:${p[5]}%"></i></div><small>${p[5]}%</small></td><td>${fmtDate(p[3])}</td><td><span class="priority ${p[6].toLowerCase()}">${p[6]}</span></td><td class="row-actions">${session.admin?`<button onclick="openEdit(${o.i})">Edit</button><button class="delete" onclick="removeProject(${o.i})">Delete</button>`:""}</td></tr>`}).join("")||`<tr><td colspan="8" class="empty-row">No projects match the selected filters.</td></tr>`;
}
function resetFilters(){["projectSearch"].forEach(id=>$(id).value="");["hotelFilter","statusFilter","deptFilter"].forEach(id=>$(id).value="all");renderRows()}

function reports(){
 const a=list(),c=counts(a),p=progress(a);
 $("page").innerHTML=`<div class="page-title"><div><span class="section-tag">EXECUTIVE REPORTING</span><h1>Reports & Analytics</h1><p>Portfolio health at a glance for ${esc(currentSystem)}.</p></div></div>
<div class="report-grid"><div class="report-card"><small>WEIGHTED PROGRESS</small><b>${p}%</b><div class="large-track"><i style="width:${p}%"></i></div><span>Current portfolio completion</span></div><div class="report-card"><small>STATUS DISTRIBUTION</small><div class="status-bars"><div><span>Completed</span><i><b style="width:${a.length?c.completed/a.length*100:0}%"></b></i><strong>${c.completed}</strong></div><div><span>On Going</span><i><b class="blue-fill" style="width:${a.length?c.ongoing/a.length*100:0}%"></b></i><strong>${c.ongoing}</strong></div><div><span>Not Started</span><i><b class="gray-fill" style="width:${a.length?c.not/a.length*100:0}%"></b></i><strong>${c.not}</strong></div></div></div></div>
<section class="panel"><div class="panel-head"><div><span class="section-tag">HOTEL BENCHMARK</span><h2>Property ranking</h2></div></div><div class="ranking">${HOTELS.map((h,i)=>{const x=a.filter(p=>p[4]===h),pp=progress(x);return `<div><span class="rank">${String(i+1).padStart(2,"0")}</span><b>${h}</b><i><b style="width:${pp}%"></b></i><strong>${pp}%</strong></div>`}).join("")}</div></section>`;
}
function settings(){
 $("page").innerHTML=`<div class="page-title"><div><span class="section-tag">CONTROL CENTER</span><h1>Settings</h1><p>Account, access and workspace information.</p></div></div><section class="panel settings-list"><div><span>01</span><div><b>Current account</b><small>${session.user} · ${session.role}</small></div></div><div><span>02</span><div><b>Permissions</b><small>${session.admin?"Add, edit and delete projects":"Add projects only"}</small></div></div><div><span>03</span><div><b>Active workspace</b><small>${currentSystem}</small></div></div><div><span>04</span><div><b>Data mode</b><small>Browser prototype with local persistence — production backend can be connected later.</small></div></div></section>`;
}

function openCreate(){editing=-1;$("modalEyebrow").textContent=currentSystem.toUpperCase()+" / NEW PROJECT";$("modalTitle").textContent="Add project";$("modalText").textContent="Create a new project in the active workspace.";fillForm();$("modal").classList.add("open")}
function openEdit(i){if(!session.admin)return;editing=i;$("modalEyebrow").textContent=currentSystem.toUpperCase()+" / EDIT PROJECT";$("modalTitle").textContent="Edit project";$("modalText").textContent="Update project details and operational progress.";fillForm(list()[i]);$("modal").classList.add("open")}
function fillForm(p){$("pHotel").innerHTML=HOTELS.map(x=>`<option ${p&&p[4]===x?"selected":""}>${esc(x)}</option>`).join("");$("pDept").innerHTML=DEPTS.map(x=>`<option ${p&&p[2]===x?"selected":""}>${x}</option>`).join("");$("pName").value=p?p[0]:"";$("pStatus").value=p?p[1]:"Not Started";$("pDate").value=p?p[3]:"";$("pPriority").value=p?p[6]:"Medium";$("pProgress").value=p?p[5]:0}
function closeModal(){$("modal").classList.remove("open")}
$("projectForm").onsubmit=e=>{e.preventDefault();const p=[$("pName").value,$("pStatus").value,$("pDept").value,$("pDate").value,$("pHotel").value,Number($("pProgress").value),$("pPriority").value];if(editing<0)list().unshift(p);else list()[editing]=p;save();$("navCount").textContent=list().length;closeModal();showPage("projects")}
function removeProject(i){if(!session.admin)return;if(confirm("Delete this project?")){list().splice(i,1);save();$("navCount").textContent=list().length;renderRows()}}
$("globalSearch").oninput=()=>{if(document.querySelector(".nav-item.active")?.dataset.page==="projects"){if($("projectSearch"))$("projectSearch").value=$("globalSearch").value;renderRows()}};
$("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
function showPage(page){document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("topPage").textContent=({dashboard:"Executive Dashboard",projects:"Projects",reports:"Reports & Analytics",settings:"Settings"})[page];if(page==="dashboard")dashboard();else if(page==="projects")projectsPage();else if(page==="reports")reports();else settings()}
