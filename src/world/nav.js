/* ===== 8. NAVIGATION ===== */
let px=0,pz=9,yaw=0,pitch=0,yawT=null,pitT=0,path=[],keys={};
const SPACE=()=>Spaces[DATA.space]||Spaces.gallery;
const areaAt=(x,z)=>SPACE().areaAt(x,z);
function walkTo(x,z,yw,pt){path=SPACE().route(px,pz,x,z);path.push([x,z]);yawT=yw===undefined?null:yw;pitT=pt||0}
function goArea(i){const a=(rooms[i]&&rooms[i].entry)||SPACE().entry(i);walkTo(a.x,a.z,a.yaw,0)}
function obst(){OBS.forEach(o=>{const dx=px-o.x,dz=pz-o.z,d=Math.hypot(dx,dz);if(d<o.r&&d>.001){const nx=Math.abs(dx)<.6?dx+(dx>=0?.03:-.03):dx,nd=Math.hypot(nx,dz);px=o.x+nx/nd*o.r;pz=o.z+dz/nd*o.r}})}
function collide(ox,oz){SPACE().collide(ox,oz)}
const cv=$("#c"),ptr={},JR=55,jel=$("#joy"),jk=$("#jk");let joy=null;
cv.addEventListener("pointerdown",e=>{cv.setPointerCapture(e.pointerId);
 if(e.pointerType=="touch"&&doorsOpen&&!joy&&e.clientX<innerWidth*.45&&e.clientY>innerHeight*.3){joy={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,dy:0,m:0,t:performance.now()};jel.style.cssText=`display:block;left:${e.clientX-JR}px;top:${e.clientY-JR}px`;jk.style.transform="";return}
 ptr[e.pointerId]={x:e.clientX,y:e.clientY,t:performance.now(),m:0}});
cv.addEventListener("pointermove",e=>{
 if(joy&&e.pointerId==joy.id){let dx=e.clientX-joy.x,dy=e.clientY-joy.y;const d=Math.hypot(dx,dy);joy.m=Math.max(joy.m,d);if(d>JR){dx*=JR/d;dy*=JR/d}jk.style.transform=`translate(${dx}px,${dy}px)`;joy.dx=d<10?0:dx/JR;joy.dy=d<10?0:dy/JR;return}
 const p=ptr[e.pointerId];if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.m+=Math.abs(dx)+Math.abs(dy);p.x=e.clientX;p.y=e.clientY;
 if(p.m>6){yaw-=dx*.005;pitch=Math.max(-1.2,Math.min(1.2,pitch-dy*.005));yawT=null}});
cv.addEventListener("pointerup",e=>{
 if(joy&&e.pointerId==joy.id){if(joy.m<8&&performance.now()-joy.t<400)pick(e.clientX,e.clientY);joy=null;jel.style.display="none";return}
 const p=ptr[e.pointerId];if(p&&p.m<8&&performance.now()-p.t<500)pick(e.clientX,e.clientY);delete ptr[e.pointerId]});
cv.addEventListener("pointercancel",e=>{if(joy&&e.pointerId==joy.id){joy=null;jel.style.display="none"}delete ptr[e.pointerId]});
const rc=new T.Raycaster();
function pick(cx,cy){if(!doorsOpen)return;rc.setFromCamera(new T.Vector2(cx/innerWidth*2-1,-cy/innerHeight*2+1),cam);
 const hit=rc.intersectObjects(scene.children,true).find(h=>h.object.isMesh&&!h.object.material.transparent);if(!hit)return;
 let o=hit.object;while(o){if(o.userData.item){openItem(o.userData.item);return}if(o.userData.floor){walkTo(hit.point.x,hit.point.z);return}o=o.parent}}
addEventListener("keydown",e=>{if(!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))keys[e.key.toLowerCase()]=1});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);


