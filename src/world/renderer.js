/* ===== 4. RENDERER ===== */
const T=THREE,$=s=>document.querySelector(s);
const R=new T.WebGLRenderer({canvas:$("#c"),antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new T.Scene(),cam=new T.PerspectiveCamera(70,1,.1,90);cam.rotation.order="YXZ";
function size(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener("resize",size);size();
function rnd(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function cvs(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c}
function artTex(seed){const c=cvs(256,320),x=c.getContext("2d"),r=rnd(seed*9973+7),hue=r()*360;
 const g=x.createLinearGradient(0,0,256,320);g.addColorStop(0,`hsl(${hue},55%,28%)`);g.addColorStop(1,`hsl(${hue+50},60%,62%)`);x.fillStyle=g;x.fillRect(0,0,256,320);
 for(let i=0;i<14;i++){x.globalAlpha=.25+r()*.4;x.fillStyle=`hsl(${hue+r()*120},65%,${40+r()*35}%)`;x.beginPath();x.arc(r()*256,r()*320,10+r()*70,0,7);x.fill()}
 x.globalAlpha=.55;x.strokeStyle="#fff";x.lineWidth=2;for(let i=0;i<6;i++){x.beginPath();x.moveTo(r()*256,r()*320);x.bezierCurveTo(r()*256,r()*320,r()*256,r()*320,r()*256,r()*320);x.stroke()}
 return new T.CanvasTexture(c)}
function textTex(it){const c=cvs(300,220),x=c.getContext("2d");x.fillStyle="#f4efe6";x.fillRect(0,0,300,220);x.fillStyle="#2a2018";x.font="bold 20px Georgia";x.fillText(it.title,16,34);x.font="italic 16px Georgia";
 let y=64,l="";it.cap.split(" ").forEach(w=>{if(x.measureText(l+w).width>266){x.fillText(l,16,y);y+=22;l=""}l+=w+" "});x.fillText(l,16,y);return new T.CanvasTexture(c)}
function signTex(t,col){const c=cvs(512,96),x=c.getContext("2d");x.fillStyle="#120e0a";x.fillRect(0,0,512,96);x.fillStyle=col;x.textAlign="center";const s=t.toUpperCase().split("").join(" ");let f=40;x.font=f+"px Georgia";while(x.measureText(s).width>490&&f>12){f-=2;x.font=f+"px Georgia"}x.fillText(s,256,48+f/3);return new T.CanvasTexture(c)}
const std=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{}));
const MODELS={};const TEXC={};function imgTex(k){return TEXC[k]||(TEXC[k]=(()=>{const t=new T.TextureLoader().load(IMG[k]);t.anisotropy=4;return t})())}
const TC={},KIND=()=>themeKey=="gallery"?["wood","plaster"]:["concrete","panel"];
function baseTex(kind,hex){const key=kind+hex;if(TC[key])return TC[key];
 const c=cvs(512,512),x=c.getContext("2d"),r=rnd(kind.length*131+hex%997),k=new T.Color(hex);
 const sh=m=>`rgb(${Math.min(255,k.r*255*m)|0},${Math.min(255,k.g*255*m)|0},${Math.min(255,k.b*255*m)|0})`;
 x.fillStyle=sh(1);x.fillRect(0,0,512,512);
 if(kind=="wood"){for(let i=0;i<8;i++){const y=i*64;x.fillStyle=sh(.78+r()*.4);x.fillRect(0,y,512,63);
  for(let j=0;j<36;j++){x.strokeStyle=`rgba(0,0,0,${.03+r()*.08})`;x.beginPath();const yy=y+r()*62;x.moveTo(0,yy);x.bezierCurveTo(170,yy+r()*8-4,340,yy+r()*8-4,512,yy);x.stroke()}
  x.fillStyle="#0007";x.fillRect(0,y+62,512,2);x.fillRect((r()*500)|0,y,2,63)}}
 else{const n=kind=="concrete"?14000:7000;for(let i=0;i<n;i++){const a=.02+r()*.05;x.fillStyle=r()<.5?`rgba(0,0,0,${a})`:`rgba(255,255,255,${a})`;x.fillRect(r()*512,r()*512,1+r()*3,1+r()*3)}
  if(kind=="concrete")for(let i=0;i<25;i++){x.fillStyle=r()<.5?"rgba(0,0,0,.05)":"rgba(255,255,255,.04)";x.beginPath();x.arc(r()*512,r()*512,40+r()*50,0,7);x.fill()}
  if(kind=="panel")for(let i=0;i<4;i++){x.fillStyle="#000a";x.fillRect(i*128,0,4,512);x.fillStyle="#fff2";x.fillRect(i*128+4,0,2,512)}
  if(kind=="coffer"){x.fillStyle=sh(.8);x.fillRect(0,0,512,16);x.fillRect(0,0,16,512);x.fillStyle="#0003";x.fillRect(16,16,496,8);x.fillRect(16,16,8,496)}}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return TC[key]=t}
function surf(kind,hex,rw,rh,o){const t=baseTex(kind,hex).clone();t.needsUpdate=true;t.repeat.set(rw,rh);return new T.MeshStandardMaterial(Object.assign({map:t,bumpMap:t,bumpScale:.7,roughness:.85},o||{}))}
function wallMat(len,h){return surf(KIND()[1],th.wall,len/4,h/4)}
let PT;function pool(x,z,s){if(!PT){const c=cvs(128,128),g=c.getContext("2d"),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,"rgba(255,255,255,.9)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.fillRect(0,0,128,128);PT=new T.CanvasTexture(c)}
 const m=new T.Mesh(new T.PlaneGeometry(s,s),new T.MeshBasicMaterial({map:PT,color:th.light,transparent:true,opacity:.22,blending:T.AdditiveBlending,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.02,z);scene.add(m)}

