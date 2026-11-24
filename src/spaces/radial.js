/* Rotunda (enclosed round hall) and Courtyard (open-air monument garden).
   Chapters run clockwise from the entrance. Wall pieces sit on the outer ring, objects and chapter centrepieces on an inner ring,
   and the first chapter's centrepiece becomes the monument at the middle. Size grows with the number of pieces. */
const TAU=Math.PI*2;
let RAD={cx:0,cz:-10,R:10,WR:10,IR:5,g:.3,seq:[],centre:null,open:false};
const isInner=o=>o.big||o.it.type=="pedestal"||o.it.type=="audio";
function radialLayout(d,open){
 const gs=derive(d),centre=gs[0].hero,seq=[];
 gs.forEach((r,i)=>{const l=[];if(r.hero!==centre)l.push({it:r.hero,big:1});r.rest.forEach(x=>l.push({it:x}));l.forEach(o=>{o.area=i;seq.push(o)})});
 const N=Math.max(1,seq.length),R=Math.max(open?11:9,N*3.1/(TAU-.7)),WR=open?R+3:R,g=Math.asin(Math.min(.9,1.5/WR))+.12,step=(TAU-2*g)/N;
 seq.forEach((o,j)=>o.phi=g+(j+.5)*step);
 gs.forEach((r,i)=>{const own=seq.map((o,j)=>o.area==i?j:-1).filter(j=>j>=0);r.a0=own.length?g+own[0]*step:0;r.a1=own.length?g+(own[own.length-1]+1)*step:0});
 RAD={cx:0,cz:-WR,R,WR,IR:Math.max(3.8,R*.5),g,seq,centre,open};return gs}
