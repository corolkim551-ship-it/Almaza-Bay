const HOTELS=["Jaz Almaza Beach","Jaz Elite Crystal","Jaz Oriental","Jaz Tamerina","Jaz Neo Almazino","Jaz Viva Casa Maza","Jaz Viva Villagio","Jaz Viva Blu"];
const DEPTS=["Kitchen","Engineering","HR","IT","FO","FB","Recreation"];
const SYSTEMS={
 "Winter Project":{tag:"WP",icon:"✦",desc:"Strategic projects & portfolio delivery"},
 "Maintenance":{tag:"MT",icon:"⌁",desc:"Preventive maintenance & reliability"},
 "Manufacturing":{tag:"MF",icon:"◈",desc:"Production & manufacturing delivery"}
};
const seed={
"Winter Project":[
{id:crypto.randomUUID(),name:"AC Unit Maintenance — Room 1024",hotel:"Jaz Almaza Beach",dept:"Engineering",status:"Completed",progress:100,due:"2025-10-12",priority:"High"},
{id:crypto.randomUUID(),name:"Fire Alarm System Check",hotel:"Jaz Elite Crystal",dept:"IT",status:"On Going",progress:62,due:"2025-10-14",priority:"High"},
{id:crypto.randomUUID(),name:"Guest Room Deep Cleaning",hotel:"Jaz Oriental",dept:"FO",status:"On Going",progress:55,due:"2025-10-15",priority:"Medium"},
{id:crypto.randomUUID(),name:"Kitchen Equipment Repair",hotel:"Jaz Tamerina",dept:"Kitchen",status:"Not Started",progress:0,due:"2025-10-16",priority:"High"},
{id:crypto.randomUUID(),name:"Pool Water Analysis",hotel:"Jaz Neo Almazino",dept:"Recreation",status:"Completed",progress:100,due:"2025-10-10",priority:"Medium"},
{id:crypto.randomUUID(),name:"Laundry Machine Service",hotel:"Jaz Viva Casa Maza",dept:"Engineering",status:"On Going",progress:72,due:"2025-10-17",priority:"Medium"},
{id:crypto.randomUUID(),name:"HR Training Session",hotel:"Jaz Viva Villagio",dept:"HR",status:"Not Started",progress:0,due:"2025-10-18",priority:"Low"},
{id:crypto.randomUUID(),name:"POS System Update",hotel:"Jaz Viva Blu",dept:"IT",status:"On Going",progress:48,due:"2025-10-20",priority:"High"}
],
"Maintenance":[
{id:crypto.randomUUID(),name:"HVAC Preventive Service",hotel:"Jaz Almaza Beach",dept:"Engineering",status:"Completed",progress:100,due:"2025-10-09",priority:"High"},
{id:crypto.randomUUID(),name:"Generator Inspection",hotel:"Jaz Elite Crystal",dept:"Engineering",status:"On Going",progress:68,due:"2025-10-13",priority:"High"},
{id:crypto.randomUUID(),name:"Kitchen Exhaust Service",hotel:"Jaz Oriental",dept:"Kitchen",status:"On Going",progress:54,due:"2025-10-15",priority:"Medium"},
{id:crypto.randomUUID(),name:"Guest Room Plumbing",hotel:"Jaz Tamerina",dept:"Engineering",status:"Not Started",progress:0,due:"2025-10-18",priority:"High"},
{id:crypto.randomUUID(),name:"Pool Pump Maintenance",hotel:"Jaz Neo Almazino",dept:"Recreation",status:"Completed",progress:100,due:"2025-10-08",priority:"Medium"},
{id:crypto.randomUUID(),name:"IT Room Cooling Check",hotel:"Jaz Viva Blu",dept:"IT",status:"On Going",progress:70,due:"2025-10-19",priority:"High"}
],
"Manufacturing":[
{id:crypto.randomUUID(),name:"Laundry Line Upgrade",hotel:"Jaz Almaza Beach",dept:"Engineering",status:"On Going",progress:58,due:"2025-10-16",priority:"High"},
{id:crypto.randomUUID(),name:"Kitchen Fabrication Batch A",hotel:"Jaz Elite Crystal",dept:"Kitchen",status:"Completed",progress:100,due:"2025-10-11",priority:"Medium"},
{id:crypto.randomUUID(),name:"Furniture Production Run",hotel:"Jaz Oriental",dept:"FO",status:"On Going",progress:44,due:"2025-10-21",priority:"Medium"},
{id:crypto.randomUUID(),name:"Maintenance Parts Batch",hotel:"Jaz Tamerina",dept:"Engineering",status:"Not Started",progress:0,due:"2025-10-24",priority:"High"},
{id:crypto.randomUUID(),name:"Recreation Equipment Build",hotel:"Jaz Viva Villagio",dept:"Recreation",status:"On Going",progress:63,due:"2025-10-26",priority:"Low"}
]};
const stored=localStorage.getItem("winter-final-v5");
let DATA=stored?JSON.parse(stored):seed;
let session=null,current="Winter Project",editId=null;

