// ---------- Data (edit this array to change events) ----------
const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const EVENTS = [
  {id:1,title:"The Creative Social",cat:"Art",date:"2026-11-22T16:00",venue:"The Hub, Bhubaneswar",price:"₹299",img:U("photo-1511795409834-ef04bbd61622"),desc:"An afternoon for makers and curious minds. Meet local creatives, swap ideas and leave inspired."},
  {id:2,title:"Future Forward Tech",cat:"Technology",date:"2026-11-28T10:00",venue:"KIIT Convention Centre",price:"Free",img:U("photo-1540575467063-178a50c2df87"),desc:"A full day of demos and talks on AI, design and the tech shaping tomorrow."},
  {id:3,title:"Afterglow: Live Sessions",cat:"Music",date:"2026-12-05T18:30",venue:"Ekamra Haat",price:"₹499",img:U("photo-1501386761578-eac5c94b800a"),desc:"An open-air evening of indie sounds and warm lights. Discover emerging artists."},
  {id:4,title:"HackNight 24h",cat:"Technology",date:"2026-12-12T18:00",venue:"Campus 14, Lab Block",price:"Free",img:U("photo-1517694712202-14dd9538aa97"),desc:"A 24-hour build sprint. Teams of up to four, free snacks, demos at sunrise."},
  {id:5,title:"Frames of Odisha",cat:"Art",date:"2026-12-15T11:00",venue:"Odisha Modern Art Gallery",price:"₹150",img:U("photo-1531058020387-3be344556be6"),desc:"Photography, illustration and mixed media celebrating the colours of Odisha."},
  {id:6,title:"Sunday Run Club",cat:"Community",date:"2026-12-20T06:00",venue:"Forest Park",price:"Free",img:U("photo-1552674605-db6ffd4facb5"),desc:"No pace goals, no pressure. A friendly morning run and coffee after. All levels welcome."},
  {id:7,title:"Git & GitHub Workshop",cat:"Technology",date:"2027-01-08T11:00",venue:"Seminar Hall 2, KIIT",price:"Free",img:U("photo-1555066931-4365d14bab8c"),desc:"Branches, pull requests and deploying a site live. Hands-on, bring a laptop."},
  {id:8,title:"The Sound of Stories",cat:"Music",date:"2027-01-09T17:00",venue:"Rabindra Mandap",price:"₹399",img:U("photo-1516280440614-37939bbacd81"),desc:"Spoken word, acoustic music and storytelling in one intimate evening."}
];
const CATS = ["All","Music","Technology","Art","Community"];
const KEY = "muster_regs";
const $ = s => document.querySelector(s);
let cat = "All", query = "";