function radialBuild(areas){
 const {cx,cz,R,WR,IR,g,seq,centre,open}=RAD,Hh=open?3.4:Math.min(8,4.6+R*.12),rn=rnd(7);
 outsideGround();
 const fl=new T.Mesh(new T.CircleGeometry(WR,72),open?surf("concrete",0x486a38,WR*2/4,WR*2/4,{roughness:.95}):surf(KIND()[0],th.minor?0x2e3037:th.floor,WR*2/4,WR*2/4,{roughness:th.minor?.35:.5}));
 fl.rotation.x=-Math.PI/2;fl.position.set(cx,0,cz);fl.userData.floor=1;scene.add(fl);
 const wm=open?surf("plaster",0x35552b,WR*TAU/4,Hh/4):surf(KIND()[1],th.wall,WR*TAU/4,Hh/4);wm.side=T.DoubleSide;
 const wl=new T.Mesh(new T.CylinderGeometry(WR,WR,Hh,72,1,true,g,TAU-2*g),wm);wl.position.set(cx,Hh/2,cz);scene.add(wl);
 box(.3,3.4,.5,-(DOOR+.15),1.7,0,std(th.trim));box(.3,3.4,.5,DOOR+.15,1.7,0,std(th.trim));box(2*DOOR+.6,.7,.5,0,3.55,0,std(th.trim));
 if(open){
  const pv=new T.Mesh(new T.RingGeometry(IR*.45,R+.8,72),surf("plaster",0xb7ad98,R/3,R/3));pv.rotation.x=-Math.PI/2;pv.position.set(cx,.012,cz);pv.userData.floor=1;scene.add(pv);
  const sky=new T.Color(th.minor?0x0c1226:0x9cc2e0);scene.background=sky;scene.fog=new T.Fog(sky,18,80);
  const sun=new T.DirectionalLight(th.light,th.li*.9);sun.position.set(-12,16,10);scene.add(sun);
  for(let i=0;i<30;i++){const a=rn()*TAU,rr=WR+2+rn()*8;if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<g+.2)continue;
   const t=new T.Group(),tr=new T.Mesh(new T.CylinderGeometry(.15,.24,2.4),std(0x4a3a2a));tr.position.y=1.2;t.add(tr);
   const cn=new T.Mesh(new T.IcosahedronGeometry(1.5+rn()*.9,1),std([0x2f5a2a,0x3d6b32,0x56782f][i%3]));cn.position.y=3.3;t.add(cn);t.position.set(cx+rr*Math.sin(a),0,cz+rr*Math.cos(a));scene.add(t)}
 }else{
  const ce=new T.Mesh(new T.CircleGeometry(WR,72),surf("coffer",th.ceil,WR*2/2.5,WR*2/2.5));ce.rotation.x=Math.PI/2;ce.position.set(cx,Hh,cz);scene.add(ce);
  scene.fog.far=Math.max(36,WR*3.2);
  const pt=new T.PointLight(th.light,th.li*1.1,WR*2.6,1.4);pt.position.set(cx,Hh-.6,cz);scene.add(pt);
  if(WR>11)for(let i=0;i<4;i++){const l=new T.PointLight(th.light,th.li*.7,WR*1.6,1.5),a=i*Math.PI/2+Math.PI/4;l.position.set(cx+WR*.6*Math.sin(a),Hh-.8,cz+WR*.6*Math.cos(a));scene.add(l)}
 }
 // monument at the centre
 [[2.4,.22],[1.8,.44]].forEach(([r,h])=>{const s=new T.Mesh(new T.CylinderGeometry(r,r+.1,h,40),std(th.trim,{roughness:.5}));s.position.set(cx,h/2,cz);scene.add(s)});
 let cg;if(centre.type=="pedestal"||centre.type=="audio")cg=solid(centre,1);
 else{cg=new T.Group();const f=frameObj(centre,1);f.position.y=2.1;cg.add(f);const po=new T.Mesh(new T.CylinderGeometry(.05,.05,1.4),std(th.trim));po.position.y=.7;cg.add(po);cg.userData.item=centre}
 cg.position.set(cx,.44,cz);scene.add(cg);pool(cx,cz,6);OBS.push({x:cx,z:cz,r:1.9});focus[centre.id]={x:cx,z:cz+4.8,yaw:0,pitch:-.05};
 seq.forEach(o=>{const it=o.it,p=o.phi,s=Math.sin(p),c=Math.cos(p);
  if(isInner(o)){let q;
   if(it.type=="pedestal"||it.type=="audio")q=solid(it);
   else{q=new T.Group();const f=frameObj(it,o.big);f.position.y=2.1;q.add(f);const po=new T.Mesh(new T.CylinderGeometry(.05,.05,1.4),std(th.trim));po.position.y=.7;q.add(po);q.userData.item=it;q.rotation.y=p}
   q.position.set(cx+IR*s,0,cz+IR*c);scene.add(q);OBS.push({x:q.position.x,z:q.position.z,r:.8});pool(q.position.x,q.position.z,3.2);
   focus[it.id]={x:cx+(IR+3.4)*s,z:cz+(IR+3.4)*c,yaw:p,pitch:-.15}
  }else{const rr=open?R:WR-.1,q=frameObj(it);q.position.set(cx+rr*s,2.1,cz+rr*c);q.rotation.y=p+Math.PI;scene.add(q);
   if(open){const sl=new T.Mesh(new T.BoxGeometry(3,3.2,.25),std(th.trim,{roughness:.6}));sl.position.set(cx+(rr+.2)*s,1.7,cz+(rr+.2)*c);sl.rotation.y=p+Math.PI;scene.add(sl)}
   pool(cx+(rr-1.6)*s,cz+(rr-1.6)*c,3.4);focus[it.id]={x:cx+(rr-3.6)*s,z:cz+(rr-3.6)*c,yaw:p+Math.PI,pitch:0}}});
 areas.forEach((a,i)=>{const o=seq.find(x=>x.area==i);a.entry=focus[(o?o.it:a.hero).id]})
}
const RM={
 areaAt(x,z){const {cx,cz,WR,g}=RAD;if(z>.2)return -1;const dx=x-cx,dz=z-cz;if(Math.hypot(dx,dz)>WR+1)return -1;let a=Math.atan2(dx,dz);if(a<0)a+=TAU;
  for(let i=0;i<rooms.length;i++)if(a>=rooms[i].a0&&a<rooms[i].a1)return i;return a<g?0:rooms.length-1},
 entry(i){return(rooms[i]&&rooms[i].entry)||{x:0,z:-3,yaw:0}},
 route(fx,fz,x,z){return fz>.2&&z<.2?[[0,.5],[0,-1.5]]:[]},
 collide(ox,oz){const {cx,cz,WR}=RAD,lane=Math.abs(px)<DOOR-.15;
  if(oz>=.2&&!lane)pz=Math.max(pz,.2);
  if(pz>=.2){px=Math.max(-(WR+2),Math.min(WR+2,px));pz=Math.min(pz,14);if(!doorsOpen)pz=Math.max(pz,1.4)}
  else{const gap=lane&&pz>cz+WR-2,dx=px-cx,dz=pz-cz,d=Math.hypot(dx,dz),lim=WR-.6;if(!gap&&d>lim){px=cx+dx/d*lim;pz=cz+dz/d*lim}}
  obst()}
};
Object.assign(Spaces.rotunda,RM,{layout:d=>radialLayout(d,false),build:radialBuild});
Object.assign(Spaces.courtyard,RM,{layout:d=>radialLayout(d,true),build:radialBuild});