const $=x=>document.getElementById(x);
const esc=x=>String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const save=()=>localStorage.setItem("winter-final-v5",JSON.stringify(DATA));
const projects=()=>DATA[current];
const stats=a=>({total:a.length,completed:a.filter(x=>x.status==="Completed").length,ongoing:a.filter(x=>x.status==="On Going").length,not:a.filter(x=>x.status==="Not Started").length,progress:a.length?Math.round(a.reduce((s,x)=>s+x.progress,0)/a.length):0});
const cls=s=>s==="Completed"?"done":s==="On Going"?"live":"idle";
const date=x=>new Date(x+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});

$("loginForm").addEventListener("submit",e=>{
 e.preventDefault();const u=$("username").value.trim(),p=$("password").value;
 if(u==="admin"&&p==="admin00") session={user:"admin",admin:true,role:"Administrator"};
 else if(u==="operator"&&p==="operator00") session={user:"operator",admin:false,role:"Project Operator"};
 else {$("loginError").textContent="Incorrect username or password.";return}
 $("loginError").textContent="";showPicker();
});
$("showPass").onclick=()=>{let x=$("password");x.type=x.type==="password"?"text":"password";$("showPass").textContent=x.type==="password"?"SHOW":"HIDE"};

function showPicker(){
 $("login").classList.add("hidden");$("app").classList.add("hidden");$("picker").classList.remove("hidden");
 $("systems").innerHTML=Object.entries(SYSTEMS).map(([n,s],i)=>{let st=stats(DATA[n]);return `
 <button class="system-card premium-card card-${i+1}" onclick="openSystem('${n}')">
   <div class="card-glow"></div>
   <div class="sys-top"><span class="sys-emblem">${s.icon}</span><small>${s.tag} / WORKSPACE</small></div>
   <div class="sys-body"><div class="sys-number">0${i+1}</div><h2>${n}</h2><p>${s.desc}</p></div>
   <div class="sys-metrics">
     <div><b>${st.total}</b><span>PROJECTS</span></div>
     <div><b>${st.completed}</b><span>COMPLETED</span></div>
     <div><b>${st.ongoing}</b><span>ONGOING</span></div>
   </div>
   <div class="sys-footer"><span>ENTER WORKSPACE</span><em>↗</em></div>
 </button>`}).join("")
}
function openSystem(n){current=n;$("picker").classList.add("hidden");$("app").classList.remove("hidden");$("workspaceName").textContent=n;$("userName").textContent=session.user;$("roleName").textContent=session.role;$("avatar").textContent=session.user==="admin"?"AD":"OP";$("projectCount").textContent=projects().length;showPage("dashboard")}
function backToPicker(){$("app").classList.add("hidden");showPicker()}
function logout(){session=null;$("app").classList.add("hidden");$("picker").classList.add("hidden");$("login").classList.remove("hidden");$("password").value="";$("username").value=""}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>showPage(b.dataset.page));

