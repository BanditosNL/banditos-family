import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL  || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = SUPABASE_URL ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const APP_NAME = "Banditos Family";
const MEMBER_COLORS = ["#FF6B35","#E91E8C","#00BCD4","#9C27B0","#34C759","#FF9F0A","#007AFF","#FF3B30"];
const MEMBER_EMOJIS = ["🤠","💃","🌸","⭐","🦁","🎸","🚀","🌊"];

const SHOPPING_LISTS = [
  { id:"boodschappen", label:"Boodschappen",    icon:"🛒", color:"#34C759" },
  { id:"health",       label:"Health & Beauty", icon:"💄", color:"#FF2D55" },
  { id:"cadeaus",      label:"Cadeaus",         icon:"🎁", color:"#FF9F0A" },
  { id:"sport",        label:"Sport",           icon:"⚽", color:"#007AFF" },
  { id:"huis",         label:"Huis",            icon:"🏠", color:"#AF52DE" },
];
const SHOP_CATS = {
  boodschappen:[{id:"groente",label:"🥦 Groente & Fruit",color:"#34C759"},{id:"zuivel",label:"🧀 Zuivel",color:"#FF9F0A"},{id:"vlees",label:"🥩 Vlees & Vis",color:"#FF3B30"},{id:"bakkerij",label:"🍞 Bakkerij",color:"#AC8E68"},{id:"dranken",label:"🥤 Dranken",color:"#007AFF"},{id:"overig",label:"🛒 Overig",color:"#8E8E93"}],
  health:[{id:"huid",label:"🧴 Huid",color:"#FF2D55"},{id:"haar",label:"💇 Haar",color:"#FF6B9D"},{id:"medicijn",label:"💊 Medicijnen",color:"#FF3B30"},{id:"overig",label:"✨ Overig",color:"#8E8E93"}],
  cadeaus:[{id:"verjaardag",label:"🎂 Verjaardag",color:"#FF9F0A"},{id:"kerst",label:"🎄 Kerst",color:"#34C759"},{id:"overig",label:"🎁 Overig",color:"#8E8E93"}],
  sport:[{id:"kleding",label:"👟 Kleding",color:"#007AFF"},{id:"uitrusting",label:"🏋️ Uitrusting",color:"#FF9F0A"},{id:"overig",label:"⚽ Overig",color:"#8E8E93"}],
  huis:[{id:"schoonmaak",label:"🧹 Schoonmaak",color:"#5AC8FA"},{id:"tuin",label:"🌱 Tuin",color:"#34C759"},{id:"overig",label:"🏠 Overig",color:"#8E8E93"}],
};
const CAL_CATS = [
  {id:"school",label:"🏫 School",color:"#007AFF"},{id:"sport",label:"⚽ Sport",color:"#34C759"},
  {id:"familie",label:"👨‍👩‍👧‍👦 Familie",color:"#FF9F0A"},{id:"werk",label:"💼 Werk",color:"#5856D6"},
  {id:"dokter",label:"🏥 Dokter",color:"#FF3B30"},{id:"verjaardag",label:"🎂 Verjaardag",color:"#FF2D55"},
  {id:"vakantie",label:"✈️ Vakantie",color:"#30B0C7"},{id:"overig",label:"📅 Overig",color:"#8E8E93"},
];
const TASK_CATS = [
  {id:"thuis",label:"🏠 Thuis",color:"#FF9F0A"},{id:"school",label:"🏫 School",color:"#007AFF"},
  {id:"werk",label:"💼 Werk",color:"#5856D6"},{id:"bood",label:"🛒 Boodschap",color:"#34C759"},
  {id:"overig",label:"📋 Overig",color:"#8E8E93"},
];
const MEAL_CATS = [
  {id:"italiaans",label:"🍝 Italiaans",color:"#E53935"},{id:"aziatisch",label:"🍜 Aziatisch",color:"#FB8C00"},
  {id:"hollands",label:"🥔 Hollands",color:"#F4511E"},{id:"gezond",label:"🥗 Gezond",color:"#43A047"},
  {id:"grill",label:"🔥 Grill/BBQ",color:"#E53935"},{id:"soep",label:"🍲 Soep",color:"#8D6E63"},
  {id:"snel",label:"⚡ Snel klaar",color:"#FF9F0A"},{id:"overig",label:"🍽️ Overig",color:"#8E8E93"},
];
const POINTS_MAP = { laag:5, normaal:10, hoog:20 };
const PRIZES = [
  {rank:1,label:"🏆 #1 — Diner cheque",value:"€25",color:"#FFD700"},
  {rank:2,label:"🥈 #2 — Bloemen",value:"€15",color:"#C0C0C0"},
  {rank:3,label:"🥉 #3 — Shoppingbon",value:"€10",color:"#CD7F32"},
];
const NL_DAYS_SHORT=["zo","ma","di","wo","do","vr","za"];
const NL_DAYS_LONG=["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];
const NL_MONTHS=["Januari","Februari","Maart","April","Mei","Juni","Juli","Augustus","September","Oktober","November","December"];
const today=new Date();
const fmtDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const addDays=(d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
const parseDate=s=>{const[y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const timeAgo=ts=>{const d=Date.now()-ts;if(d<60000)return"nu";if(d<3600000)return`${Math.floor(d/60000)}m`;if(d<86400000)return`${Math.floor(d/3600000)}u`;return`${Math.floor(d/86400000)}d`;};
const getMonthKey=ts=>{const d=new Date(ts);return`${d.getFullYear()}-${d.getMonth()}`;};

function exportToICS(event){
  const d=parseDate(event.datum);
  const[sh,sm]=event.begintijd.split(":").map(Number);
  const[eh,em]=event.eindtijd.split(":").map(Number);
  const fmt=(date,h,m)=>`${date.getFullYear()}${String(date.getMonth()+1).padStart(2,"0")}${String(date.getDate()).padStart(2,"0")}T${String(h).padStart(2,"0")}${String(m).padStart(2,"0")}00`;
  const ics=["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",`DTSTART:${fmt(d,sh,sm)}`,`DTEND:${fmt(d,eh,em)}`,`SUMMARY:${event.titel}`,event.locatie?`LOCATION:${event.locatie}`:"",`UID:${event.id}@banditos`,"END:VEVENT","END:VCALENDAR"].filter(Boolean).join("\r\n");
  const blob=new Blob([ics],{type:"text/calendar"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${event.titel}.ics`;a.click();
}

// ─── AUTH STYLES ─────────────────────────────────────────────────────────────
const A = {
  wrap:  { minHeight:"100vh", background:"linear-gradient(160deg,#1a0a00,#3d1a00,#1a0000)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  card:  { width:"100%", maxWidth:380, background:"rgba(255,255,255,0.08)", backdropFilter:"blur(20px)", borderRadius:28, padding:"32px 28px", border:"1px solid rgba(255,255,255,0.12)" },
  logo:  { fontSize:64, textAlign:"center", marginBottom:8 },
  title: { fontSize:28, fontWeight:900, color:"#fff", textAlign:"center", marginBottom:4 },
  sub:   { fontSize:14, color:"rgba(255,255,255,0.5)", textAlign:"center", marginBottom:28 },
  input: { width:"100%", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", borderRadius:14, padding:"15px 18px", color:"#fff", fontSize:15, marginBottom:12, outline:"none", boxSizing:"border-box" },
  btn:   { width:"100%", background:"#FF6B35", border:"none", borderRadius:14, padding:"17px", color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", marginTop:6, boxShadow:"0 6px 24px rgba(255,107,53,0.45)" },
  err:   { background:"rgba(255,60,60,0.18)", border:"1px solid rgba(255,60,60,0.4)", borderRadius:12, padding:"11px 16px", marginBottom:14, fontSize:13, color:"#ffaaaa", textAlign:"center" },
};

// ─── LOGIN / REGISTER ─────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode,setMode]   = useState("login");
  const [email,setEmail] = useState("");
  const [pass,setPass]   = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [pendingUserId,setPendingUserId] = useState(null);

  const doLogin = async () => {
    if(!email||!pass) return setError("Vul e-mail en wachtwoord in");
    setLoading(true); setError("");
    try {
      if(!supabase) { setError("Supabase nog niet gekoppeld — zie de handleiding Stap 7"); return; }
      const { data, error:err } = await supabase.auth.signInWithPassword({ email, password:pass });
      if(err) throw err;
      const { data:profile, error:profErr } = await supabase
        .from("profielen").select("*").eq("id", data.user.id).maybeSingle();
      if(profile) {
        onLogin(profile);
      } else {
        // No profile yet — go to profile setup
        setPendingUserId(data.user.id);
        setMode("profile");
      }
    } catch(e) { setError(e.message||"Inloggen mislukt"); }
    finally { setLoading(false); }
  };

  const doRegister = async () => {
    if(!email||!pass) return setError("Vul e-mail en wachtwoord in");
    if(pass.length<6) return setError("Wachtwoord minimaal 6 tekens");
    setLoading(true); setError("");
    try {
      if(!supabase) { setError("Supabase nog niet gekoppeld — zie de handleiding Stap 7"); return; }
      const { data, error:err } = await supabase.auth.signUp({ email, password:pass });
      if(err) throw err;
      setPendingUserId(data.user?.id);
      setMode("profile");
    } catch(e) { setError(e.message||"Registreren mislukt"); }
    finally { setLoading(false); }
  };

  if(mode==="profile") return <ProfileSetup userId={pendingUserId} onDone={onLogin} />;

  return (
    <div style={A.wrap}>
      <div style={A.card}>
        <div style={A.logo}>🤠</div>
        <div style={A.title}>{APP_NAME}</div>
        <div style={A.sub}>De gezinsapp van de Banditos</div>

        <div style={{ display:"flex", background:"rgba(255,255,255,0.1)", borderRadius:14, padding:3, marginBottom:22 }}>
          {[["login","Inloggen"],["register","Registreren"]].map(([v,l])=>(
            <div key={v} onClick={()=>{setMode(v);setError("");}} style={{ flex:1, textAlign:"center", padding:"11px 0", borderRadius:11, fontSize:14, fontWeight:700, background:mode===v?"rgba(255,255,255,0.2)":"transparent", color:"#fff", cursor:"pointer", transition:"all 0.2s" }}>{l}</div>
          ))}
        </div>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mailadres" type="email" style={A.input} />
        <input value={pass}  onChange={e=>setPass(e.target.value)}  placeholder="Wachtwoord (min. 6 tekens)" type="password" style={A.input}
          onKeyDown={e=>e.key==="Enter"&&(mode==="login"?doLogin():doRegister())} />

        {error && <div style={A.err}>{error}</div>}
        <button onClick={mode==="login"?doLogin:doRegister} disabled={loading} style={A.btn}>
          {loading ? "Even geduld..." : mode==="login" ? "Inloggen →" : "Account aanmaken →"}
        </button>

        {!supabase && (
          <div style={{ marginTop:16, background:"rgba(255,165,0,0.15)", border:"1px solid rgba(255,165,0,0.35)", borderRadius:12, padding:"12px 16px", fontSize:12, color:"rgba(255,255,255,0.75)", textAlign:"center" }}>
            ⚠️ Supabase niet gekoppeld.<br/>Stel de omgevingsvariabelen in bij Vercel (Stap 7 handleiding).
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE SETUP ────────────────────────────────────────────────────────────
function ProfileSetup({ userId, onDone }) {
  const [naam,setNaam]         = useState("");
  const [gezinCode,setGezinCode] = useState("");
  const [kleur,setKleur]       = useState(MEMBER_COLORS[0]);
  const [emoji,setEmoji]       = useState(MEMBER_EMOJIS[0]);
  const [avatarPreview,setAvatarPreview] = useState(null);
  const [avatarFile,setAvatarFile]       = useState(null);
  const [loading,setLoading]   = useState(false);
  const [error,setError]       = useState("");
  const fileRef = useRef(null);

  const handlePhoto = e => {
    const file = e.target.files[0]; if(!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if(!naam.trim()) return setError("Vul je naam in");
    if(!gezinCode.trim()) return setError("Vul de gezinscode in");
    setLoading(true); setError("");
    try {
      let avatar_url = null;
      if(supabase && avatarFile && userId) {
        try {
          const ext = avatarFile.name.split(".").pop();
          const path = `avatars/${userId}.${ext}`;
          const { error:upErr } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert:true });
          if(!upErr) {
            const { data:u } = supabase.storage.from("avatars").getPublicUrl(path);
            avatar_url = u?.publicUrl || null;
          }
        } catch(uploadErr) {
          console.warn("Foto upload mislukt, doorgaan zonder foto:", uploadErr);
          // Continue without photo — not a blocker
        }
      }
      const profile = { id: userId||`demo-${Date.now()}`, naam:naam.trim(), kleur, emoji, gezin_code:gezinCode.trim().toLowerCase(), avatar_url };
      if(supabase && userId) {
        const { error: upsertErr } = await supabase.from("profielen").upsert(profile);
        if(upsertErr) {
          console.error("Profiel opslaan mislukt:", upsertErr);
          setError("Opslaan mislukt: " + upsertErr.message);
          return;
        }
      }
      // Profile saved — go to app immediately
      onDone(profile);
    } catch(e) { setError(e.message||"Opslaan mislukt"); }
    finally { setLoading(false); }
  };

  return (
    <div style={A.wrap}>
      <div style={A.card}>
        <div style={A.logo}>👤</div>
        <div style={A.title}>Jouw profiel</div>
        <div style={A.sub}>Hoe zie jij eruit in de app?</div>

        {/* Avatar */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:18 }}>
          <div onClick={()=>fileRef.current?.click()} style={{ width:96, height:96, borderRadius:48, background:kleur, display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, cursor:"pointer", overflow:"hidden", border:"3px solid rgba(255,255,255,0.3)", position:"relative" }}>
            {avatarPreview ? <img src={avatarPreview} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : emoji}
            <div style={{ position:"absolute", bottom:2, right:2, background:"rgba(0,0,0,0.65)", borderRadius:12, padding:"3px 7px", fontSize:13 }}>📷</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }} />
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:6 }}>Tik voor een foto (optioneel)</div>
        </div>

        {/* Emoji keuze */}
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:1, marginBottom:8, textAlign:"center" }}>KIES EEN EMOJI</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:16 }}>
          {MEMBER_EMOJIS.map(e=>(
            <div key={e} onClick={()=>setEmoji(e)} style={{ width:42, height:42, borderRadius:21, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, background:emoji===e?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.07)", border:`2px solid ${emoji===e?"rgba(255,255,255,0.7)":"transparent"}`, cursor:"pointer", transition:"all 0.15s" }}>{e}</div>
          ))}
        </div>

        {/* Kleur keuze */}
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:1, marginBottom:8, textAlign:"center" }}>KIES EEN KLEUR</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20 }}>
          {MEMBER_COLORS.map(c=>(
            <div key={c} onClick={()=>setKleur(c)} style={{ width:32, height:32, borderRadius:16, background:c, border:`3px solid ${kleur===c?"#fff":"transparent"}`, cursor:"pointer", transition:"all 0.15s", boxShadow:kleur===c?"0 0 0 2px rgba(255,255,255,0.3)":"none" }} />
          ))}
        </div>

        <input value={naam} onChange={e=>setNaam(e.target.value)} placeholder="Jouw naam (bijv. Sandra)" style={A.input} />
        <input value={gezinCode} onChange={e=>setGezinCode(e.target.value)} placeholder="Gezinscode (bijv. banditos2025)" style={A.input} />
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:16, textAlign:"center", lineHeight:1.5 }}>
          De gezinscode koppelt jou aan het gezin.<br/>Vraag de beheerder om de code.
        </div>

        {error && <div style={A.err}>{error}</div>}
        <button onClick={save} disabled={loading} style={A.btn}>{loading?"Opslaan...":"Klaar! Start de app 🤠"}</button>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function BanditosApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!supabase) { setBooting(false); return; }

    // Check session once on load
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        supabase.from("profielen").select("*")
          .eq("id", data.session.user.id).maybeSingle()
          .then(({ data: profile }) => {
            if (profile) setCurrentUser(profile);
            setBooting(false);
          });
      } else {
        setBooting(false);
      }
    });

    // Safety timeout
    const t = setTimeout(() => setBooting(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = (profile) => {
    setCurrentUser(profile);
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  if (booting) return (
    <div style={{ minHeight:"100vh", background:"#1a0a00", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:64 }}>🤠</div>
      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:14 }}>Laden...</div>
    </div>
  );

  if (!currentUser) return <AuthScreen onLogin={handleLogin} />;
  return <AppShell currentUser={currentUser} onLogout={logout} />;
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function AppShell({ currentUser, onLogout }) {
  const gc = currentUser.gezin_code;

  const [mainTab,setMainTab] = useState("chat");
  const [appError,setAppError] = useState(null);
  const [pushGranted,setPushGranted] = useState(()=>typeof Notification!=="undefined"&&Notification?.permission==="granted");
  const [showPushPopup,setShowPushPopup] = useState(()=>typeof Notification!=="undefined"&&Notification?.permission!=="granted");
  const [lastReadAt,setLastReadAt] = useState(()=>{ 
    try { return parseInt(localStorage.getItem("banditos_lastread_"+currentUser?.id)||"0"); } 
    catch(e){ return 0; }
  });

  // ── state ──
  const [messages,setMessages]   = useState([]);
  const [chatInput,setChatInput] = useState("");
  const [reactionTarget,setReactionTarget] = useState(null);
  const chatEndRef = useRef(null);

  const [events,setEvents]         = useState([]);
  const [calView,setCalView]       = useState("week");
  const [calDate,setCalDate]       = useState(today);
  const [showAddEvent,setShowAddEvent] = useState(false);
  const [selectedEvent,setSelectedEvent] = useState(null);
  const [newEvent,setNewEvent]     = useState({ titel:"", datum:fmtDate(today), begintijd:"09:00", eindtijd:"10:00", categorie:"familie", locatie:"", notities:"" });
  const [filterMember,setFilterMember] = useState("alle");
  const [familyMembers,setFamilyMembers] = useState([currentUser]);

  const [activeList,setActiveList] = useState("boodschappen");
  const [allItems,setAllItems]     = useState({ boodschappen:[], health:[], cadeaus:[], sport:[], huis:[] });
  const [showAddItem,setShowAddItem] = useState(false);
  const [newItem,setNewItem]       = useState({ naam:"", hoeveelheid:1, eenheid:"stuks", categorie:"" });
  const [searchQ,setSearchQ]       = useState("");
  const [filterCat,setFilterCat]   = useState("all");
  const [swipedId,setSwipedId]     = useState(null);

  const [tasks,setTasks]           = useState([]);
  const [showAddTask,setShowAddTask] = useState(false);
  const [newTask,setNewTask]       = useState({ titel:"", categorie:"thuis", toegewezen_aan:currentUser.naam, prioriteit:"normaal", deadline:"", notities:"" });
  const [taskFilter,setTaskFilter] = useState("alle");
  const [taskView,setTaskView]     = useState("taken");
  const [editTask,setEditTask]     = useState(null);
  const [editEvent,setEditEvent]   = useState(null);
  const [editShopItem,setEditShopItem] = useState(null);
  const [editMeal,setEditMeal]     = useState(null);

  const [meals,setMeals]           = useState([]);
  const [showAddMeal,setShowAddMeal] = useState(false);
  const [newMeal,setNewMeal]       = useState({ titel:"", categorie:"overig", recept:"", image:null });
  const [selectedMeal,setSelectedMeal] = useState(null);
  const [mealFilter,setMealFilter] = useState("alle");
  const mealFileRef = useRef(null);

  // ── Load + realtime ──
  useEffect(()=>{
    if(!supabase){ 
      console.warn("Supabase niet gekoppeld — check VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY in Vercel");
      return; 
    }
    loadAll();
    const subs = [
      supabase.channel("ch_msg").on("postgres_changes",{event:"*",schema:"public",table:"berichten",filter:`gezin_code=eq.${gc}`},()=>loadMessages()).subscribe(),
      supabase.channel("ch_tak").on("postgres_changes",{event:"*",schema:"public",table:"taken",filter:`gezin_code=eq.${gc}`},()=>loadTasks()).subscribe(),
      supabase.channel("ch_ite").on("postgres_changes",{event:"*",schema:"public",table:"items",filter:`gezin_code=eq.${gc}`},()=>loadItems()).subscribe(),
      supabase.channel("ch_afs").on("postgres_changes",{event:"*",schema:"public",table:"afspraken",filter:`gezin_code=eq.${gc}`},()=>loadEvents()).subscribe(),
      supabase.channel("ch_din").on("postgres_changes",{event:"*",schema:"public",table:"diners",filter:`gezin_code=eq.${gc}`},()=>loadMeals()).subscribe(),
      supabase.channel("ch_pro").on("postgres_changes",{event:"*",schema:"public",table:"profielen",filter:`gezin_code=eq.${gc}`},()=>loadFamily()).subscribe(),
    ];
    return ()=>subs.forEach(s=>supabase.removeChannel(s));
  },[gc]);

  const loadAll     = ()=>Promise.all([loadMessages(),loadTasks(),loadItems(),loadEvents(),loadMeals(),loadFamily()]).catch(e=>{ console.error("Laden mislukt:", e); setAppError(e.message); });
  const loadMessages= async()=>{ const{data}=await supabase.from("berichten").select("*").eq("gezin_code",gc).order("verzonden_op",{ascending:true}).limit(200); setMessages(data||[]); };
  const loadTasks   = async()=>{ const{data}=await supabase.from("taken").select("*").eq("gezin_code",gc).order("aangemaakt_op",{ascending:false}); setTasks(data||[]); };
  const loadItems   = async()=>{ const{data}=await supabase.from("items").select("*").eq("gezin_code",gc); if(!data)return; const g={boodschappen:[],health:[],cadeaus:[],sport:[],huis:[]}; data.forEach(i=>{if(g[i.lijst])g[i.lijst].push(i);}); setAllItems(g); };
  const loadEvents  = async()=>{ const{data}=await supabase.from("afspraken").select("*").eq("gezin_code",gc).order("datum",{ascending:true}); setEvents(data||[]); };
  const loadMeals   = async()=>{ const{data}=await supabase.from("diners").select("*").eq("gezin_code",gc).order("aangemaakt_op",{ascending:false}); setMeals(data||[]); };
  const loadFamily  = async()=>{ const{data}=await supabase.from("profielen").select("*").eq("gezin_code",gc); if(data&&data.length>0)setFamilyMembers(data); };

  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);
  useEffect(()=>{ setFilterCat("all"); setSearchQ(""); },[activeList]);

  // Tab title met ongelezen berichten
  useEffect(()=>{
    const unread = messages.filter(msg => {
      if(msg.van === currentUser.naam) return false;
      const msgTime = msg.verzonden_op ? new Date(msg.verzonden_op).getTime() : 0;
      return msgTime > lastReadAt;
    }).length;
    document.title = unread > 0 ? `(${unread}) 🤠 Banditos Family` : '🤠 Banditos Family';
  }, [messages, lastReadAt, currentUser.naam]);

  // Push: als al toestemming gegeven, update state
  useEffect(()=>{
    if(typeof Notification !== "undefined" && Notification.permission === "granted"){
      setPushGranted(true);
    }
  }, []);

  const requestPush = async () => {
    try {
      // 1. Check browser support
      if(!("Notification" in window)){ alert("Deze browser ondersteunt geen meldingen"); return; }
      if(!("serviceWorker" in navigator)){ alert("Service Worker niet ondersteund"); return; }

      // 2. Ask permission
      const permission = await Notification.requestPermission();
      if(permission !== "granted"){ alert("Toestemming geweigerd — je kunt dit later aanpassen in je telefooninstellingen"); setPushGranted(true); return; }

      // 3. Get service worker
      const reg = await navigator.serviceWorker.ready;

      // 4. Subscribe to push
      const VAPID_PUBLIC_KEY = "BMSHAJ0wmDJp2bdR6wJc6q2v5WejYQA7vi3uQ8FMmk1TP4W5vY75okLCsR--FJ9dwWrgLSc_GTPN7WM1zfEKdYg";
      const keyBytes = Uint8Array.from(atob(VAPID_PUBLIC_KEY.replace(/-/g,"+").replace(/_/g,"/")), c=>c.charCodeAt(0));
      const subscription = await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:keyBytes });

      // 5. Save to Supabase
      if(supabase) {
        const { data } = await supabase.auth.getUser();
        await supabase.from("push_subscriptions").upsert({
          user_id: data?.user?.id,
          gezin_code: currentUser.gezin_code,
          subscription: subscription.toJSON()
        });
      }

      setPushGranted(true);
      setShowPushPopup(false);
    } catch(err) {
      console.error("Push fout:", err);
      alert("Meldingen inschakelen mislukt: " + err.message);
      setShowPushPopup(false);
    }
  };

  const getMember = useCallback(naam=>{ return familyMembers.find(m=>m.naam===naam)||{ naam, kleur:MEMBER_COLORS[0], emoji:"👤", avatar_url:null }; },[familyMembers]);

  // ── Chat ──
  const sendMessage = async()=>{
    if(!chatInput.trim()) return;
    const msg={ van:currentUser.naam, tekst:chatInput.trim(), reacties:{}, gezin_code:gc, verzonden_op:new Date().toISOString() };
    setChatInput("");
    if(supabase) await supabase.from("berichten").insert(msg);
    // Send push notification to other family members
    if(supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      sendPushNotification(currentUser.naam, chatInput.trim(), gc, user?.id);
    }
    else setMessages(p=>[...p,{...msg,id:Date.now()}]);
  };
  const addReaction = async(msgId,emoji)=>{
    const msg=messages.find(m=>m.id===msgId); if(!msg) return;
    const r={...(msg.reacties||{})};
    if(!r[emoji]) r[emoji]=[];
    r[emoji]=r[emoji].includes(currentUser.naam)?r[emoji].filter(x=>x!==currentUser.naam):[...r[emoji],currentUser.naam];
    if(r[emoji].length===0) delete r[emoji];
    setMessages(p=>p.map(m=>m.id===msgId?{...m,reacties:r}:m));
    if(supabase) await supabase.from("berichten").update({reacties:r}).eq("id",msgId);
    setReactionTarget(null);
  };

  // ── Tasks ──
  const addTask = async()=>{
    if(!newTask.titel.trim()) return;
    const t={ ...newTask, toegevoegd_door:currentUser.naam, gedaan:false, gezin_code:gc, aangemaakt_op:new Date().toISOString(), deadline:newTask.deadline||null };
    if(supabase) await supabase.from("taken").insert(t);
    else setTasks(p=>[{...t,id:Date.now()},...p]);
    setNewTask({ titel:"", categorie:"thuis", toegewezen_aan:currentUser.naam, prioriteit:"normaal", deadline:"", notities:"" });
    setShowAddTask(false);
  };
  const toggleTask = async id=>{
    const t=tasks.find(x=>x.id===id); if(!t) return;
    const nowDone=!t.gedaan;
    const gedaan_op=nowDone?new Date().toISOString():null;
    const gedaan_door=nowDone?currentUser.naam:null;
    const upd={ gedaan:nowDone, gedaan_door, gedaan_op };
    // Optimistic update with full data so calcPts works immediately
    setTasks(p=>p.map(x=>x.id===id?{...x,...upd}:x));
    if(supabase) await supabase.from("taken").update(upd).eq("id",id);
  };
  const deleteTask = async id=>{ setTasks(p=>p.filter(x=>x.id!==id)); if(supabase) await supabase.from("taken").delete().eq("id",id); };
  const updateTask = async(id,upd)=>{ setTasks(p=>p.map(x=>x.id===id?{...x,...upd}:x)); if(supabase) await supabase.from("taken").update(upd).eq("id",id); setEditTask(null); };

  const curMonthKey=getMonthKey(Date.now());
  const calcPts=naam=>tasks.filter(t=>{
    if(!t.gedaan||t.gedaan_door!==naam) return false;
    if(t.toegevoegd_door===naam) return false; // geen punten voor eigen taken
    // Moet gedaan zijn in de huidige maand
    const ts = t.gedaan_op;
    if(!ts) return false; // geen timestamp = niet tellen
    try { return getMonthKey(new Date(ts).getTime())===curMonthKey; }
    catch(e){ return false; }
  }).reduce((s,t)=>s+(POINTS_MAP[t.prioriteit]||10),0);
  const scoreboardData=familyMembers.map(m=>({...m,points:calcPts(m.naam),doneTasks:tasks.filter(t=>t.gedaan&&t.gedaan_door===m.naam&&t.toegevoegd_door!==m.naam).length})).sort((a,b)=>b.points-a.points);
  const filteredTasks=tasks.filter(t=>{ if(taskFilter==="mijn")return t.toegewezen_aan===currentUser.naam; if(taskFilter==="open")return!t.gedaan; if(taskFilter==="klaar")return t.gedaan; return true; });

  // ── Events ──
  const addEvent = async()=>{
    if(!newEvent.titel.trim()) return;
    // ensure empty strings become null
    const e={ ...newEvent, lid:currentUser.naam, gezin_code:gc };
    if(supabase) await supabase.from("afspraken").insert(e);
    else setEvents(p=>[...p,{...e,id:Date.now()}]);
    setNewEvent({ titel:"", datum:fmtDate(calDate), begintijd:"09:00", eindtijd:"10:00", categorie:"familie", locatie:"", notities:"" });
    setShowAddEvent(false);
  };
  const deleteEvent = async id=>{ setEvents(p=>p.filter(e=>e.id!==id)); if(supabase) await supabase.from("afspraken").delete().eq("id",id); setSelectedEvent(null); };
  const updateEvent = async(id,upd)=>{ setEvents(p=>p.map(x=>x.id===id?{...x,...upd}:x)); if(supabase) await supabase.from("afspraken").update(upd).eq("id",id); setEditEvent(null); setSelectedEvent(null); };

  // ── Shopping ──
  const cats=SHOP_CATS[activeList]||[];
  const listInfo=SHOPPING_LISTS.find(l=>l.id===activeList);
  const shopItems=allItems[activeList]||[];
  const filteredShop=shopItems.filter(i=>(filterCat==="all"||i.categorie===filterCat)&&i.naam.toLowerCase().includes(searchQ.toLowerCase()));
  const unchecked=filteredShop.filter(i=>!i.afgevinkt);
  const checked=filteredShop.filter(i=>i.afgevinkt);
  const progress=shopItems.length>0?(shopItems.filter(i=>i.afgevinkt).length/shopItems.length)*100:0;
  const getCat=id=>cats.find(c=>c.id===id)||{color:"#8E8E93"};
  const listBadge=lid=>{ const c=(allItems[lid]||[]).filter(i=>!i.afgevinkt).length; return c>0?c:null; };

  const toggleCheck=async id=>{
    const item=shopItems.find(i=>i.id===id); if(!item) return;
    const afgevinkt=!item.afgevinkt;
    setAllItems(p=>({...p,[activeList]:p[activeList].map(i=>i.id===id?{...i,afgevinkt}:i)}));
    if(supabase) await supabase.from("items").update({afgevinkt}).eq("id",id);
  };
  const deleteShopItem=async id=>{ setAllItems(p=>({...p,[activeList]:p[activeList].filter(i=>i.id!==id)})); if(supabase) await supabase.from("items").delete().eq("id",id); setSwipedId(null); };
  const updateShopItem=async(id,upd)=>{ setAllItems(p=>({...p,[activeList]:p[activeList].map(i=>i.id===id?{...i,...upd}:i)})); if(supabase) await supabase.from("items").update(upd).eq("id",id); setEditShopItem(null); };
  const clearChecked=async()=>{ const ids=checked.map(i=>i.id); setAllItems(p=>({...p,[activeList]:p[activeList].filter(i=>!ids.includes(i.id))})); if(supabase) await supabase.from("items").delete().in("id",ids); };
  const addShopItem=async()=>{
    if(!newItem.naam.trim()) return;
    const cat=newItem.categorie||cats[0]?.id||"overig";
    const item={ naam:newItem.naam, hoeveelheid:newItem.hoeveelheid, eenheid:newItem.eenheid, categorie:cat, lijst:activeList, toegevoegd_door:currentUser.naam, afgevinkt:false, gezin_code:gc };
    if(supabase){ const{data}=await supabase.from("items").insert(item).select().single(); if(data)setAllItems(p=>({...p,[activeList]:[data,...p[activeList]]})); }
    else setAllItems(p=>({...p,[activeList]:[{...item,id:Date.now()},...p[activeList]]}));
    setNewItem({ naam:"", hoeveelheid:1, eenheid:"stuks", categorie:"" });
    setShowAddItem(false);
  };

  // ── Meals ──
  const addMeal=async()=>{
    if(!newMeal.titel.trim()) return;
    const m={ titel:newMeal.titel, categorie:newMeal.categorie, recept:newMeal.recept, foto_url:newMeal.image||null, toegevoegd_door:currentUser.naam, stemmen:{}, gezin_code:gc };
    if(supabase){ const{data}=await supabase.from("diners").insert(m).select().single(); if(data)setMeals(p=>[data,...p]); }
    else setMeals(p=>[{...m,id:Date.now()},...p]);
    setNewMeal({ titel:"", categorie:"overig", recept:"", image:null });
    setShowAddMeal(false);
  };
  const voteMeal=async(id,emoji)=>{
    const meal=meals.find(m=>m.id===id); if(!meal) return;
    const v={...(meal.stemmen||{})};
    if(v[currentUser.naam]===emoji) delete v[currentUser.naam]; else v[currentUser.naam]=emoji;
    setMeals(p=>p.map(m=>m.id===id?{...m,stemmen:v}:m));
    if(selectedMeal?.id===id) setSelectedMeal(p=>({...p,stemmen:v}));
    if(supabase) await supabase.from("diners").update({stemmen:v}).eq("id",id);
  };
  const updateMeal=async(id,upd)=>{ setMeals(p=>p.map(x=>x.id===id?{...x,...upd}:x)); if(supabase) await supabase.from("diners").update(upd).eq("id",id); setEditMeal(null); setSelectedMeal(null); };
  const handleMealImg=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>setNewMeal(p=>({...p,image:ev.target.result})); r.readAsDataURL(f); };
  const filteredMeals=mealFilter==="alle"?meals:meals.filter(m=>m.categorie===mealFilter);

  // ── Calendar helpers ──
  const filtCal=events.filter(e=>filterMember==="alle"||e.lid===filterMember);
  const getEvtsForDate=date=>filtCal.filter(e=>e.datum===fmtDate(date));
  const getCatInfo=id=>CAL_CATS.find(c=>c.id===id)||CAL_CATS[7];
  const HOURS=Array.from({length:16},(_,i)=>i+7);
  const navCal=dir=>{ const d=new Date(calDate); if(calView==="dag")d.setDate(d.getDate()+dir); else if(calView==="week")d.setDate(d.getDate()+dir*7); else d.setMonth(d.getMonth()+dir); setCalDate(d); };
  const getWeekDays=d=>{ const s=new Date(d); const day=s.getDay(); s.setDate(s.getDate()-(day===0?6:day-1)); return Array.from({length:7},(_,i)=>addDays(s,i)); };
  const weekDays=getWeekDays(calDate);
  const isToday=d=>fmtDate(d)===fmtDate(today);
  const calTitle=()=>{ if(calView==="dag")return`${NL_DAYS_LONG[calDate.getDay()]} ${calDate.getDate()} ${NL_MONTHS[calDate.getMonth()]}`; if(calView==="week"){const s=weekDays[0],e=weekDays[6];return s.getMonth()===e.getMonth()?`${s.getDate()} – ${e.getDate()} ${NL_MONTHS[s.getMonth()]} ${s.getFullYear()}`:`${s.getDate()} ${NL_MONTHS[s.getMonth()]} – ${e.getDate()} ${NL_MONTHS[e.getMonth()]}`;} return`${NL_MONTHS[calDate.getMonth()]} ${calDate.getFullYear()}`; };
  const getMonthDays=d=>{ const first=new Date(d.getFullYear(),d.getMonth(),1); const last=new Date(d.getFullYear(),d.getMonth()+1,0); const offset=(first.getDay()+6)%7; const days=[]; for(let i=0;i<offset;i++)days.push(addDays(first,-offset+i)); for(let i=1;i<=last.getDate();i++)days.push(new Date(d.getFullYear(),d.getMonth(),i)); while(days.length%7!==0)days.push(addDays(days[days.length-1],1)); return days; };

  // ── Tabs ──
  const taskBadge=tasks.filter(t=>!t.gedaan&&t.toegewezen_aan===currentUser.naam).length;
  const shopBadge=Object.values(allItems).flat().filter(i=>!i.afgevinkt).length;
  const openChat = () => {
    const now = Date.now();
    setLastReadAt(now);
    try { localStorage.setItem("banditos_lastread_"+currentUser.id, String(now)); } catch(e){}
    setMainTab("chat");
  };

  const chatBadge = messages.filter(msg => {
    if(msg.van === currentUser.naam) return false;
    const msgTime = msg.verzonden_op ? new Date(msg.verzonden_op).getTime() : 0;
    return msgTime > lastReadAt;
  }).length;
  const TABS=[{id:"chat",icon:"💬",label:"Chat",badge:chatBadge},{id:"taken",icon:"✅",label:"Taken",badge:taskBadge},{id:"kalender",icon:"📅",label:"Kalender"},{id:"lijsten",icon:"🛒",label:"Lijsten",badge:shopBadge},{id:"diner",icon:"🍽️",label:"Diner"}];
  const accent=()=>{ if(mainTab==="chat")return currentUser.kleur||"#FF6B35"; if(mainTab==="taken")return"#5856D6"; if(mainTab==="kalender")return"#007AFF"; if(mainTab==="lijsten")return listInfo?.color||"#34C759"; return"#E53935"; };

  const AV = ({naam,size=30,fsize=14})=>{ const m=getMember(naam); return(<div style={{ width:size,height:size,borderRadius:size/2,background:m.kleur||"#8E8E93",display:"flex",alignItems:"center",justifyContent:"center",fontSize:fsize,overflow:"hidden",flexShrink:0 }}>{m.avatar_url?<img src={m.avatar_url} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:(m.emoji||naam?.[0]||"?")}</div>); };

  if(appError) return (
    <div style={{ minHeight:"100vh", background:"#1a0a00", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, padding:24 }}>
      <div style={{ fontSize:48 }}>⚠️</div>
      <div style={{ color:"#fff", fontSize:18, fontWeight:700, textAlign:"center" }}>Er ging iets mis</div>
      <div style={{ color:"rgba(255,255,255,0.5)", fontSize:13, textAlign:"center", maxWidth:300 }}>{appError}</div>
      <div style={{ color:"rgba(255,165,0,0.8)", fontSize:12, textAlign:"center", maxWidth:320, lineHeight:1.6 }}>
        Controleer of VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY correct zijn ingesteld in Vercel → Settings → Environment Variables
      </div>
      <button onClick={()=>{ setAppError(null); if(supabase) loadAll(); }} style={{ background:"#FF6B35", border:"none", borderRadius:12, padding:"12px 24px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", marginTop:8 }}>Opnieuw proberen</button>
      <button onClick={onLogout} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"10px 24px", color:"rgba(255,255,255,0.6)", fontSize:13, cursor:"pointer" }}>Uitloggen</button>
    </div>
  );

  return (<div style={{ display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh",
      background:"linear-gradient(160deg,#1a0a00,#3d1a00,#1a0000)",
      fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <div style={{ width:393,height:852,background:"#000",borderRadius:55,
        boxShadow:"0 80px 120px rgba(0,0,0,0.9),inset 0 0 0 1.5px #3a3a3a,0 0 0 8px #111",
        overflow:"hidden",position:"relative",display:"flex",flexDirection:"column" }}>

        {/* Status bar */}
        <div style={{ height:54,background:"#000",display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:"0 28px 8px",color:"#fff",fontSize:12,fontWeight:600,flexShrink:0 }}>
          <span>9:41</span>
          <div style={{ width:120,height:34,background:"#000",borderRadius:20,position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",boxShadow:"inset 0 0 0 1px #333" }} />
          <div style={{ display:"flex",gap:5,alignItems:"center",fontSize:11 }}><span>●●●</span><span>WiFi</span><span>🔋</span></div>
        </div>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${accent()},${accent()}99)`,padding:"10px 18px 12px",color:"#fff",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11,opacity:0.8,letterSpacing:1,textTransform:"uppercase" }}>🤠 {APP_NAME}</div>
            <div style={{ fontSize:20,fontWeight:800 }}>{TABS.find(t=>t.id===mainTab)?.icon} {TABS.find(t=>t.id===mainTab)?.label}</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11,opacity:0.8 }}>Ingelogd als</div>
              <div style={{ fontSize:13,fontWeight:700 }}>{currentUser.naam}</div>
            </div>
            <div onClick={()=>window.confirm("Uitloggen?")&&onLogout()} style={{ cursor:"pointer" }}>
              <AV naam={currentUser.naam} size={40} fsize={20} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1,background:"#F2F2F7",overflow:"hidden",display:"flex",flexDirection:"column" }}>

          {/* ══ CHAT ══ */}
          {mainTab==="chat"&&(
            <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ flex:1,overflowY:"auto",padding:"12px 14px" }}>
                {messages.length===0&&<div style={{ textAlign:"center",padding:"60px 0",color:"#8E8E93" }}><div style={{ fontSize:48,marginBottom:12 }}>💬</div><div style={{ fontWeight:700,fontSize:17 }}>Nog geen berichten</div><div style={{ fontSize:14,marginTop:6 }}>Stuur het eerste bericht!</div></div>}
                {messages.map((msg,i)=>{
                  const isMe=msg.van===currentUser.naam;
                  const m=getMember(msg.van);
                  const showName=!isMe&&(i===0||messages[i-1].van!==msg.van);
                  const ts=msg.verzonden_op?new Date(msg.verzonden_op).getTime():Date.now();
                  return(
                    <div key={msg.id||i} style={{ display:"flex",justifyContent:isMe?"flex-end":"flex-start",marginBottom:4,alignItems:"flex-end",gap:6 }}>
                      {!isMe&&<div style={{ width:28,visibility:showName?"visible":"hidden",flexShrink:0 }}><AV naam={msg.van} size={28} fsize={13} /></div>}
                      <div style={{ maxWidth:"72%",display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start" }}>
                        {showName&&!isMe&&<div style={{ fontSize:10,color:m.kleur||"#8E8E93",fontWeight:700,marginBottom:2,marginLeft:4 }}>{msg.van}</div>}
                        <div onClick={()=>setReactionTarget(reactionTarget===msg.id?null:msg.id)} style={{ background:isMe?(m.kleur||"#FF6B35"):"#fff",color:isMe?"#fff":"#000",borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"9px 13px",fontSize:15,lineHeight:1.4,boxShadow:"0 1px 4px rgba(0,0,0,0.1)",cursor:"pointer",userSelect:"none" }}>{msg.tekst}</div>
                        {Object.keys(msg.reacties||{}).length>0&&(
                          <div style={{ display:"flex",gap:3,marginTop:3,flexWrap:"wrap" }}>
                            {Object.entries(msg.reacties).map(([e2,users])=>(
                              <div key={e2} onClick={()=>addReaction(msg.id,e2)} style={{ background:"#fff",borderRadius:12,padding:"2px 7px",fontSize:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",cursor:"pointer",display:"flex",alignItems:"center",gap:3,border:users.includes(currentUser.naam)?`2px solid ${m.kleur||"#FF6B35"}`:"2px solid transparent" }}>{e2}<span style={{ fontSize:10,color:"#8E8E93" }}>{users.length}</span></div>
                            ))}
                          </div>
                        )}
                        {reactionTarget===msg.id&&<div style={{ display:"flex",gap:4,background:"#fff",borderRadius:20,padding:"6px 10px",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",marginTop:4,zIndex:5 }}>{["❤️","😂","👍","😮","😢","🔥"].map(e2=><div key={e2} onClick={()=>addReaction(msg.id,e2)} style={{ fontSize:20,cursor:"pointer" }}>{e2}</div>)}</div>}
                        <div style={{ fontSize:10,color:"#8E8E93",marginTop:2 }}>{timeAgo(ts)}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div style={{ background:"#fff",borderTop:"1px solid #E5E5EA",padding:"10px 14px 16px",display:"flex",gap:10,alignItems:"flex-end",flexShrink:0 }}>
                <div style={{ flex:1,background:"#F2F2F7",borderRadius:22,padding:"10px 16px",display:"flex",alignItems:"center" }}>
                  <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()} placeholder="Stuur een bericht..." style={{ background:"none",border:"none",outline:"none",flex:1,fontSize:15 }} />
                </div>
                <div onClick={sendMessage} style={{ width:40,height:40,borderRadius:20,background:chatInput.trim()?(currentUser.kleur||"#FF6B35"):"#E5E5EA",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,cursor:"pointer",flexShrink:0,transition:"background 0.2s" }}>↑</div>
              </div>
            </div>
          )}

          {/* ══ TAKEN ══ */}
          {mainTab==="taken"&&(
            <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ padding:"10px 14px 8px",flexShrink:0 }}>
                <div style={{ display:"flex",background:"#E5E5EA",borderRadius:12,padding:3 }}>
                  {[["taken","✅ Taken"],["scores","🏆 Scorebord"]].map(([v,l])=><div key={v} onClick={()=>setTaskView(v)} style={{ flex:1,textAlign:"center",padding:"8px 0",borderRadius:9,fontSize:13,fontWeight:800,background:taskView===v?"#fff":"transparent",color:taskView===v?"#5856D6":"#8E8E93",cursor:"pointer",transition:"all 0.2s",boxShadow:taskView===v?"0 1px 4px rgba(0,0,0,0.12)":"none" }}>{l}</div>)}
                </div>
              </div>
              {taskView==="scores"&&(
                <div style={{ flex:1,overflowY:"auto",padding:"0 14px 16px" }}>
                  <div style={{ textAlign:"center",padding:"12px 0 8px" }}>
                    <div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:1,textTransform:"uppercase" }}>{NL_MONTHS[today.getMonth()]} {today.getFullYear()}</div>
                    <div style={{ fontSize:13,color:"#8E8E93",marginTop:2 }}>Punten voor taken gedaan voor een ander</div>
                  </div>
                  {scoreboardData.length===0?<div style={{ textAlign:"center",padding:"40px 0",color:"#8E8E93" }}><div style={{ fontSize:48 }}>🏆</div><div style={{ marginTop:8 }}>Nog geen scores</div></div>:(
                    <>
                      <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8,margin:"8px 0 20px",height:130 }}>
                        {scoreboardData.slice(0,3).map((m,i)=>{ const heights=[110,90,75]; const prize=PRIZES[i]; const isFirst=i===0; return(
                          <div key={m.naam} style={{ display:"flex",flexDirection:"column",alignItems:"center",flex:1 }}>
                            {isFirst&&<div style={{ fontSize:20,marginBottom:2 }}>👑</div>}
                            <AV naam={m.naam} size={isFirst?52:42} fsize={isFirst?24:20} />
                            <div style={{ fontSize:isFirst?13:11,fontWeight:800,color:"#000",marginTop:4 }}>{m.naam}</div>
                            <div style={{ fontSize:isFirst?18:14,fontWeight:900,color:m.kleur||"#8E8E93" }}>{m.points}<span style={{ fontSize:10,color:"#8E8E93" }}>pt</span></div>
                            <div style={{ width:"100%",height:heights[i],background:`linear-gradient(180deg,${m.kleur||"#8E8E93"},${m.kleur||"#8E8E93"}88)`,borderRadius:"8px 8px 0 0",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:6,marginTop:4 }}>
                              <div style={{ fontSize:11,fontWeight:800,color:"#fff",opacity:0.9 }}>{prize?.value}</div>
                            </div>
                          </div>
                        ); })}
                      </div>
                      <div style={{ background:"#fff",borderRadius:16,overflow:"hidden",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                        {scoreboardData.map((m,i)=>{ const maxPts=scoreboardData[0]?.points||1; const pct=maxPts>0?(m.points/maxPts)*100:0; return(
                          <div key={m.naam} style={{ padding:"12px 14px",borderTop:i>0?"1px solid #F2F2F7":"none" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:7 }}>
                              <div style={{ fontSize:16,width:22,textAlign:"center",fontWeight:800,color:"#8E8E93" }}>#{i+1}</div>
                              <AV naam={m.naam} size={34} fsize={16} />
                              <div style={{ flex:1 }}><div style={{ fontSize:15,fontWeight:800,color:"#000" }}>{m.naam}</div><div style={{ fontSize:11,color:"#8E8E93" }}>{m.doneTasks} taken gedaan</div></div>
                              <div style={{ textAlign:"right" }}><div style={{ fontSize:20,fontWeight:900,color:m.kleur||"#8E8E93" }}>{m.points}</div><div style={{ fontSize:10,color:"#8E8E93" }}>punten</div></div>
                            </div>
                            <div style={{ height:6,background:"#F2F2F7",borderRadius:3,overflow:"hidden",marginLeft:32 }}><div style={{ height:"100%",width:`${pct}%`,background:m.kleur||"#8E8E93",borderRadius:3,transition:"width 0.6s" }} /></div>
                          </div>
                        ); })}
                      </div>
                    </>
                  )}
                </div>
              )}
              {taskView==="taken"&&(
                <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
                  <div style={{ padding:"0 14px 8px",flexShrink:0 }}>
                    <div style={{ background:"linear-gradient(135deg,#5856D6,#007AFF)",borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <AV naam={currentUser.naam} size={32} fsize={16} />
                        <div><div style={{ fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:600 }}>Jouw punten deze maand</div><div style={{ fontSize:20,fontWeight:900,color:"#fff" }}>{calcPts(currentUser.naam)}<span style={{ fontSize:12,fontWeight:600,opacity:0.8 }}> pt</span></div></div>
                      </div>
                      <div style={{ textAlign:"right" }}><div style={{ fontSize:11,color:"rgba(255,255,255,0.7)" }}>Positie</div><div style={{ fontSize:22,fontWeight:900,color:"#FFD700" }}>#{(scoreboardData.findIndex(s=>s.naam===currentUser.naam)+1)||"-"}</div></div>
                    </div>
                  </div>
                  <div style={{ padding:"0 14px 6px",display:"flex",gap:7,overflowX:"auto",flexShrink:0 }}>
                    {["alle","mijn","open","klaar"].map(f=><Chip key={f} label={f.charAt(0).toUpperCase()+f.slice(1)} active={taskFilter===f} color="#5856D6" onClick={()=>setTaskFilter(f)} />)}
                  </div>
                  <div style={{ flex:1,overflowY:"auto",padding:"4px 14px" }}>
                    {filteredTasks.length===0?<div style={{ textAlign:"center",padding:"48px 0",color:"#8E8E93" }}><div style={{ fontSize:44,marginBottom:10 }}>✅</div><div style={{ fontWeight:600,fontSize:17 }}>Geen taken</div><div style={{ fontSize:14,marginTop:4 }}>Tik op + om een taak toe te voegen</div></div>:(
                      <>
                        {filteredTasks.filter(t=>!t.gedaan).length>0&&<div style={{ marginBottom:8 }}><div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:0.5,marginBottom:6,paddingLeft:4 }}>OPEN ({filteredTasks.filter(t=>!t.gedaan).length})</div><div style={{ background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{filteredTasks.filter(t=>!t.gedaan).map((t,i,arr)=><TaskItem key={t.id} task={t} isLast={i===arr.length-1} onToggle={()=>toggleTask(t.id)} onDelete={()=>deleteTask(t.id)} onEdit={()=>setEditTask({...t})} getMember={getMember} />)}</div></div>}
                        {filteredTasks.filter(t=>t.gedaan).length>0&&<div style={{ marginBottom:12 }}><div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:0.5,marginBottom:6,paddingLeft:4 }}>GEDAAN ({filteredTasks.filter(t=>t.gedaan).length})</div><div style={{ background:"#fff",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",opacity:0.7 }}>{filteredTasks.filter(t=>t.gedaan).map((t,i,arr)=><TaskItem key={t.id} task={t} isLast={i===arr.length-1} onToggle={()=>toggleTask(t.id)} onDelete={()=>deleteTask(t.id)} onEdit={()=>setEditTask({...t})} getMember={getMember} />)}</div></div>}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ KALENDER ══ */}
          {mainTab==="kalender"&&(
            <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ background:"#1C1C2E",padding:"12px 16px 10px",color:"#fff",flexShrink:0 }}>
                <div style={{ display:"flex",background:"rgba(255,255,255,0.1)",borderRadius:10,padding:3,marginBottom:10 }}>
                  {["dag","week","maand"].map(v=><div key={v} onClick={()=>setCalView(v)} style={{ flex:1,textAlign:"center",padding:"6px 0",borderRadius:8,fontSize:12,fontWeight:700,background:calView===v?"#fff":"transparent",color:calView===v?"#1C1C2E":"rgba(255,255,255,0.6)",cursor:"pointer" }}>{v.charAt(0).toUpperCase()+v.slice(1)}</div>)}
                </div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
                  <div onClick={()=>navCal(-1)} style={{ width:30,height:30,borderRadius:15,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15 }}>‹</div>
                  <div style={{ fontSize:13,fontWeight:700 }}>{calTitle()}</div>
                  <div onClick={()=>navCal(1)} style={{ width:30,height:30,borderRadius:15,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:15 }}>›</div>
                </div>
                <div style={{ display:"flex",gap:5,overflowX:"auto" }}>
                  <Chip label="Iedereen" active={filterMember==="alle"} color="#007AFF" onClick={()=>setFilterMember("alle")} small />
                  {familyMembers.map(m=><Chip key={m.naam} label={m.naam} active={filterMember===m.naam} color={m.kleur||"#8E8E93"} onClick={()=>setFilterMember(m.naam)} small />)}
                </div>
              </div>
              {calView==="dag"&&<div style={{ flex:1,overflowY:"auto" }}>
  {/* All-day events at top */}
  {getEvtsForDate(calDate).filter(ev=>ev.begintijd==="allday").map(ev=>(
    <div key={ev.id} onClick={()=>setSelectedEvent(ev)} style={{ margin:"4px 8px",background:getCatInfo(ev.categorie).color,borderRadius:8,padding:"6px 10px",cursor:"pointer" }}>
      <div style={{ fontSize:13,fontWeight:800,color:"#fff" }}>📅 {ev.titel} — hele dag</div>
    </div>
  ))}
  {/* Timed grid */}
  <div style={{ position:"relative" }}>
    {HOURS.map(hour=>(
      <div key={hour} style={{ display:"flex",height:60,borderBottom:"1px solid #E5E5EA" }}>
        <div style={{ width:48,padding:"5px 8px 0",fontSize:10,color:"#8E8E93",fontWeight:600,textAlign:"right",flexShrink:0 }}>{String(hour).padStart(2,"0")}:00</div>
        <div style={{ flex:1 }} />
      </div>
    ))}
    <div style={{ position:"absolute",top:0,left:48,right:0 }}>
      {getEvtsForDate(calDate).filter(ev=>ev.begintijd!=="allday").map(ev=>{
        const [sh,sm]=(ev.begintijd||"09:00").split(":").map(Number);
        const [eh,em]=(ev.eindtijd||"10:00").split(":").map(Number);
        const startMins=(sh-7)*60+sm;
        const durMins=Math.max((eh-7)*60+em-startMins,30);
        const top=(startMins/60)*60;
        const height=(durMins/60)*60;
        const cat=getCatInfo(ev.categorie);
        return <div key={ev.id} onClick={()=>setSelectedEvent(ev)} style={{ position:"absolute",left:4,right:4,top,height:Math.max(height,28),background:cat.color,borderRadius:6,padding:"3px 6px",cursor:"pointer",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}>
          <div style={{ fontSize:11,fontWeight:800,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{ev.titel}</div>
          <div style={{ fontSize:9,color:"rgba(255,255,255,0.85)" }}>{ev.begintijd}–{ev.eindtijd}</div>
        </div>;
      })}
    </div>
  </div>
</div>}
              {calView==="week"&&<div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
  {/* Day headers */}
  <div style={{ display:"flex",background:"#fff",borderBottom:"1px solid #E5E5EA",flexShrink:0 }}>
    <div style={{ width:38 }} />
    {weekDays.map((d,i)=><div key={i} onClick={()=>{setCalDate(d);setCalView("dag");}} style={{ flex:1,textAlign:"center",padding:"6px 2px",cursor:"pointer" }}>
      <div style={{ fontSize:9,color:"#8E8E93",fontWeight:700,textTransform:"uppercase" }}>{NL_DAYS_SHORT[d.getDay()]}</div>
      <div style={{ width:24,height:24,borderRadius:12,margin:"2px auto",background:isToday(d)?"#007AFF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:isToday(d)?"#fff":"#000" }}>{d.getDate()}</div>
    </div>)}
  </div>
  {/* All-day events row */}
  {weekDays.some(d=>getEvtsForDate(d).some(e=>e.begintijd==="allday"))&&(
    <div style={{ display:"flex",borderBottom:"1px solid #E5E5EA",background:"#F9F9F9",flexShrink:0 }}>
      <div style={{ width:38,padding:"4px 2px",fontSize:8,color:"#8E8E93",textAlign:"right",flexShrink:0 }}>dag</div>
      {weekDays.map((d,di)=>{
        const allday=getEvtsForDate(d).filter(e=>e.begintijd==="allday");
        return <div key={di} style={{ flex:1,borderLeft:"1px solid #F0F0F0",padding:"2px 1px" }}>
          {allday.map(ev=><div key={ev.id} onClick={()=>setSelectedEvent(ev)} style={{ background:getCatInfo(ev.categorie).color,color:"#fff",borderRadius:3,padding:"1px 3px",fontSize:7,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer",marginBottom:1 }}>{ev.titel}</div>)}
        </div>;
      })}
    </div>
  )}
  {/* Timed grid with positioned events */}
  <div style={{ flex:1,overflowY:"auto" }}>
    <div style={{ display:"flex" }}>
      {/* Hour labels */}
      <div style={{ width:38,flexShrink:0 }}>
        {HOURS.map(hour=><div key={hour} style={{ height:44,borderBottom:"1px solid #F0F0F0",padding:"4px 6px 0",fontSize:9,color:"#8E8E93",fontWeight:600,textAlign:"right",boxSizing:"border-box" }}>{String(hour).padStart(2,"0")}:00</div>)}
      </div>
      {/* Day columns with positioned events */}
      {weekDays.map((d,di)=>(
        <div key={di} style={{ flex:1,borderLeft:"1px solid #F0F0F0",position:"relative" }}>
          {/* Hour grid lines */}
          {HOURS.map(hour=><div key={hour} style={{ height:44,borderBottom:"1px solid #F0F0F0",boxSizing:"border-box" }} />)}
          {/* Positioned events */}
          {getEvtsForDate(d).filter(ev=>ev.begintijd!=="allday").map(ev=>{
            const [sh,sm]=(ev.begintijd||"09:00").split(":").map(Number);
            const [eh,em]=(ev.eindtijd||"10:00").split(":").map(Number);
            const startMins=(sh-7)*60+sm;
            const durMins=Math.max((eh-7)*60+em-startMins,30);
            const PX=44/60;
            return <div key={ev.id} onClick={()=>setSelectedEvent(ev)} style={{ position:"absolute",left:1,right:1,top:startMins*PX,height:Math.max(durMins*PX,18),background:getCatInfo(ev.categorie).color,borderRadius:3,padding:"1px 3px",fontSize:7,fontWeight:700,color:"#fff",overflow:"hidden",cursor:"pointer",zIndex:1 }}>
              <div style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{ev.titel}</div>
            </div>;
          })}
        </div>
      ))}
    </div>
  </div>
</div>}
              {calView==="maand"&&<div style={{ flex:1,overflowY:"auto" }}><div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:"#fff",borderBottom:"1px solid #E5E5EA" }}>{["ma","di","wo","do","vr","za","zo"].map(d=><div key={d} style={{ textAlign:"center",padding:"6px 0",fontSize:10,fontWeight:700,color:"#8E8E93",textTransform:"uppercase" }}>{d}</div>)}</div><div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)" }}>{getMonthDays(calDate).map((d,i)=>{ const evs=getEvtsForDate(d); const isCur=d.getMonth()===calDate.getMonth(); return<div key={i} onClick={()=>{setCalDate(d);setCalView("dag");}} style={{ minHeight:58,padding:"4px 2px 2px",borderRight:"1px solid #E5E5EA",borderBottom:"1px solid #E5E5EA",background:isToday(d)?"#EBF4FF":"#fff",cursor:"pointer",opacity:isCur?1:0.35 }}><div style={{ width:20,height:20,borderRadius:10,margin:"0 auto 2px",background:isToday(d)?"#007AFF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:isToday(d)?700:500,color:isToday(d)?"#fff":"#000" }}>{d.getDate()}</div>{evs.slice(0,2).map(ev=><div key={ev.id} style={{ background:getCatInfo(ev.categorie).color,color:"#fff",borderRadius:2,padding:"0 3px",fontSize:8,fontWeight:600,marginBottom:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{ev.titel}</div>)}{evs.length>2&&<div style={{ fontSize:8,color:"#8E8E93",textAlign:"center" }}>+{evs.length-2}</div>}</div>; })}</div></div>}
              <div style={{ background:"#fff",padding:"6px 14px",borderTop:"1px solid #E5E5EA",flexShrink:0 }}>
                <div onClick={()=>events.forEach(e=>exportToICS(e))} style={{ background:"#E8F0FE",color:"#007AFF",borderRadius:10,padding:"9px",textAlign:"center",fontSize:12,fontWeight:700,cursor:"pointer" }}>📤 Exporteer naar Outlook</div>
              </div>
            </div>
          )}

          {/* ══ LIJSTEN ══ */}
          {mainTab==="lijsten"&&(
            <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ background:`linear-gradient(135deg,${listInfo.color}dd,${listInfo.color}88)`,padding:"14px 16px 18px",color:"#fff",flexShrink:0 }}>
                <div style={{ marginBottom:10 }}><div style={{ display:"flex",justifyContent:"space-between",fontSize:11,opacity:0.9,marginBottom:4 }}><span>{unchecked.length} te halen</span><span>{Math.round(progress)}% klaar</span></div><div style={{ height:4,background:"rgba(255,255,255,0.3)",borderRadius:2,overflow:"hidden" }}><div style={{ height:"100%",width:`${progress}%`,background:"#fff",borderRadius:2,transition:"width 0.5s" }} /></div></div>
                <div style={{ background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 12px",display:"flex",alignItems:"center",gap:8 }}><span style={{ fontSize:12,opacity:0.8 }}>🔍</span><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Zoeken..." style={{ background:"none",border:"none",outline:"none",color:"#fff",fontSize:14,width:"100%" }} /></div>
              </div>
              <div style={{ padding:"8px 12px 4px",display:"flex",gap:6,overflowX:"auto",flexShrink:0 }}>
                <Chip label="Alle" active={filterCat==="all"} color={listInfo.color} onClick={()=>setFilterCat("all")} />
                {cats.map(cat=><Chip key={cat.id} label={cat.label.split(" ")[0]} active={filterCat===cat.id} color={cat.color} onClick={()=>setFilterCat(cat.id)} />)}
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:"6px 12px" }}>
                {unchecked.length>0&&<div style={{ marginBottom:8 }}><div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:0.5,marginBottom:5,paddingLeft:4 }}>TE HALEN ({unchecked.length})</div><div style={{ background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>{unchecked.map((item,i)=><ShopItem key={item.id} item={item} isLast={i===unchecked.length-1} catColor={getCat(item.categorie).color} memberColor={getMember(item.toegevoegd_door).kleur||"#8E8E93"} onToggle={()=>toggleCheck(item.id)} onDelete={()=>deleteShopItem(item.id)} onEdit={()=>setEditShopItem({...item})} swiped={swipedId===item.id} onSwipe={()=>setSwipedId(swipedId===item.id?null:item.id)} />)}</div></div>}
                {checked.length>0&&<div style={{ marginBottom:10 }}><div style={{ display:"flex",justifyContent:"space-between",marginBottom:5,paddingLeft:4 }}><div style={{ fontSize:11,fontWeight:700,color:"#8E8E93",letterSpacing:0.5 }}>IN WINKELWAGEN ({checked.length})</div><div onClick={clearChecked} style={{ fontSize:12,color:"#FF3B30",fontWeight:700,cursor:"pointer" }}>Wis</div></div><div style={{ background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",opacity:0.65 }}>{checked.map((item,i)=><ShopItem key={item.id} item={item} isLast={i===checked.length-1} catColor={getCat(item.categorie).color} memberColor={getMember(item.toegevoegd_door).kleur||"#8E8E93"} onToggle={()=>toggleCheck(item.id)} onDelete={()=>deleteShopItem(item.id)} onEdit={()=>setEditShopItem({...item})} swiped={swipedId===item.id} onSwipe={()=>setSwipedId(swipedId===item.id?null:item.id)} />)}</div></div>}
                {filteredShop.length===0&&<div style={{ textAlign:"center",padding:"40px 0",color:"#8E8E93" }}><div style={{ fontSize:40,marginBottom:8 }}>{listInfo.icon}</div><div style={{ fontWeight:600 }}>Lijst is leeg</div><div style={{ fontSize:13,marginTop:4 }}>Tik op + om iets toe te voegen</div></div>}
              </div>
              <div style={{ background:"#fff",borderTop:"1px solid rgba(0,0,0,0.08)",display:"flex",padding:"6px 0 18px",flexShrink:0 }}>
                {SHOPPING_LISTS.map(list=>{ const badge=listBadge(list.id); return<div key={list.id} onClick={()=>setActiveList(list.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",position:"relative",color:activeList===list.id?list.color:"#8E8E93" }}><span style={{ fontSize:18 }}>{list.icon}</span><span style={{ fontSize:8,fontWeight:700,textAlign:"center",maxWidth:52,lineHeight:1.2 }}>{list.label}</span>{badge&&<div style={{ position:"absolute",top:-2,right:"12%",background:list.color,color:"#fff",width:14,height:14,borderRadius:7,fontSize:8,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff" }}>{badge}</div>}</div>; })}
              </div>
            </div>
          )}

          {/* ══ DINER ══ */}
          {mainTab==="diner"&&(
            <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
              <div style={{ padding:"10px 12px 6px",display:"flex",gap:6,overflowX:"auto",background:"#F2F2F7",flexShrink:0 }}>
                <Chip label="Alle" active={mealFilter==="alle"} color="#E53935" onClick={()=>setMealFilter("alle")} />
                {MEAL_CATS.map(c=><Chip key={c.id} label={c.label.split(" ")[0]} active={mealFilter===c.id} color={c.color} onClick={()=>setMealFilter(c.id)} />)}
              </div>
              <div style={{ flex:1,overflowY:"auto",padding:"8px 12px" }}>
                {filteredMeals.length===0&&<div style={{ textAlign:"center",padding:"48px 0",color:"#8E8E93" }}><div style={{ fontSize:44,marginBottom:10 }}>🍽️</div><div style={{ fontWeight:600,fontSize:17 }}>Geen suggesties</div><div style={{ fontSize:14,marginTop:4 }}>Tik op + om een gerecht voor te stellen</div></div>}
                {filteredMeals.map(meal=>{ const mc=getMember(meal.toegevoegd_door); const myCat=MEAL_CATS.find(c=>c.id===meal.categorie)||MEAL_CATS[7]; const myVote=(meal.stemmen||{})[currentUser.naam]; return(
                  <div key={meal.id} onClick={()=>setSelectedMeal(meal)} style={{ background:"#fff",borderRadius:16,marginBottom:10,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.07)",cursor:"pointer" }}>
                    {meal.foto_url?<img src={meal.foto_url} alt={meal.titel} style={{ width:"100%",height:140,objectFit:"cover" }}/>:<div style={{ width:"100%",height:90,background:`linear-gradient(135deg,${myCat.color}33,${myCat.color}11)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48 }}>{myCat.label.split(" ")[0]}</div>}
                    <div style={{ padding:"10px 14px 12px" }}>
                      <div style={{ fontSize:16,fontWeight:700,color:"#000",marginBottom:2 }}>{meal.titel}</div>
                      <div style={{ fontSize:11,color:"#8E8E93",marginBottom:8 }}><span style={{ background:myCat.color+"22",color:myCat.color,padding:"1px 7px",borderRadius:10,fontWeight:700 }}>{myCat.label}</span>{" · "}<span style={{ color:mc.kleur||"#8E8E93",fontWeight:600 }}>{meal.toegevoegd_door}</span></div>
                      <div style={{ display:"flex",gap:8 }}>{[["❤️","Lekker!"],["👍","Prima"],["😐","Twijfel"]].map(([emoji])=><div key={emoji} onClick={e=>{e.stopPropagation();voteMeal(meal.id,emoji);}} style={{ display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,fontSize:13,background:myVote===emoji?"#F3F4F6":"transparent",border:`2px solid ${myVote===emoji?"#007AFF":"#E5E5EA"}`,cursor:"pointer" }}><span>{emoji}</span><span style={{ fontSize:11,color:"#8E8E93" }}>{Object.values(meal.stemmen||{}).filter(v=>v===emoji).length||""}</span></div>)}</div>
                    </div>
                  </div>
                ); })}
              </div>
            </div>
          )}
        </div>

        {/* Tab bar */}
        <div style={{ background:"#fff",borderTop:"1px solid rgba(0,0,0,0.1)",display:"flex",padding:"6px 4px 20px",flexShrink:0 }}>
          {TABS.map(tab=><div key={tab.id} onClick={()=>tab.id==="chat" ? openChat() : setMainTab(tab.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",position:"relative" }}><span style={{ fontSize:22 }}>{tab.icon}</span><span style={{ fontSize:9,fontWeight:700,color:mainTab===tab.id?accent():"#8E8E93" }}>{tab.label}</span>{tab.badge>0&&<div style={{ position:"absolute",top:-1,right:"8%",background:"#FF3B30",color:"#fff",minWidth:16,height:16,borderRadius:8,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",border:"2px solid #fff" }}>{tab.badge}</div>}{mainTab===tab.id&&<div style={{ width:4,height:4,borderRadius:2,background:accent(),marginTop:1 }} />}</div>)}
        </div>

        {/* FAB */}
        {mainTab!=="chat"&&<div onClick={()=>{ if(mainTab==="lijsten")setShowAddItem(true); if(mainTab==="kalender")setShowAddEvent(true); if(mainTab==="taken")setShowAddTask(true); if(mainTab==="diner")setShowAddMeal(true); }} style={{ position:"absolute",bottom:82,right:18,width:48,height:48,borderRadius:24,background:accent(),display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:24,fontWeight:300,boxShadow:`0 6px 20px ${accent()}66`,cursor:"pointer",zIndex:10 }}>+</div>}

        {/* Sheets */}
        {showAddItem&&<Sheet onClose={()=>setShowAddItem(false)}><SheetTitle icon={listInfo.icon} title={`Toevoegen aan ${listInfo.label}`} sub={currentUser.naam} subColor={listInfo.color} /><FieldBox><input value={newItem.naam} onChange={e=>setNewItem({...newItem,naam:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addShopItem()} placeholder="Naam van artikel..." style={INP} /></FieldBox><div style={{ display:"flex",gap:8,marginBottom:10 }}><FieldBox style={{ flex:1 }}><input type="number" value={newItem.hoeveelheid} onChange={e=>setNewItem({...newItem,hoeveelheid:e.target.value})} style={INP} /></FieldBox><FieldBox style={{ flex:1 }}><input value={newItem.eenheid} placeholder="eenheid" onChange={e=>setNewItem({...newItem,eenheid:e.target.value})} style={INP} /></FieldBox></div><div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:14 }}>{cats.map(cat=><Chip key={cat.id} label={cat.label} active={(newItem.categorie||cats[0]?.id)===cat.id} color={cat.color} onClick={()=>setNewItem({...newItem,categorie:cat.id})} />)}</div><ActionBtn color={listInfo.color} onClick={addShopItem}>Toevoegen</ActionBtn></Sheet>}

        {showAddEvent&&<Sheet onClose={()=>setShowAddEvent(false)}>
          <SheetTitle icon="📅" title="Afspraak toevoegen" sub={currentUser.naam} subColor="#007AFF" />
          <FieldBox><input value={newEvent.titel} onChange={e=>setNewEvent({...newEvent,titel:e.target.value})} placeholder="Titel afspraak..." style={INP} /></FieldBox>
          <FieldBox><input type="date" value={newEvent.datum} onChange={e=>setNewEvent({...newEvent,datum:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
          {/* Full day toggle */}
          <div onClick={()=>setNewEvent({...newEvent,begintijd:newEvent.begintijd==="allday"?"09:00":"allday",eindtijd:newEvent.begintijd==="allday"?"10:00":"allday"})} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#fff",borderRadius:10,marginBottom:8,cursor:"pointer" }}>
            <div style={{ width:24,height:24,borderRadius:12,background:newEvent.begintijd==="allday"?"#007AFF":"#E5E5EA",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s" }}>
              {newEvent.begintijd==="allday"&&<span style={{ color:"#fff",fontSize:14 }}>✓</span>}
            </div>
            <div style={{ fontSize:14,fontWeight:600,color:"#000" }}>Hele dag</div>
          </div>
          {newEvent.begintijd!=="allday"&&<div style={{ display:"flex",gap:8,marginBottom:10 }}>
            <FieldBox style={{ flex:1 }}><input type="time" value={newEvent.begintijd} onChange={e=>{
              const start=e.target.value;
              const [sh,sm]=start.split(":").map(Number);
              const endH=String(sh+1).padStart(2,"0");
              const endTime=`${endH}:${String(sm).padStart(2,"0")}`;
              setNewEvent({...newEvent,begintijd:start,eindtijd:newEvent.eindtijd<start?endTime:newEvent.eindtijd});
            }} style={{...INP,fontSize:13}} /></FieldBox>
            <div style={{ display:"flex",alignItems:"center",color:"#8E8E93",fontSize:12 }}>tot</div>
            <FieldBox style={{ flex:1 }}><input type="time" value={newEvent.eindtijd} min={newEvent.begintijd} onChange={e=>setNewEvent({...newEvent,eindtijd:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
          </div>}
          <FieldBox><input value={newEvent.locatie} onChange={e=>setNewEvent({...newEvent,locatie:e.target.value})} placeholder="📍 Locatie" style={INP} /></FieldBox>
          <div style={{ display:"flex",flexWrap:"wrap",gap:5,margin:"10px 0 14px" }}>{CAL_CATS.map(cat=><Chip key={cat.id} label={cat.label.split(" ")[0]} active={newEvent.categorie===cat.id} color={cat.color} onClick={()=>setNewEvent({...newEvent,categorie:cat.id})} small />)}</div>
          <div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6 }}>VOOR WIE</div>
          <div style={{ display:"flex",gap:6,marginBottom:14,flexWrap:"wrap" }}>{familyMembers.map(m=><div key={m.naam} onClick={()=>setNewEvent({...newEvent,lid:m.naam})} style={{ padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:700,background:(newEvent.lid||currentUser.naam)===m.naam?(m.kleur||"#007AFF"):"#E5E5EA",color:(newEvent.lid||currentUser.naam)===m.naam?"#fff":"#3A3A3C",cursor:"pointer" }}>{m.emoji||""} {m.naam}</div>)}</div>
          <ActionBtn color="#007AFF" onClick={addEvent}>Afspraak toevoegen</ActionBtn>
        </Sheet>}

        {showAddTask&&<Sheet onClose={()=>setShowAddTask(false)}><SheetTitle icon="✅" title="Nieuwe taak" sub={currentUser.naam} subColor="#5856D6" /><FieldBox><input value={newTask.titel} onChange={e=>setNewTask({...newTask,titel:e.target.value})} onKeyDown={e=>e.key==="Enter"&&addTask()} placeholder="Wat moet er gedaan worden?" style={INP} /></FieldBox><div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6,marginTop:4 }}>TOEWIJZEN AAN</div><div style={{ display:"flex",gap:6,marginBottom:10,flexWrap:"wrap" }}>{familyMembers.map(m=><div key={m.naam} onClick={()=>setNewTask({...newTask,toegewezen_aan:m.naam})} style={{ flex:"1 0 40%",padding:"8px 0",borderRadius:12,textAlign:"center",fontSize:11,fontWeight:700,background:newTask.toegewezen_aan===m.naam?(m.kleur||"#8E8E93"):"#E5E5EA",color:newTask.toegewezen_aan===m.naam?"#fff":"#3A3A3C",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}><AV naam={m.naam} size={32} fsize={16} />{m.naam}</div>)}</div><div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6 }}>PRIORITEIT</div><div style={{ display:"flex",gap:6,marginBottom:10 }}>{[["laag","🟢"],["normaal","🟡"],["hoog","🔴"]].map(([p2,ic])=><div key={p2} onClick={()=>setNewTask({...newTask,prioriteit:p2})} style={{ flex:1,padding:"8px 0",borderRadius:12,textAlign:"center",fontSize:12,fontWeight:700,background:newTask.prioriteit===p2?"#5856D6":"#E5E5EA",color:newTask.prioriteit===p2?"#fff":"#3A3A3C",cursor:"pointer" }}>{ic} {p2.charAt(0).toUpperCase()+p2.slice(1)}</div>)}</div><div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:10 }}>{TASK_CATS.map(cat=><Chip key={cat.id} label={cat.label} active={newTask.categorie===cat.id} color={cat.color} onClick={()=>setNewTask({...newTask,categorie:cat.id})} />)}</div><FieldBox><input value={newTask.deadline} type="date" onChange={e=>setNewTask({...newTask,deadline:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox><ActionBtn color="#5856D6" onClick={addTask}>Taak toevoegen</ActionBtn></Sheet>}

        {showAddMeal&&<Sheet onClose={()=>setShowAddMeal(false)}><SheetTitle icon="🍽️" title="Gerecht voorstellen" sub={currentUser.naam} subColor="#E53935" /><FieldBox><input value={newMeal.titel} onChange={e=>setNewMeal({...newMeal,titel:e.target.value})} placeholder="Naam van het gerecht..." style={INP} /></FieldBox><FieldBox><input value={newMeal.recept} onChange={e=>setNewMeal({...newMeal,recept:e.target.value})} placeholder="Ingrediënten / recept (optioneel)" style={INP} /></FieldBox><div onClick={()=>mealFileRef.current?.click()} style={{ background:newMeal.image?"transparent":"#fff",border:"2px dashed #E5E5EA",borderRadius:12,marginBottom:10,overflow:"hidden",cursor:"pointer",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center" }}>{newMeal.image?<img src={newMeal.image} alt="" style={{ width:"100%",height:120,objectFit:"cover" }}/>:<div style={{ textAlign:"center",color:"#8E8E93",padding:16 }}><div style={{ fontSize:28,marginBottom:4 }}>📸</div><div style={{ fontSize:13,fontWeight:600 }}>Foto toevoegen</div></div>}</div><input ref={mealFileRef} type="file" accept="image/*" onChange={handleMealImg} style={{ display:"none" }} /><div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:14 }}>{MEAL_CATS.map(cat=><Chip key={cat.id} label={cat.label} active={newMeal.categorie===cat.id} color={cat.color} onClick={()=>setNewMeal({...newMeal,categorie:cat.id})} />)}</div><ActionBtn color="#E53935" onClick={addMeal}>Gerecht voorstellen</ActionBtn></Sheet>}

        {selectedEvent&&<Sheet onClose={()=>setSelectedEvent(null)}><div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}><div style={{ flex:1 }}><div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}><div style={{ width:8,height:8,borderRadius:4,background:getCatInfo(selectedEvent.categorie).color }} /><div style={{ fontSize:10,color:getCatInfo(selectedEvent.categorie).color,fontWeight:700,textTransform:"uppercase" }}>{getCatInfo(selectedEvent.categorie).label}</div></div><div style={{ fontSize:18,fontWeight:800,color:"#000" }}>{selectedEvent.titel}</div><div style={{ fontSize:12,color:"#8E8E93",marginTop:2 }}>{NL_DAYS_LONG[parseDate(selectedEvent.datum).getDay()]} {parseDate(selectedEvent.datum).getDate()} {NL_MONTHS[parseDate(selectedEvent.datum).getMonth()]}</div></div><AV naam={selectedEvent.lid} size={36} fsize={18} /></div><div style={{ background:"#F2F2F7",borderRadius:12,padding:"10px 14px",marginBottom:12 }}><InfoRow icon="🕐" label={`${selectedEvent.begintijd} – ${selectedEvent.eindtijd}`} />{selectedEvent.locatie&&<InfoRow icon="📍" label={selectedEvent.locatie} />}<InfoRow icon="👤" label={selectedEvent.lid} />{selectedEvent.notities&&<InfoRow icon="📝" label={selectedEvent.notities} />}</div><div style={{ display:"flex",gap:8,marginBottom:8 }}><div onClick={()=>exportToICS(selectedEvent)} style={{ flex:1,background:"#E8F0FE",color:"#007AFF",borderRadius:12,padding:"12px",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer" }}>📤 Outlook</div><div onClick={()=>{ setEditEvent({...selectedEvent}); setSelectedEvent(null); }} style={{ flex:1,background:"#F0FFF0",color:"#34C759",borderRadius:12,padding:"12px",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer" }}>✏️ Bewerken</div><div onClick={()=>deleteEvent(selectedEvent.id)} style={{ flex:1,background:"#FFE5E5",color:"#FF3B30",borderRadius:12,padding:"12px",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer" }}>🗑️ Wis</div></div></Sheet>}

        {selectedMeal&&<Sheet onClose={()=>setSelectedMeal(null)}>{selectedMeal.foto_url&&<img src={selectedMeal.foto_url} alt="" style={{ width:"100%",height:160,objectFit:"cover",borderRadius:12,marginBottom:12 }} />}<div style={{ fontSize:20,fontWeight:800,color:"#000",marginBottom:4 }}>{selectedMeal.titel}</div><div style={{ fontSize:12,color:"#8E8E93",marginBottom:12 }}>Voorgesteld door <span style={{ color:getMember(selectedMeal.toegevoegd_door).kleur||"#8E8E93",fontWeight:700 }}>{selectedMeal.toegevoegd_door}</span></div>{selectedMeal.recept&&<div style={{ background:"#F2F2F7",borderRadius:12,padding:"12px",marginBottom:12 }}><div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6 }}>RECEPT</div><div style={{ fontSize:14,color:"#3A3A3C",lineHeight:1.6 }}>{selectedMeal.recept}</div></div>}<div style={{ display:"flex",gap:8,marginBottom:14 }}>{[["❤️","Lekker!"],["👍","Prima"],["😐","Twijfel"]].map(([emoji,label])=>{ const count=Object.values(selectedMeal.stemmen||{}).filter(v=>v===emoji).length; const myVote=(selectedMeal.stemmen||{})[currentUser.naam]; return<div key={emoji} onClick={()=>voteMeal(selectedMeal.id,emoji)} style={{ flex:1,padding:"10px 0",borderRadius:14,textAlign:"center",border:`2px solid ${myVote===emoji?"#007AFF":"#E5E5EA"}`,cursor:"pointer",background:myVote===emoji?"#EBF4FF":"#fff" }}><div style={{ fontSize:22 }}>{emoji}</div><div style={{ fontSize:12,fontWeight:700 }}>{label}</div><div style={{ fontSize:11,color:"#8E8E93" }}>{count} stem{count!==1?"men":""}</div></div>; })}</div><div style={{ display:"flex",gap:8 }}><div onClick={()=>{ setEditMeal({...selectedMeal}); setSelectedMeal(null); }} style={{ flex:1,background:"#EBF4FF",color:"#007AFF",borderRadius:12,padding:"12px",textAlign:"center",fontSize:13,fontWeight:700,cursor:"pointer" }}>✏️ Bewerken</div><div onClick={()=>setSelectedMeal(null)} style={{ flex:1,background:"#F2F2F7",color:"#3A3A3C",borderRadius:12,padding:"12px",textAlign:"center",fontSize:14,fontWeight:700,cursor:"pointer" }}>Sluiten</div></div></Sheet>}

        {/* Edit Task Sheet */}
        {editTask&&<Sheet onClose={()=>setEditTask(null)}>
          <SheetTitle icon="✅" title="Taak bewerken" sub={currentUser.naam} subColor="#5856D6" />
          <FieldBox><input value={editTask.titel} onChange={e=>setEditTask({...editTask,titel:e.target.value})} placeholder="Wat moet er gedaan worden?" style={INP} /></FieldBox>
          <div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6,marginTop:4 }}>TOEWIJZEN AAN</div>
          <div style={{ display:"flex",gap:6,marginBottom:10,flexWrap:"wrap" }}>{familyMembers.map(m=><div key={m.naam} onClick={()=>setEditTask({...editTask,toegewezen_aan:m.naam})} style={{ flex:"1 0 40%",padding:"8px 0",borderRadius:12,textAlign:"center",fontSize:11,fontWeight:700,background:editTask.toegewezen_aan===m.naam?(m.kleur||"#8E8E93"):"#E5E5EA",color:editTask.toegewezen_aan===m.naam?"#fff":"#3A3A3C",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4 }}><AV naam={m.naam} size={32} fsize={16} />{m.naam}</div>)}</div>
          <div style={{ fontSize:12,fontWeight:700,color:"#8E8E93",marginBottom:6 }}>PRIORITEIT</div>
          <div style={{ display:"flex",gap:6,marginBottom:10 }}>{[["laag","🟢"],["normaal","🟡"],["hoog","🔴"]].map(([p2,ic])=><div key={p2} onClick={()=>setEditTask({...editTask,prioriteit:p2})} style={{ flex:1,padding:"8px 0",borderRadius:12,textAlign:"center",fontSize:12,fontWeight:700,background:editTask.prioriteit===p2?"#5856D6":"#E5E5EA",color:editTask.prioriteit===p2?"#fff":"#3A3A3C",cursor:"pointer" }}>{ic} {p2.charAt(0).toUpperCase()+p2.slice(1)}</div>)}</div>
          <FieldBox><input value={editTask.deadline||""} type="date" onChange={e=>setEditTask({...editTask,deadline:e.target.value||null})} style={{...INP,fontSize:13}} /></FieldBox>
          <ActionBtn color="#5856D6" onClick={()=>updateTask(editTask.id,{titel:editTask.titel,toegewezen_aan:editTask.toegewezen_aan,prioriteit:editTask.prioriteit,deadline:editTask.deadline||null})}>Opslaan</ActionBtn>
        </Sheet>}

        {/* Edit Event Sheet */}
        {editEvent&&<Sheet onClose={()=>setEditEvent(null)}>
          <SheetTitle icon="📅" title="Afspraak bewerken" sub={currentUser.naam} subColor="#007AFF" />
          <FieldBox><input value={editEvent.titel} onChange={e=>setEditEvent({...editEvent,titel:e.target.value})} placeholder="Titel..." style={INP} /></FieldBox>
          <div style={{ display:"flex",gap:8,marginBottom:10 }}>
            <FieldBox style={{ flex:1 }}><input type="date" value={editEvent.datum} onChange={e=>setEditEvent({...editEvent,datum:e.target.value})} style={{...INP,fontSize:13}} /></FieldBox>
          </div>
          <div style={{ display:"flex",gap:8,marginBottom:10 }}>
            <FieldBox style={{ flex:1 }}><input value={editEvent.begintijd} onChange={e=>setEditEvent({...editEvent,begintijd:e.target.value})} placeholder="09:00" style={INP} /></FieldBox>
            <FieldBox style={{ flex:1 }}><input value={editEvent.eindtijd} onChange={e=>setEditEvent({...editEvent,eindtijd:e.target.value})} placeholder="10:00" style={INP} /></FieldBox>
          </div>
          <FieldBox><input value={editEvent.locatie||""} onChange={e=>setEditEvent({...editEvent,locatie:e.target.value})} placeholder="Locatie (optioneel)" style={INP} /></FieldBox>
          <FieldBox><input value={editEvent.notities||""} onChange={e=>setEditEvent({...editEvent,notities:e.target.value})} placeholder="Notities (optioneel)" style={INP} /></FieldBox>
          <ActionBtn color="#007AFF" onClick={()=>updateEvent(editEvent.id,{titel:editEvent.titel,datum:editEvent.datum,begintijd:editEvent.begintijd,eindtijd:editEvent.eindtijd,locatie:editEvent.locatie,notities:editEvent.notities})}>Opslaan</ActionBtn>
        </Sheet>}

        {/* Edit Shop Item Sheet */}
        {editShopItem&&<Sheet onClose={()=>setEditShopItem(null)}>
          <SheetTitle icon="🛒" title="Item bewerken" sub={currentUser.naam} subColor="#34C759" />
          <FieldBox><input value={editShopItem.naam} onChange={e=>setEditShopItem({...editShopItem,naam:e.target.value})} placeholder="Naam..." style={INP} /></FieldBox>
          <div style={{ display:"flex",gap:8,marginBottom:10 }}>
            <FieldBox style={{ flex:1 }}><input type="number" value={editShopItem.hoeveelheid} onChange={e=>setEditShopItem({...editShopItem,hoeveelheid:e.target.value})} style={INP} /></FieldBox>
            <FieldBox style={{ flex:1 }}><input value={editShopItem.eenheid} onChange={e=>setEditShopItem({...editShopItem,eenheid:e.target.value})} placeholder="eenheid" style={INP} /></FieldBox>
          </div>
          <ActionBtn color="#34C759" onClick={()=>updateShopItem(editShopItem.id,{naam:editShopItem.naam,hoeveelheid:editShopItem.hoeveelheid,eenheid:editShopItem.eenheid})}>Opslaan</ActionBtn>
        </Sheet>}

        {/* Edit Meal Sheet */}
        {editMeal&&<Sheet onClose={()=>setEditMeal(null)}>
          <SheetTitle icon="🍽️" title="Diner bewerken" sub={currentUser.naam} subColor="#E53935" />
          <FieldBox><input value={editMeal.titel} onChange={e=>setEditMeal({...editMeal,titel:e.target.value})} placeholder="Gerecht..." style={INP} /></FieldBox>
          <FieldBox><textarea value={editMeal.recept||""} onChange={e=>setEditMeal({...editMeal,recept:e.target.value})} placeholder="Recept (optioneel)" style={{...INP,minHeight:80,resize:"none"}} /></FieldBox>
          <ActionBtn color="#E53935" onClick={()=>updateMeal(editMeal.id,{titel:editMeal.titel,recept:editMeal.recept})}>Opslaan</ActionBtn>
        </Sheet>}

        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}*{-webkit-tap-highlight-color:transparent}::-webkit-scrollbar{display:none}input::placeholder{color:#aaa}`}</style>
      </div>

      {/* Push notificatie popup — buiten het telefoon frame */}
      {showPushPopup && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"#fff", borderRadius:24, padding:"28px 24px", maxWidth:320, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.4)" }}>
            <div style={{ fontSize:56, marginBottom:12 }}>🔔</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#000", marginBottom:8 }}>Meldingen aanzetten</div>
            <div style={{ fontSize:14, color:"#8E8E93", lineHeight:1.5, marginBottom:24 }}>
              Krijg een melding als iemand een nieuw bericht stuurt, ook als de app dicht is.
            </div>
            <button onClick={requestPush} style={{ width:"100%", background:"#FF6B35", border:"none", borderRadius:14, padding:"16px", color:"#fff", fontSize:16, fontWeight:800, cursor:"pointer", marginBottom:10 }}>
              Ja, zet meldingen aan 🤠
            </button>
            <button onClick={()=>setShowPushPopup(false)} style={{ width:"100%", background:"none", border:"none", color:"#8E8E93", fontSize:14, cursor:"pointer", padding:"8px" }}>
              Niet nu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function TaskItem({ task, isLast, onToggle, onDelete, onEdit, getMember }) {
  const [swiped,setSwiped] = useState(false);
  const m = getMember(task.toegewezen_aan);
  const TC = TASK_CATS.find(c=>c.id===task.categorie)||TASK_CATS[4];
  const pc = task.prioriteit==="hoog"?"#FF3B30":task.prioriteit==="laag"?"#34C759":"#FF9F0A";
  const pts = POINTS_MAP[task.prioriteit]||10;
  const earns = task.toegevoegd_door!==task.toegewezen_aan;
  return (
    <div style={{ position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:130,display:"flex" }}>
        <div style={{ flex:1,background:"#007AFF",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }} onClick={onEdit}>✏️ Bewerk</div>
        <div style={{ flex:1,background:"#FF3B30",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }} onClick={onDelete}>🗑️ Wis</div>
      </div>
      <div style={{ display:"flex",alignItems:"center",padding:"12px 14px",borderBottom:isLast?"none":"1px solid #F2F2F7",background:"#fff",transform:swiped?"translateX(-130px)":"translateX(0)",transition:"transform 0.22s" }}>
        <div onClick={onToggle} style={{ width:24,height:24,borderRadius:12,marginRight:12,flexShrink:0,border:task.gedaan?"none":"2px solid #C7C7CC",background:task.gedaan?"#34C759":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s" }}>
          {task.gedaan&&<span style={{ color:"#fff",fontSize:12 }}>✓</span>}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
            <div style={{ width:6,height:6,borderRadius:3,background:pc,flexShrink:0 }} />
            <div style={{ fontSize:15,fontWeight:600,color:task.gedaan?"#8E8E93":"#000",textDecoration:task.gedaan?"line-through":"none",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{task.titel}</div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:5,flexWrap:"wrap" }}>
            <div style={{ background:TC.color+"22",color:TC.color,padding:"1px 6px",borderRadius:8,fontSize:10,fontWeight:700 }}>{TC.label.split(" ")[1]||TC.label}</div>
            {earns&&<div style={{ background:task.gedaan?"#34C75922":"#5856D622",color:task.gedaan?"#34C759":"#5856D6",padding:"1px 7px",borderRadius:8,fontSize:10,fontWeight:800 }}>{task.gedaan?`+${pts}pt ✓`:`+${pts}pt`}</div>}
            {task.gedaan&&task.gedaan_door&&<div style={{ fontSize:10,color:getMember(task.gedaan_door).kleur||"#8E8E93",fontWeight:600 }}>door {task.gedaan_door}</div>}
          </div>
        </div>
        <div onClick={()=>setSwiped(s=>!s)} style={{ width:30,height:30,borderRadius:15,background:m.kleur||"#8E8E93",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginLeft:8,cursor:"pointer",overflow:"hidden" }}>
          {m.avatar_url?<img src={m.avatar_url} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:(m.emoji||m.naam?.[0]||"?")}
        </div>
      </div>
    </div>
  );
}
function CalPill({ event, onClick, getCatInfo, getMember }) {
  const cat=getCatInfo(event.categorie); const m=getMember(event.lid);
  return <div onClick={onClick} style={{ background:cat.color+"15",borderLeft:`3px solid ${cat.color}`,borderRadius:"0 8px 8px 0",padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,marginBottom:2 }}><div style={{ flex:1 }}><div style={{ fontSize:12,fontWeight:700,color:"#000" }}>{event.titel}</div><div style={{ fontSize:10,color:"#8E8E93" }}>{event.begintijd}–{event.eindtijd}{event.locatie?` · ${event.locatie}`:""}</div></div><div style={{ width:20,height:20,borderRadius:10,background:m.kleur||"#8E8E93",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff",overflow:"hidden" }}>{m.avatar_url?<img src={m.avatar_url} style={{ width:"100%",height:"100%",objectFit:"cover" }}/>:(m.emoji||event.lid?.[0])}</div></div>;
}
function ShopItem({ item, isLast, catColor, memberColor, onToggle, onDelete, onEdit, swiped, onSwipe }) {
  return <div style={{ position:"relative",overflow:"hidden" }}>
    <div style={{ position:"absolute",right:0,top:0,bottom:0,width:130,display:"flex" }}>
      <div style={{ flex:1,background:"#007AFF",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }} onClick={onEdit}>✏️ Bewerk</div>
      <div style={{ flex:1,background:"#FF3B30",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer" }} onClick={onDelete}>🗑️ Wis</div>
    </div>
    <div style={{ display:"flex",alignItems:"center",padding:"10px 12px",borderBottom:isLast?"none":"1px solid #F2F2F7",background:"#fff",transform:swiped?"translateX(-130px)":"translateX(0)",transition:"transform 0.22s" }}>
      <div style={{ width:6,height:6,borderRadius:3,background:catColor,marginRight:10,flexShrink:0 }} />
      <div onClick={onToggle} style={{ width:21,height:21,borderRadius:11,marginRight:10,flexShrink:0,border:item.afgevinkt?"none":"2px solid #C7C7CC",background:item.afgevinkt?"#34C759":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s" }}>{item.afgevinkt&&<span style={{ color:"#fff",fontSize:11 }}>✓</span>}</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:14,fontWeight:500,color:item.afgevinkt?"#8E8E93":"#000",textDecoration:item.afgevinkt?"line-through":"none" }}>{item.naam}</div>
        <div style={{ fontSize:11,color:"#8E8E93",marginTop:1 }}>{item.hoeveelheid} {item.eenheid} · <span style={{ color:memberColor,fontWeight:600 }}>{item.toegevoegd_door}</span></div>
      </div>
      <div onClick={onSwipe} style={{ padding:"0 0 0 8px",color:"#C7C7CC",fontSize:15 }}>⋯</div>
    </div>
  </div>;
}
function Sheet({ children, onClose }) {
  return <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:20,display:"flex",alignItems:"flex-end" }} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{ background:"#F2F2F7",borderRadius:"22px 22px 0 0",padding:"14px 16px 36px",width:"100%",boxSizing:"border-box",animation:"slideUp 0.28s ease",maxHeight:"88%",overflowY:"auto" }}><div style={{ width:34,height:4,background:"#C7C7CC",borderRadius:2,margin:"0 auto 14px" }} />{children}</div></div>;
}
function SheetTitle({ icon, title, sub, subColor }) {
  return <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}><div style={{ fontSize:16,fontWeight:800,color:"#000" }}>{icon} {title}</div><div style={{ fontSize:12,color:subColor,fontWeight:700 }}>{sub}</div></div>;
}
function Chip({ label, active, color, onClick, small }) {
  return <div onClick={onClick} style={{ padding:small?"4px 9px":"5px 11px",borderRadius:20,fontSize:small?11:12,fontWeight:700,background:active?color:"#E5E5EA",color:active?"#fff":"#3A3A3C",cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0 }}>{label}</div>;
}
function FieldBox({ children, style }) {
  return <div style={{ background:"#fff",borderRadius:10,marginBottom:8,overflow:"hidden",...style }}>{children}</div>;
}
function ActionBtn({ color, onClick, children }) {
  return <div onClick={onClick} style={{ background:color,color:"#fff",borderRadius:12,padding:"14px",textAlign:"center",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 4px 14px ${color}44`,marginTop:4 }}>{children}</div>;
}
function InfoRow({ icon, label }) {
  return <div style={{ display:"flex",gap:8,marginBottom:5,alignItems:"flex-start" }}><span style={{ fontSize:13 }}>{icon}</span><span style={{ fontSize:13,color:"#3A3A3C" }}>{label}</span></div>;
}
const INP = { width:"100%",padding:"12px 14px",border:"none",outline:"none",fontSize:15,color:"#000",background:"none",boxSizing:"border-box" };
