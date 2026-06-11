// ---------- Ember particle system ----------
const canvas = document.getElementById('embers');
const ctx = canvas.getContext('2d');
let w, h, embers = [];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function spawnEmber(){
  return {
    x: Math.random() * w,
    y: h + 10,
    r: Math.random() * 2.5 + 0.5,
    speed: Math.random() * 0.8 + 0.3,
    drift: (Math.random() - 0.5) * 0.6,
    life: 0,
    maxLife: Math.random() * 400 + 300,
    hue: Math.random() > 0.5 ? '255,93,46' : '255,179,71'
  };
}

const EMBER_COUNT = window.innerWidth < 700 ? 25 : 50;
for(let i=0;i<EMBER_COUNT;i++){
  const e = spawnEmber();
  e.y = Math.random() * h;
  e.life = Math.random() * e.maxLife;
  embers.push(e);
}

function tick(){
  ctx.clearRect(0,0,w,h);
  for(const e of embers){
    e.y -= e.speed;
    e.x += e.drift;
    e.life++;
    const fade = Math.min(1, (e.maxLife - e.life) / 60);
    const alpha = Math.max(0, fade) * 0.8;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${e.hue},${alpha})`;
    ctx.shadowColor = `rgba(${e.hue},0.8)`;
    ctx.shadowBlur = 6;
    ctx.fill();

    if(e.y < -10 || e.life > e.maxLife){
      Object.assign(e, spawnEmber());
    }
  }
  if(!reduceMotion) requestAnimationFrame(tick);
}
if(!reduceMotion) tick();
else ctx.clearRect(0,0,w,h);

// ---------- Vision audio player ----------
const audio = document.getElementById('bgAudio');
const toggle = document.getElementById('visionToggle');
const player = document.getElementById('visionPlayer');

toggle.addEventListener('click', () => {
  if(audio.paused){
    audio.play().then(() => {
      player.classList.add('playing');
    }).catch(() => {
      // Autoplay blocked or file missing — silently ignore
    });
  } else {
    audio.pause();
    player.classList.remove('playing');
  }
});
