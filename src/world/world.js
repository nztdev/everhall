let OBS=[];
function outsideGround(){const og=new T.Mesh(new T.PlaneGeometry(40,30),std(th.floor,{color:0x1a1713}));og.rotation.x=-Math.PI/2;og.position.set(0,-.01,14);og.userData.floor=1;scene.add(og)}
/* ===== 5. WORLD BUILD ===== */
let rooms=[],B=[],screens=[],spin=[],doors=[],focus={},th,themeKey=DATA.theme,doorsOpen=false;
function box(w,h,d,x,y,z,mat){if(mat.userData.wall)mat=wallMat(Math.max(w,d),h);const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);scene.add(m);return m}
function frameObj(it,big){
 const g=new T.Group(),sc=it.type=="screen",tx=it.type=="text",k=big?1.25:1;let w=(sc?3.2:tx?1.5:1.6)*k,h=(sc?1.8:tx?1.1:2)*k;if(it.img){const a=it.ar,ww=a>=1?Math.min(2.9,2.1*a):2.1*a;w=ww*k;h=ww/a*k}
 let tex;
 if(sc){const c=cvs(320,180);tex=new T.CanvasTexture(c);screens.push({c,tex,it,g})}else tex=it.img?imgTex(it.img):tx?textTex(it):artTex(it.id);
 g.add(new T.Mesh(new T.BoxGeometry(w+.14,h+.14,.08),std(th.trim)));g.add(new T.Mesh(new T.BoxGeometry(w+.05,h+.05,.08),std(th.accent,{metalness:.8,roughness:.35})));
 const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex}));p.position.z=.045;g.add(p);
 g.userData.item=it;g.userData.h=h;return g}
function solid(it,hero){
 if(it.glb&&MODELS[it.glb]){const g=new T.Group(),pl=new T.Mesh(new T.CylinderGeometry(.7,.75,.5,32),std(th.trim,{roughness:.4}));pl.position.y=.25;g.add(pl);const m=MODELS[it.glb].clone(true);m.scale.setScalar(1.7/MODELS[it.glb].userData.h);m.position.y=.5;g.add(m);spin.push(m);g.userData.item=it;return g}
 const g=new T.Group(),s=hero?1.5:1;
 const pl=new T.Mesh(new T.CylinderGeometry(.35*s,.4*s,.9*s,24),std(th.trim,{roughness:.4}));pl.position.y=.45*s;g.add(pl);
 let geo,mat=std(th.accent,{metalness:.7,roughness:.25});
 if(it.type=="audio"){geo=new T.SphereGeometry(.28,24,16);mat=new T.MeshBasicMaterial({color:th.accent})}
 else geo=[new T.TorusKnotGeometry(.28*s,.09*s,64,10),new T.OctahedronGeometry(.34*s),new T.IcosahedronGeometry(.34*s)][it.id%3];
 const o=new T.Mesh(geo,mat);o.position.y=.9*s+.45;g.add(o);spin.push(o);g.userData.item=it;return g}
function build(){
 while(scene.children.length)scene.remove(scene.children[0]);
 screens=[];spin=[];doors=[];focus={};th=THEMES[themeKey];
 const SPC=SPACE();OBS=[];rooms=SPC.layout(DATA);
 scene.background=new T.Color(th.fog);scene.fog=new T.Fog(th.fog,7,36);
 scene.add(new T.HemisphereLight(th.light,th.floor,th.amb));
 SPC.build(rooms);
 // entrance doors + sign
 const dm=surf("wood",0x4a3524,.5,.8,{roughness:.45});
 [-1,1].forEach(sd=>{const p=new T.Group();p.position.set(sd*DOOR,0,0);const d=new T.Mesh(new T.BoxGeometry(DOOR,3.2,.12),dm);d.position.set(-sd*DOOR/2,1.6,0);p.add(d);
  const hd=new T.Mesh(new T.SphereGeometry(.07),std(th.accent,{metalness:.8,roughness:.3}));hd.position.set(-sd*(DOOR-.15),1.5,.1);p.add(hd);p.rotation.y=doorsOpen?-sd*1.6:0;scene.add(p);doors.push({p,sd})});
 const sg=new T.Mesh(new T.PlaneGeometry(4.4,.82),new T.MeshBasicMaterial({map:signTex(DATA.name,"#"+th.accent.toString(16).padStart(6,"0"))}));sg.position.set(0,3.85,.2);scene.add(sg);
 const wl=new T.PointLight(th.light,.9,16,1.5);wl.position.set(0,3,5);scene.add(wl);
 buildHud();
 if(AC)audioBuild();
}

