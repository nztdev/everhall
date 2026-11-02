/* Hall store: local library (IndexedDB), file export/import, load-from-URL. The engine only talks to this. */
const Store=(()=>{
 const db=()=>new Promise((ok,no)=>{const r=indexedDB.open("everhall-lib",1);r.onupgradeneeded=()=>r.result.createObjectStore("halls",{keyPath:"id"});r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});
 const tx=(m,f)=>db().then(d=>new Promise((ok,no)=>{const t=d.transaction("halls",m),r=f(t.objectStore("halls"));t.oncomplete=()=>ok(r.result);t.onerror=()=>no(t.error)}));
 const toData=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>new Promise(ok=>{const f=new FileReader();f.onload=()=>ok(f.result);f.readAsDataURL(b)}));
 const S={
  uid:()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),
  blank:n=>({v:1,data:{name:n,sub:"Your story",theme:"gallery",items:[{id:1,type:"text",group:"Room 1",date:"",title:"Welcome",cap:"Open Edit to add photos, videos and plaques.",src:"manual"}]},images:{}}),
  valid(o){if(!(o&&o.data&&Array.isArray(o.data.items)&&o.data.items.length))throw new Error("invalid hall");return o},
  list:()=>tx("readonly",s=>s.getAll()).then(a=>a.map(r=>({id:r.id,name:r.name,sub:r.sub,n:r.snap.data.items.length,updated:r.updated})).sort((a,b)=>b.updated-a.updated)),
  get:id=>tx("readonly",s=>s.get(id)).then(r=>r&&r.snap),
  save:(id,snap)=>tx("readwrite",s=>s.put({id,name:snap.data.name,sub:snap.data.sub,updated:Date.now(),snap})),
  create(snap){const id=S.uid();return S.save(id,snap).then(()=>id)},
  remove:id=>tx("readwrite",s=>s.delete(id)),
  async duplicate(id){const o=await S.get(id);o.data.name+=" (copy)";return S.create(o)},
  async fromUrl(src){const u=new URL(src,location.href),r=await fetch(u);if(!r.ok)throw new Error("fetch failed");const o=S.valid(await r.json());
   const abs=v=>/^(data:|https?:|blob:)/.test(v)?v:new URL(v,u).href;o.images=o.images||{};for(const k in o.images)o.images[k]=abs(o.images[k]);
   o.data.items.forEach(i=>{if(typeof i.glb=="string")i.glb=abs(i.glb)});return o},
  async inline(o){const im={};for(const k in (o.images||{})){let v=o.images[k];if(!/^data:/.test(v)){try{v=await toData(v)}catch(e){}}im[k]=v}return Object.assign({},o,{images:im})},
  download(name,o){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(o)],{type:"application/json"}));a.download=String(name||"hall").replace(/\W+/g,"-").toLowerCase()+".everhall.json";a.click()}
 };return S})();
