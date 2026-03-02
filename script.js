(function(){
"use strict";

/* ── PARTICLES ── */
const canvas=document.getElementById('pcanvas');
const ctx=canvas.getContext('2d');
let particles=[];

function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}

class Particle{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.vx=(Math.random()-.5)*.6;
    this.vy=(Math.random()-.5)*.6;
    this.r=Math.random()*1.8+.4;
    this.a=Math.random()*.6+.1;
    this.col=Math.random()>.5?'10,108,245':'0,212,255';
  }
  update(){
    this.x+=this.vx;this.y+=this.vy;
    if(this.x<0||this.x>canvas.width)this.vx*=-1;
    if(this.y<0||this.y>canvas.height)this.vy*=-1;
  }
  draw(){
    ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${this.col},${this.a})`;ctx.fill();
  }
}

function connect(){
  const d=130;
  for(let i=0;i<particles.length;i++)
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<d){
        ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle=`rgba(10,108,245,${.15*(1-dist/d)})`;ctx.lineWidth=.6;ctx.stroke();
      }
    }
}

function init(){
  const n=Math.min(Math.floor(canvas.width*canvas.height/18000),90);
  particles=Array.from({length:n},()=>new Particle());
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw();});
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener('resize',()=>{resize();init();});
resize();init();animate();

/* ── CURSOR ── */
const dot=document.getElementById('cdot'),ring=document.getElementById('cring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  dot.style.left=mx+'px';dot.style.top=my+'px';
});
(function follow(){
  rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(follow);
})();
document.querySelectorAll('a,button,.sc,.pc,.wc').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.style.transform='translate(-50%,-50%) scale(2)';ring.style.borderColor='rgba(245,166,35,.8)';});
  el.addEventListener('mouseleave',()=>{dot.style.transform='translate(-50%,-50%) scale(1)';ring.style.borderColor='rgba(0,212,255,.5)';});
});

/* ── NAVBAR ── */
const nb=document.getElementById('navbar');
const ham=document.getElementById('ham');
const nl=document.getElementById('navLinks');
window.addEventListener('scroll',()=>nb.classList.toggle('scrolled',window.scrollY>60));
ham.addEventListener('click',()=>{ham.classList.toggle('open');nl.classList.toggle('open');document.body.style.overflow=nl.classList.contains('open')?'hidden':'';});
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');nl.classList.remove('open');document.body.style.overflow='';}));

/* ── REVEAL ── */
const revEls=document.querySelectorAll('.ru,.rl,.rr');
const revObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
revEls.forEach(el=>revObs.observe(el));

/* ── COUNTERS ── */
function animCount(el,target,dur=2000){
  let s=0;const step=target/(dur/16);
  const t=setInterval(()=>{
    s+=step;
    if(s>=target){el.textContent=target.toLocaleString();clearInterval(t);}
    else el.textContent=Math.floor(s).toLocaleString();
  },16);
}
const cObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!e.target.dataset.done){
      e.target.dataset.done=1;
      const t=parseInt(e.target.dataset.target||e.target.dataset.count,10);
      animCount(e.target,t);
    }
  });
},{threshold:.4});
document.querySelectorAll('.counter,.asnn').forEach(el=>cObs.observe(el));

/* ── TILT ── */
document.querySelectorAll('[data-tilt]').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    const rx2=((e.clientY-r.top-r.height/2)/r.height)*-8;
    const ry2=((e.clientX-r.left-r.width/2)/r.width)*8;
    c.style.transform=`translateY(-8px) perspective(600px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
  });
  c.addEventListener('mouseleave',()=>c.style.transform='');
});

/* ── PROJECT 3D ── */
document.querySelectorAll('.pc').forEach(c=>{
  c.addEventListener('mousemove',e=>{
    const r=c.getBoundingClientRect();
    const rx2=((e.clientY-r.top-r.height/2)/r.height)*-5;
    const ry2=((e.clientX-r.left-r.width/2)/r.width)*5;
    c.style.transform=`translateY(-8px) perspective(800px) rotateX(${rx2}deg) rotateY(${ry2}deg)`;
  });
  c.addEventListener('mouseleave',()=>c.style.transform='');
});

/* ── FORM ── */
const form=document.getElementById('cform');
const succ=document.getElementById('fsuccess');
form&&form.addEventListener('submit',e=>{
  e.preventDefault();
  const btn=form.querySelector('button[type=submit]');
  const orig=btn.innerHTML;
  btn.innerHTML='<span>Sending...</span><i class="fa fa-spinner fa-spin"></i>';
  btn.disabled=true;
  setTimeout(()=>{btn.innerHTML=orig;btn.disabled=false;succ.classList.add('show');form.reset();setTimeout(()=>succ.classList.remove('show'),5000);},1800);
});

/* ── BACK TOP ── */
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>btt.classList.toggle('show',window.scrollY>400));
btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* ── TICKER PAUSE ── */
const tt=document.getElementById('ttrack');
tt&&tt.addEventListener('mouseenter',()=>tt.style.animationPlayState='paused');
tt&&tt.addEventListener('mouseleave',()=>tt.style.animationPlayState='running');

/* ── GLITCH ── */
const gl=document.getElementById('glitchLine');
if(gl){
  const orig=gl.textContent;
  const chars='▓█▒░╔╗╝╚│─';
  let busy=false;
  function glitch(){
    if(busy)return;busy=true;let i=0;
    const iv=setInterval(()=>{
      gl.textContent=orig.split('').map((ch,idx)=>{
        if(idx<i)return orig[idx];
        if(ch===' ')return ' ';
        return chars[Math.floor(Math.random()*chars.length)];
      }).join('');
      if(i>=orig.length){clearInterval(iv);gl.textContent=orig;busy=false;}
      i+=1.2;
    },40);
  }
  setInterval(glitch,4500);
}

/* ── PARALLAX HERO ── */
const hv=document.querySelector('.hvisual');
const hs=document.getElementById('home');
if(hs&&hv){
  hs.addEventListener('mousemove',e=>{
    const r=hs.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    hv.style.transform=`translate(${dx*14}px,${dy*10}px)`;
  });
  hs.addEventListener('mouseleave',()=>hv.style.transform='');
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',function(e){
    const t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-72,behavior:'smooth'});}
  });
});

console.log('%c⚡ Unicellular Pvt Ltd — Built for the Future of Connectivity','color:#00d4ff;font-size:14px;font-weight:bold;');
})();