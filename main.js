'use strict';
var _yr=document.getElementById('yr');if(_yr)_yr.textContent=new Date().getFullYear();
(function(){
const seen=sessionStorage.getItem('bps-loaded')==='1';
const loader=document.getElementById('pl');
if(seen){loader.classList.add('done');return;}
sessionStorage.setItem('bps-loaded','1');
function buildLine(id,text){
const el=document.getElementById(id);
text.split('').forEach((c,i)=>{
const s=document.createElement('span');
s.className='pl-char'+(c===' '?' sp':'');
s.textContent=c===' '?'\u00a0':c;
s.style.transitionDelay=(i*0.038+0.18)+'s';
el.appendChild(s);
});}
buildLine('pl-l1','BALDEO PUBLIC');
buildLine('pl-l2','SCHOOL');
const bar=document.getElementById('pl-bar');
const pct=document.getElementById('pl-pct');
let prog=0;
const iv=setInterval(()=>{
prog+=Math.random()*18+6;
if(prog>=100){prog=100;clearInterval(iv);}
if(bar)bar.style.width=prog+'%';
if(pct)pct.textContent=Math.floor(prog)+'%';
},120);
setTimeout(()=>{
const pl=document.getElementById('pl');
if(pl)pl.classList.add('go');
},80);
setTimeout(()=>{
const pl=document.getElementById('pl');
if(pl)pl.classList.add('done');
},3200);
})();

