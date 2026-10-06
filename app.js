const departments=["Maintenance","IT","HK","FB","Pest Control","Laundry","HR","FO"];
const hotels=["Jaz Almaza Beach","Jaz Elite Crystal","Jaz Oriental","Jaz Tamerina","Jaz Neo Almazino","Jaz Viva Casa Maza","Jaz Viva Villagio","Jaz Viva Blu"];
const projects=[
["AC Unit Maintenance - Room 1024","Completed","Maintenance","12 Oct 2025","Jaz Almaza Beach","High"],
["Fire Alarm System Check","In Progress","IT","14 Oct 2025","Jaz Elite Crystal","High"],
["Guest Room Deep Cleaning","In Progress","HK","15 Oct 2025","Jaz Oriental","Medium"],
["Kitchen Equipment Repair","Not Started","FB","16 Oct 2025","Jaz Tamerina","High"],
["Pool Water Analysis","Completed","Pest Control","10 Oct 2025","Jaz Neo Almazino","Medium"],
["Laundry Machine Service","In Progress","Laundry","17 Oct 2025","Jaz Viva Casa Maza","Medium"],
["HR Training Session","Not Started","HR","18 Oct 2025","Jaz Viva Villagio","Low"],
["POS System Update","In Progress","IT","20 Oct 2025","Jaz Viva Blu","High"],
["Guest Room Furniture Check","Completed","FO","11 Oct 2025","Jaz Almaza Beach","Low"],
["Pest Control Monthly Service","Not Started","Pest Control","22 Oct 2025","Jaz Elite Crystal","Medium"]
];
const hotelProgress=[78,62,70,55,68,73,61,66];
const page=document.getElementById("page");

function cls(s){return s==="Completed"?"done":s==="In Progress"?"progress":"pending"}
function deptCls(s){return s.toLowerCase().replaceAll(" ","-")}
function shell(title,kicker,body){page.innerHTML=`<div class="page-head"><div><small class="gold-label">${kicker}</small><h1>${title}</h1></div><div class="head-actions">${title==="Dashboard"?`<button class="ghost" onclick="showPage('reports')">View Reports →</button>`:`<button class="ghost" onclick="showPage('dashboard')">← Dashboard</button>`}</div></div>${body}`}

function dashboard(){
shell("Projects & Maintenance","WINTER PROJECT",`
<section class="hero"><div><small>WINTER PROJECT</small><h2>Projects & Maintenance</h2><p>Better Operations <b>•</b> Sustainable Future</p><div class="hero-stats"><span><b>12</b><small>Active Projects</small></span><span><b>8</b><small>Departments</small></span><span><b>8</b><small>Hotels</small></span></div></div><strong>WINTER<br><i>PROJECT</i></strong></section>
<div class="metrics"><div><small>Total Projects</small><b>125</b><span>↑ 12% this month</span></div><div><small>Completed</small><b>85</b><span>68% of portfolio</span></div><div><small>In Progress</small><b>29</b><span>23% of portfolio</span></div><div><small>Not Started</small><b>11</b><span>9% of portfolio</span></div></div>
<div class="grid2"><section class="card"><div class="card-head"><div><small>OPERATIONS</small><h2>Project List</h2></div><div class="actions"><input id="dashSearch" placeholder="Search project..."><select id="dashFilter"><option value="all">All Departments</option>${departments.map(x=>`<option>${x}</option>`).join("")}</select><button class="primary" onclick="openModal()">＋ New Project</button></div></div><div class="table-scroll"><table><thead><tr><th>#</th><th>Project</th><th>Status</th><th>Department</th><th>Due Date</th><th>Hotel</th><th></th></tr></thead><tbody id="rows"></tbody></table></div></section>
<aside class="card hotels"><div class="card-head"><div><small>PORTFOLIO</small><h2>Hotels</h2></div><button class="text-btn" onclick="showPage('hotels')">View All →</button></div><div id="hotelList"></div></aside></div>
<section class="card"><div class="card-head"><div><small>PERFORMANCE</small><h2>Project Progress</h2></div><select><option>All Bay</option><option>Jaz Almaza Beach</option></select></div><div class="progress-grid">${hotels.map((h,i)=>progressCard(h,hotelProgress[i])).join("")}</div></section>
<div class="summary"><div class="summary-title">▤ <span><b>All Bay</b><small>Total Project Progress</small></span></div><div class="big-ring"><b>68%</b></div><div class="legend"><span>● 68% Completed</span><span>● 32% Remaining</span></div><div class="summary-stat">Total Projects <b>125</b></div><div class="summary-stat">Completed <b>85</b></div><div class="summary-stat">In Progress <b>29</b></div><div class="summary-stat">Not Started <b>11</b></div></div>`);
renderRows();renderHotels();
document.getElementById("dashSearch").oninput=renderRows;document.getElementById("dashFilter").onchange=renderRows;
}
function progressCard(h,p){return `<div class="progress-card"><b>${h}</b><div class="ring" style="--p:${p}%"><span>${p}%</span></div><small>● ${p}% Completed</small><small>● ${100-p}% Remaining</small></div>`}
function renderRows(){
let q=(document.getElementById("dashSearch")?.value||"").toLowerCase(),f=document.getElementById("dashFilter")?.value||"all";
let arr=projects.filter(p=>(!q||p.join(" ").toLowerCase().includes(q))&&(f==="all"||p[2]===f));
document.getElementById("rows").innerHTML=arr.map((p,i)=>`<tr><td>${i+1}</td><td><strong>${p[0]}</strong></td><td><span class="status ${cls(p[1])}">● ${p[1]}</span></td><td><span class="dept ${deptCls(p[2])}">${p[2]}</span></td><td>${p[3]}</td><td>${p[4]}</td><td>•••</td></tr>`).join("")||`<tr><td colspan="7" class="empty">No projects found</td></tr>`;
}
function renderHotels(){document.getElementById("hotelList").innerHTML=hotels.map((h,i)=>`<div class="hotel-row" onclick="showPage('hotels')"><div class="thumb t${i}"></div><div><b>${h}</b><small>${i%2?"Sharm El Sheikh":"Marsa Alam"}</small></div><span>›</span></div>`).join("")}

