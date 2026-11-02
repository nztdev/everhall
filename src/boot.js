/* Start-up: load a hall (local ?id= or shared ?src=), then build the world. */
function loadModels(){new Set(DATA.items.map(i=>i.glb).filter(u=>typeof u=="string")).forEach(u=>{if(MODELS[u])return;
 new T.GLTFLoader().load(u,g=>{const o=g.scene,bb=new T.Box3().setFromObject(o),z=bb.getSize(new T.Vector3()),c=bb.getCenter(new T.Vector3());o.position.set(-c.x,-bb.min.y,-c.z);const w=new T.Group();w.add(o);w.userData.h=z.y;MODELS[u]=w;build()},undefined,e=>console.warn(e))})}
async function saveCopy(){const id=await Store.create(await Store.inline(snap()));location.href="?id="+id}
(async()=>{let o=null;
 try{o=QS.get("src")?await Store.fromUrl(QS.get("src")):HALL.id?await Store.get(HALL.id):null}catch(e){console.warn(e)}
 if(!o){document.body.innerHTML='<p style="padding:30px;font:16px Georgia;color:#eee">That hall could not be loaded. <a href="../" style="color:#d7b25e">Back to the library</a></p>';return}
 load(o);document.title=DATA.name+" · Everhall";build();simple();requestAnimationFrame(loop);
 $("#iname").textContent=DATA.name;$("#isub").textContent=DATA.sub;
 $("#enter").onclick=()=>{startAudio();doorsOpen=true;$("#intro").style.opacity=0;setTimeout(()=>$("#intro").style.display="none",1500);$("#hud").style.display="flex";
 path=[[0,1.6],[0,-3]];yawT=0;pitT=0;if(matchMedia("(pointer:coarse)").matches){const h=$("#hint");h.style.opacity=1;setTimeout(()=>h.style.opacity=0,7000)}};
})();