(function(){
const isFine=window.matchMedia('(pointer:fine)').matches;
const isTouch='ontouchstart' in window;
const rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const W=window.innerWidth,H=window.innerHeight;
const canvas=document.getElementById('click-canvas');
if(!canvas)return;
const ctx=canvas.getContext('2d');
canvas.width=W;canvas.height=H;
const particles=[];
const PALS=[
['rgba(255,210,80,','rgba(255,160,30,','rgba(200,240,255,'],
['rgba(150,220,255,','rgba(80,180,255,','rgba(255,230,100,'],
['rgba(255,180,100,','rgba(255,140,60,','rgba(255,220,180,'],
];
function spawnClick(x,y,isT){
const pal=PALS[Math.floor(Math.random()*PALS.length)];
const now=performance.now();
particles.push({type:'glow',x,y,r:0,maxR:isT?38+Math.random()*18:80+Math.random()*60,alpha:isT?0.28:0.55,decay:isT?0.038:0.022,color:pal[0],born:now});
if(!isT)particles.push({type:'ring',x,y,r:0,maxR:120+Math.random()*80,alpha:0.35,decay:0.016,lw:1.2,color:pal[1],born:now});
if(!isT)particles.push({type:'ring',x,y,r:6,maxR:90+Math.random()*50,alpha:0.22,decay:0.02,lw:0.7,color:pal[2],born:now,offset:{x:1.5,y:-1}});
const count=isT?Math.floor(4+Math.random()*3):Math.floor(8+Math.random()*6);
for(let i=0;i<count;i++){
const angle=(Math.PI*2/count)*i+Math.random()*.4;
const speed=isT?1+Math.random()*1.4:1.8+Math.random()*2.8;
const size=isT?1+Math.random()*1.2:1.5+Math.random()*2.5;
particles.push({type:'dot',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,alpha:isT?0.5:0.9,decay:isT?0.055+Math.random()*.02:0.028+Math.random()*.018,size,color:pal[Math.floor(Math.random()*3)],born:now});}
if(!isT){
const streaks=Math.floor(4+Math.random()*3);
for(let i=0;i<streaks;i++){
const angle=(Math.PI*2/streaks)*i+Math.random()*.6;
const len=18+Math.random()*28;
const speed=1.4+Math.random()*1.8;
particles.push({type:'streak',x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,len,alpha:0.6,decay:0.024,color:pal[0],born:now});}}}
let rafId;
function render(){
rafId=requestAnimationFrame(render);
ctx.clearRect(0,0,W,H);
if(!particles.length)return;
let i=particles.length;
while(i--){
const p=particles[i];
if(p.alpha<=0.01){particles.splice(i,1);continue;}
ctx.save();ctx.globalCompositeOperation='screen';
if(p.type==='glow'){
const progress=Math.min(1,(performance.now()-p.born)/180);
p.r=p.maxR*progress;
const grad=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
grad.addColorStop(0,p.color+(p.alpha*.9)+')');
grad.addColorStop(0.35,p.color+(p.alpha*.45)+')');
grad.addColorStop(1,p.color+'0)');
ctx.fillStyle=grad;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();p.alpha-=p.decay;}
else if(p.type==='ring'){
const progress=Math.min(1,(performance.now()-p.born)/220);
p.r=p.maxR*Math.pow(progress,0.6);
const ox=p.offset?p.offset.x:0,oy=p.offset?p.offset.y:0;
ctx.strokeStyle=p.color+p.alpha+')';ctx.lineWidth=p.lw*(1-progress*.4);
ctx.shadowColor=p.color+(p.alpha*.6)+')';ctx.shadowBlur=8;
ctx.beginPath();ctx.arc(p.x+ox,p.y+oy,Math.max(1,p.r),0,Math.PI*2);ctx.stroke();p.alpha-=p.decay;}
else if(p.type==='dot'){
p.x+=p.vx;p.y+=p.vy;p.vx*=0.91;p.vy*=0.91;
ctx.shadowColor=p.color+(p.alpha*.8)+')';ctx.shadowBlur=6;
ctx.fillStyle=p.color+p.alpha+')';
ctx.beginPath();ctx.arc(p.x,p.y,p.size*(p.alpha/.9),0,Math.PI*2);ctx.fill();p.alpha-=p.decay;}
else if(p.type==='streak'){
p.x+=p.vx;p.y+=p.vy;p.vx*=0.88;p.vy*=0.88;
const tx=p.x-p.vx*p.len*.55,ty=p.y-p.vy*p.len*.55;
const grad=ctx.createLinearGradient(tx,ty,p.x,p.y);
grad.addColorStop(0,p.color+'0)');grad.addColorStop(1,p.color+p.alpha+')');
ctx.strokeStyle=grad;ctx.lineWidth=1.2*p.alpha;
ctx.shadowColor=p.color+(p.alpha*.5)+')';ctx.shadowBlur=4;ctx.lineCap='round';
ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(p.x,p.y);ctx.stroke();p.alpha-=p.decay;}
ctx.restore();}}
render();
if(isFine&&!rm){
const dot=document.getElementById('cur-dot');
const ring=document.getElementById('cur-ring');
const lbl=document.getElementById('cur-lbl');
let dx=0,dy=0,rx=0,ry=0;
dot.style.left='0';dot.style.top='0';
ring.style.left='0';ring.style.top='0';
window.addEventListener('pointermove',e=>{
dx=e.clientX;dy=e.clientY;
dot.style.transform=`translate3d(calc(${dx}px - 50%),calc(${dy}px - 50%),0)`;
},{passive:true});
(function lr(){
rx+=(dx-rx)*.11;ry+=(dy-ry)*.11;
ring.style.transform=`translate3d(calc(${rx}px - 50%),calc(${ry}px - 50%),0)`;
requestAnimationFrame(lr);})();
document.addEventListener('mouseover',e=>{
const el=e.target.closest('a,button,[data-cursor]');
if(!el)return;ring.classList.add('exp');lbl.textContent=el.dataset.cursor||'Open';});
document.addEventListener('mouseout',e=>{
const el=e.target.closest('a,button,[data-cursor]');
if(!el)return;if(e.relatedTarget&&el.contains(e.relatedTarget))return;
ring.classList.remove('exp');lbl.textContent='';});
window.addEventListener('pointerdown',()=>{dot.classList.add('press');ring.classList.add('press');},{passive:true});
window.addEventListener('pointerup',()=>{dot.classList.remove('press');ring.classList.remove('press');},{passive:true});}
if(rm)return;
function fireAt(x,y,isT){isT?spawnClick(x,y,true):spawnClick(x,y,false);}
window.addEventListener('click',e=>{if(!isTouch)fireAt(e.clientX,e.clientY,false);},{passive:true});
window.addEventListener('touchstart',e=>{for(let t of e.changedTouches)fireAt(t.clientX,t.clientY,true);},{passive:true});
})();

