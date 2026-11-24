/* Space catalogue: pure data, ordered from small and simple to large and open.
   min..rec = pieces the space holds well; max = beyond this it feels crowded. Builders attach in gallery.js / radial.js. */
const ic=p=>`<svg viewBox="0 0 48 48">${p}</svg>`;
const Spaces={
 cabinet:{id:"cabinet",name:"The Cabinet",tier:1,min:1,rec:8,max:10,desc:"One small, intimate room. A few pieces, shown with care.",
  icon:ic('<rect x="11" y="11" width="26" height="26" rx="2"/><circle cx="24" cy="24" r="3"/>')},
 rotunda:{id:"rotunda",name:"The Rotunda",tier:2,min:6,rec:24,max:32,desc:"One round hall: a monument at the centre and the story around the wall.",
  icon:ic('<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="3"/><path d="M20 41h8"/>')},
 gallery:{id:"gallery",name:"The Gallery",tier:3,min:9,rec:36,max:48,desc:"A walk through chapter rooms, each with its own centrepiece.",
  icon:ic('<rect x="3" y="17" width="11" height="14"/><rect x="18.500" y="17" width="11" height="14"/><rect x="34" y="17" width="11" height="14"/><path d="M14 24h4.500M29.500 24H34"/>')},
 courtyard:{id:"courtyard",name:"The Courtyard",tier:4,min:16,rec:60,max:72,desc:"An open-air garden of monuments and stelae under the sky.",
  icon:ic('<circle cx="24" cy="24" r="18" stroke-dasharray="3 3"/><circle cx="24" cy="24" r="3"/><circle cx="24" cy="10" r="1.500"/><circle cx="36" cy="30" r="1.500"/><circle cx="12" cy="30" r="1.500"/>')}
};
const spaceList=()=>["cabinet","rotunda","gallery","courtyard"].map(k=>Spaces[k]);
const spaceFit=n=>spaceList().find(s=>n<=s.rec)||Spaces.courtyard;
