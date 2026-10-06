const hotels=["Jaz Almaza Beach","Jaz Elite Crystal","Jaz Oriental","Jaz Tamerina","Jaz Neo Almazino","Jaz Viva Casa Maza","Jaz Viva Villagio","Jaz Viva Blu"];
const departments=["Kitchen","Engineering","HR","IT","FO","FB","Recreation"];
const systems={
 "Winter Project":{tag:"PROJECTS",desc:"Strategic projects & portfolio delivery",accent:"gold",progress:68},
 "Maintenance":{tag:"MAINTENANCE",desc:"Preventive maintenance & work orders",accent:"cyan",progress:74},
 "Manufacturing":{tag:"MANUFACTURING",desc:"Production, assets & manufacturing projects",accent:"violet",progress:61}
};
const seed={
 "Winter Project":[
 ["AC Unit Maintenance - Room 1024","Completed","Engineering","12 Oct 2025","Jaz Almaza Beach",100,"High"],
 ["Fire Alarm System Check","On Going","IT","14 Oct 2025","Jaz Elite Crystal",62,"High"],
 ["Guest Room Deep Cleaning","On Going","FO","15 Oct 2025","Jaz Oriental",55,"Medium"],
 ["Kitchen Equipment Repair","Not Started","Kitchen","16 Oct 2025","Jaz Tamerina",0,"High"],
 ["Pool Water Analysis","Completed","Recreation","10 Oct 2025","Jaz Neo Almazino",100,"Medium"],
 ["Laundry Machine Service","On Going","Engineering","17 Oct 2025","Jaz Viva Casa Maza",72,"Medium"],
 ["HR Training Session","Not Started","HR","18 Oct 2025","Jaz Viva Villagio",0,"Low"],
 ["POS System Update","On Going","IT","20 Oct 2025","Jaz Viva Blu",48,"High"],
 ["Guest Room Furniture Check","Completed","FO","11 Oct 2025","Jaz Almaza Beach",100,"Low"],
 ["Pest Control Monthly Service","Not Started","Recreation","22 Oct 2025","Jaz Elite Crystal",0,"Medium"]
 ],
 "Maintenance":[
 ["HVAC Preventive Service","Completed","Engineering","09 Oct 2025","Jaz Almaza Beach",100,"High"],
 ["Generator Inspection","On Going","Engineering","13 Oct 2025","Jaz Elite Crystal",68,"High"],
 ["Kitchen Exhaust Service","On Going","Kitchen","15 Oct 2025","Jaz Oriental",54,"Medium"],
 ["Guest Room Plumbing","Not Started","Engineering","18 Oct 2025","Jaz Tamerina",0,"High"],
 ["Pool Pump Maintenance","Completed","Recreation","08 Oct 2025","Jaz Neo Almazino",100,"Medium"],
 ["IT Room Cooling Check","On Going","IT","19 Oct 2025","Jaz Viva Blu",70,"High"]
 ],
 "Manufacturing":[
 ["Laundry Line Upgrade","On Going","Engineering","16 Oct 2025","Jaz Almaza Beach",58,"High"],
 ["Kitchen Fabrication Batch A","Completed","Kitchen","11 Oct 2025","Jaz Elite Crystal",100,"Medium"],
 ["Furniture Production Run","On Going","FO","21 Oct 2025","Jaz Oriental",44,"Medium"],
 ["Maintenance Parts Batch","Not Started","Engineering","24 Oct 2025","Jaz Tamerina",0,"High"],
 ["Recreation Equipment Build","On Going","Recreation","26 Oct 2025","Jaz Viva Villagio",63,"Low"]
 ]
};
let data=JSON.parse(localStorage.getItem("winterDataV3")||"null")||seed;
let session=null,currentSystem="Winter Project",editIndex=null;