const SECS=[{id:'hero',l:'Welcome'},{id:'about',l:'About'},{id:'mission-vision',l:'Vision'},{id:'academics',l:'Academ.'},{id:'facilities',l:'Facility'},{id:'transport',l:'Transport'},{id:'student-life',l:'Life'},{id:'admissions',l:'Admit'},{id:'contact',l:'Contact'}];
const dw=document.getElementById('sp-dots');
if(dw){SECS.forEach(s=>{const a=document.createElement('a');a.href='#'+s.id;a.className='sp-row';a.dataset.id=s.id;a.innerHTML=`<span class="sp-dot"></span><span class="sp-lbl">${s.l}</span>`;dw.appendChild(a);});}
let aid='hero';
function upSec(id){
if(id===aid)return;aid=id;
const idx=SECS.findIndex(s=>s.id===id);
document.querySelectorAll('.sp-row').forEach(r=>r.classList.toggle('act',r.dataset.id===id));
const ct=document.getElementById('sp-ct');if(ct)ct.textContent=String(idx+1).padStart(2,'0')+'/'+SECS.length;
const ml=document.getElementById('mp-lbl');if(ml)ml.textContent=SECS[idx]?.l||'';
const mc=document.getElementById('mp-ct');if(mc)mc.textContent=String(idx+1).padStart(2,'0')+'/'+SECS.length;
const mf=document.getElementById('mp-fill');if(mf)mf.style.width=((idx+1)/SECS.length*100)+'%';}
const io1=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)upSec(x.target.id);}),{threshold:.55});
const io2=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)upSec(x.target.id);}),{rootMargin:'-45% 0px -45% 0px',threshold:0});
SECS.forEach(s=>{const el=document.getElementById(s.id);if(el){io1.observe(el);io2.observe(el);}});

let mo=false;
const hamBtn=document.getElementById('ham');
if(hamBtn)hamBtn.addEventListener('click',()=>{mo=!mo;document.getElementById('mob').classList.toggle('open',mo);hamBtn.textContent=mo?'x':'=';});
function cm(){mo=false;const mob=document.getElementById('mob');if(mob)mob.classList.remove('open');if(hamBtn)hamBtn.textContent='=';}
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();cm();t.scrollIntoView({behavior:'smooth'});});});

(function(){
function init(){
const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const targets=Array.from(document.querySelectorAll('.sec h1,.sec h2,.sec h3,.sec h4'));
if(!targets.length)return;
function makeTextFragment(text,state){
const frag=document.createDocumentFragment();
text.split(/(\s+)/).forEach(part=>{
if(!part)return;
if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
const word=document.createElement('span');word.className='morph-word';
Array.from(part).forEach(char=>{
const span=document.createElement('span');span.className='morph-char';span.textContent=char;
span.style.transitionDelay=Math.min(state.i*0.018,1.05)+'s';state.i++;word.appendChild(span);});
frag.appendChild(word);});return frag;}
function cloneMorph(node,state){
const frag=document.createDocumentFragment();
node.childNodes.forEach(child=>{
if(child.nodeType===Node.TEXT_NODE)frag.appendChild(makeTextFragment(child.textContent,state));
else if(child.nodeType===Node.ELEMENT_NODE){
if(child.tagName==='BR')frag.appendChild(document.createElement('br'));
else{const clone=child.cloneNode(false);clone.appendChild(cloneMorph(child,state));frag.appendChild(clone);}}});
return frag;}
targets.forEach(heading=>{
if(heading.dataset.morphed==='1')return;
const label=heading.textContent.replace(/\s+/g,' ').trim();
const state={i:0};
const visual=document.createElement('span');visual.className='morph-visual';visual.setAttribute('aria-hidden','true');
visual.appendChild(cloneMorph(heading,state));
heading.innerHTML='';heading.appendChild(visual);
if(label)heading.setAttribute('aria-label',label);
heading.dataset.morphed='1';heading.classList.add('morph-ready');
if(reduce)heading.classList.add('morph-visible');});
if(reduce)return;
function revealHeading(el){
const preloader=document.getElementById('pl');
const heroDelay=preloader&&!preloader.classList.contains('done')?2850:650;
const delay=el.classList.contains('ht')?heroDelay:90;
setTimeout(()=>el.classList.add('morph-visible'),delay);}
const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;revealHeading(entry.target);io.unobserve(entry.target);});},{threshold:.18,rootMargin:'0px 0px -10% 0px'});
targets.forEach(heading=>io.observe(heading));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('v');ro.unobserve(x.target);}}),{threshold:.08});
document.querySelectorAll('.rev').forEach(el=>ro.observe(el));