function showPage(page){
 document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("pageTitle").textContent={dashboard:"Dashboard",projects:"Projects",reports:"Reports",settings:"Settings"}[page];
 $("crumb").textContent=current.toUpperCase();
 if(page==="dashboard")dashboard();if(page==="projects")projectsPage();if(page==="reports")reports();if(page==="settings")settings();
}
function dashboard(){
 const a=projects(),s=stats(a);
 const hotels=HOTELS.map(h=>{let x=a.filter(p=>p.hotel===h),z=stats(x);return {h,...z}});
 const depts=DEPTS.map(d=>{let x=a.filter(p=>p.dept===d),z=stats(x);return {d,...z}});
 $("page").innerHTML=`
 <section class="hero"><div><small class="kicker">LIVE PORTFOLIO · ${esc(current.toUpperCase())}</small><h1>Executive <em>control.</em></h1><p>Every hotel, department and milestone — organized in one clear operating view.</p><div class="live-line"><i></i> Live workspace <span>•</span> ${a.length} active records</div></div><div class="ring" style="--p:${s.progress}"><div><b>${s.progress}%</b><small>portfolio<br>progress</small></div></div></section>
 <section class="kpis">
 ${kpi("◆","TOTAL PROJECTS",s.total,"Portfolio size","gold")}${kpi("✓","COMPLETED",s.completed,`${s.total?s.completed/s.total*100|0:0}% of projects`,"green")}${kpi("↗","ON GOING",s.ongoing,"Currently executing","blue")}${kpi("○","NOT STARTED",s.not,"Awaiting start","gray")}
 </section>
 <div class="two-panels">
  <section class="panel"><div class="panel-head"><div><small class="section-label">PROPERTY PERFORMANCE</small><h2>Hotel progress</h2></div><button class="link-btn" onclick="showPage('projects')">View projects →</button></div>
   <div class="hotel-list">${hotels.map(h=>`<div class="hotel-row"><div class="hotel-name"><span>${initials(h.h)}</span><div><b>${esc(h.h)}</b><small>${h.total} projects</small></div></div><strong>${h.progress}%</strong><div class="bar"><i style="width:${h.progress}%"></i></div><div class="mini-states"><span class="green">● ${h.completed} done</span><span class="blue">● ${h.ongoing} live</span><span>● ${h.not} left</span></div></div>`).join("")}</div>
  </section>
  <section class="panel"><div class="panel-head"><div><small class="section-label">DEPARTMENT HEALTH</small><h2>Delivery by department</h2></div></div>
   <div class="dept-list">${depts.map(d=>`<div class="dept"><div class="dept-title"><b>${d.d}</b><span>${d.total} projects</span><strong>${d.progress}%</strong></div><div class="bar"><i style="width:${d.progress}%"></i></div><div class="dept-states"><span class="green">${d.completed} done</span><span class="blue">${d.ongoing} live</span><span>${d.not} left</span></div></div>`).join("")}</div>
  </section>
 </div>
 <section class="panel"><div class="panel-head"><div><small class="section-label">PROJECT CONTROL</small><h2>Latest projects</h2></div><div class="panel-actions"><button class="link-btn" onclick="showPage('projects')">All projects →</button><button class="gold-btn" onclick="openCreate()">＋ Add project</button></div></div>
 <div class="activity">${a.slice(0,7).map(p=>activity(p)).join("")}</div></section>`;
}
function kpi(icon,label,num,sub,color){return `<div class="kpi"><span class="kpi-icon ${color}">${icon}</span><div><small>${label}</small><b>${num}</b><em>${sub}</em></div></div>`}
function initials(x){return x.split(" ").filter(Boolean).slice(0,2).map(a=>a[0]).join("").toUpperCase()}
function activity(p){return `<div class="activity-row"><div class="activity-index">01</div><div class="activity-project"><b>${esc(p.name)}</b><small>${esc(p.hotel)} <i>•</i> ${p.dept} <i>•</i> Due ${date(p.due)}</small></div><span class="status ${cls(p.status)}">${p.status}</span><div class="activity-progress"><b>${p.progress}%</b><i><b style="width:${p.progress}%"></b></i></div><span class="priority ${p.priority.toLowerCase()}">${p.priority}</span>${session.admin?`<button class="edit-link" onclick="openEdit('${p.id}')">Edit</button>`:""}</div>`}

