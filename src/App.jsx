import { useState, useRef, useEffect } from "react";

// ─── BANDITOS FAMILY ──────────────────────────────────────────────────────────

const APP_NAME = "Banditos Family";

const MEMBERS = [
  { name: "Stephan", color: "#FF6B35", avatar: "👨", emoji: "🤠" },
  { name: "Sandra",  color: "#E91E8C", avatar: "👩", emoji: "💃" },
  { name: "Floor",   color: "#00BCD4", avatar: "🧒", emoji: "🌸" },
  { name: "Kiki",    color: "#9C27B0", avatar: "👧", emoji: "⭐" },
];

const SHOPPING_LISTS = [
  { id: "boodschappen", label: "Boodschappen", icon: "🛒", color: "#34C759" },
  { id: "health",       label: "Health & Beauty", icon: "💄", color: "#FF2D55" },
  { id: "cadeaus",      label: "Cadeaus",       icon: "🎁", color: "#FF9F0A" },
  { id: "sport",        label: "Sport",         icon: "⚽", color: "#007AFF" },
  { id: "huis",         label: "Huis",          icon: "🏠", color: "#AF52DE" },
];

const SHOP_CATS = {
  boodschappen: [
    { id: "groente",  label: "🥦 Groente & Fruit", color: "#34C759" },
    { id: "zuivel",   label: "🧀 Zuivel",           color: "#FF9F0A" },
    { id: "vlees",    label: "🥩 Vlees & Vis",      color: "#FF3B30" },
    { id: "bakkerij", label: "🍞 Bakkerij",          color: "#AC8E68" },
    { id: "dranken",  label: "🥤 Dranken",           color: "#007AFF" },
    { id: "overig",   label: "🛒 Overig",            color: "#8E8E93" },
  ],
  health:    [{ id: "huid", label: "🧴 Huidverzorging", color: "#FF2D55" }, { id: "haar", label: "💇 Haar", color: "#FF6B9D" }, { id: "medicijn", label: "💊 Medicijnen", color: "#FF3B30" }, { id: "overig", label: "✨ Overig", color: "#8E8E93" }],
  cadeaus:   [{ id: "verjaardag", label: "🎂 Verjaardag", color: "#FF9F0A" }, { id: "kerst", label: "🎄 Kerst", color: "#34C759" }, { id: "overig", label: "🎁 Overig", color: "#8E8E93" }],
  sport:     [{ id: "kleding", label: "👟 Kleding", color: "#007AFF" }, { id: "uitrusting", label: "🏋️ Uitrusting", color: "#FF9F0A" }, { id: "overig", label: "⚽ Overig", color: "#8E8E93" }],
  huis:      [{ id: "schoonmaak", label: "🧹 Schoonmaak", color: "#5AC8FA" }, { id: "tuin", label: "🌱 Tuin", color: "#34C759" }, { id: "overig", label: "🏠 Overig", color: "#8E8E93" }],
};

const CAL_CATS = [
  { id: "school",    label: "🏫 School",   color: "#007AFF" },
  { id: "sport",     label: "⚽ Sport",    color: "#34C759" },
  { id: "familie",   label: "👨‍👩‍👧‍👦 Familie", color: "#FF9F0A" },
  { id: "werk",      label: "💼 Werk",     color: "#5856D6" },
  { id: "dokter",    label: "🏥 Dokter",   color: "#FF3B30" },
  { id: "verjaardag",label: "🎂 Verjaardag",color: "#FF2D55" },
  { id: "vakantie",  label: "✈️ Vakantie", color: "#30B0C7" },
  { id: "overig",    label: "📅 Overig",   color: "#8E8E93" },
];

const TASK_CATS = [
  { id: "thuis",  label: "🏠 Thuis",    color: "#FF9F0A" },
  { id: "school", label: "🏫 School",   color: "#007AFF" },
  { id: "werk",   label: "💼 Werk",     color: "#5856D6" },
  { id: "bood",   label: "🛒 Boodschap", color: "#34C759" },
  { id: "overig", label: "📋 Overig",   color: "#8E8E93" },
];

// Points per priority level — only earned when you do a task for SOMEONE ELSE
const POINTS_MAP = { laag: 5, normaal: 10, hoog: 20 };

const PRIZES = [
  { rank: 1, label: "🏆 #1 — Diner cheque", value: "€25", color: "#FFD700", bg: "#FFFBEA" },
  { rank: 2, label: "🥈 #2 — Bloemen",      value: "€15", color: "#C0C0C0", bg: "#F5F5F5" },
  { rank: 3, label: "🥉 #3 — Shoppingbon",  value: "€10", color: "#CD7F32", bg: "#FFF3E0" },
];

const MEAL_CATS = [
  { id: "italiaans",  label: "🍝 Italiaans",  color: "#E53935" },
  { id: "aziatisch",  label: "🍜 Aziatisch",  color: "#FB8C00" },
  { id: "hollands",   label: "🥔 Hollands",   color: "#F4511E" },
  { id: "gezond",     label: "🥗 Gezond",     color: "#43A047" },
  { id: "grill",      label: "🔥 Grill/BBQ",  color: "#E53935" },
  { id: "soep",       label: "🍲 Soep",       color: "#8D6E63" },
  { id: "snel",       label: "⚡ Snel klaar", color: "#FF9F0A" },
  { id: "overig",     label: "🍽️ Overig",    color: "#8E8E93" },
];

