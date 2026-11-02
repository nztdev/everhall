/* ===== 10. BUILDER (owner mode) ===== */
const ED=$("#ed");let edT=null,pt=null;
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nid=()=>Math.max(0,...DATA.items.map(i=>i.id))+1;
const ytId=s=>{s=String(s);const m=s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)||s.match(/^([\w-]{11})$/);return m?m[1]:null};
function groups(){const g=[],m={};DATA.items.forEach(i=>{if(!m[i.group]){m[i.group]={name:i.group,items:[]};g.push(m[i.group])}m[i.group].items.push(i)});return g}
const flat=gs=>{DATA.items=gs.flatMap(g=>g.items)};
function add(g,p){const k=DATA.items.map(i=>i.group).lastIndexOf(g.name);DATA.items.splice(k+1,0,Object.assign({id:nid(),group:g.name,date:""},p))}
function refresh(save){build();simple();$("#iname").textContent=DATA.name;$("#isub").textContent=DATA.sub;if(save!==false)persist()}
function renderEd(){
 let h=`<div class="eh"><b>Hall editor</b><span><button data-a="export">Export</button><button data-a="import">Import</button><a class="bt" href="../">Library</a><button data-a="close">✕</button></span></div>
<label>Name<input data-f="name" value="${esc(DATA.name)}"></label><label>Subtitle<input data-f="sub" value="${esc(DATA.sub)}"></label>
<label>Theme<select data-f="theme">${Object.keys(THEMES).map(k=>`<option value="${k}"${k==themeKey?" selected":""}>${THEMES[k].label}</option>`).join("")}</select></label>`;
 groups().forEach((g,gi)=>{const n=g.items.length;
  h+=`<div class="rm"><div class="rh"><input data-r="${gi}" data-f="gname" value="${esc(g.name)}"><button data-a="rup" data-r="${gi}">↑</button><button data-a="rdn" data-r="${gi}">↓</button></div>
<input data-r="${gi}" data-f="range" placeholder="Label, e.g. 2012 – 2015" value="${esc(g.items[0].range||"")}">
<small${n>10?' style="color:#e99"':""}>${n} pieces${n>10?" · over 10 can feel crowded":""}. ☆ marks the centrepiece.</small>`;
  g.items.forEach(it=>{h+=`<div class="it"><div class="ir"><input data-id="${it.id}" data-f="title" value="${esc(it.title)}"><button data-a="hero" data-id="${it.id}">${it.hero?"★":"☆"}</button><button data-a="iup" data-id="${it.id}">↑</button><button data-a="idn" data-id="${it.id}">↓</button><button data-a="del" data-id="${it.id}">✕</button></div>
<input data-id="${it.id}" data-f="cap" placeholder="Caption" value="${esc(it.cap)}">${it.img?`<input data-id="${it.id}" data-f="credit" placeholder="Photo credit" value="${esc(it.credit||"")}">`:""}${it.yt?`<input data-id="${it.id}" data-f="yt" placeholder="YouTube link" value="https://youtu.be/${esc(it.yt)}">`:""}</div>`});
  h+=`<div class="ar"><label class="bt">+ Photos<input type="file" accept="image/*" multiple hidden data-a="photo" data-r="${gi}"></label><button data-a="vid" data-r="${gi}">+ Video</button><button data-a="txt" data-r="${gi}">+ Plaque</button></div></div>`});
 ED.innerHTML=h+`<button data-a="room" style="margin-top:12px">+ New room</button><input type="file" accept=".json" hidden id="imp">`}
ED.addEventListener("input",e=>{const t=e.target,f=t.dataset.f;if(!f)return;const v=t.value,r=+t.dataset.r;
 if(f=="name")DATA.name=v;else if(f=="sub")DATA.sub=v;else if(f=="theme")themeKey=DATA.theme=v;
 else if(f=="gname"){const gs=groups();if(!v.trim()||gs.some((x,i)=>i!=r&&x.name==v))return;gs[r].items.forEach(i=>i.group=v)}
 else if(f=="range"){const g=groups()[r];g.items.forEach(i=>delete i.range);g.items[0].range=v}
 else{const it=DATA.items.find(i=>i.id==t.dataset.id);if(!it)return;if(f=="yt"){const y=ytId(v);if(!y)return;it.yt=y}else it[f]=v}
 clearTimeout(edT);edT=setTimeout(()=>refresh(),350)});