function projectsPage(){
 $("page").innerHTML=`<div class="page-heading"><div><small class="section-label">${esc(current.toUpperCase())} / PROJECT REGISTER</small><h1>Projects</h1><p>Search and manage projects with precise hotel, status and department filters.</p></div><button class="gold-btn" onclick="openCreate()">＋ Add project</button></div>
 <section class="panel table-panel"><div class="filters"><div class="filter-search">⌕<input id="search" placeholder="Search project or hotel..."></div><select id="hotel"><option value="">All hotels</option>${HOTELS.map(x=>`<option>${x}</option>`).join("")}</select><select id="status" title="Update status filter"><option value="">Status: All</option><option value="Completed">Status: Completed</option><option value="On Going">Status: On Going</option><option value="Not Started">Status: Not Started</option></select><select id="dept"><option value="">All departments</option>${DEPTS.map(x=>`<option>${x}</option>`).join("")}</select><button class="reset" onclick="resetFilters()">Reset</button></div>
 <div class="table-scroll"><table><thead><tr><th>PROJECT</th><th>HOTEL</th><th>DEPARTMENT</th><th>STATUS</th><th>PROGRESS</th><th>DUE DATE</th><th>PRIORITY</th><th>ACTIONS</th></tr></thead><tbody id="projectRows"></tbody></table></div></section>`;
 ["search","hotel","status","dept"].forEach(id=>$(id).addEventListener("input",renderRows));renderRows();
}
function renderRows(){
 let q=($("search")?.value||"").toLowerCase(),h=$("hotel")?.value||"",s=$("status")?.value||"",d=$("dept")?.value||"";
 let arr=projects().filter(p=>(!q||p.name.toLowerCase().includes(q)||p.hotel.toLowerCase().includes(q))&&(!h||p.hotel===h)&&(!s||p.status===s)&&(!d||p.dept===d));
 $("projectRows").innerHTML=arr.length?arr.map(p=>`<tr><td><div class="table-project"><span>${initials(p.hotel)}</span><div><b>${esc(p.name)}</b><small>Project ID · ${p.id.slice(0,8).toUpperCase()}</small></div></div></td><td>${esc(p.hotel)}</td><td><span class="dept-tag">${p.dept}</span></td><td><span class="status ${cls(p.status)}">${p.status}</span></td><td>${date(p.due)}</td><td class="actions">${session.admin?`<button onclick="openEdit('${p.id}')">Edit</button><button class="danger" onclick="deleteProject('${p.id}')">Delete</button>`:`<span class="locked">View only</span>`}</td></tr>`).join(""):`<tr><td colspan="8" class="empty">No projects found. Try another filter.</td></tr>`;
}
function resetFilters(){["search"].forEach(id=>$(id).value="");["hotel","status","dept"].forEach(id=>$(id).value="");renderRows()}

