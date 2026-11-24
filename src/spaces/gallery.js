/* Gallery and Cabinet: chapter rooms in a line. The Cabinet is the same builder with everything in one room. */
const GM={
 layout(d){const r=derive(d);B=r.map(x=>x.z0).concat(r[r.length-1].z1);return r},
 build(rooms){
 const wm=std(th.wall);wm.userData.wall=1;const seg=(W-2*DOOR)/2;
 // outside ground
 outsideGround();
 rooms.forEach((r,i)=>{
  const cz=(r.z0+r.z1)/2;
  const fl=new T.Mesh(new T.PlaneGeometry(W,r.L),surf(KIND()[0],th.minor?0x2e3037:th.floor,W/4,r.L/4,{roughness:th.minor?.35:.5}));fl.rotation.x=-Math.PI/2;fl.position.set(0,0,cz);fl.userData.floor=1;scene.add(fl);
  const ce=new T.Mesh(new T.PlaneGeometry(W,r.L),surf("coffer",th.ceil,W/2.5,r.L/2.5));ce.rotation.x=Math.PI/2;ce.position.set(0,H,cz);scene.add(ce);
  box(.2,H,r.L,-W/2,H/2,cz,wm);box(.2,H,r.L,W/2,H/2,cz,wm);
  box(seg,H,.3,-(DOOR+seg/2),H/2,r.z0,wm);box(seg,H,.3,DOOR+seg/2,H/2,r.z0,wm);box(DOOR*2,H-3.2,.3,0,3.2+(H-3.2)/2,r.z0,wm);
  box(W,.12,.32,0,.06,r.z0,std(th.trim));
  [-1,1].forEach(s=>{box(.06,.24,r.L,s*(W/2-.13),.12,cz,std(th.trim));box(.16,.14,r.L,s*(W/2-.18),H-.07,cz,std(th.trim,{roughness:.5}))});
  const pt=new T.PointLight(th.light,th.li,r.L*1.3,1.6);pt.position.set(0,H-.5,cz);scene.add(pt);
  // hero at centre
  const hz=cz-.5,hero=r.hero;let hg;
  if(hero.type=="pedestal"||hero.type=="audio")hg=solid(hero,1);
  else{hg=new T.Group();const f=frameObj(hero,1);f.position.y=2.1;hg.add(f);hg.userData.item=hero;
   const post=new T.Mesh(new T.CylinderGeometry(.05,.05,1.4),std(th.trim));post.position.y=.7;hg.add(post)}
  hg.position.set(0,0,hz);scene.add(hg);pool(0,hz,4.6);focus[hero.id]={x:0,z:hz+4,yaw:0,pitch:-.05};r.hz=hz;OBS.push({x:0,z:hz,r:1.15});
  // slots along walls
  r.slots.forEach(s=>{
   const it=s.it,x=s.side*(W/2-.08);let g;pool(s.side*(W/2-1.6),s.z,3.4);
   if(it.type=="pedestal"||it.type=="audio"){g=solid(it);g.position.set(s.side*(W/2-1.3),0,s.z);scene.add(g);focus[it.id]={x:s.side*(W/2-3.4),z:s.z,yaw:-s.side*Math.PI/2,pitch:-.25}}
   else{g=frameObj(it);g.position.set(x,2.1,s.z);g.rotation.y=-s.side*Math.PI/2;scene.add(g);focus[it.id]={x:s.side*(W/2-3.6),z:s.z,yaw:-s.side*Math.PI/2,pitch:0}}
  });
 });
 const last=rooms[rooms.length-1];box(W,H,.3,0,H/2,last.z1,wm);

 },
 areaAt(x,z){for(let i=0;i<rooms.length;i++)if(z<=B[i]&&z>B[i+1])return i;return -1},
 entry(i){return{x:0,z:B[i]-3,yaw:0}},
 route(fx,fz,x,z){const a=GM.areaAt(fx,fz),b=GM.areaAt(x,z),p=[];
  if(a!=b&&a>=0&&b>=0){p.push([0,fz]);if(a<b)for(let k=a+1;k<=b;k++)p.push([0,B[k]-1]);else for(let k=a;k>b;k--)p.push([0,B[k]+1])}
  else if(a<0&&b>=0)p.push([0,.5],[0,-1.5]);return p},
 collide(ox,oz){const hw=W/2-.6;px=Math.max(-hw,Math.min(hw,px));pz=Math.min(pz,14);pz=Math.max(pz,doorsOpen?B[B.length-1]+.6:1.4);
  B.forEach(b=>{if(Math.abs(px)>DOOR-.15&&Math.abs(pz-b)<.35)pz=oz>b?b+.35:b-.35});obst()}
};
Object.assign(Spaces.gallery,GM);
Object.assign(Spaces.cabinet,GM,{layout(d){return GM.layout(Object.assign({},d,{items:d.items.map(i=>Object.assign({},i,{group:d.name||"Cabinet"}))}))}});