const $=id=>document.getElementById(id);
function save(){localStorage.setItem("winterDataV3",JSON.stringify(data))}
function statusClass(s){return s==="Completed"?"done":s==="On Going"?"going":"pending"}
function deptClass(s){return s.toLowerCase().replaceAll(" ","-")}
function pct(list){if(!list.length)return 0;return Math.round(list.reduce((a,p)=>a+p[5],0)/list.length)}
function counts(list){return {completed:list.filter(p=>p[1]==="Completed").length,ongoing:list.filter(p=>p[1]==="On Going").length,not:list.filter(p=>p[1]==="Not Started").length}}
function login(){
 const u=$("loginUser").value.trim(),pw=$("loginPass").value;
 if((u==="admin"&&pw==="admin00")||(u==="operator"&&pw==="operator00")){
   session={username:u,role:u==="admin"?"Administrator":"Project Operator",canEdit:u==="admin",canDelete:u==="admin",canAdd:true};
   $("loginError").textContent=""; $("loginScreen").classList.add("hidden"); $("systemScreen").classList.remove("hidden"); renderSystems();
 }else $("loginError").textContent="Incorrect username or password.";
}
$("loginForm").onsubmit=e=>{e.preventDefault();login()}
$("showPass").onclick=()=>{const x=$("loginPass");x.type=x.type==="password"?"text":"password"}
function logout(){session=null;$("app").classList.add("hidden");$("systemScreen").classList.add("hidden");$("loginScreen").classList.remove("hidden");$("loginPass").value=""}
function renderSystems(){
 $("systemUser").textContent=`${session.username} • ${session.role}`;
 $("systemCards").innerHTML=Object.entries(systems).map(([name,s],i)=>{
   const list=data[name],p=pct(list),c=counts(list);
   return `<button class="system-card ${s.accent}" onclick="enterSystem('${name}')"><div class="sys-top"><span>${["✦","⚙","▣"][i]}</span><small>${s.tag}</small></div><h2>${name}</h2><p>${s.desc}</p><div class="sys-progress"><div><b>${p}%</b><small>overall progress</small></div><div class="bar"><i style="width:${p}%"></i></div></div><div class="sys-stats"><span><b>${list.length}</b>Projects</span><span><b>${c.completed}</b>Completed</span><span><b>${c.ongoing}</b>On Going</span></div><em>Open system →</em></button>`
 }).join("")
}
function enterSystem(name){currentSystem=name;$("systemScreen").classList.add("hidden");$("app").classList.remove("hidden");$("sideSystem").textContent=name;$("topUser").textContent=session.username;$("topRole").textContent=session.role;$("avatar").textContent=session.username.slice(0,2).toUpperCase();$("projectCount").textContent=data[name].length;showPage("dashboard")}
function selectSystemScreen(){ $("app").classList.add("hidden");$("systemScreen").classList.remove("hidden");renderSystems()}
function nav(){document.querySelectorAll(".nav").forEach(x=>x.onclick=()=>showPage(x.dataset.page))}
function showPage(name){document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===name));({dashboard,projects:projectsPage,reports:reportsPage,settings:settingsPage}[name]||dashboard)()}
function dashboard(){
 const list=data[currentSystem],c=counts(list),p=pct(list);
 const hotelStats=hotels.map(h=>{let a=list.filter(x=>x[4]===h);return [h,pct(a),a.length]});
 const depStats=departments.map(d=>{let a=list.filter(x=>x[2]===d);return [d,pct(a),a.length,counts(a)]});
 $("page").innerHTML=`<div class="hero"><div><small>${currentSystem.toUpperCase()}</small><h1>Executive Dashboard</h1><p>${systems[currentSystem].desc} <b>•</b> Live operational overview</p></div><div class="hero-p"><b>${p}%</b><small>Portfolio<br>Progress</small></div></div>
 <div class="metric-grid"><div><small>Total Projects</small><b>${list.length}</b><span>Active portfolio</span></div><div><small>Completed</small><b>${c.completed}</b><span class="green">● ${Math.round(c.completed/Math.max(list.length,1)*100)}% complete</span></div><div><small>On Going</small><b>${c.ongoing}</b><span class="blue">● In execution</span></div><div><small>Not Started</small><b>${c.not}</b><span class="amber">● Awaiting start</span></div></div>
 <div class="dashboard-grid"><section class="card"><div class="card-head"><div><small>PROPERTY PERFORMANCE</small><h2>Hotel Progress</h2></div><button class="text-btn" onclick="showPage('projects')">Manage Projects →</button></div><div class="hotel-progress">${hotelStats.map(x=>`<div class="hotel-progress-row"><div class="hotel-name"><b>${x[0]}</b><small>${x[2]} project${x[2]===1?"":"s"}</small></div><div class="progress-track"><i style="width:${x[1]}%"></i></div><strong>${x[1]}%</strong></div>`).join("")}</div></section>
 <section class="card"><div class="card-head"><div><small>DEPARTMENT HEALTH</small><h2>Departments</h2></div></div><div class="department-health">${depStats.map(x=>`<div><div class="dep-line"><b>${x[0]}</b><strong>${x[1]}%</strong></div><div class="progress-track"><i style="width:${x[1]}%"></i></div><small><span class="green">${x[3].completed} done</span> · <span class="blue">${x[3].ongoing} ongoing</span> · <span class="amber">${x[3].not} left</span></small></div>`).join("")}</div></section></div>
 <section class="card recent"><div class="card-head"><div><small>PROJECT CONTROL</small><h2>Latest Projects</h2></div><button class="primary" onclick="showPage('projects')">Open Projects</button></div><div class="mini-projects">${list.slice(0,6).map((p,i)=>`<div><span class="project-index">${String(i+1).padStart(2,"0")}</span><div><b>${p[0]}</b><small>${p[4]} · ${p[2]}</small></div><span class="status ${statusClass(p[1])}">${p[1]}</span><strong>${p[5]}%</strong></div>`).join("")}</div></section>`
}
function projectToolbar(){
 return `<div class="project-tools"><input id="projectSearch" placeholder="Search project, hotel..."><select id="hotelFilter"><option value="all">All Hotels</option>${hotels.map(x=>`<option>${x}</option>`).join("")}</select><select id="statusFilter"><option value="all">All Statuses</option><option>Completed</option><option>On Going</option><option>Not Started</option></select><select id="deptFilter"><option value="all">All Departments</option>${departments.map(x=>`<option>${x}</option>`).join("")}</select>${session.canAdd?`<button class="primary" onclick="openCreate()">＋ Add Project</button>`:""}</div>`
}
function projectsPage(){
 $("page").innerHTML=`<div class="page-head"><div><small class="gold-label">${currentSystem.toUpperCase()}</small><h1>Projects</h1><p>Complete project control, filtering and lifecycle management.</p></div></div><section class="card project-card"><div class="project-header"><div><small>PROJECT REGISTER</small><h2>${data[currentSystem].length} projects in ${currentSystem}</h2></div></div>${projectToolbar()}<div class="table-scroll"><table><thead><tr><th>#</th><th>Project</th><th>Hotel</th><th>Department</th><th>Status</th><th>Progress</th><th>Due Date</th><th>Priority</th><th>Actions</th></tr></thead><tbody id="projectRows"></tbody></table></div></section>`;
 ["projectSearch","hotelFilter","statusFilter","deptFilter"].forEach(id=>$(id).oninput=renderProjectRows);
 renderProjectRows();
}
function renderProjectRows(){
 let q=($("projectSearch")?.value||$("globalSearch").value).toLowerCase(),hf=$("hotelFilter")?.value||"all",sf=$("statusFilter")?.value||"all",df=$("deptFilter")?.value||"all";
 let arr=data[currentSystem].map((p,i)=>[p,i]).filter(([p])=>(!q||p.join(" ").toLowerCase().includes(q))&&(hf==="all"||p[4]===hf)&&(sf==="all"||p[1]===sf)&&(df==="all"||p[2]===df));
 $("projectRows").innerHTML=arr.map(([p,i])=>`<tr><td>${String(i+1).padStart(2,"0")}</td><td><b>${p[0]}</b></td><td>${p[4]}</td><td><span class="dept ${deptClass(p[2])}">${p[2]}</span></td><td><span class="status ${statusClass(p[1])}">● ${p[1]}</span></td><td><div class="table-progress"><i style="width:${p[5]}%"></i></div><small>${p[5]}%</small></td><td>${p[3]}</td><td><span class="priority ${p[6].toLowerCase()}">${p[6]}</span></td><td class="actions-cell">${session.canEdit?`<button onclick="openEdit(${i})">Edit</button>`:""}${session.canDelete?`<button class="danger" onclick="deleteProject(${i})">Delete</button>`:""}</td></tr>`).join("")||`<tr><td colspan="9" class="empty">No projects match your filters.</td></tr>`;
}
function openCreate(){editIndex=null;$("modalTitle").textContent="Create Project";$("modalDesc").textContent=`Add a project to ${currentSystem}.`;$("modalKicker").textContent=currentSystem.toUpperCase();fillForm();$("modal").classList.add("open")}
function openEdit(i){if(!session.canEdit)return;editIndex=i;const p=data[currentSystem][i];$("modalTitle").textContent="Edit Project";$("modalDesc").textContent="Update project status, ownership and progress.";fillForm(p);$("modal").classList.add("open")}
function fillForm(p){$("pHotel").innerHTML=hotels.map(x=>`<option ${p&&p[4]===x?"selected":""}>${x}</option>`).join("");$("pDept").innerHTML=departments.map(x=>`<option ${p&&p[2]===x?"selected":""}>${x}</option>`).join("");$("pName").value=p?p[0]:"";$("pStatus").value=p?p[1]:"Not Started";$("pDate").value=p?isoDate(p[3]):"";$("pPriority").value=p?p[6]:"Medium";$("pProgress").value=p?p[5]:0}
function isoDate(s){let d=new Date(s);if(isNaN(d))return"";return d.toISOString().slice(0,10)}
function closeModal(){$("modal").classList.remove("open")}
function deleteProject(i){if(!session.canDelete)return;if(confirm(`Delete "${data[currentSystem][i][0]}"?`)){data[currentSystem].splice(i,1);save();$("projectCount").textContent=data[currentSystem].length;projectsPage()}}
$("projectForm").onsubmit=e=>{e.preventDefault();let p=[$("pName").value,$("pStatus").value,$("pDept").value,new Date($("pDate").value+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),$("pHotel").value,Number($("pProgress").value),$("pPriority").value];if(editIndex===null)data[currentSystem].unshift(p);else data[currentSystem][editIndex]=p;save();closeModal();$("projectCount").textContent=data[currentSystem].length;projectsPage()}
function reportsPage(){const list=data[currentSystem],c=counts(list),p=pct(list);$("page").innerHTML=`<div class="page-head"><div><small class="gold-label">${currentSystem.toUpperCase()}</small><h1>Reports & Analytics</h1><p>Executive visibility across properties and departments.</p></div></div><div class="report-kpis"><div class="card"><small>OVERALL</small><b>${p}%</b><span>Portfolio completion</span></div><div class="card"><small>COMPLETED</small><b>${c.completed}</b><span>Projects closed</span></div><div class="card"><small>ON GOING</small><b>${c.ongoing}</b><span>Projects executing</span></div><div class="card"><small>REMAINING</small><b>${c.not}</b><span>Not started</span></div></div><section class="card chart-card"><div class="card-head"><div><small>STATUS MIX</small><h2>Project Health</h2></div></div><div class="health-layout"><div class="donut" style="--done:${c.completed};--run:${c.ongoing};"><b>${p}%</b><small>weighted progress</small></div><div class="health-list"><div><i class="done-dot"></i>Completed <b>${c.completed}</b></div><div><i class="run-dot"></i>On Going <b>${c.ongoing}</b></div><div><i class="not-dot"></i>Not Started <b>${c.not}</b></div></div></div></section>`}
function settingsPage(){$("page").innerHTML=`<div class="page-head"><div><small class="gold-label">ADMINISTRATION</small><h1>Settings</h1><p>Access and interface controls for the current session.</p></div></div><section class="card settings-card"><div><span>◈</span><b>Current account</b><small>${session.username} — ${session.role}</small></div><div><span>◆</span><b>Permissions</b><small>${session.canEdit?"Create, edit and delete projects":"Create projects only"}</small></div><div><span>◉</span><b>Active system</b><small>${currentSystem}</small></div><div><span>✦</span><b>Data storage</b><small>Browser local storage demo — ready for backend integration</small></div></section>`}
$("globalSearch").oninput=()=>{if(document.querySelector(".nav.active")?.dataset.page==="projects")renderProjectRows()}
$("theme").onclick=()=>document.body.classList.toggle("dark");
$("loginForm").addEventListener("submit",e=>e.preventDefault());
nav();
