/* ===== 3. ENGINE: derive rooms, heroes and placement from content ===== */
const W=10,H=4.5,DOOR=1.4,SP=3.4;
function derive(d){
 const rooms=[],m={};let z=0;
 d.items.forEach(i=>{if(!m[i.group]){m[i.group]={name:i.group,range:i.range||"",items:[]};rooms.push(m[i.group])}m[i.group].items.push(i)});
 rooms.forEach(r=>{
  r.hero=r.items.find(i=>i.hero)||r.items.find(i=>i.type=="pedestal")||r.items[0];
  r.rest=r.items.filter(i=>i!==r.hero);
  r.L=Math.max(12,SP*Math.ceil(r.rest.length/2)+5);
  r.z0=z;r.z1=z-r.L;z=r.z1;
  r.slots=r.rest.map((it,k)=>({it,side:k%2?1:-1,z:r.z0-2.6-Math.floor(k/2)*SP}));
 });
 return rooms;
}

