/* ===== 6. AUDIO (starts only after the Enter gesture) ===== */
let AC,master,oscs=[],gains=[],muted=false;
let curRoom=-1,tick=null;
function audioBuild(){
 oscs.forEach(o=>{try{o.stop()}catch(e){}});oscs=[];gains=[];clearInterval(tick);
 const sr=AC.sampleRate,len=sr*2.6,ir=AC.createBuffer(2,len,sr);
 for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
 const cvb=AC.createConvolver();cvb.buffer=ir;const wet=AC.createGain();wet.gain.value=.6;cvb.connect(wet);wet.connect(master);
 rooms.forEach(()=>{const g=AC.createGain();g.gain.value=0;g.connect(master);g.connect(cvb);gains.push(g)});
 const nb=AC.createBuffer(1,sr*2,sr),nd=nb.getChannelData(0);for(let i=0,l=0;i<nd.length;i++){l=(l+(Math.random()*2-1)*.04)/1.02;nd[i]=l*9}
 // room 0: slow sea swell
 const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;const lp=AC.createBiquadFilter();lp.frequency.value=500;const wg=AC.createGain();wg.gain.value=.1;
 const lf=AC.createOscillator();lf.frequency.value=.11;const lg=AC.createGain();lg.gain.value=.09;lf.connect(lg);lg.connect(wg.gain);ns.connect(lp);lp.connect(wg);wg.connect(gains[0]);ns.start();lf.start();oscs.push(ns,lf);
 const sc=th.minor?[0,3,5,7,10,12,15]:[0,2,4,7,9,12,14],hz=n=>th.base*2*Math.pow(2,n/12);
 function note(g,f,type,t,dur,vol){const o=AC.createOscillator(),v=AC.createGain();o.type=type;o.frequency.value=f;v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(vol,t+.02);v.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(v);v.connect(g);o.start(t);o.stop(t+dur+.1)}
 function kick(g,t){const o=AC.createOscillator(),v=AC.createGain();o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);v.gain.setValueAtTime(.5,t);v.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(v);v.connect(g);o.start(t);o.stop(t+.3)}
 function hat(g,t){const s=AC.createBufferSource();s.buffer=nb;const f=AC.createBiquadFilter();f.type="highpass";f.frequency.value=6000;const v=AC.createGain();v.gain.setValueAtTime(.12,t);v.gain.exponentialRampToValueAtTime(.001,t+.05);s.connect(f);f.connect(v);v.connect(g);s.start(t,Math.random());s.stop(t+.06)}
 let step=0,nxt=0;
 tick=setInterval(()=>{const i=curRoom;if(i<0||AC.state!="running")return;const t=AC.currentTime;if(nxt<t)nxt=t+.05;
  while(nxt<t+.3){const g=gains[i],k=i%3,r=Math.random;
   if(k==0){if(step%2==0||r()<.2)note(g,hz(sc[(r()*sc.length)|0]),"triangle",nxt,1.8,.2);if(step%12==0)note(g,hz(-12),"sine",nxt,7,.22);nxt+=.6}
   else if(k==1){const q=step%16;if(q%4==0){kick(g,nxt);}if(q%2)hat(g,nxt);if(q%8==0)note(g,hz(q<8?-12:-9),"triangle",nxt,1.2,.3);note(g,hz(sc[(step*3+(q>>2))%sc.length]+12),"square",nxt,.22,.04);nxt+=.19}
   else{if(step%2==0){const n=sc[(r()*sc.length)|0];note(g,hz(n+12),"sine",nxt,4,.14);note(g,hz(n+12)*2.01,"sine",nxt,2.5,.04)}if(step%10==0){[0,7,12].forEach(n=>note(g,hz(n-12),"triangle",nxt,6,.07))}nxt+=.85}
   step++}},100);
}
function startAudio(){try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:.5;master.connect(AC.destination);audioBuild()}catch(e){AC=null}}