function projectsPage(){shell("Projects","OPERATIONS",`<section class="card"><div class="card-head"><div><small>PROJECT MANAGEMENT</small><h2>All Projects</h2></div><button class="primary" onclick="openModal()">＋ New Project</button></div><div class="filterbar"><input id="allSearch" placeholder="Search project, hotel or department..."><select id="allFilter"><option value="all">All Statuses</option><option>Completed</option><option>In Progress</option><option>Not Started</option></select></div><div class="table-scroll"><table><thead><tr><th>#</th><th>Project</th><th>Status</th><th>Department</th><th>Due Date</th><th>Hotel</th><th>Priority</th></tr></thead><tbody id="allRows"></tbody></table></div></section>`);
function draw(){let q=allSearch.value.toLowerCase(),f=allFilter.value;allRows.innerHTML=projects.filter(p=>(!q||p.join(" ").toLowerCase().includes(q))&&(f==="all"||p[1]===f)).map((p,i)=>`<tr><td>${i+1}</td><td><strong>${p[0]}</strong></td><td><span class="status ${cls(p[1])}">● ${p[1]}</span></td><td><span class="dept ${deptCls(p[2])}">${p[2]}</span></td><td>${p[3]}</td><td>${p[4]}</td><td><span class="priority ${p[5].toLowerCase()}">${p[5]}</span></td></tr>`).join("")};allSearch.oninput=draw;allFilter.onchange=draw;draw()}

function maintenancePage(){shell("Maintenance","ASSET CARE",`<div class="metrics"><div><small>Open Work Orders</small><b>18</b><span>5 high priority</span></div><div><small>Preventive Tasks</small><b>42</b><span>92% on schedule</span></div><div><small>Assets</small><b>1,284</b><span>Across 8 hotels</span></div><div><small>Avg. Response</small><b>2.4h</b><span>↓ 18% improvement</span></div></div><div class="grid3">${["HVAC & Cooling","Electrical Systems","Plumbing & Water","Kitchen Equipment","Fire & Safety","Guest Room Assets"].map((x,i)=>`<div class="feature card"><div class="feature-icon">${["❄","ϟ","≈","♨","♢","▣"][i]}</div><h3>${x}</h3><p>${[8,4,3,6,2,11][i]} active work orders</p><button class="text-btn">Open module →</button></div>`).join("")}</div>`)}

