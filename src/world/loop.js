/* ===== 9. LOOP ===== */
let last=performance.now(),open=0;
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;
 let fw=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0),sd=(keys.d?1:0)-(keys.a?1:0);if(joy){fw-=joy.dy;sd+=joy.dx}
 if(keys.arrowleft)yaw+=dt*1.8;if(keys.arrowright)yaw-=dt*1.8;
 if((fw||sd)&&doorsOpen){path=[];yawT=null;const ox=px,oz=pz,sp=3.4*dt;
  px+=(-Math.sin(yaw)*fw+Math.cos(yaw)*sd)*sp;pz+=(-Math.cos(yaw)*fw-Math.sin(yaw)*sd)*sp;collide(ox,oz)}
 if(path.length){const [tx,tz]=path[0],dx=tx-px,dz=tz-pz,d=Math.hypot(dx,dz),st=4.2*dt;const ox=px,oz=pz;
  if(d<st){px=tx;pz=tz;path.shift()}else{px+=dx/d*st;pz+=dz/d*st}collide(ox,oz)}
 if(yawT!==null&&path.length<=1){let dy=yawT-yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));yaw+=dy*Math.min(1,dt*4);pitch+=(pitT-pitch)*Math.min(1,dt*4)}
 cam.position.set(px,1.65,pz);cam.rotation.set(pitch,yaw,0);
 if(doorsOpen&&open<1){open=Math.min(1,open+dt/2.4);const e=1-Math.pow(1-open,3);doors.forEach(d=>d.p.rotation.y=-d.sd*1.6*e)}
 spin.forEach(o=>{o.rotation.y+=dt*.7});
 screens.forEach(s=>{if(Math.hypot(s.g.position.x-px,s.g.position.z-pz)>14)return;const x=s.c.getContext("2d"),r=rnd(s.it.id);
  x.fillStyle="#08090c";x.fillRect(0,0,320,180);for(let i=0;i<9;i++){x.fillStyle=`hsl(${r()*360},60%,${35+Math.sin(t/600+i)*15}%)`;const w=40+r()*120;x.fillRect((r()*320+t/40*(i+1))%360-40,i*20,w,12)}
  x.fillStyle="#0009";x.beginPath();x.arc(160,90,28,0,7);x.fill();x.fillStyle="#fff";x.beginPath();x.moveTo(151,75);x.lineTo(151,105);x.lineTo(176,90);x.fill();s.tex.needsUpdate=true});
 const ri=roomAt(pz),r=rooms[ri];curRoom=ri;
 if(doorsOpen){$("#room").innerHTML=r?`<b>${r.name}</b><span>${r.range}</span>`:`<b>${DATA.name}</b><span>${DATA.sub}</span>`}
 if(AC)gains.forEach((g,i)=>g.gain.setTargetAtTime(i==ri?1:0,AC.currentTime,.8));
 R.render(scene,cam)}