ED.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const a=t.dataset.a,gs=groups(),r=+t.dataset.r,id=+t.dataset.id,g=gs[r];
 const mine=()=>gs.find(x=>x.items.some(i=>i.id==id));
 const mv=d=>{const q=mine(),rg=q.items[0].range,k=q.items.findIndex(i=>i.id==id),j=k+d;if(j<0||j>=q.items.length)return;q.items.forEach(i=>delete i.range);[q.items[k],q.items[j]]=[q.items[j],q.items[k]];q.items[0].range=rg;flat(gs)};
 if(a=="close"){ED.style.display="none";return}
 if(a=="export"){exp();return}
 if(a=="import"){$("#imp").click();return}
 if(a=="rup"||a=="rdn"){const j=r+(a=="rup"?-1:1);if(j<0||j>=gs.length)return;[gs[r],gs[j]]=[gs[j],gs[r]];flat(gs)}
 else if(a=="iup")mv(-1);else if(a=="idn")mv(1);
 else if(a=="hero"){const q=mine(),was=q.items.find(i=>i.id==id).hero;q.items.forEach(i=>delete i.hero);if(!was)q.items.find(i=>i.id==id).hero=1}
 else if(a=="del"){if(DATA.items.length<2)return;DATA.items=DATA.items.filter(i=>i.id!=id)}
 else if(a=="vid"){const y=ytId(prompt("Paste a YouTube link")||"");if(!y)return;add(g,{type:"screen",title:"New video",cap:"",src:"youtube",yt:y})}
 else if(a=="txt")add(g,{type:"text",title:"New plaque",cap:"Write something here.",src:"manual"});
 else if(a=="room"){let n=1;while(gs.some(x=>x.name=="New room "+n))n++;DATA.items.push({id:nid(),type:"text",group:"New room "+n,date:"",title:"New room",cap:"Add photos, videos and plaques.",src:"manual"})}
 else return;
 renderEd();refresh()});
ED.addEventListener("change",async e=>{const t=e.target;
 if(t.dataset.a=="photo"){const g=groups()[+t.dataset.r];for(const f of t.files){try{const o=await shrink(f);add(g,{type:"wall",title:f.name.replace(/\.[^.]+$/,""),cap:"",src:"upload",img:o.k,ar:o.ar})}catch(x){}}renderEd();refresh()}
 else if(t.id=="imp"&&t.files[0])imp(t.files[0])});
function shrink(f){return new Promise((ok,no)=>{const im=new Image(),u=URL.createObjectURL(f);im.onload=()=>{const s=Math.min(1,900/Math.max(im.width,im.height)),c=cvs(Math.round(im.width*s),Math.round(im.height*s));c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);const k="u"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);IMG[k]=c.toDataURL("image/jpeg",.76);ok({k,ar:+(c.width/c.height).toFixed(3)})};im.onerror=no;im.src=u})}
function snap(){const im={};DATA.items.forEach(i=>{if(i.img)im[i.img]=IMG[i.img]});return{v:1,data:DATA,images:im}}
async function exp(){Store.download(DATA.name||"hall",await Store.inline(snap()))}
function load(o){Object.assign(IMG,o.images||{});DATA.name=o.data.name||"Untitled";DATA.sub=o.data.sub||"";DATA.items=o.data.items;themeKey=THEMES[o.data.theme]?o.data.theme:"gallery";DATA.theme=themeKey;loadModels()}
function imp(f){f.text().then(t=>{const o=JSON.parse(t);if(!o.data||!Array.isArray(o.data.items)||!o.data.items.length)throw 0;load(o);renderEd();refresh()}).catch(()=>alert("That file isn't a valid hall."))}
function persist(){if(!HALL.id)return;clearTimeout(pt);pt=setTimeout(()=>Store.save(HALL.id,snap()).catch(()=>{}),600)}
