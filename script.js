const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      if(entry.target.classList.contains('metric')) entry.target.classList.add('visible');
    }
  });
},{threshold:.16});

$$('.reveal,.metric').forEach(el=>observer.observe(el));

const phones = $$('.phone');
const words = $$('.giant-word');
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  phones.forEach((p,i)=>{
    const rect=p.parentElement.getBoundingClientRect();
    const progress=Math.max(-1,Math.min(1,(window.innerHeight/2-rect.top)/window.innerHeight));
    const depth=Number(p.dataset.depth||.2);
    p.style.transform=`translateY(${progress*120*depth}px) rotateY(${(i?1:-1)*progress*8}deg)`;
  });
  words.forEach(w=>{
    const r=w.parentElement.getBoundingClientRect();
    const speed=Number(w.dataset.parallax||.12);
    w.style.transform=`translateX(-50%) translateY(${(window.innerHeight/2-r.top)*speed}px)`;
  });
},{passive:true});

$$('.choice').forEach(btn=>{
  btn.addEventListener('click',()=>{
    $$('.choice').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    const name=btn.dataset.choice;
    $('#choiceResult').textContent = name==='GALAXY'
      ? 'You picked the power-user route. Welcome to Ultra mode.'
      : 'You picked the ecosystem route. Clean, controlled, connected.';
  });
});

let audioCtx, oscillator, gain, playing=false;
$('#soundBtn').addEventListener('click',()=>{
  if(!audioCtx){
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    oscillator=audioCtx.createOscillator();
    gain=audioCtx.createGain();
    oscillator.type='sine'; oscillator.frequency.value=55; gain.gain.value=.015;
    oscillator.connect(gain).connect(audioCtx.destination); oscillator.start();
  }
  playing=!playing;
  gain.gain.value=playing?.015:0;
  $('#soundBtn').textContent=playing?'◼':'♪';
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}
  });
});
