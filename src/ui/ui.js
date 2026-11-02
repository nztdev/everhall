/* ===== 7. HUD, PANEL, SIMPLE VIEW ===== */
function btn(t,f){const b=document.createElement("button");b.textContent=t;b.onclick=f;return b}
function buildHud(){const h=$("#hud");h.innerHTML="";
 rooms.forEach((r,i)=>h.appendChild(btn(r.name,()=>walkTo(0,B[i]-3,0,0))));
 h.appendChild(btn("Theme: "+th.label,()=>{themeKey=themeKey=="gallery"?"noir":"gallery";build()}));
 h.appendChild(btn(muted?"Sound off":"Sound on",e=>{muted=!muted;if(master)master.gain.value=muted?0:.5;e.target.textContent=muted?"Sound off":"Sound on"}));
 if(!VISITOR)h.appendChild(btn("Edit",()=>{renderEd();ED.style.display="block"}));h.appendChild(btn("Simple view",()=>{$("#simple").style.display="block"}));if(VISITOR)h.appendChild(btn("Save a copy",saveCopy))}
function openItem(it){
 $("#ptag").textContent=it.type=="pedestal"?"Object":it.type=="text"?"Plaque":it.type=="audio"?"Listening post":it.type=="screen"?"Screening":"Wall piece";
 $("#ptitle").textContent=it.title;$("#pdate").textContent=it.date;$("#pcap").textContent=it.cap;$("#psrc").textContent="Source: "+SRC[it.src]+(it.credit?" · Photo: "+it.credit:"");
 $("#pbody").innerHTML=it.yt?`<div class="ph" style="padding:0;border:0"><iframe src="https://www.youtube-nocookie.com/embed/${it.yt}" allowfullscreen allow="encrypted-media;picture-in-picture" style="width:100%;height:100%;border:0;border-radius:8px"></iframe></div><a href="https://www.youtube.com/watch?v=${it.yt}" target="_blank" rel="noopener" style="color:var(--ac)">Open on YouTube ↗</a>`:it.img?`<img src="${IMG[it.img]}" alt="${it.title}" style="width:100%;max-height:40vh;object-fit:contain;border-radius:8px;margin:8px 0">`:"";
 $("#panel").classList.add("on");
 const f=focus[it.id];if(f)walkTo(f.x,f.z,f.yaw,f.pitch)}
$("#x").onclick=()=>{$("#panel").classList.remove("on");$("#pbody").innerHTML=""};
function simple(){const l=$("#slist");let s=`<button onclick="document.getElementById('simple').style.display='none'" style="position:fixed;top:14px;right:14px">Back to hall</button><h1 style="font-weight:400">${DATA.name}</h1><p>${DATA.sub}</p>`;
 derive(DATA).forEach(r=>{s+=`<h3>${r.name} <small>${r.range}</small></h3>`;r.items.forEach(i=>s+=`<p><b>${i.title}</b> <small>${i.date}</small><br>${i.cap}</p>`)});l.innerHTML=s}
simple();