function reportsPage(){shell("Reports & Analytics","INSIGHTS",`<div class="report-grid"><section class="card chart"><div class="card-head"><div><small>PORTFOLIO PERFORMANCE</small><h2>Completion Trend</h2></div><select><option>Last 6 Months</option></select></div><div class="bars">${[48,55,52,64,61,78,68].map((v,i)=>`<div><span style="height:${v}%"></span><small>${["May","Jun","Jul","Aug","Sep","Oct","Nov"][i]}</small></div>`).join("")}</div></section><section class="card"><small>STATUS DISTRIBUTION</small><h2>Project Health</h2><div class="health"><div class="health-ring"><b>68%</b></div><div><p>Completed <strong>85</strong></p><p>In Progress <strong>29</strong></p><p>Not Started <strong>11</strong></p></div></div></section></div><section class="card"><div class="card-head"><div><small>EXECUTIVE REPORT</small><h2>Portfolio Snapshot</h2></div><button class="primary" onclick="alert('Report export prepared in the full backend version.')">Export Report</button></div><div class="report-table">${hotels.map((h,i)=>`<div><b>${h}</b><span>${hotelProgress[i]}% complete</span><div><i style="width:${hotelProgress[i]}%"></i></div></div>`).join("")}</div></section>`)}

function hotelsPage(){shell("Hotels","PORTFOLIO",`<div class="hotel-grid">${hotels.map((h,i)=>`<div class="hotel-card card"><div class="large-thumb t${i}"></div><div><small>${i%2?"SHARM EL SHEIKH":"MARSA ALAM"}</small><h3>${h}</h3><p>${hotelProgress[i]}% project completion</p><div class="mini-bar"><i style="width:${hotelProgress[i]}%"></i></div><button class="text-btn">View hotel →</button></div></div>`).join("")}</div>`)}

function departmentsPage(){shell("Departments","ORGANIZATION",`<div class="grid3">${departments.map((d,i)=>`<div class="card department"><div class="dept-symbol">${["⌕","▣","♙","♨","♢","▤","♙","⌂"][i]}</div><h3>${d}</h3><p>${[28,14,31,17,9,12,6,22][i]} assigned projects</p><span class="dept ${deptCls(d)}">${Math.round([28,14,31,17,9,12,6,22][i]/125*100)}% share</span></div>`).join("")}</div>`)}

function settingsPage(){shell("Settings","ADMINISTRATION",`<div class="settings card">${["Company Profile","User & Access Management","Notifications","Appearance","Data & Integrations","Security"].map((x,i)=>`<button><span>${["▤","♙","♧","☼","⌘","◇"][i]}</span><div><b>${x}</b><small>${["Branding, company information and defaults","Roles, permissions and administrators","Email, alerts and task reminders","Theme and dashboard preferences","API and data connection settings","Authentication and security controls"][i]}</small></div><strong>›</strong></button>`).join("")}</div>`)}

function showPage(name){document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===name));({dashboard,projects:projectsPage,maintenance:maintenancePage,reports:reportsPage,hotels:hotelsPage,departments:departmentsPage,settings:settingsPage}[name]||dashboard)()}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
function openModal(){document.getElementById("modal").classList.add("open")}
document.getElementById("close").onclick=()=>document.getElementById("modal").classList.remove("open");
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("open")};
document.getElementById("theme").onclick=()=>document.body.classList.toggle("dark");
document.getElementById("form").addEventListener("submit",e=>{e.preventDefault();projects.unshift([name.value,"Not Started",dept.value,new Date(date.value+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),hotel.value,priority.value]);document.getElementById("modal").classList.remove("open");e.target.reset();showPage("projects")});
document.getElementById("dept").innerHTML=departments.map(x=>`<option>${x}</option>`).join("");document.getElementById("hotel").innerHTML=hotels.map(x=>`<option>${x}</option>`).join("");
document.getElementById("globalSearch").oninput=e=>{if(e.target.value&&!location.hash.includes("projects"))showPage("projects");document.getElementById("allSearch")&&(document.getElementById("allSearch").value=e.target.value,document.getElementById("allSearch").dispatchEvent(new Event("input")))};
showPage("dashboard");