document.querySelectorAll('.dc').forEach(c=>{
c.addEventListener('pointermove',e=>{
if(e.pointerType!=='mouse')return;
const r=c.getBoundingClientRect();
const x=e.clientX-r.left,y=e.clientY-r.top;
const ry2=((x/r.width)-.5)*10,rx2=-((y/r.height)-.5)*8;
c.style.setProperty('--mx',(x/r.width*100)+'%');c.style.setProperty('--my',(y/r.height*100)+'%');
c.style.transform=`perspective(900px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;});
c.addEventListener('pointerleave',()=>{
c.style.transition='transform .7s cubic-bezier(0.16,1,0.3,1)';
c.style.transform='perspective(900px) rotateX(0) rotateY(0)';
setTimeout(()=>c.style.transition='',700);});});

(function(){
const sw=document.getElementById('sw');if(!sw)return;
const cs=sw.querySelectorAll('.sc');
let _cardTick=false;
window.addEventListener('scroll',()=>{
if(_cardTick)return;_cardTick=true;
requestAnimationFrame(()=>{
_cardTick=false;
const r=sw.getBoundingClientRect();
const p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+sw.offsetHeight)));
cs.forEach((c,i)=>{if(i===0)return;c.style.transform=`translateY(${i*-22*p}px) scale(${1-i*.025*p})`;});});
},{passive:true});})();

const fsBtn=document.getElementById('fs');
if(fsBtn)fsBtn.addEventListener('click',()=>{
const name=document.getElementById('fn').value.trim();
const ph=document.getElementById('fp').value.replace(/\D/g,'');
const cls=document.getElementById('fc').value;
const msg=document.getElementById('fm').value.trim();
const err=document.getElementById('fe');
function se(m){err.textContent=m;err.style.display='block';err.className='adm-fer';}
if(name.length<2){se('Please enter your name.');return;}
if(ph.length<10){se('Please enter a valid 10-digit phone number.');return;}
if(!cls){se('Please select the class you are applying for.');return;}
err.style.display='none';
const WA='919720513100';
const t=encodeURIComponent(`*Admission Enquiry — Baldeo Public School, Mathura*\n\nParent/Guardian: ${name}\nPhone: ${document.getElementById('fp').value}\nClass Seeking Admission: ${cls}\n\nMessage:\n${msg||'I would like to enquire about admission details and schedule a campus visit.'}`);
window.open(`https://wa.me/${WA}?text=${t}`,'_blank','noopener,noreferrer');});

(function(){
const canvas=document.getElementById('hc');
if(!canvas||typeof THREE==='undefined')return;
const mob=innerWidth<768;
const rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2('#0D0C0A',mob?.06:.04);
const cam=new THREE.PerspectiveCamera(56,innerWidth/innerHeight,.1,100);
cam.position.z=mob?9:7.4;
const ren=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
ren.setPixelRatio(Math.min(devicePixelRatio,1.5));
ren.setSize(innerWidth,innerHeight);
ren.setClearColor(0x0D0C0A,0);
ren.shadowMap.enabled=false;
const cnt=rm?150:mob?400:1000;
const p=new Float32Array(cnt*3),b=new Float32Array(cnt*3),c=new Float32Array(cnt*3);
const cGold=new THREE.Color('#D97706'),cBlue=new THREE.Color('#0066CC'),cCream=new THREE.Color('#F59E0B');
for(let i=0;i<cnt;i++){
const t=i/Math.max(1,cnt-1),ln=(i%5)-2;
const r=1.3+ln*.16+Math.sin(t*14)*.14;
const a=t*Math.PI*20+ln*.45;
const x=Math.cos(a)*r+(Math.random()-.5)*.25;
const y=(t-.5)*7+Math.sin(a*1.2)*.15;
const z=Math.sin(a)*r+ln*.28+(Math.random()-.5)*.25;
b[i*3]=p[i*3]=x;b[i*3+1]=p[i*3+1]=y;b[i*3+2]=p[i*3+2]=z;
const mix=t;const col=new THREE.Color().lerpColors(cGold,t<.5?cBlue:cCream,Math.abs(ln)/2.5);
c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b;}
const geo=new THREE.BufferGeometry();
geo.setAttribute('position',new THREE.BufferAttribute(p,3));
geo.setAttribute('color',new THREE.BufferAttribute(c,3));
const mat=new THREE.PointsMaterial({size:mob?.028:.022,vertexColors:true,transparent:true,opacity:.85,sizeAttenuation:true,depthWrite:false});
const pts=new THREE.Points(geo,mat);scene.add(pts);
let animId,t2=0;
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(animId);else loop();});
function loop(){
animId=requestAnimationFrame(loop);
t2+=rm?.002:.004;
const pos=geo.attributes.position;
for(let i=0;i<cnt;i++){
const base_y=b[i*3+1];
pos.array[i*3+1]=base_y+Math.sin(t2*1.1+i*.08)*.045;
pos.array[i*3]=b[i*3]+Math.cos(t2*.7+i*.05)*.022;}
pos.needsUpdate=true;
pts.rotation.y=t2*.12;pts.rotation.x=Math.sin(t2*.18)*.06;
cam.position.x=Math.sin(t2*.09)*.3;cam.position.y=Math.cos(t2*.07)*.18;
cam.lookAt(0,0,0);ren.render(scene,cam);}
loop();
window.addEventListener('resize',()=>{
cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();
ren.setSize(innerWidth,innerHeight);},{passive:true});
})();

(function(){
var rm=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
if(rm)return;
var MORPH_T=1.5,COOLDOWN_T=0.7;
var SETS={
hero:['Where Knowledge Becomes Light.','Excellence Through Values.','Shaping Future Leaders.','Rooted in Braj. Built for the World.','Every Child. Every Dream.','Learning That Lasts a Lifetime.'],
about:['Founded with Grace. Built with Purpose.','22 Years of Excellence in Braj.','Education Beyond Boundaries.','Every Child Belongs Here.','A Campus of Warmth and Wisdom.'],
mission:['Recognise. Nurture. Achieve.','Minds that Question. Hearts that Care.','Intelligence with Integrity.','Justice, Love and Peace.','Rooted in Values. Ready for the World.']};
function morpher(id1,id2,texts){
var el1=document.getElementById(id1),el2=document.getElementById(id2);
if(!el1||!el2)return;
var idx=0,morph=0,cooldown=COOLDOWN_T,lastT=null;
el1.textContent=texts[0];el2.textContent=texts[1%texts.length];
el1.style.opacity='1';el1.style.filter='none';el2.style.opacity='0';el2.style.filter='blur(8px)';
var _morphVisible=true;
if(typeof IntersectionObserver!=='undefined'){
var _mIO=new IntersectionObserver(function(e){_morphVisible=e[0].isIntersecting;},{threshold:0});
_mIO.observe(el1.closest('section')||el1);}
function setMorph(f){
var b2=Math.min(8/f-8,100);el2.style.filter='blur('+b2+'px)';el2.style.opacity=Math.pow(f,.4)+'';
var inv=1-f,b1=Math.min(8/inv-8,100);el1.style.filter='blur('+b1+'px)';el1.style.opacity=Math.pow(inv,.4)+'';
el1.textContent=texts[idx%texts.length];el2.textContent=texts[(idx+1)%texts.length];}
function tick(now){
requestAnimationFrame(tick);
if(!_morphVisible)return;
if(lastT===null){lastT=now;return;}
var dt=(now-lastT)/1000;lastT=now;cooldown-=dt;
if(cooldown<=0){morph-=cooldown;cooldown=0;var f=morph/MORPH_T;
if(f>1){cooldown=COOLDOWN_T;f=1;}setMorph(f);if(f===1)idx++;}
else{morph=0;el2.style.filter='none';el2.style.opacity='1';el1.style.filter='none';el1.style.opacity='0';}}
requestAnimationFrame(tick);}
morpher('mh1','mh2',SETS.hero);morpher('ma1','ma2',SETS.about);morpher('mm1','mm2',SETS.mission);
})();

(function(){
var reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var paras=Array.from(document.querySelectorAll('.sec p'));
if(!paras.length)return;
paras.forEach(function(p){
if(p.dataset.pBlurred==='1')return;
var frag=document.createDocumentFragment(),charIdx=0;
p.childNodes.forEach(function(node){
if(node.nodeType===Node.TEXT_NODE){
node.textContent.split(/(\s+)/).forEach(function(part){
if(!part)return;
if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));}
else{var span=document.createElement('span');span.className='p-blur-word';span.textContent=part;
span.style.transitionDelay=Math.min(charIdx*0.042+(Math.random()-.5)*0.03,1.2)+'s';charIdx++;frag.appendChild(span);}});}
else if(node.nodeType===Node.ELEMENT_NODE){
if(node.tagName==='BR')frag.appendChild(document.createElement('br'));
else{var clone=node.cloneNode(false);
(node.textContent||'').split(/(\s+)/).forEach(function(part){
if(!part)return;
if(/^\s+$/.test(part))clone.appendChild(document.createTextNode(part));
else{var s=document.createElement('span');s.className='p-blur-word';s.textContent=part;
s.style.transitionDelay=Math.min(charIdx*0.042,1.2)+'s';charIdx++;clone.appendChild(s);}});
frag.appendChild(clone);}}});
p.innerHTML='';p.appendChild(frag);p.dataset.pBlurred='1';p.classList.add('p-blur-ready');
if(reduce)p.classList.add('p-blur-visible');});
if(reduce)return;
var io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;setTimeout(function(){entry.target.classList.add('p-blur-visible');},120);io.unobserve(entry.target);});},{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
paras.forEach(function(p){io.observe(p);});
})();

var _tf2=document.getElementById('tf-year2');if(_tf2)_tf2.textContent=new Date().getFullYear();