// ---------- Helpers ----------
const fmt = d => new Date(d).toLocaleString("en-IN",{weekday:"short",day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
const upcoming = () => EVENTS.filter(e => new Date(e.date) > new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date));
const getRegs = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const saveRegs = r => { try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {} };
const esc = s => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const FALLBACK = "linear-gradient(135deg,#8B7BFF,#E7FF72)";
const bg = e => `background-image:url('${e.img}'),${FALLBACK}`;

// ---------- Grid ----------
function renderChips(){
  $("#chips").innerHTML = CATS.map(c => `<button class="chip" aria-pressed="${c===cat}" data-cat="${c}">${c==="All"?"All events":c}</button>`).join("");
}
function renderGrid(){
  const q = query.trim().toLowerCase();
  const list = upcoming().filter(e => (cat==="All"||e.cat===cat) && [e.title,e.venue,e.desc,e.cat].join(" ").toLowerCase().includes(q));
  $("#count").textContent = `${list.length} event${list.length===1?"":"s"} to explore`;
  $("#empty").hidden = list.length > 0;
  $("#grid").innerHTML = list.map(e => {
    const d = new Date(e.date);
    return `<article class="card">
      <div class="c-img" style="${bg(e)}" role="img" aria-label="${esc(e.title)}">
        <span class="c-cat">${e.cat}</span>
        <span class="c-date">${d.getDate()}<small>${d.toLocaleString("en-IN",{month:"short"})}</small></span>
      </div>
      <div class="c-body">
        <h3><button data-open="${e.id}">${e.title}</button></h3>
        <p class="c-desc">${e.desc}</p>
        <div class="c-foot"><span>📍 ${e.venue}</span><strong>${e.price}</strong></div>
      </div></article>`;
  }).join("");
}
$("#chips").addEventListener("click", ev => { const b = ev.target.closest("[data-cat]"); if(b){ cat=b.dataset.cat; renderChips(); renderGrid(); }});
$("#search").addEventListener("input", ev => { query = ev.target.value; renderGrid(); });
$("#clear").onclick = () => { cat="All"; query=""; $("#search").value=""; renderChips(); renderGrid(); };
$("#grid").addEventListener("click", ev => { const b = ev.target.closest("[data-open]"); if(b) openEvent(+b.dataset.open); });

// ---------- Modal + form ----------
const modal = $("#modal"), form = $("#form");
function openEvent(id){
  const e = EVENTS.find(x => x.id===id); if(!e) return;
  $("#mImg").style.cssText = bg(e);
  $("#mCat").textContent = e.cat;
  $("#mTitle").textContent = e.title;
  $("#mMeta").textContent = `${fmt(e.date)} · ${e.venue} · ${e.price}`;
  $("#mDesc").textContent = e.desc;
  $("#evSelect").innerHTML = `<option value="">Choose an event</option>` + upcoming().map(x => `<option value="${x.id}">${x.title}</option>`).join("");
  form.reset(); $("#evSelect").value = id; clearErrors();
  form.hidden = false; $("#done").hidden = true;
  modal.showModal();
}
$("#closeBtn").onclick = $("#doneBtn").onclick = () => modal.close();
modal.addEventListener("click", ev => { if(ev.target===modal) modal.close(); });
$("#nextBtn").onclick = () => { const n = upcoming()[0]; if(n) openEvent(n.id); };

const rules = {
  name: v => /^[A-Za-z][A-Za-z .'-]{1,}$/.test(v.trim()) ? "" : "Enter your full name using letters only (min. 2 characters).",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email, like name@example.com.",
  phone: v => /^[6-9]\d{9}$/.test(v.replace(/^\+91|[\s-]/g,"")) ? "" : "Enter a 10-digit mobile number starting with 6–9.",
  evSelect: v => v ? "" : "Choose the event you want to attend."
};
const errBox = {name:"#e-name",email:"#e-email",phone:"#e-phone",evSelect:"#e-ev"};
function check(id){
  const el = $("#"+id), msg = rules[id](el.value);
  $(errBox[id]).textContent = msg;
  el.closest(".field").classList.toggle("bad", !!msg);
  el.setAttribute("aria-invalid", !!msg);
  return !msg;
}
function clearErrors(){ Object.keys(rules).forEach(id => { $(errBox[id]).textContent=""; $("#"+id).closest(".field").classList.remove("bad"); }); }
Object.keys(rules).forEach(id => $("#"+id).addEventListener("blur", () => check(id)));

form.addEventListener("submit", ev => {
  ev.preventDefault();
  if(!Object.keys(rules).map(check).every(Boolean)){ form.querySelector(".bad input, .bad select")?.focus(); return; }
  const evt = EVENTS.find(x => x.id === +$("#evSelect").value);
  const email = $("#email").value.trim().toLowerCase();
  const regs = getRegs();
  if(regs.some(r => r.eventId===evt.id && r.email===email)){
    $(errBox.email).textContent = "This email is already registered for that event.";
    $("#email").closest(".field").classList.add("bad"); return;
  }
  const name = $("#name").value.trim();
  regs.push({ref:"MUS-"+Date.now().toString(36).toUpperCase(), eventId:evt.id, name, email, phone:$("#phone").value.trim()});
  saveRegs(regs);
  $("#doneMsg").innerHTML = `Thanks, <b>${esc(name)}</b>. You're registered for <b>${esc(evt.title)}</b> on ${fmt(evt.date)} at ${esc(evt.venue)}.`;
  form.hidden = true; $("#done").hidden = false;
  renderMine();
});

// ---------- My registrations ----------
function renderMine(){
  const regs = getRegs();
  $("#regCount").textContent = regs.length;
  $("#myEmpty").hidden = regs.length > 0;
  $("#myList").innerHTML = regs.map(r => {
    const e = EVENTS.find(x => x.id===r.eventId);
    return `<li><span><b>${e.title}</b><br><span class="muted">${fmt(e.date)} · ${esc(r.name)} · ${r.ref}</span></span><button data-cancel="${r.ref}">Cancel</button></li>`;
  }).join("");
}
$("#myList").addEventListener("click", ev => { const b = ev.target.closest("[data-cancel]"); if(b){ saveRegs(getRegs().filter(r => r.ref!==b.dataset.cancel)); renderMine(); }});

// ---------- Countdown ----------
function tick(){
  const n = upcoming()[0];
  if(!n){ $("#nextTitle").textContent = "No upcoming events"; $("#nextBtn").hidden = true; return; }
  $("#nextTitle").textContent = n.title;
  $("#nextMeta").textContent = `${fmt(n.date)} · ${n.venue}`;
  let s = Math.max(0, Math.floor((new Date(n.date) - new Date())/1000));
  const p = x => String(x).padStart(2,"0");
  $("#cd-d").textContent = p(Math.floor(s/86400)); s %= 86400;
  $("#cd-h").textContent = p(Math.floor(s/3600)); s %= 3600;
  $("#cd-m").textContent = p(Math.floor(s/60));
  $("#cd-s").textContent = p(s%60);
}

// ---------- Theme ----------
function setTheme(t){
  document.documentElement.dataset.theme = t;
  $("#themeBtn").textContent = t==="dark" ? "☀" : "☾";
  $("#themeBtn").setAttribute("aria-label", t==="dark" ? "Switch to light mode" : "Switch to dark mode");
  try{ localStorage.setItem("muster_theme", t); }catch{}
}
let saved = null; try{ saved = localStorage.getItem("muster_theme"); }catch{}
setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme==="dark" ? "light" : "dark");

// ---------- Newsletter ----------
$("#newsForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const v = $("#newsEmail").value.trim(), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  $("#newsForm").classList.toggle("bad", !ok);
  $("#newsMsg").textContent = ok ? "You're on the list. See you in your inbox!" : "Enter a valid email, like name@example.com.";
  if(ok) $("#newsEmail").value = "";
});

// ---------- Init ----------
renderChips(); renderGrid(); renderMine(); tick(); setInterval(tick, 1000);