function reports(){
 let a=projects(),s=stats(a);
 $("page").innerHTML=`<div class="page-heading"><div><small class="section-label">EXECUTIVE REPORTING</small><h1>Reports</h1><p>A clean management summary of ${esc(current)}.</p></div></div>
 <div class="report-cards"><div class="report-card"><small>PORTFOLIO PROGRESS</small><b>${s.progress}%</b><div class="bigbar"><i style="width:${s.progress}%"></i></div><span>Average project completion</span></div><div class="report-card"><small>STATUS MIX</small><div class="mix"><div><b>${s.completed}</b><span>Completed</span></div><div><b>${s.ongoing}</b><span>On Going</span></div><div><b>${s.not}</b><span>Not Started</span></div></div></div></div>
 <section class="panel"><div class="panel-head"><div><small class="section-label">HOTEL BENCHMARK</small><h2>Property ranking</h2></div></div><div class="ranking">${HOTELS.map((h,i)=>{let z=stats(a.filter(p=>p.hotel===h));return `<div><span>${String(i+1).padStart(2,"0")}</span><b>${h}</b><i><b style="width:${z.progress}%"></b></i><strong>${z.progress}%</strong></div>`}).join("")}</div></section>`;
}
function settings(){
 $("page").innerHTML=`<div class="page-heading"><div><small class="section-label">ACCESS & WORKSPACE</small><h1>Settings</h1><p>Current session and permission information.</p></div></div><section class="panel settings">${setting("01","Account",session.user+" · "+session.role)}${setting("02","Permissions",session.admin?"Add, edit and delete projects":"Add projects only")}${setting("03","Workspace",current)}${setting("04","Data storage","Local browser demo — ready to connect to a secure backend.")}</section>`;
}
function setting(n,t,v){return `<div><span>${n}</span><div><b>${t}</b><small>${esc(v)}</small></div></div>`}

function openCreate(){editId=null;fillForm();$("modalKicker").textContent=current.toUpperCase()+" / NEW PROJECT";$("modalTitle").textContent="Add project";$("modalDesc").textContent="Create a project in this workspace.";openModal()}
function openEdit(id){if(!session.admin){toast("Admin access required.");return}let p=projects().find(x=>x.id===id);if(!p)return;editId=id;fillForm(p);$("modalKicker").textContent=current.toUpperCase()+" / EDIT PROJECT";$("modalTitle").textContent="Edit project";$("modalDesc").textContent="Update the selected project.";openModal()}
function fillForm(p=null){$("fHotel").innerHTML=HOTELS.map(x=>`<option ${p?.hotel===x?"selected":""}>${x}</option>`).join("");$("fDept").innerHTML=DEPTS.map(x=>`<option ${p?.dept===x?"selected":""}>${x}</option>`).join("");$("fName").value=p?.name||"";$("fStatus").value=p?.status||"Not Started";$("fDate").value=p?.due||""}
function openModal(){$("modal").classList.add("show");setTimeout(()=>$("fName").focus(),50)}
function closeModal(){$("modal").classList.remove("show")}
$("projectForm").addEventListener("submit",e=>{
 e.preventDefault();let p={id:editId||crypto.randomUUID(),name:$("fName").value.trim(),hotel:$("fHotel").value,dept:$("fDept").value,status:$("fStatus").value,progress:editId?(projects().find(x=>x.id===editId)?.progress||0):0,due:$("fDate").value,priority:editId?(projects().find(x=>x.id===editId)?.priority||"Medium"):"Medium"};
 if(!p.name||!p.due)return;
 if(p.status==="Completed")p.progress=100;if(p.status==="Not Started")p.progress=0;
 if(editId){let i=projects().findIndex(x=>x.id===editId);if(i>=0)projects()[i]=p;toast("Project updated successfully.");}
 else{projects().unshift(p);toast("Project added successfully.");}
 save();closeModal();$("projectCount").textContent=projects().length;showPage("projects");
});
function deleteProject(id){if(!session.admin){toast("Admin access required.");return}let p=projects().find(x=>x.id===id);if(!p)return;if(confirm(`Delete "${p.name}"?`)){DATA[current]=projects().filter(x=>x.id!==id);save();$("projectCount").textContent=projects().length;renderRows();toast("Project deleted.");}}
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeModal()});
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
$("globalSearch").addEventListener("input",e=>{if(document.querySelector(".nav.active")?.dataset.page==="projects"&&$("search")){$("search").value=e.target.value;renderRows()}});

// repair legacy V4 object-array data if it exists
if(Array.isArray(DATA["Winter Project"]?.[0])) DATA=seed;
save();