const NL_DAYS_SHORT  = ["zo","ma","di","wo","do","vr","za"];
const NL_DAYS_LONG   = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
const NL_MONTHS      = ["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];

const today = new Date();
function fmtDate(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function addDays(d,n){ const r=new Date(d); r.setDate(r.getDate()+n); return r; }
function parseDate(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function timeAgo(ts){
  const diff = Date.now() - ts;
  if(diff < 60000) return "nu";
  if(diff < 3600000) return `${Math.floor(diff/60000)}m`;
  if(diff < 86400000) return `${Math.floor(diff/3600000)}u`;
  return `${Math.floor(diff/86400000)}d`;
}

function exportToICS(event){
  const d=parseDate(event.date);
  const [sh,sm]=event.startTime.split(":").map(Number);
  const [eh,em]=event.endTime.split(":").map(Number);
  const fmt=(date,h,m)=>`${date.getFullYear()}${String(date.getMonth()+1).padStart(2,"0")}${String(date.getDate()).padStart(2,"0")}T${String(h).padStart(2,"0")}${String(m).padStart(2,"0")}00`;
  const ics=["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",`DTSTART:${fmt(d,sh,sm)}`,`DTEND:${fmt(d,eh,em)}`,`SUMMARY:${event.title}`,event.location?`LOCATION:${event.location}`:"",`UID:${event.id}@banditos`,"END:VEVENT","END:VCALENDAR"].filter(Boolean).join("\r\n");
  const blob=new Blob([ics],{type:"text/calendar"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=`${event.title}.ics`; a.click();
}

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────

const INIT_EVENTS = [
  { id:1, title:"Voetbaltraining", date:fmtDate(addDays(today,1)), startTime:"16:00", endTime:"17:30", category:"sport", member:"Kiki", location:"Sportpark", notes:"" },
  { id:2, title:"Tandarts Sandra", date:fmtDate(addDays(today,3)), startTime:"10:00", endTime:"11:00", category:"dokter", member:"Sandra", location:"Centrum", notes:"" },
  { id:3, title:"Familiediner",    date:fmtDate(addDays(today,5)), startTime:"18:00", endTime:"21:00", category:"familie", member:"Stephan", location:"Thuis", notes:"Oma komt ook" },
];

const INIT_ITEMS = {
  boodschappen: [
    { id:1, name:"Melk", qty:2, unit:"L", category:"zuivel", addedBy:"Sandra", checked:false },
    { id:2, name:"Brood", qty:1, unit:"stuk", category:"bakkerij", addedBy:"Stephan", checked:false },
    { id:3, name:"Appels", qty:6, unit:"stuks", category:"groente", addedBy:"Floor", checked:true },
  ],
  health:  [{ id:10, name:"Shampoo", qty:1, unit:"fles", category:"haar", addedBy:"Sandra", checked:false }],
  cadeaus: [{ id:20, name:"Cadeau Floor verjaardag", qty:1, unit:"stuk", category:"verjaardag", addedBy:"Stephan", checked:false }],
  sport:   [{ id:30, name:"Sportschoenen Kiki", qty:1, unit:"paar", category:"kleding", addedBy:"Sandra", checked:false }],
  huis:    [{ id:40, name:"Allesreiniger", qty:2, unit:"fles", category:"schoonmaak", addedBy:"Sandra", checked:false }],
};

const INIT_TASKS = [
  { id:1, title:"Kamer opruimen",       category:"thuis",  assignedTo:"Floor",   addedBy:"Sandra",  priority:"hoog",   done:false, deadline:"", notes:"", createdAt: Date.now()-3600000,   doneBy:null,      doneAt:null },
  { id:2, title:"Auto wassen",          category:"thuis",  assignedTo:"Stephan", addedBy:"Sandra",  priority:"normaal",done:false, deadline:"", notes:"", createdAt: Date.now()-7200000,   doneBy:null,      doneAt:null },
  { id:3, title:"Huiswerk wiskunde",    category:"school", assignedTo:"Kiki",    addedBy:"Floor",   priority:"hoog",   done:false, deadline:"", notes:"", createdAt: Date.now()-1800000,   doneBy:null,      doneAt:null },
  { id:4, title:"Boodschappen doen",    category:"bood",   assignedTo:"Stephan", addedBy:"Sandra",  priority:"normaal",done:true,  deadline:"", notes:"", createdAt: Date.now()-86400000,  doneBy:"Stephan", doneAt:Date.now()-82000000 },
  { id:5, title:"Wasmachine inruimen",  category:"thuis",  assignedTo:"Sandra",  addedBy:"Stephan", priority:"normaal",done:true,  deadline:"", notes:"", createdAt: Date.now()-172800000, doneBy:"Floor",   doneAt:Date.now()-170000000 },
  { id:6, title:"Afwassen na diner",    category:"thuis",  assignedTo:"Kiki",    addedBy:"Stephan", priority:"laag",   done:true,  deadline:"", notes:"", createdAt: Date.now()-259200000, doneBy:"Kiki",    doneAt:Date.now()-255000000 },
  { id:7, title:"Tuin opruimen",        category:"thuis",  assignedTo:"Stephan", addedBy:"Sandra",  priority:"hoog",   done:true,  deadline:"", notes:"", createdAt: Date.now()-345600000, doneBy:"Stephan", doneAt:Date.now()-340000000 },
  { id:8, title:"Lunch klaarmaken",     category:"thuis",  assignedTo:"Floor",   addedBy:"Sandra",  priority:"laag",   done:true,  deadline:"", notes:"", createdAt: Date.now()-432000000, doneBy:"Floor",   doneAt:Date.now()-430000000 },
  { id:9, title:"Vaatwasser inruimen",  category:"thuis",  assignedTo:"Sandra",  addedBy:"Floor",   priority:"normaal",done:true,  deadline:"", notes:"", createdAt: Date.now()-518400000, doneBy:"Sandra",  doneAt:Date.now()-515000000 },
];

const INIT_MESSAGES = [
  { id:1, from:"Sandra", text:"Wie haalt vanavond de kinderen op?", ts: Date.now()-3600000*2, reactions:{} },
  { id:2, from:"Stephan", text:"Ik doe het! Ben rond 17:00 thuis 🙌", ts: Date.now()-3600000*1.5, reactions:{} },
  { id:3, from:"Floor", text:"Mama kunnen we pizza eten vanavond? 🍕", ts: Date.now()-3600000, reactions:{"❤️":["Sandra"]} },
  { id:4, from:"Kiki", text:"JA PIZZA!! 🎉🎉", ts: Date.now()-1800000, reactions:{"😂":["Stephan","Sandra"]} },
  { id:5, from:"Sandra", text:"Goed idee! Ik bestel om 18:00 🍕", ts: Date.now()-900000, reactions:{"❤️":["Floor","Kiki"]} },
];

const INIT_MEALS = [
  { id:1, title:"Spaghetti Bolognese", category:"italiaans", addedBy:"Sandra", image:null, recipe:"Gehakt, tomatensaus, spaghetti, basilicum", votes:{"Stephan":"❤️","Floor":"❤️","Kiki":"❤️"}, createdAt: Date.now()-86400000*3 },
  { id:2, title:"Stamppot Boerenkool", category:"hollands", addedBy:"Stephan", image:null, recipe:"Boerenkool, aardappels, rookworst, spek", votes:{"Sandra":"👍","Floor":"😐"}, createdAt: Date.now()-86400000*2 },
  { id:3, title:"Pad Thai", category:"aziatisch", addedBy:"Floor", image:null, recipe:"Rijstnoedels, garnalen, pinda, limoensap", votes:{"Sandra":"❤️","Kiki":"❤️"}, createdAt: Date.now()-86400000 },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function BanditosApp() {
  const [mainTab, setMainTab]       = useState("chat");
  const [currentMember, setCurrentMember] = useState("Stephan");

  // Shopping
  const [activeList, setActiveList] = useState("boodschappen");
  const [allItems, setAllItems]     = useState(INIT_ITEMS);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem]       = useState({ name:"", qty:1, unit:"stuks", category:"" });
  const [searchQ, setSearchQ]       = useState("");
  const [filterCat, setFilterCat]   = useState("all");
  const [swipedId, setSwipedId]     = useState(null);

  // Calendar
  const [events, setEvents]         = useState(INIT_EVENTS);
  const [calView, setCalView]       = useState("week");
  const [calDate, setCalDate]       = useState(today);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent]     = useState({ title:"", date:fmtDate(today), startTime:"09:00", endTime:"10:00", category:"familie", member:currentMember, location:"", notes:"" });
  const [filterMember, setFilterMember] = useState("alle");

  // Chat
  const [messages, setMessages]     = useState(INIT_MESSAGES);
  const [chatInput, setChatInput]   = useState("");
  const [reactionTarget, setReactionTarget] = useState(null);
  const chatEndRef = useRef(null);

  // Tasks
  const [tasks, setTasks]           = useState(INIT_TASKS);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask]       = useState({ title:"", category:"thuis", assignedTo:currentMember, priority:"normaal", deadline:"", notes:"" });
  const [taskFilter, setTaskFilter] = useState("alle"); // alle|mijn|open|klaar
  const [taskView, setTaskView]     = useState("taken"); // taken | scores

  // Points helpers
  const getMonthKey = (ts) => { const d=new Date(ts); return `${d.getFullYear()}-${d.getMonth()}`; };
  const currentMonthKey = getMonthKey(Date.now());
  const calcPoints = (memberName) => tasks
    .filter(t => t.done && t.doneBy === memberName && t.addedBy !== memberName && getMonthKey(t.doneAt||t.createdAt) === currentMonthKey)
    .reduce((sum, t) => sum + (POINTS_MAP[t.priority] || 10), 0);
  const calcAllTimePoints = (memberName) => tasks
    .filter(t => t.done && t.doneBy === memberName && t.addedBy !== memberName)
    .reduce((sum, t) => sum + (POINTS_MAP[t.priority] || 10), 0);
  const scoreboardData = MEMBERS.map(m => ({
    ...m,
    points: calcPoints(m.name),
    allTime: calcAllTimePoints(m.name),
    doneTasks: tasks.filter(t => t.done && t.doneBy === m.name && t.addedBy !== m.name && getMonthKey(t.doneAt||t.createdAt) === currentMonthKey).length,
  })).sort((a,b) => b.points - a.points);

  // Meals
  const [meals, setMeals]           = useState(INIT_MEALS);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal]       = useState({ title:"", category:"overig", recipe:"", image:null });
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealFilter, setMealFilter] = useState("alle");

  const itemInputRef  = useRef(null);
  const eventInputRef = useRef(null);
  const taskInputRef  = useRef(null);
  const mealInputRef  = useRef(null);
  const fileInputRef  = useRef(null);

  useEffect(()=>{ if(showAddItem  && itemInputRef.current)  itemInputRef.current.focus(); }, [showAddItem]);
  useEffect(()=>{ if(showAddEvent && eventInputRef.current) eventInputRef.current.focus(); }, [showAddEvent]);
  useEffect(()=>{ if(showAddTask  && taskInputRef.current)  taskInputRef.current.focus(); }, [showAddTask]);
  useEffect(()=>{ if(showAddMeal  && mealInputRef.current)  mealInputRef.current.focus(); }, [showAddMeal]);
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);
  useEffect(()=>{ setFilterCat("all"); setSearchQ(""); }, [activeList]);

  const getMember   = name => MEMBERS.find(m=>m.name===name) || MEMBERS[0];
  const memberColor = name => getMember(name).color;

  // ── Chat ──
  const sendMessage = () => {
    if(!chatInput.trim()) return;
    setMessages(p=>[...p, { id:Date.now(), from:currentMember, text:chatInput.trim(), ts:Date.now(), reactions:{} }]);
    setChatInput("");
  };
  const addReaction = (msgId, emoji) => {
    setMessages(p=>p.map(m=>{
      if(m.id!==msgId) return m;
      const r = {...m.reactions};
      if(!r[emoji]) r[emoji]=[];
      if(r[emoji].includes(currentMember)) r[emoji]=r[emoji].filter(x=>x!==currentMember);
      else r[emoji]=[...r[emoji],currentMember];
      if(r[emoji].length===0) delete r[emoji];
      return {...m,reactions:r};
    }));
    setReactionTarget(null);
  };

  // ── Tasks ──
  const addTask = () => {
    if(!newTask.title.trim()) return;
    setTasks(p=>[{ ...newTask, id:Date.now(), addedBy:currentMember, done:false, createdAt:Date.now(), doneBy:null, doneAt:null }, ...p]);
    setNewTask({ title:"", category:"thuis", assignedTo:currentMember, priority:"normaal", deadline:"", notes:"" });
    setShowAddTask(false);
  };
  const toggleTask = id => setTasks(p=>p.map(t=>{
    if(t.id!==id) return t;
    const nowDone = !t.done;
    return { ...t, done:nowDone, doneBy: nowDone ? currentMember : null, doneAt: nowDone ? Date.now() : null };
  }));
  const deleteTask = id => setTasks(p=>p.filter(t=>t.id!==id));
  const filteredTasks = tasks.filter(t=>{
    if(taskFilter==="mijn")   return t.assignedTo===currentMember;
    if(taskFilter==="open")   return !t.done;
    if(taskFilter==="klaar")  return t.done;
    return true;
  });

  // ── Meals ──
  const addMeal = () => {
    if(!newMeal.title.trim()) return;
    setMeals(p=>[{ ...newMeal, id:Date.now(), addedBy:currentMember, votes:{}, createdAt:Date.now() }, ...p]);
    setNewMeal({ title:"", category:"overig", recipe:"", image:null });
    setShowAddMeal(false);
  };
  const voteMeal = (id, emoji) => {
    setMeals(p=>p.map(m=>{
      if(m.id!==id) return m;
      const v={...m.votes};
      if(v[currentMember]===emoji) delete v[currentMember];
      else v[currentMember]=emoji;
      return {...m,votes:v};
    }));
  };
  const handleMealImage = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => setNewMeal(p=>({...p, image:ev.target.result}));
    reader.readAsDataURL(file);
  };
  const filteredMeals = mealFilter==="alle" ? meals : meals.filter(m=>m.category===mealFilter);

  // ── Shopping ──
  const cats = SHOP_CATS[activeList] || [];
  const shopItems = allItems[activeList] || [];
  const filteredShop = shopItems.filter(i=>(filterCat==="all"||i.category===filterCat)&&i.name.toLowerCase().includes(searchQ.toLowerCase()));
  const unchecked = filteredShop.filter(i=>!i.checked);
  const checked   = filteredShop.filter(i=>i.checked);
  const totalUnchecked = shopItems.filter(i=>!i.checked).length;
  const totalChecked   = shopItems.filter(i=>i.checked).length;
  const progress = shopItems.length>0?(totalChecked/shopItems.length)*100:0;
  const getCat   = id=>cats.find(c=>c.id===id)||{color:"#8E8E93"};
  const listBadge = lid=>{ const c=(allItems[lid]||[]).filter(i=>!i.checked).length; return c>0?c:null; };
  const listInfo = SHOPPING_LISTS.find(l=>l.id===activeList);
  const toggleCheck  = id => setAllItems(p=>({...p,[activeList]:p[activeList].map(i=>i.id===id?{...i,checked:!i.checked}:i)}));
  const deleteShopItem = id => { setAllItems(p=>({...p,[activeList]:p[activeList].filter(i=>i.id!==id)})); setSwipedId(null); };
  const clearChecked = () => setAllItems(p=>({...p,[activeList]:p[activeList].filter(i=>!i.checked)}));
  const addShopItem = () => {
    if(!newItem.name.trim()) return;
    const cat = newItem.category || cats[0]?.id || "overig";
    setAllItems(p=>({...p,[activeList]:[{ ...newItem, category:cat, id:Date.now(), addedBy:currentMember, checked:false }, ...p[activeList]]}));
    setNewItem({ name:"", qty:1, unit:"stuks", category:"" });
    setShowAddItem(false);
  };

  // ── Calendar ──
  const filtCal = events.filter(e=>filterMember==="alle"||e.member===filterMember);
  const getEventsForDate = date => filtCal.filter(e=>e.date===fmtDate(date));
  const getCatInfo = id => CAL_CATS.find(c=>c.id===id)||CAL_CATS[7];
  const addEvent = () => {
    if(!newEvent.title.trim()) return;
    setEvents(p=>[...p,{ ...newEvent, id:Date.now() }]);
    setNewEvent({ title:"", date:fmtDate(calDate), startTime:"09:00", endTime:"10:00", category:"familie", member:currentMember, location:"", notes:"" });
    setShowAddEvent(false);
  };
  const deleteEvent = id => { setEvents(p=>p.filter(e=>e.id!==id)); setSelectedEvent(null); };
  const HOURS = Array.from({length:16},(_,i)=>i+7);
  const navCal = dir => {
    const d=new Date(calDate);
    if(calView==="dag") d.setDate(d.getDate()+dir);
    else if(calView==="week") d.setDate(d.getDate()+dir*7);
    else d.setMonth(d.getMonth()+dir);
    setCalDate(d);
  };
  const getWeekDays = d => {
    const s=new Date(d); const day=s.getDay();
    s.setDate(s.getDate()-(day===0?6:day-1));
    return Array.from({length:7},(_,i)=>addDays(s,i));
  };
  const weekDays = getWeekDays(calDate);
  const isToday  = d => fmtDate(d)===fmtDate(today);
  const calTitle = () => {
    if(calView==="dag") return `${NL_DAYS_LONG[calDate.getDay()]} ${calDate.getDate()} ${NL_MONTHS[calDate.getMonth()]}`;
    if(calView==="week"){ const s=weekDays[0],e=weekDays[6]; return s.getMonth()===e.getMonth()?`${s.getDate()} – ${e.getDate()} ${NL_MONTHS[s.getMonth()]} ${s.getFullYear()}`:`${s.getDate()} ${NL_MONTHS[s.getMonth()]} – ${e.getDate()} ${NL_MONTHS[e.getMonth()]}`; }
    return `${NL_MONTHS[calDate.getMonth()]} ${calDate.getFullYear()}`;
  };
  const getMonthDays = d => {
    const first=new Date(d.getFullYear(),d.getMonth(),1);
    const last=new Date(d.getFullYear(),d.getMonth()+1,0);
    const offset=(first.getDay()+6)%7;
    const days=[];
    for(let i=0;i<offset;i++) days.push(addDays(first,-offset+i));
    for(let i=1;i<=last.getDate();i++) days.push(new Date(d.getFullYear(),d.getMonth(),i));
    while(days.length%7!==0) days.push(addDays(days[days.length-1],1));
    return days;
  };

  // tab badges
  const chatBadge = 0;
  const taskBadge = tasks.filter(t=>!t.done&&(t.assignedTo===currentMember)).length;
  const shopBadge = Object.values(allItems).flat().filter(i=>!i.checked).length;

  const MAIN_TABS = [
    { id:"chat",     icon:"💬", label:"Chat" },
    { id:"taken",    icon:"✅", label:"Taken",    badge:taskBadge },
    { id:"kalender", icon:"📅", label:"Kalender" },
    { id:"lijsten",  icon:"🛒", label:"Lijsten",  badge:shopBadge },
    { id:"diner",    icon:"🍽️", label:"Diner" },
  ];

  const accentColor = () => {
    if(mainTab==="chat")     return "#FF6B35";
    if(mainTab==="taken")    return "#5856D6";
    if(mainTab==="kalender") return "#007AFF";
    if(mainTab==="lijsten")  return listInfo?.color || "#34C759";
    if(mainTab==="diner")    return "#E53935";
    return "#007AFF";
  };

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh",
      background:"linear-gradient(160deg,#1a0a00,#3d1a00,#1a0000)",
      fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif" }}>

      {/* iPhone Frame */}
      <div style={{ width:393, height:852, background:"#000", borderRadius:55,
        boxShadow:"0 80px 120px rgba(0,0,0,0.9), inset 0 0 0 1.5px #3a3a3a, 0 0 0 8px #111",
        overflow:"hidden", position:"relative", display:"flex", flexDirection:"column" }}>

        {/* Status bar */}
        <div style={{ height:54, background:"#000", display:"flex", alignItems:"flex-end",
          justifyContent:"space-between", padding:"0 28px 8px", color:"#fff", fontSize:12, fontWeight:600, flexShrink:0 }}>
          <span>9:41</span>
          <div style={{ width:120, height:34, background:"#000", borderRadius:20, position:"absolute",
            top:8, left:"50%", transform:"translateX(-50%)", boxShadow:"inset 0 0 0 1px #333" }} />
          <div style={{ display:"flex", gap:5, alignItems:"center", fontSize:11 }}>
            <span>●●●</span><span>WiFi</span><span>🔋</span>
          </div>
        </div>

        {/* App Header */}
        <div style={{ background:`linear-gradient(135deg, ${accentColor()}, ${accentColor()}99)`,
          padding:"10px 18px 12px", color:"#fff", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11, opacity:0.8, letterSpacing:1, textTransform:"uppercase" }}>🤠 {APP_NAME}</div>
            <div style={{ fontSize:20, fontWeight:800 }}>{MAIN_TABS.find(t=>t.id===mainTab)?.icon} {MAIN_TABS.find(t=>t.id===mainTab)?.label}</div>
          </div>
          {/* Member switcher */}
          <div style={{ display:"flex", gap:5 }}>
            {MEMBERS.map(m=>(
              <div key={m.name} onClick={()=>setCurrentMember(m.name)} style={{
                width:32, height:32, borderRadius:16,
                background:currentMember===m.name?"#fff":"rgba(255,255,255,0.2)",
                color:currentMember===m.name?m.color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:800, cursor:"pointer",
                border:currentMember===m.name?`2px solid ${m.color}`:"2px solid transparent",
                transition:"all 0.2s",
              }}>{m.name[0]}</div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, background:"#F2F2F7", overflow:"hidden", display:"flex", flexDirection:"column" }}>

          {/* ══ CHAT ══ */}
          {mainTab==="chat" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              {/* Messages */}
              <div style={{ flex:1, overflowY:"auto", padding:"12px 14px" }}>
                {messages.map((msg,i)=>{
                  const isMe = msg.from===currentMember;
                  const m = getMember(msg.from);
                  const showAvatar = !isMe && (i===0||messages[i-1].from!==msg.from);
                  return (
                    <div key={msg.id} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start",
                      marginBottom:4, alignItems:"flex-end", gap:6 }}>
                      {!isMe && (
                        <div style={{ width:28, height:28, borderRadius:14, background:m.color,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:12, fontWeight:800, color:"#fff", flexShrink:0,
                          visibility:showAvatar?"visible":"hidden" }}>{m.name[0]}</div>
                      )}
                      <div style={{ maxWidth:"72%", display:"flex", flexDirection:"column", alignItems:isMe?"flex-end":"flex-start" }}>
                        {showAvatar && !isMe && (
                          <div style={{ fontSize:10, color:m.color, fontWeight:700, marginBottom:2, marginLeft:4 }}>{m.name}</div>
                        )}
                        <div onLongPress={()=>setReactionTarget(msg.id)}
                          onClick={()=>setReactionTarget(reactionTarget===msg.id?null:msg.id)}
                          style={{
                            background:isMe?m.color:"#fff",
                            color:isMe?"#fff":"#000",
                            borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
                            padding:"9px 13px", fontSize:15, lineHeight:1.4,
                            boxShadow:"0 1px 4px rgba(0,0,0,0.1)",
                            cursor:"pointer", userSelect:"none",
                          }}>{msg.text}</div>
                        {/* Reactions */}
                        {Object.keys(msg.reactions).length>0 && (
                          <div style={{ display:"flex", gap:3, marginTop:3 }}>
                            {Object.entries(msg.reactions).map(([emoji,users])=>(
                              <div key={emoji} onClick={()=>addReaction(msg.id,emoji)} style={{
                                background:"#fff", borderRadius:12, padding:"2px 7px",
                                fontSize:12, boxShadow:"0 1px 3px rgba(0,0,0,0.1)",
                                cursor:"pointer", display:"flex", alignItems:"center", gap:3,
                                border:users.includes(currentMember)?"2px solid "+m.color:"2px solid transparent",
                              }}>{emoji} <span style={{ fontSize:10, color:"#8E8E93" }}>{users.length}</span></div>
                            ))}
                          </div>
                        )}
                        {/* Reaction picker */}
                        {reactionTarget===msg.id && (
                          <div style={{ display:"flex", gap:4, background:"#fff", borderRadius:20, padding:"6px 10px",
                            boxShadow:"0 4px 20px rgba(0,0,0,0.15)", marginTop:4 }}>
                            {["❤️","😂","👍","😮","😢","🔥"].map(e=>(
                              <div key={e} onClick={()=>addReaction(msg.id,e)} style={{ fontSize:20, cursor:"pointer" }}>{e}</div>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize:10, color:"#8E8E93", marginTop:2, marginLeft:4, marginRight:4 }}>{timeAgo(msg.ts)}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              {/* Input */}
              <div style={{ background:"#fff", borderTop:"1px solid #E5E5EA", padding:"10px 14px 16px",
                display:"flex", gap:10, alignItems:"flex-end", flexShrink:0 }}>
                <div style={{ flex:1, background:"#F2F2F7", borderRadius:22, padding:"10px 16px",
                  display:"flex", alignItems:"center" }}>
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&sendMessage()}
                    placeholder="Stuur een bericht..."
                    style={{ background:"none", border:"none", outline:"none", flex:1, fontSize:15 }} />
                </div>
                <div onClick={sendMessage} style={{
                  width:40, height:40, borderRadius:20,
                  background:chatInput.trim()?accentColor():"#E5E5EA",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:18, cursor:"pointer", flexShrink:0,
                  transition:"background 0.2s",
                }}>↑</div>
              </div>
            </div>
          )}

          {/* ══ TAKEN ══ */}
          {mainTab==="taken" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

              {/* Tab toggle: Taken / Scores */}
              <div style={{ padding:"10px 14px 8px", background:"#F2F2F7", flexShrink:0 }}>
                <div style={{ display:"flex", background:"#E5E5EA", borderRadius:12, padding:3 }}>
                  {[["taken","✅ Taken"],["scores","🏆 Scorebord"]].map(([v,label])=>(
                    <div key={v} onClick={()=>setTaskView(v)} style={{
                      flex:1, textAlign:"center", padding:"8px 0", borderRadius:9,
                      background:taskView===v?"#fff":"transparent",
                      color:taskView===v?"#5856D6":"#8E8E93",
                      fontSize:13, fontWeight:800, cursor:"pointer", transition:"all 0.2s",
                      boxShadow:taskView===v?"0 1px 4px rgba(0,0,0,0.12)":"none",
                    }}>{label}</div>
                  ))}
                </div>
              </div>

              {/* ── SCOREBORD VIEW ── */}
              {taskView==="scores" && (
                <div style={{ flex:1, overflowY:"auto", padding:"0 14px 16px" }}>

                  {/* Month header */}
                  <div style={{ textAlign:"center", padding:"12px 0 8px" }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#8E8E93", letterSpacing:1, textTransform:"uppercase" }}>
                      {NL_MONTHS[today.getMonth()]} {today.getFullYear()}
                    </div>
                    <div style={{ fontSize:13, color:"#8E8E93", marginTop:2 }}>Punten verdiend door taken te doen voor een ander</div>
                  </div>

                  {/* Podium — top 3 */}
                  <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8, margin:"8px 0 20px", height:130 }}>
                    {scoreboardData.slice(0,3).map((m,i)=>{
                      const heights = [110, 90, 75];
                      const prize = PRIZES[i];
                      const isFirst = i===0;
                      return (
                        <div key={m.name} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                          {isFirst && <div style={{ fontSize:20, marginBottom:2 }}>👑</div>}
                          <div style={{ width:isFirst?52:42, height:isFirst?52:42, borderRadius:isFirst?26:21,
                            background:m.color, display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:isFirst?22:18, fontWeight:900, color:"#fff",
                            border:`3px solid ${prize.color}`,
                            boxShadow:`0 4px 16px ${m.color}66`,
                          }}>{m.emoji}</div>
                          <div style={{ fontSize:isFirst?13:11, fontWeight:800, color:"#000", marginTop:4 }}>{m.name}</div>
                          <div style={{ fontSize:isFirst?18:14, fontWeight:900, color:m.color }}>{m.points}<span style={{ fontSize:10, fontWeight:600, color:"#8E8E93" }}>pt</span></div>
                          <div style={{ width:"100%", height:heights[i], background:`linear-gradient(180deg,${m.color},${m.color}88)`,
                            borderRadius:"8px 8px 0 0", display:"flex", alignItems:"flex-start",
                            justifyContent:"center", paddingTop:6, marginTop:4,
                          }}>
                            <div style={{ fontSize:11, fontWeight:800, color:"#fff", opacity:0.9 }}>{prize.value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Prizes */}
                  <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", marginBottom:14, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ padding:"10px 14px 6px" }}>
                      <div style={{ fontSize:12, fontWeight:800, color:"#8E8E93", letterSpacing:0.5 }}>MAANDPRIJZEN 🎁</div>
                    </div>
                    {PRIZES.map((prize,i)=>{
                      const winner = scoreboardData[i];
                      return (
                        <div key={prize.rank} style={{ display:"flex", alignItems:"center", padding:"10px 14px",
                          borderTop:i>0?"1px solid #F2F2F7":"none", background:prize.bg }}>
                          <div style={{ fontSize:22, width:32 }}>{["🥇","🥈","🥉"][i]}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:14, fontWeight:700, color:"#000" }}>{prize.label}</div>
                            <div style={{ fontSize:11, color:"#8E8E93" }}>Winst: <span style={{ fontWeight:700, color:prize.color }}>{prize.value}</span></div>
                          </div>
                          {winner && (
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <div style={{ width:28, height:28, borderRadius:14, background:winner.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#fff" }}>{winner.name[0]}</div>
                              <div style={{ fontSize:12, fontWeight:700, color:winner.color }}>{winner.points}pt</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Full leaderboard */}
                  <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", marginBottom:14 }}>
                    <div style={{ padding:"10px 14px 6px" }}>
                      <div style={{ fontSize:12, fontWeight:800, color:"#8E8E93", letterSpacing:0.5 }}>ALLE BANDITOS</div>
                    </div>
                    {scoreboardData.map((m,i)=>{
                      const maxPts = scoreboardData[0]?.points || 1;
                      const pct = maxPts > 0 ? (m.points / maxPts) * 100 : 0;
                      return (
                        <div key={m.name} style={{ padding:"12px 14px", borderTop:i>0?"1px solid #F2F2F7":"none" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                            <div style={{ fontSize:16, width:22, textAlign:"center", fontWeight:800, color:"#8E8E93" }}>#{i+1}</div>
                            <div style={{ width:34, height:34, borderRadius:17, background:m.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{m.emoji}</div>
                            <div style={{ flex:1 }}>
                              <div style={{ fontSize:15, fontWeight:800, color:"#000" }}>{m.name}</div>
                              <div style={{ fontSize:11, color:"#8E8E93" }}>{m.doneTasks} taken gedaan · {m.allTime}pt all-time</div>
                            </div>
                            <div style={{ textAlign:"right" }}>
                              <div style={{ fontSize:20, fontWeight:900, color:m.color }}>{m.points}</div>
                              <div style={{ fontSize:10, color:"#8E8E93" }}>punten</div>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div style={{ height:6, background:"#F2F2F7", borderRadius:3, overflow:"hidden", marginLeft:32 }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:m.color, borderRadius:3, transition:"width 0.6s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Points legend */}
                  <div style={{ background:"#fff", borderRadius:16, padding:"12px 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize:12, fontWeight:800, color:"#8E8E93", letterSpacing:0.5, marginBottom:8 }}>HOE VERDIEN JE PUNTEN?</div>
                    <div style={{ fontSize:12, color:"#6B6B6B", marginBottom:8 }}>Doe je een taak die <span style={{ fontWeight:700 }}>door iemand anders is aangemaakt</span>, dan verdien je punten:</div>
                    {[["🔴 Hoge prioriteit","20 punten"],["🟡 Normale prioriteit","10 punten"],["🟢 Lage prioriteit","5 punten"]].map(([label,pts])=>(
                      <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid #F2F2F7" }}>
                        <div style={{ fontSize:13 }}>{label}</div>
                        <div style={{ fontSize:13, fontWeight:800, color:"#5856D6" }}>{pts}</div>
                      </div>
                    ))}
                    <div style={{ fontSize:11, color:"#8E8E93", marginTop:8 }}>⚠️ Eigen taken tellen niet mee. Scorebord reset elke maand.</div>
                  </div>
                </div>
              )}

              {/* ── TAKEN VIEW ── */}
              {taskView==="taken" && (
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  {/* My points pill */}
                  <div style={{ padding:"4px 14px 8px", flexShrink:0 }}>
                    <div style={{ background:"linear-gradient(135deg,#5856D6,#007AFF)", borderRadius:12, padding:"8px 14px",
                      display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ fontSize:20 }}>{getMember(currentMember).emoji}</div>
                        <div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>Jouw punten deze maand</div>
                          <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>{calcPoints(currentMember)}<span style={{ fontSize:12, fontWeight:600, opacity:0.8 }}> pt</span></div>
                        </div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>Positie</div>
                        <div style={{ fontSize:22, fontWeight:900, color:"#FFD700" }}>
                          #{scoreboardData.findIndex(s=>s.name===currentMember)+1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter bar */}
                  <div style={{ padding:"0 14px 6px", display:"flex", gap:7, overflowX:"auto", flexShrink:0 }}>
                    {["alle","mijn","open","klaar"].map(f=>(
                      <Chip key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} active={taskFilter===f} color="#5856D6" onClick={()=>setTaskFilter(f)} />
                    ))}
                  </div>

                  {/* Task list */}
                  <div style={{ flex:1, overflowY:"auto", padding:"4px 14px" }}>
                    {filteredTasks.filter(t=>!t.done).length>0 && (
                      <div style={{ marginBottom:8 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#8E8E93", letterSpacing:0.5, marginBottom:6, paddingLeft:4 }}>OPEN ({filteredTasks.filter(t=>!t.done).length})</div>
                        <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                          {filteredTasks.filter(t=>!t.done).map((task,i,arr)=>(
                            <TaskItem key={task.id} task={task} isLast={i===arr.length-1}
                              onToggle={()=>toggleTask(task.id)} onDelete={()=>deleteTask(task.id)}
                              getMember={getMember} currentMember={currentMember} />
                          ))}
                        </div>
                      </div>
                    )}
                    {filteredTasks.filter(t=>t.done).length>0 && (
                      <div style={{ marginBottom:12 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#8E8E93", letterSpacing:0.5, marginBottom:6, paddingLeft:4 }}>GEDAAN ({filteredTasks.filter(t=>t.done).length})</div>
                        <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", opacity:0.7 }}>
                          {filteredTasks.filter(t=>t.done).map((task,i,arr)=>(
                            <TaskItem key={task.id} task={task} isLast={i===arr.length-1}
                              onToggle={()=>toggleTask(task.id)} onDelete={()=>deleteTask(task.id)}
                              getMember={getMember} currentMember={currentMember} />
                          ))}
                        </div>
                      </div>
                    )}
                    {filteredTasks.length===0 && (
                      <div style={{ textAlign:"center", padding:"48px 0", color:"#8E8E93" }}>
                        <div style={{ fontSize:44, marginBottom:10 }}>✅</div>
                        <div style={{ fontWeight:600, fontSize:17 }}>Geen taken</div>
                        <div style={{ fontSize:14, marginTop:4 }}>Tik op + om een taak toe te voegen</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ KALENDER ══ */}
          {mainTab==="kalender" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ background:"#1C1C2E", padding:"12px 16px 10px", color:"#fff", flexShrink:0 }}>
                <div style={{ display:"flex", background:"rgba(255,255,255,0.1)", borderRadius:10, padding:3, marginBottom:10 }}>
                  {["dag","week","maand"].map(v=>(
                    <div key={v} onClick={()=>setCalView(v)} style={{
                      flex:1, textAlign:"center", padding:"6px 0", borderRadius:8, fontSize:12, fontWeight:700,
                      background:calView===v?"#fff":"transparent",
                      color:calView===v?"#1C1C2E":"rgba(255,255,255,0.6)",
                      cursor:"pointer", transition:"all 0.2s", textTransform:"capitalize",
                    }}>{v.charAt(0).toUpperCase()+v.slice(1)}</div>
                  ))}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div onClick={()=>navCal(-1)} style={{ width:30,height:30,borderRadius:15,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15 }}>‹</div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{calTitle()}</div>
                  <div onClick={()=>navCal(1)} style={{ width:30,height:30,borderRadius:15,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15 }}>›</div>
                </div>
                <div style={{ display:"flex", gap:5, overflowX:"auto" }}>
                  <div onClick={()=>setFilterMember("alle")} style={{ padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:700,background:filterMember==="alle"?"#fff":"rgba(255,255,255,0.15)",color:filterMember==="alle"?"#1C1C2E":"#fff",cursor:"pointer",flexShrink:0 }}>Iedereen</div>
                  {MEMBERS.map(m=>(
                    <div key={m.name} onClick={()=>setFilterMember(m.name)} style={{ padding:"3px 10px",borderRadius:12,fontSize:10,fontWeight:700,background:filterMember===m.name?m.color:"rgba(255,255,255,0.15)",color:"#fff",cursor:"pointer",flexShrink:0 }}>{m.name}</div>
                  ))}
                </div>
              </div>

              {calView==="dag" && (
                <div style={{ flex:1, overflowY:"auto" }}>
                  <div style={{ background:"#fff",padding:"8px 16px",borderBottom:"1px solid #E5E5EA",display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:38,height:38,borderRadius:19,background:isToday(calDate)?"#007AFF":"#F2F2F7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:isToday(calDate)?"#fff":"#000" }}>{calDate.getDate()}</div>
                    <div><div style={{ fontSize:15,fontWeight:700 }}>{NL_DAYS_LONG[calDate.getDay()]}</div><div style={{ fontSize:11,color:"#8E8E93" }}>{NL_MONTHS[calDate.getMonth()]} {calDate.getFullYear()}</div></div>
                    <div onClick={()=>{ const evs=getEventsForDate(calDate); evs.forEach(e=>exportToICS(e)); }} style={{ marginLeft:"auto",padding:"4px 10px",borderRadius:8,background:"#E8F0FE",color:"#007AFF",fontSize:11,fontWeight:700,cursor:"pointer" }}>📤 Outlook</div>
                  </div>
                  {HOURS.map(hour=>{
                    const hourEvs=getEventsForDate(calDate).filter(e=>{ const sm=parseInt(e.startTime)*60+parseInt(e.startTime.split(":")[1]); return sm>=hour*60&&sm<(hour+1)*60; });
                    return (
                      <div key={hour} style={{ display:"flex",minHeight:50,borderBottom:"1px solid #E5E5EA" }}>
                        <div style={{ width:48,padding:"5px 8px 0",fontSize:10,color:"#8E8E93",fontWeight:600,textAlign:"right",flexShrink:0 }}>{String(hour).padStart(2,"0")}:00</div>
                        <div style={{ flex:1,padding:"3px 8px",display:"flex",flexDirection:"column",gap:2 }}>
                          {hourEvs.map(ev=><CalPill key={ev.id} event={ev} onClick={()=>setSelectedEvent(ev)} getCatInfo={getCatInfo} getMember={getMember} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {calView==="week" && (
                <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                  <div style={{ display:"flex", background:"#fff", borderBottom:"1px solid #E5E5EA", flexShrink:0 }}>
                    <div style={{ width:38 }} />
                    {weekDays.map((d,i)=>(
                      <div key={i} onClick={()=>{ setCalDate(d); setCalView("dag"); }} style={{ flex:1,textAlign:"center",padding:"6px 2px",cursor:"pointer" }}>
                        <div style={{ fontSize:9,color:"#8E8E93",fontWeight:700,textTransform:"uppercase" }}>{NL_DAYS_SHORT[d.getDay()]}</div>
                        <div style={{ width:24,height:24,borderRadius:12,margin:"2px auto",background:isToday(d)?"#007AFF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:isToday(d)?"#fff":"#000" }}>{d.getDate()}</div>
                        <div style={{ display:"flex",justifyContent:"center",gap:1,marginTop:1 }}>
                          {getEventsForDate(d).slice(0,3).map((ev,ei)=>(
                            <div key={ei} style={{ width:3,height:3,borderRadius:2,background:getCatInfo(ev.category).color }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex:1, overflowY:"auto" }}>
                    {HOURS.map(hour=>(
                      <div key={hour} style={{ display:"flex",minHeight:44,borderBottom:"1px solid #F0F0F0" }}>
                        <div style={{ width:38,padding:"4px 6px 0",fontSize:9,color:"#8E8E93",fontWeight:600,textAlign:"right",flexShrink:0 }}>{String(hour).padStart(2,"0")}:00</div>
                        {weekDays.map((d,di)=>{
                          const dayEvs=getEventsForDate(d).filter(e=>{ const sm=parseInt(e.startTime)*60+parseInt(e.startTime.split(":")[1]); return sm>=hour*60&&sm<(hour+1)*60; });
                          return (
                            <div key={di} style={{ flex:1,padding:"2px 1px",borderLeft:"1px solid #F0F0F0" }}>
                              {dayEvs.map(ev=>(
                                <div key={ev.id} onClick={()=>setSelectedEvent(ev)} style={{ background:getCatInfo(ev.category).color,color:"#fff",borderRadius:3,padding:"1px 3px",fontSize:8,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1,cursor:"pointer" }}>{ev.title}</div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {calView==="maand" && (
                <div style={{ flex:1, overflowY:"auto" }}>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"#fff",borderBottom:"1px solid #E5E5EA" }}>
                    {["ma","di","wo","do","vr","za","zo"].map(d=>(
                      <div key={d} style={{ textAlign:"center",padding:"6px 0",fontSize:10,fontWeight:700,color:"#8E8E93",textTransform:"uppercase" }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)" }}>
                    {getMonthDays(calDate).map((d,i)=>{
                      const dayEvs=getEventsForDate(d);
                      const isCurMonth=d.getMonth()===calDate.getMonth();
                      return (
                        <div key={i} onClick={()=>{ setCalDate(d); setCalView("dag"); }} style={{ minHeight:58,padding:"4px 2px 2px",borderRight:"1px solid #E5E5EA",borderBottom:"1px solid #E5E5EA",background:isToday(d)?"#EBF4FF":"#fff",cursor:"pointer",opacity:isCurMonth?1:0.35 }}>
                          <div style={{ width:20,height:20,borderRadius:10,margin:"0 auto 2px",background:isToday(d)?"#007AFF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:isToday(d)?700:500,color:isToday(d)?"#fff":"#000" }}>{d.getDate()}</div>
                          {dayEvs.slice(0,2).map(ev=>(
                            <div key={ev.id} style={{ background:getCatInfo(ev.category).color,color:"#fff",borderRadius:2,padding:"0 3px",fontSize:8,fontWeight:600,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{ev.title}</div>
                          ))}
                          {dayEvs.length>2&&<div style={{ fontSize:8,color:"#8E8E93",textAlign:"center" }}>+{dayEvs.length-2}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ background:"#fff",padding:"6px 14px",borderTop:"1px solid #E5E5EA",flexShrink:0 }}>
                <div onClick={()=>{ filtCal.forEach(e=>exportToICS(e)); }} style={{ background:"#E8F0FE",color:"#007AFF",borderRadius:10,padding:"9px",textAlign:"center",fontSize:12,fontWeight:700,cursor:"pointer" }}>📤 Exporteer alle afspraken naar Outlook</div>
              </div>
            </div>
          )}

          {/* ══ LIJSTEN ══ */}
          {mainTab==="lijsten" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div style={{ background:`linear-gradient(135deg,${listInfo.color}dd,${listInfo.color}88)`,padding:"14px 16px 18px",color:"#fff",flexShrink:0 }}>
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,opacity:0.9,marginBottom:4 }}>
                    <span>{totalUnchecked} te halen</span><span>{Math.round(progress)}% klaar</span>
                  </div>
                  <div style={{ height:4,background:"rgba(255,255,255,0.3)",borderRadius:2,overflow:"hidden" }}>
                    <div style={{ height:"100%",width:`${progress}%`,background:"#fff",borderRadius:2,transition:"width 0.5s" }} />
                  </div>
                </div>
                <div style={{ background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:12,opacity:0.8 }}>🔍</span>
                  <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Zoeken..." style={{ background:"none",border:"none",outline:"none",color:"#fff",fontSize:14,width:"100%" }} />
                </div>
              </div>
              <div style={{ padding:"8px 12px 4px",display:"flex",gap:6,overflowX:"auto",flexShrink:0 }}>
                <Chip label="Alle" active={filterCat==="all"} color={listInfo.color} onClick={()=>setFilterCat("all")} />
                {cats.map(cat=><Chip key={cat.id} label={cat.label.split(" ")[0]} active={filterCat===cat.id} color={cat.color} onClick={()=>setFilterCat(cat.id)} />)}
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:"6px 12px" }}>
                {unchecked.length>0&&(
                  <div style={{ marginBottom:8 }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:0.5,marginBottom:5,paddingLeft:4 }}>TE HALEN ({unchecked.length})</div>
                    <div style={{ background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      {unchecked.map((item,i)=><ShopItem key={item.id} item={item} isLast={i===unchecked.length-1} catColor={getCat(item.category).color} memberColor={memberColor(item.addedBy)} onToggle={()=>toggleCheck(item.id)} onDelete={()=>deleteShopItem(item.id)} swiped={swipedId===item.id} onSwipe={()=>setSwipedId(swipedId===item.id?null:item.id)} />)}
                    </div>
                  </div>
                )}
                {checked.length>0&&(
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,paddingLeft:4 }}>
                      <div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:0.5 }}>IN WINKELWAGEN ({checked.length})</div>
                      <div onClick={clearChecked} style={{ fontSize:12,color:"#FF3B30",fontWeight:700,cursor:"pointer" }}>Wis</div>
                    </div>
                    <div style={{ background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",opacity:0.65 }}>
                      {checked.map((item,i)=><ShopItem key={item.id} item={item} isLast={i===checked.length-1} catColor={getCat(item.category).color} memberColor={memberColor(item.addedBy)} onToggle={()=>toggleCheck(item.id)} onDelete={()=>deleteShopItem(item.id)} swiped={swipedId===item.id} onSwipe={()=>setSwipedId(swipedId===item.id?null:item.id)} />)}
                    </div>
                  </div>
                )}
                {filteredShop.length===0&&<div style={{ textAlign:"center",padding:"40px 0",color:"#8E8E93" }}><div style={{ fontSize:40,marginBottom:8 }}>{listInfo.icon}</div><div style={{ fontWeight:600 }}>Lijst is leeg</div></div>}
              </div>
              <div style={{ background:"#fff",borderTop:"1px solid rgba(0,0,0,0.08)",display:"flex",padding:"6px 0 18px",flexShrink:0 }}>
                {SHOPPING_LISTS.map(list=>{
                  const badge=listBadge(list.id);
                  return (
                    <div key={list.id} onClick={()=>setActiveList(list.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",position:"relative",color:activeList===list.id?list.color:"#8E8E93" }}>
                      <span style={{ fontSize:18 }}>{list.icon}</span>
                      <span style={{ fontSize:8,fontWeight:700,textAlign:"center",maxWidth:52,lineHeight:1.2 }}>{list.label}</span>
                      {badge&&<div style={{ position:"absolute",top:-2,right:"12%",background:list.color,color:"#fff",width:14,height:14,borderRadius:7,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff" }}>{badge}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ DINER ══ */}
          {mainTab==="diner" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              {/* Category filter */}
              <div style={{ padding:"10px 12px 6px",display:"flex",gap:6,overflowX:"auto",background:"#F2F2F7",flexShrink:0 }}>
                <Chip label="Alle" active={mealFilter==="alle"} color="#E53935" onClick={()=>setMealFilter("alle")} />
                {MEAL_CATS.map(c=><Chip key={c.id} label={c.label.split(" ")[0]} active={mealFilter===c.id} color={c.color} onClick={()=>setMealFilter(c.id)} />)}
              </div>
              {/* Meals */}
              <div style={{ flex:1,overflowY:"auto",padding:"8px 12px" }}>
                {filteredMeals.map(meal=>{
                  const m=getMember(meal.addedBy);
                  const myCat=MEAL_CATS.find(c=>c.id===meal.category)||MEAL_CATS[7];
                  const hearts=Object.values(meal.votes).filter(v=>v==="❤️").length;
                  const thumbs=Object.values(meal.votes).filter(v=>v==="👍").length;
                  const myVote=meal.votes[currentMember];
                  return (
                    <div key={meal.id} onClick={()=>setSelectedMeal(meal)} style={{ background:"#fff",borderRadius:16,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.07)",cursor:"pointer" }}>
                      {meal.image ? (
                        <img src={meal.image} alt={meal.title} style={{ width:"100%",height:140,objectFit:"cover" }} />
                      ) : (
                        <div style={{ width:"100%",height:90,background:`linear-gradient(135deg,${myCat.color}33,${myCat.color}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>
                          {myCat.label.split(" ")[0]}
                        </div>
                      )}
                      <div style={{ padding:"10px 14px 12px" }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:16,fontWeight:700,color:"#000",marginBottom:2 }}>{meal.title}</div>
                            <div style={{ fontSize:11,color:"#8E8E93" }}>
                              <span style={{ background:myCat.color+"22",color:myCat.color,padding:"1px 7px",borderRadius:10,fontWeight:700 }}>{myCat.label}</span>
                              {" · "}<span style={{ color:m.color,fontWeight:600 }}>{meal.addedBy}</span>
                            </div>
                          </div>
                        </div>
                        {meal.recipe&&<div style={{ fontSize:12,color:"#6B6B6B",marginTop:6,lineHeight:1.4 }} numberOfLines={2}>{meal.recipe.slice(0,80)}{meal.recipe.length>80?"...":""}</div>}
                        {/* Votes */}
                        <div style={{ display:"flex",gap:8,marginTop:10,alignItems:"center" }}>
                          {[["❤️","Lekker!"],["👍","Prima"],["😐","Twijfel"]].map(([emoji,label])=>(
                            <div key={emoji} onClick={e=>{e.stopPropagation();voteMeal(meal.id,emoji);}} style={{
                              display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,fontSize:13,
                              background:myVote===emoji?"#F3F4F6":"transparent",
                              border:`2px solid ${myVote===emoji?"#007AFF":"#E5E5EA"}`,
                              cursor:"pointer",fontWeight:myVote===emoji?700:400,
                            }}>
                              <span>{emoji}</span>
                              <span style={{ fontSize:11,color:"#8E8E93" }}>{Object.values(meal.votes).filter(v=>v===emoji).length||""}</span>
                            </div>
                          ))}
                          <div style={{ marginLeft:"auto",display:"flex",gap:3 }}>
                            {MEMBERS.map(mb=>{
                              const v=meal.votes[mb.name];
                              if(!v) return null;
                              return <div key={mb.name} style={{ width:20,height:20,borderRadius:10,background:mb.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700 }}>{mb.name[0]}</div>;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredMeals.length===0&&(
                  <div style={{ textAlign:"center",padding:"48px 0",color:"#8E8E93" }}>
                    <div style={{ fontSize:44,marginBottom:10 }}>🍽️</div>
                    <div style={{ fontWeight:600,fontSize:17 }}>Geen suggesties</div>
                    <div style={{ fontSize:14,marginTop:4 }}>Tik op + om een gerecht voor te stellen</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN TAB BAR ── */}
        <div style={{ background:"#fff",borderTop:"1px solid rgba(0,0,0,0.1)",display:"flex",padding:"6px 4px 20px",flexShrink:0 }}>
          {MAIN_TABS.map(tab=>(
            <div key={tab.id} onClick={()=>setMainTab(tab.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",position:"relative" }}>
              <span style={{ fontSize:22,filter:mainTab===tab.id?"none":"grayscale(0.3)" }}>{tab.icon}</span>
              <span style={{ fontSize:9,fontWeight:700,color:mainTab===tab.id?accentColor():"#8E8E93" }}>{tab.label}</span>
              {tab.badge>0&&<div style={{ position:"absolute",top:-1,right:"8%",background:"#FF3B30",color:"#fff",minWidth:16,height:16,borderRadius:8,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",border:"2px solid #fff" }}>{tab.badge}</div>}
              {mainTab===tab.id&&<div style={{ width:4,height:4,borderRadius:2,background:accentColor(),marginTop:1 }} />}
            </div>
          ))}
        </div>

        {/* ── FAB ── */}
        {mainTab!=="chat" && (
          <div onClick={()=>{
            if(mainTab==="lijsten")  setShowAddItem(true);
            if(mainTab==="kalender") setShowAddEvent(true);
            if(mainTab==="taken")    setShowAddTask(true);
            if(mainTab==="diner")    setShowAddMeal(true);
          }} style={{
            position:"absolute",bottom:82,right:18,
            width:48,height:48,borderRadius:24,
            background:accentColor(),
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"#fff",fontSize:24,fontWeight:300,
            boxShadow:`0 6px 20px ${accentColor()}66`,
            cursor:"pointer",zIndex:10,
          }}>+</div>
        )}

        {/* ── ADD ITEM SHEET ── */}
        {showAddItem&&(
          <Sheet onClose={()=>setShowAddItem(false)}>
            <SheetTitle icon={listInfo.icon} title={`Toevoegen aan ${listInfo.label}`} sub={`Als ${currentMember}`} subColor={listInfo.color} />
            <FieldBox><input ref={itemInputRef} value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addShopItem()} placeholder="Naam van artikel..." style={INP} /></FieldBox>
            <div style={{ display:"flex",gap:8,marginBottom:10 }}>
              <FieldBox style={{ flex:1 }}><input type="number" value={newItem.qty} onChange={e=>setNewItem({...newItem,qty:e.target.value})} style={INP} /></FieldBox>
              <FieldBox style={{ flex:1 }}><input value={newItem.unit} placeholder="eenheid" onChange={e=>setNewItem({...newItem,unit:e.target.value})} style={INP} /></FieldBox>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:14 }}>
              {cats.map(cat=><Chip key={cat.id} label={cat.label} active={(newItem.category||cats[0]?.id)===cat.id} color={cat.color} onClick={()=>setNewItem({...newItem,category:cat.id})} />)}
            </div>
            <ActionBtn color={listInfo.color} onClick={addShopItem}>Toevoegen aan lijst</ActionBtn>
          </Sheet>
        )}

        {/* ── ADD EVENT SHEET ── */}
        {showAddEvent&&(
          <Sheet onClose={()=>setShowAddEvent(false)}>
            <SheetTitle icon="📅" title="Afspraak toevoegen" sub={`Als ${currentMember}`} subColor="#007AFF" />
            <FieldBox><input ref={eventInputRef} value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})} placeholder="Titel afspraak..." style={INP} /></FieldBox>
            <FieldBox><input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
            <div style={{ display:"flex",gap:8,marginBottom:10 }}>
              <FieldBox style={{ flex:1 }}><input type="time" value={newEvent.startTime} onChange={e=>setNewEvent({...newEvent,startTime:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
              <div style={{ display:"flex",alignItems:"center",color:"#8E8E93",fontSize:12 }}>tot</div>
              <FieldBox style={{ flex:1 }}><input type="time" value={newEvent.endTime} onChange={e=>setNewEvent({...newEvent,endTime:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
            </div>
            <FieldBox><input value={newEvent.location} onChange={e=>setNewEvent({...newEvent,location:e.target.value})} placeholder="📍 Locatie" style={INP} /></FieldBox>
            <FieldBox style={{ marginTop:6 }}><input value={newEvent.notes} onChange={e=>setNewEvent({...newEvent,notes:e.target.value})} placeholder="📝 Notities" style={INP} /></FieldBox>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,margin:"10px 0 8px" }}>
              {CAL_CATS.map(cat=><Chip key={cat.id} label={cat.label.split(" ")[0]} active={newEvent.category===cat.id} color={cat.color} onClick={()=>setNewEvent({...newEvent,category:cat.id})} small />)}
            </div>
            <div style={{ display:"flex",gap:6,marginBottom:14 }}>
              {MEMBERS.map(m=><div key={m.name} onClick={()=>setNewEvent({...newEvent,member:m.name})} style={{ padding:"4px 10px",borderRadius:14,fontSize:11,fontWeight:700,background:newEvent.member===m.name?m.color:"#E5E5EA",color:newEvent.member===m.name?"#fff":"#3A3A3C",cursor:"pointer" }}>{m.name}</div>)}
            </div>
            <ActionBtn color="#007AFF" onClick={addEvent}>Afspraak toevoegen</ActionBtn>
          </Sheet>
        )}

        {/* ── ADD TASK SHEET ── */}
        {showAddTask&&(
          <Sheet onClose={()=>setShowAddTask(false)}>
            <SheetTitle icon="✅" title="Nieuwe taak" sub={`Als ${currentMember}`} subColor="#5856D6" />
            <FieldBox><input ref={taskInputRef} value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Wat moet er gedaan worden?" style={INP} /></FieldBox>
            <div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6,marginTop:6 }}>TOEWIJZEN AAN</div>
            <div style={{ display:"flex",gap:6,marginBottom:10 }}>
              {MEMBERS.map(m=>(
                <div key={m.name} onClick={()=>setNewTask({...newTask,assignedTo:m.name})} style={{ flex:1,padding:"8px 0",borderRadius:12,textAlign:"center",fontSize:11,fontWeight:700,background:newTask.assignedTo===m.name?m.color:"#E5E5EA",color:newTask.assignedTo===m.name?"#fff":"#3A3A3C",cursor:"pointer" }}>
                  <div style={{ fontSize:18,marginBottom:2 }}>{getMember(m.name).emoji}</div>{m.name}
                </div>
              ))}
            </div>
            <div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6 }}>PRIORITEIT</div>
            <div style={{ display:"flex",gap:6,marginBottom:10 }}>
              {[["laag","🟢"],["normaal","🟡"],["hoog","🔴"]].map(([p,ic])=>(
                <div key={p} onClick={()=>setNewTask({...newTask,priority:p})} style={{ flex:1,padding:"8px 0",borderRadius:12,textAlign:"center",fontSize:12,fontWeight:700,background:newTask.priority===p?"#5856D6":"#E5E5EA",color:newTask.priority===p?"#fff":"#3A3A3C",cursor:"pointer" }}>{ic} {p.charAt(0).toUpperCase()+p.slice(1)}</div>
              ))}
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:14 }}>
              {TASK_CATS.map(cat=><Chip key={cat.id} label={cat.label} active={newTask.category===cat.id} color={cat.color} onClick={()=>setNewTask({...newTask,category:cat.id})} />)}
            </div>
            <FieldBox><input value={newTask.deadline} type="date" onChange={e=>setNewTask({...newTask,deadline:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
            <ActionBtn color="#5856D6" onClick={addTask} style={{ marginTop:6 }}>Taak toevoegen</ActionBtn>
          </Sheet>
        )}

        {/* ── ADD MEAL SHEET ── */}
        {showAddMeal&&(
          <Sheet onClose={()=>setShowAddMeal(false)}>
            <SheetTitle icon="🍽️" title="Gerecht voorstellen" sub={`Als ${currentMember}`} subColor="#E53935" />
            <FieldBox><input ref={mealInputRef} value={newMeal.title} onChange={e=>setNewMeal({...newMeal,title:e.target.value})} placeholder="Naam van het gerecht..." style={INP} /></FieldBox>
            <FieldBox><input value={newMeal.recipe} onChange={e=>setNewMeal({...newMeal,recipe:e.target.value})} placeholder="📝 Ingrediënten / recept (optioneel)" style={INP} /></FieldBox>
            {/* Photo upload */}
            <div onClick={()=>fileInputRef.current?.click()} style={{ background:newMeal.image?"transparent":"#fff",border:"2px dashed #E5E5EA",borderRadius:12,marginBottom:10,overflow:"hidden",cursor:"pointer",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center" }}>
              {newMeal.image ? (
                <img src={newMeal.image} alt="" style={{ width:"100%",height:120,objectFit:"cover" }} />
              ) : (
                <div style={{ textAlign:"center",color:"#8E8E93",padding:"16px" }}>
                  <div style={{ fontSize:28,marginBottom:4 }}>📸</div>
                  <div style={{ fontSize:13,fontWeight:600 }}>Foto toevoegen</div>
                  <div style={{ fontSize:11 }}>Uit je fotoboek of maak een foto</div>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMealImage} style={{ display:"none" }} />
            <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:14 }}>
              {MEAL_CATS.map(cat=><Chip key={cat.id} label={cat.label} active={newMeal.category===cat.id} color={cat.color} onClick={()=>setNewMeal({...newMeal,category:cat.id})} />)}
            </div>
            <ActionBtn color="#E53935" onClick={addMeal}>Gerecht voorstellen</ActionBtn>
          </Sheet>
        )}

        {/* ── EVENT DETAIL ── */}
        {selectedEvent&&(
          <Sheet onClose={()=>setSelectedEvent(null)}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                  <div style={{ width:8,height:8,borderRadius:4,background:getCatInfo(selectedEvent.category).color }} />
                  <div style={{ fontSize:10,color:getCatInfo(selectedEvent.category).color,fontWeight:700,textTransform:"uppercase" }}>{getCatInfo(selectedEvent.category).label}</div>
                </div>
                <div style={{ fontSize:18,fontWeight:800,color:"#000" }}>{selectedEvent.title}</div>
                <div style={{ fontSize:12,color:"#8E8E93",marginTop:2 }}>{NL_DAYS_LONG[parseDate(selectedEvent.date).getDay()]} {parseDate(selectedEvent.date).getDate()} {NL_MONTHS[parseDate(selectedEvent.date).getMonth()]}</div>
              </div>
              <div style={{ width:36,height:36,borderRadius:18,background:memberColor(selectedEvent.member)+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:memberColor(selectedEvent.member) }}>{selectedEvent.member[0]}</div>
            </div>
            <div style={{ background:"#F2F2F7",borderRadius:12,padding:"10px 14px",marginBottom:12 }}>
              <InfoRow icon="🕐" label={`${selectedEvent.startTime} – ${selectedEvent.endTime}`} />
              {selectedEvent.location&&<InfoRow icon="📍" label={selectedEvent.location} />}
              <InfoRow icon="👤" label={selectedEvent.member} />
              {selectedEvent.notes&&<InfoRow icon="📝" label={selectedEvent.notes} />}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <div onClick={()=>exportToICS(selectedEvent)} style={{ flex:1,background:"#E8F0FE",color:"#007AFF",borderRadius:12,padding:"12px",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer" }}>📤 Naar Outlook</div>
              <div onClick={()=>deleteEvent(selectedEvent.id)} style={{ flex:1,background:"#FFE5E5",color:"#FF3B30",borderRadius:12,padding:"12px",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer" }}>🗑️ Verwijder</div>
            </div>
          </Sheet>
        )}

        {/* ── MEAL DETAIL ── */}
        {selectedMeal&&(
          <Sheet onClose={()=>setSelectedMeal(null)}>
            {selectedMeal.image&&<img src={selectedMeal.image} alt="" style={{ width:"100%",height:160,objectFit:"cover",borderRadius:12,marginBottom:12 }} />}
            <div style={{ fontSize:20,fontWeight:800,color:"#000",marginBottom:4 }}>{selectedMeal.title}</div>
            <div style={{ fontSize:12,color:"#8E8E93",marginBottom:12 }}>
              Voorgesteld door <span style={{ color:memberColor(selectedMeal.addedBy),fontWeight:700 }}>{selectedMeal.addedBy}</span>
            </div>
            {selectedMeal.recipe&&(
              <div style={{ background:"#F2F2F7",borderRadius:12,padding:"12px",marginBottom:12 }}>
                <div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6 }}>RECEPT / INGREDIËNTEN</div>
                <div style={{ fontSize:14,color:"#3A3A3C",lineHeight:1.6 }}>{selectedMeal.recipe}</div>
              </div>
            )}
            <div style={{ display:"flex",gap:8,marginBottom:14 }}>
              {[["❤️","Lekker!"],["👍","Prima"],["😐","Twijfel"]].map(([emoji,label])=>{
                const count=Object.values(selectedMeal.votes).filter(v=>v===emoji).length;
                const myVote=selectedMeal.votes[currentMember];
                const voters=Object.entries(selectedMeal.votes).filter(([,v])=>v===emoji).map(([k])=>k);
                return (
                  <div key={emoji} onClick={()=>{ voteMeal(selectedMeal.id,emoji); setSelectedMeal(p=>({...p,votes:{...p.votes,[currentMember]:p.votes[currentMember]===emoji?undefined:emoji}})); }} style={{ flex:1,padding:"10px 0",borderRadius:14,textAlign:"center",border:`2px solid ${myVote===emoji?"#007AFF":"#E5E5EA"}`,cursor:"pointer",background:myVote===emoji?"#EBF4FF":"#fff" }}>
                    <div style={{ fontSize:22 }}>{emoji}</div>
                    <div style={{ fontSize:12,fontWeight:700,color:"#3A3A3C" }}>{label}</div>
                    <div style={{ fontSize:11,color:"#8E8E93" }}>{count} {count===1?"stem":"stemmen"}</div>
                  </div>
                );
              })}
            </div>
            <div onClick={()=>setSelectedMeal(null)} style={{ background:"#F2F2F7",color:"#3A3A3C",borderRadius:12,padding:"12px",textAlign:"center",fontSize:14,fontWeight:700,cursor:"pointer" }}>Sluiten</div>
          </Sheet>
        )}

        <style>{`
          @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
          * { -webkit-tap-highlight-color:transparent; }
          ::-webkit-scrollbar { display:none; }
        `}</style>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function TaskItem({ task, isLast, onToggle, onDelete, getMember, currentMember }) {
  const [swiped, setSwiped] = useState(false);
  const m = getMember(task.assignedTo);
  const TASK_CAT = TASK_CATS.find(c=>c.id===task.category)||TASK_CATS[4];
  const priorityColor = task.priority==="hoog"?"#FF3B30":task.priority==="laag"?"#34C759":"#FF9F0A";
  const pts = POINTS_MAP[task.priority] || 10;
  const earnsPoints = task.addedBy !== task.assignedTo; // task for someone else = points
  const doneByM = task.doneBy ? getMember(task.doneBy) : null;
  return (
    <div style={{ position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:72,background:"#FF3B30",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }} onClick={onDelete}>Wis</div>
      <div style={{ display:"flex",alignItems:"center",padding:"12px 14px",borderBottom:isLast?"none":"1px solid #F2F2F7",background:"#fff",transform:swiped?"translateX(-72px)":"translateX(0)",transition:"transform 0.22s" }}>
        {/* Checkbox */}
        <div onClick={onToggle} style={{ width:24,height:24,borderRadius:12,marginRight:12,flexShrink:0,border:task.done?"none":"2px solid #C7C7CC",background:task.done?"#34C759":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",cursor:"pointer" }}>
          {task.done&&<span style={{ color:"#fff",fontSize:12 }}>✓</span>}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
            <div style={{ fontSize:8,width:6,height:6,borderRadius:3,background:priorityColor,flexShrink:0 }} />
            <div style={{ fontSize:15,fontWeight:600,color:task.done?"#8E8E93":"#000",textDecoration:task.done?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{task.title}</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:5,flexWrap:"wrap" }}>
            <div style={{ background:TASK_CAT.color+"22",color:TASK_CAT.color,padding:"1px 6px",borderRadius:8,fontSize:10,fontWeight:700 }}>{TASK_CAT.label.split(" ")[1]||TASK_CAT.label}</div>
            {task.deadline&&<div style={{ fontSize:10,color:"#FF9F0A",fontWeight:600 }}>📅 {task.deadline}</div>}
            {/* Points badge */}
            {earnsPoints && (
              <div style={{ background:task.done?"#34C75922":"#5856D622", color:task.done?"#34C759":"#5856D6", padding:"1px 7px", borderRadius:8, fontSize:10, fontWeight:800 }}>
                {task.done ? `+${pts}pt ✓` : `+${pts}pt`}
              </div>
            )}
            {task.done && doneByM && (
              <div style={{ fontSize:10,color:doneByM.color,fontWeight:600 }}>door {doneByM.name}</div>
            )}
          </div>
        </div>
        {/* Assigned avatar */}
        <div style={{ width:30,height:30,borderRadius:15,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:"#fff",flexShrink:0,marginLeft:8,cursor:"pointer" }} onClick={()=>setSwiped(s=>!s)}>{m.emoji}</div>
      </div>
    </div>
  );
}

function CalPill({ event, onClick, getCatInfo, getMember }) {
  const cat = getCatInfo(event.category);
  const m   = getMember(event.member);
  return (
    <div onClick={onClick} style={{ background:cat.color+"15",borderLeft:`3px solid ${cat.color}`,borderRadius:"0 8px 8px 0",padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12,fontWeight:700,color:"#000" }}>{event.title}</div>
        <div style={{ fontSize:10,color:"#8E8E93" }}>{event.startTime}–{event.endTime}{event.location?` · ${event.location}`:""}</div>
      </div>
      <div style={{ width:20,height:20,borderRadius:10,background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff",flexShrink:0 }}>{event.member[0]}</div>
    </div>
  );
}

function ShopItem({ item, isLast, catColor, memberColor, onToggle, onDelete, swiped, onSwipe }) {
  return (
    <div style={{ position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:68,background:"#FF3B30",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }} onClick={onDelete}>Wis</div>
      <div style={{ display:"flex",alignItems:"center",padding:"10px 12px",borderBottom:isLast?"none":"1px solid #F2F2F7",background:"#fff",transform:swiped?"translateX(-68px)":"translateX(0)",transition:"transform 0.22s" }}>
        <div style={{ width:6,height:6,borderRadius:3,background:catColor,marginRight:10,flexShrink:0 }} />
        <div onClick={onToggle} style={{ width:21,height:21,borderRadius:11,marginRight:10,flexShrink:0,border:item.checked?"none":"2px solid #C7C7CC",background:item.checked?"#34C759":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",cursor:"pointer" }}>
          {item.checked&&<span style={{ color:"#fff",fontSize:11 }}>✓</span>}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:14,fontWeight:500,color:item.checked?"#8E8E93":"#000",textDecoration:item.checked?"line-through":"none" }}>{item.name}</div>
          <div style={{ fontSize:11,color:"#8E8E93",marginTop:1 }}>{item.qty} {item.unit} · <span style={{ color:memberColor,fontWeight:600 }}>{item.addedBy}</span></div>
        </div>
        <div onClick={onSwipe} style={{ padding:"0 0 0 8px",color:"#C7C7CC",fontSize:15 }}>⋯</div>
      </div>
    </div>
  );
}

function Sheet({ children, onClose }) {
  return (
    <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:20,display:"flex",alignItems:"flex-end" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#F2F2F7",borderRadius:"22px 22px 0 0",padding:"14px 16px 36px",width:"100%",boxSizing:"border-box",animation:"slideUp 0.28s ease",maxHeight:"88%",overflowY:"auto" }}>
        <div style={{ width:34,height:4,background:"#C7C7CC",borderRadius:2,margin:"0 auto 14px" }} />
        {children}
      </div>
    </div>
  );
}

function SheetTitle({ icon, title, sub, subColor }) {
  return (
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
      <div style={{ fontSize:16,fontWeight:800,color:"#000" }}>{icon} {title}</div>
      <div style={{ fontSize:12,color:subColor,fontWeight:700 }}>Als {sub}</div>
    </div>
  );
}

function Chip({ label, active, color, onClick, small }) {
  return (
    <div onClick={onClick} style={{ padding:small?"4px 9px":"5px 11px",borderRadius:20,fontSize:small?11:12,fontWeight:700,background:active?color:"#E5E5EA",color:active?"#fff":"#3A3A3C",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0 }}>{label}</div>
  );
}

function FieldBox({ children, style }) {
  return <div style={{ background:"#fff",borderRadius:10,marginBottom:8,overflow:"hidden",...style }}>{children}</div>;
}

function ActionBtn({ color, onClick, children }) {
  return <div onClick={onClick} style={{ background:color,color:"#fff",borderRadius:12,padding:"14px",textAlign:"center",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 14px ${color}44`,marginTop:4 }}>{children}</div>;
}

function InfoRow({ icon, label }) {
  return (
    <div style={{ display:"flex",gap:8,marginBottom:5,alignItems:"flex-start" }}>
      <span style={{ fontSize:13 }}>{icon}</span>
      <span style={{ fontSize:13,color:"#3A3A3C" }}>{label}</span>
    </div>
  );
}

const INP = { width:"100%",padding:"12px 14px",border:"none",outline:"none",fontSize:15,color:"#000",background:"none",boxSizing:"border-box" };
