/* ================================================
   FORGEFIT — app.js
   ================================================ */


let selectedGoal='cut',rateLevel=2;

const _PAGE_MAP = {
  home: 'index.html',
  goals: 'diet-goals.html',
  plans: 'diet-plans.html',
  about: 'about.html',
  score: 'forge-score.html'
};

function showPage(p) {
  const dest = _PAGE_MAP[p];
  if (!dest) return;
  // If already on this page, just scroll to top
  if (window.location.pathname.endsWith(dest) || (p === 'home' && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')))) {
    window.scrollTo({top:0, behavior:'smooth'});
    return;
  }
  window.location.href = dest;
}

function toggleMenu(){
  let m=document.querySelector('.mobile-menu');
  if(!m){
    m=document.createElement('div');
    m.className='mobile-menu';
    m.innerHTML=`
      <a href="index.html">Home</a>
      <a href="diet-goals.html">Diet Goals</a>
      <a href="diet-plans.html">Diet Plans</a>
      <a href="about.html">About Us</a>
      <a href="forge-score.html" style="color:var(--cyan)">⚡ Forge Score</a>
    `;
    document.querySelector('.navbar').after(m);
  }
  m.classList.toggle('open');
}

function selectGoal(btn,goal){
  document.querySelectorAll('.goal-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');selectedGoal=goal;
  document.getElementById('rateGroup').style.display=(goal==='maintain')?'none':'block';
}

function updateRate(input){
  rateLevel=parseInt(input.value);
  const d=document.getElementById('rateDisplay');if(!d)return;
  const r={cut:['Slow: -250 kcal/day','Moderate: -500 kcal/day','Aggressive: -750 kcal/day'],bulk:['Slow: +150 kcal/day','Moderate: +300 kcal/day','Aggressive: +500 kcal/day'],recomp:['Slow: ±100 kcal','Moderate: ±150 kcal','Aggressive: ±200 kcal'],maintain:['Maintaining TDEE','Maintaining TDEE','Maintaining TDEE']};
  d.textContent=(r[selectedGoal]||r.cut)[rateLevel-1];
}

function calculate(){
  const age=parseFloat(document.getElementById('age').value);
  const sex=document.getElementById('sex').value;
  const wR=parseFloat(document.getElementById('weight').value);
  const wU=document.getElementById('weightUnit').value;
  const hR=parseFloat(document.getElementById('height').value);
  const hU=document.getElementById('heightUnit').value;
  const act=parseFloat(document.getElementById('activity').value);
  const bfR=document.getElementById('bodyFat').value;
  const bf=bfR?parseFloat(bfR):null;
  if(!age||!wR||!hR||isNaN(age)||isNaN(wR)||isNaN(hR)){shakeForm();return;}
  const wKg=wU==='lbs'?wR*0.453592:wR;
  const hCm=hU==='in'?hR*2.54:hR;
  let bmr;
  if(bf!==null&&!isNaN(bf)){const lm=wKg*(1-bf/100);bmr=370+(21.6*lm);}
  else{bmr=sex==='male'?(10*wKg)+(6.25*hCm)-(5*age)+5:(10*wKg)+(6.25*hCm)-(5*age)-161;}
  const tdee=Math.round(bmr*act);bmr=Math.round(bmr);
  const sm={cut:[-250,-500,-750],bulk:[150,300,500],maintain:[0,0,0],recomp:[-100,-150,-200]};
  const delta=sm[selectedGoal][rateLevel-1]||0;
  const tc=tdee+delta;
  let pR,cR,fR;
  if(selectedGoal==='cut'){pR=.4;cR=.35;fR=.25;}
  else if(selectedGoal==='bulk'){pR=.3;cR=.5;fR=.2;}
  else if(selectedGoal==='recomp'){pR=.4;cR=.4;fR=.2;}
  else{pR=.3;cR=.45;fR=.25;}
  const pG=Math.round(tc*pR/4),cG=Math.round(tc*cR/4),fG=Math.round(tc*fR/9);
  const hM=hCm/100,bmi=(wKg/(hM*hM)).toFixed(1);
  document.getElementById('targetCal').textContent=tc.toLocaleString();
  document.getElementById('bmrVal').textContent=bmr.toLocaleString()+' kcal';
  document.getElementById('tdeeVal').textContent=tdee.toLocaleString()+' kcal';
  document.getElementById('deltaVal').textContent=(delta>=0?'+':'')+delta+' kcal';
  setTimeout(()=>{
    document.getElementById('proteinBar').style.width=(pR*100)+'%';
    document.getElementById('carbsBar').style.width=(cR*100)+'%';
    document.getElementById('fatsBar').style.width=(fR*100)+'%';
  },100);
  document.getElementById('proteinG').textContent=pG+'g';
  document.getElementById('carbsG').textContent=cG+'g';
  document.getElementById('fatsG').textContent=fG+'g';
  const tips=genTips(selectedGoal,bmi,bf,wKg,rateLevel,sex);
  document.getElementById('tipsList').innerHTML=tips.map(t=>`<div class="tip-item">${t}</div>`).join('');
  const wkly=Math.abs(delta*7/7700),tot=(wkly*12).toFixed(1);
  document.getElementById('projStart').textContent=wKg.toFixed(1)+' kg';
  document.getElementById('projEnd').textContent=(selectedGoal==='cut'?(wKg-tot).toFixed(1):selectedGoal==='bulk'?(wKg+parseFloat(tot)).toFixed(1):wKg.toFixed(1))+' kg';
  document.getElementById('projNote').textContent=selectedGoal==='maintain'||selectedGoal==='recomp'?'Weight stable — body composition improves over time':`Projected change: ${selectedGoal==='cut'?'-':'+'}${tot} kg in 12 weeks`;
  updateBMI(bmi);
  document.getElementById('resultsPlaceholder').classList.add('hidden');
  document.getElementById('resultsContent').classList.remove('hidden');
}

function genTips(goal,bmi,bf,w,rate,sex){
  const t=[];const b=parseFloat(bmi);
  if(goal==='cut'){t.push('🥩 Keep protein at 2.2–2.8g/kg to preserve muscle in the deficit.');t.push('🏋️ Maintain resistance training 3–4x/week — lifting prevents muscle loss.');t.push('💧 Drink 3–4L of water daily — hunger is often dehydration.');t.push('🌙 Prioritize 7–9 hours of sleep — cortisol from poor sleep promotes fat storage.');}
  else if(goal==='bulk'){t.push('🍗 Spread protein across 4–6 meals — maximizes muscle protein synthesis.');t.push('💪 Progressive overload is essential: increase weight/reps weekly.');t.push('🍠 Front-load carbs around training for optimal performance.');t.push('😴 Sleep is anabolic — aim for 8+ hours during a bulk.');}
  else if(goal==='maintain'){t.push('📊 Weigh weekly and adjust calories ±100 to stay on target.');t.push('🥦 Focus on food quality — micronutrients support performance.');t.push('🔁 Great time to focus on building strength slowly.');t.push('📈 Consider carb cycling: more on training days, less on rest.');}
  else{t.push('⏱️ Patience is key — recomposition is slower than dedicated cycles.');t.push('🍚 Eat more on training days, less on rest days.');t.push('💪 Protein non-negotiable — hit 2.5g/kg minimum every day.');t.push('📉 Works best for beginners or those with moderate body fat (15–25%).');}
  return t.slice(0,4);
}

function updateBMI(bmi){
  const ind=document.getElementById('bmiIndicator');const lbl=document.getElementById('bmiLabel');
  if(!ind)return;const b=parseFloat(bmi);let p;
  if(b<18.5)p=Math.min(22,(b/18.5)*22);
  else if(b<25)p=25+((b-18.5)/6.5)*23;
  else if(b<30)p=50+((b-25)/5)*23;
  else p=Math.min(96,75+((b-30)/10)*20);
  ind.style.left=p+'%';lbl.textContent='BMI '+bmi;
}

function shakeForm(){
  const btn=document.querySelector('.calc-form-panel .btn-primary');if(!btn)return;
  btn.style.transform='translateX(-8px)';setTimeout(()=>btn.style.transform='translateX(8px)',80);setTimeout(()=>btn.style.transform='translateX(-4px)',160);setTimeout(()=>btn.style.transform='translateX(0)',240);
  ['age','weight','height'].forEach(id=>{const el=document.getElementById(id);if(el&&!el.value){el.style.borderColor='#f97316';setTimeout(()=>el.style.borderColor='',2000);}});
}

function filterPlans(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  document.querySelectorAll('.plan-card').forEach(c=>{c.classList.toggle('hidden',cat!=='all'&&c.dataset.category!==cat);});
}

function togglePlan(btn){
  const m=btn.nextElementSibling;if(!m)return;
  m.classList.toggle('hidden');btn.textContent=m.classList.contains('hidden')?'Sample Meal Day ↓':'Hide Meal Day ↑';
}

function toggleFaq(item){
  const a=item.querySelector('.faq-a'),t=item.querySelector('.faq-toggle');if(!a)return;
  const open=a.classList.contains('open');
  document.querySelectorAll('.faq-a').forEach(x=>x.classList.remove('open'));
  document.querySelectorAll('.faq-toggle').forEach(x=>x.textContent='+');
  if(!open){a.classList.add('open');t.textContent='−';}
}

function submitContact(){
  const ins=document.querySelectorAll('.cf-input,.cf-textarea');let ok=true;
  ins.forEach(i=>{if(!i.value.trim()){i.style.borderColor='#f97316';setTimeout(()=>i.style.borderColor='',2000);ok=false;}});
  if(!ok)return;
  const btn=document.querySelector('.contact-section .btn-primary');btn.textContent='Sending...';
  setTimeout(()=>{btn.style.display='none';document.getElementById('contactSuccess').classList.remove('hidden');ins.forEach(i=>i.value='');},1200);
}

// PARTICLES
(function(){
  const c=document.createElement('canvas');c.id='particles-canvas';document.body.prepend(c);
  const ctx=c.getContext('2d');
  let W=c.width=window.innerWidth,H=c.height=window.innerHeight;
  const ps=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,o:Math.random()*.5+.1}));
  function draw(){
    ctx.clearRect(0,0,W,H);
    ps.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(96,165,250,${p.o})`;ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;});
    for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const dx=ps[i].x-ps[j].x,dy=ps[i].y-ps[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.beginPath();ctx.moveTo(ps[i].x,ps[i].y);ctx.lineTo(ps[j].x,ps[j].y);ctx.strokeStyle=`rgba(59,130,246,${.06*(1-d/120)})`;ctx.lineWidth=.5;ctx.stroke();}}
    requestAnimationFrame(draw);
  }
  draw();window.addEventListener('resize',()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;});
})();

// CURSOR
(function(){
  const dot=document.createElement('div');dot.className='cursor-dot';
  const ring=document.createElement('div');ring.className='cursor-ring';
  document.body.append(dot,ring);
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function tick(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(tick);})();
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.plan-card,.feature-card')){ring.style.transform='translate(-50%,-50%) scale(2)';ring.style.opacity='.5';}});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.plan-card,.feature-card')){ring.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='1';}});
})();

// NAVBAR SCROLL
window.addEventListener('scroll',()=>{document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);});

// SCROLL ANIMS
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.15});
document.querySelectorAll('.anim-ready').forEach(el=>obs.observe(el));

// RATE INIT
updateRate(document.getElementById('rateSlider'));

// ============================================================
//  FORGE SCORE ENGINE
// ============================================================
let lastCalcData = null;

function computeForgeScore(data) {
  let scores = {};
  // 1. Calorie Alignment (0-25)
  const surplus = Math.abs(data.delta);
  if (data.goal === 'maintain') scores.calorie = surplus < 100 ? 25 : surplus < 200 ? 20 : 12;
  else if (data.goal === 'cut') scores.calorie = surplus >= 250 && surplus <= 600 ? 25 : surplus < 250 ? 15 : surplus <= 750 ? 20 : 10;
  else if (data.goal === 'bulk') scores.calorie = surplus >= 150 && surplus <= 400 ? 25 : surplus < 150 ? 15 : surplus <= 600 ? 20 : 8;
  else scores.calorie = 20;

  // 2. Macro Balance (0-25)
  const pRatio = data.pR, cRatio = data.cR, fRatio = data.fR;
  const idealP = data.goal === 'cut' ? 0.40 : data.goal === 'bulk' ? 0.30 : 0.35;
  const pDiff = Math.abs(pRatio - idealP);
  scores.macro = pDiff < 0.02 ? 25 : pDiff < 0.05 ? 21 : pDiff < 0.10 ? 16 : 10;

  // 3. Activity Level (0-25)
  const actMap = { '1.2': 10, '1.375': 16, '1.55': 20, '1.725': 24, '1.9': 25 };
  scores.activity = actMap[String(data.activity)] || 18;
  if (data.goal === 'cut' && data.activity >= 1.55) scores.activity = Math.min(25, scores.activity + 2);
  if (data.goal === 'bulk' && data.activity >= 1.55) scores.activity = Math.min(25, scores.activity + 2);

  // 4. Body Composition (0-25)
  const bmi = data.bmi;
  if (bmi >= 18.5 && bmi <= 24.9) scores.body = 25;
  else if (bmi >= 17 && bmi < 18.5) scores.body = 18;
  else if (bmi >= 25 && bmi <= 27) scores.body = 20;
  else if (bmi > 27 && bmi <= 30) scores.body = 14;
  else if (bmi > 30) scores.body = 8;
  else scores.body = 12;
  if (data.bf && data.bf > 0) {
    const idealBf = data.sex === 'male' ? 15 : 23;
    const bfDiff = Math.abs(data.bf - idealBf);
    scores.body = bfDiff < 3 ? 25 : bfDiff < 8 ? 20 : bfDiff < 15 ? 14 : 8;
  }

  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  return { total, scores };
}

function animateGauge(score) {
  const fill = document.getElementById('gaugeFill');
  const numEl = document.getElementById('gaugeNum');
  const gradeEl = document.getElementById('gaugeGrade');
  const arcLen = 377;
  const offset = arcLen - (score / 100) * arcLen;

  fill.style.strokeDashoffset = offset;
  // Color by score
  if (score >= 80) fill.style.stroke = 'url(#gaugeGrad)';
  else if (score >= 60) { fill.style.stroke = '#3b82f6'; }
  else if (score >= 40) { fill.style.stroke = '#eab308'; }
  else { fill.style.stroke = '#ef4444'; }

  // Animate number
  let current = 0;
  const step = score / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, score);
    numEl.textContent = Math.round(current);
    if (current >= score) clearInterval(timer);
  }, 16);

  // Grade
  const grades = [[90,'ELITE'],[80,'ADVANCED'],[65,'SOLID'],[50,'BUILDING'],[35,'BEGINNER'],[0,'LOCKED']];
  const grade = grades.find(([min]) => score >= min);
  gradeEl.textContent = grade ? grade[1] : 'LOCKED';
}

function animatePillar(id, score, max, desc) {
  document.getElementById('ps-' + id).textContent = score + '/' + max;
  const pct = (score / max) * 100;
  setTimeout(() => {
    const bar = document.getElementById('pb-' + id);
    bar.style.width = pct + '%';
    if (pct > 80) bar.style.background = 'linear-gradient(90deg,#3b82f6,#06b6d4)';
    else if (pct > 55) bar.style.background = 'linear-gradient(90deg,#1d4ed8,#3b82f6)';
    else if (pct > 35) bar.style.background = 'linear-gradient(90deg,#ca8a04,#eab308)';
    else bar.style.background = 'linear-gradient(90deg,#b91c1c,#ef4444)';
  }, 200);
  document.getElementById('pd-' + id).textContent = desc;
}

function buildRecommendations(data, scores) {
  const recs = [];
  if (scores.calorie < 18) recs.push({ priority: 'high', title: 'Adjust Calories', body: data.goal === 'cut' ? 'Your deficit may be too aggressive. A 300–500 kcal deficit is optimal for muscle preservation.' : 'Your surplus may be too large. Aim for 200–350 kcal above TDEE for lean gains.' });
  if (scores.macro < 18) recs.push({ priority: 'high', title: 'Fix Your Protein', body: 'Protein should be 35–40% of calories when cutting, 28–32% when bulking. Adjust macros for better results.' });
  if (scores.activity < 18) recs.push({ priority: 'med', title: 'Increase Activity', body: 'Bump training to 4–5 sessions/week. More frequent lifting preserves muscle and boosts TDEE.' });
  if (scores.body < 18) recs.push({ priority: 'med', title: 'Phase Change Recommended', body: data.bmi > 27 ? 'Your BMI suggests cutting before bulking will improve hormonal environment for muscle growth.' : 'Your BMI is low. Focus on building a solid base before cutting.' });
  if (scores.calorie >= 22) recs.push({ priority: 'low', title: 'Calorie Target ✓', body: 'Your calorie target is dialed in. Stay consistent and weigh yourself weekly to confirm progression.' });
  if (scores.macro >= 22) recs.push({ priority: 'low', title: 'Macros Optimized ✓', body: 'Great macro split! Focus on hitting protein targets every day — consistency beats perfection.' });
  if (recs.length === 0) recs.push({ priority: 'low', title: 'Outstanding!', body: 'Your plan is nearly perfect. Focus on execution — track weekly weight, sleep 8hrs, and stay consistent.' });

  return recs.slice(0, 3);
}

function renderForgeScore() {
  if (!lastCalcData) {
    document.getElementById('gaugeNum').textContent = '--';
    document.getElementById('gaugeGrade').textContent = 'CALCULATE FIRST';
    document.getElementById('verdictIcon').textContent = '🔒';
    document.getElementById('verdictText').textContent = 'Head to Diet Goals, enter your stats, and hit Calculate to unlock your Forge Score.';
    return;
  }

  const { total, scores } = computeForgeScore(lastCalcData);
  animateGauge(total);

  const descs = {
    calorie: scores.calorie >= 22 ? 'Your calorie target aligns perfectly with your goal.' : scores.calorie >= 16 ? 'Calorie target is close but could be refined.' : 'Calorie target needs adjustment for your goal.',
    macro: scores.macro >= 22 ? 'Excellent macro distribution for your goal.' : scores.macro >= 16 ? 'Macros are good — consider bumping protein slightly.' : 'Macro split needs work. Prioritize protein.',
    activity: scores.activity >= 22 ? 'Activity level strongly supports your goal.' : scores.activity >= 16 ? 'Good activity — consider adding one more session/week.' : 'Activity level is below optimal for your goal.',
    body: scores.body >= 22 ? 'Your body composition is well-positioned for your goal.' : scores.body >= 16 ? 'Body composition is in range — keep progressing.' : 'Body composition could be optimized — consider a different phase.'
  };

  setTimeout(() => {
    animatePillar('calorie', scores.calorie, 25, descs.calorie);
    animatePillar('macro', scores.macro, 25, descs.macro);
    animatePillar('activity', scores.activity, 25, descs.activity);
    animatePillar('body', scores.body, 25, descs.body);
  }, 300);

  const verdicts = [
    [85, '🏆', 'Elite-level plan. Your nutrition strategy is optimized. Focus on execution and progressive overload.'],
    [70, "⚡", "Strong plan. A few tweaks and you'll be at elite level. Check the priority actions below."],
    [50, '🔥', 'Solid foundation. Address the highlighted areas to accelerate your progress significantly.'],
    [30, "🌱", "You're building. The recommendations below will have a big impact on your results."],
    [0, '⚠️', 'Your plan needs work. Follow the priority actions — small changes will make a big difference.']
  ];
  const v = verdicts.find(([min]) => total >= min);
  document.getElementById('verdictIcon').textContent = v[1];
  document.getElementById('verdictText').textContent = v[2];

  const recs = buildRecommendations(lastCalcData, scores);
  document.getElementById('scoreRecs').style.display = 'block';
  document.getElementById('recsGrid').innerHTML = recs.map(r =>
    `<div class="rec-card anim-ready"><div class="rec-priority ${r.priority}">${r.priority.toUpperCase()}</div><div class="rec-title">${r.title}</div><div class="rec-body">${r.body}</div></div>`
  ).join('');
  document.querySelectorAll('.rec-card.anim-ready').forEach((el,i) => setTimeout(() => el.classList.add('visible'), i * 100));
}

// ============================================================
//  WEEKLY TRACKER (localStorage)
// ============================================================
function logWeek() {
  const w = parseFloat(document.getElementById('trackWeight').value);
  const e = parseInt(document.getElementById('trackEnergy').value);
  const s = parseInt(document.getElementById('trackSessions').value);
  const n = document.getElementById('trackNote').value.trim();
  if (!w || !e || !s) { alert('Please fill in weight, energy, and sessions.'); return; }
  const entries = JSON.parse(localStorage.getItem('ff_log') || '[]');
  const week = entries.length + 1;
  entries.push({ week, weight: w, energy: e, sessions: s, note: n, date: new Date().toLocaleDateString() });
  localStorage.setItem('ff_log', JSON.stringify(entries));
  document.getElementById('trackWeight').value = '';
  document.getElementById('trackEnergy').value = '';
  document.getElementById('trackSessions').value = '';
  document.getElementById('trackNote').value = '';
  renderLog();
}

function deleteEntry(idx) {
  const entries = JSON.parse(localStorage.getItem('ff_log') || '[]');
  entries.splice(idx, 1);
  entries.forEach((e, i) => e.week = i + 1);
  localStorage.setItem('ff_log', JSON.stringify(entries));
  renderLog();
}

function renderLog() {
  const entries = JSON.parse(localStorage.getItem('ff_log') || '[]');
  const container = document.getElementById('logEntries');
  if (!entries.length) { container.innerHTML = ''; drawWeightChart([]); return; }
  container.innerHTML = [...entries].reverse().map((e, ri) => {
    const i = entries.length - 1 - ri;
    return `<div class="log-entry">
      <div class="log-week">WEEK ${e.week}<br/><span style="font-size:10px;color:var(--text-muted)">${e.date}</span></div>
      <div class="log-stats">
        <div class="log-stat"><span class="log-stat-val">${e.weight}</span><span class="log-stat-label">kg</span></div>
        <div class="log-stat"><span class="log-stat-val">${e.energy}/10</span><span class="log-stat-label">energy</span></div>
        <div class="log-stat"><span class="log-stat-val">${e.sessions}x</span><span class="log-stat-label">sessions</span></div>
        ${e.note ? `<div class="log-note">"${e.note}"</div>` : ''}
      </div>
      <button class="log-delete" onclick="deleteEntry(${i})">× DEL</button>
    </div>`;
  }).join('');
  drawWeightChart(entries);
}

function drawWeightChart(entries) {
  const canvas = document.getElementById('weightChart');
  const empty = document.getElementById('chartEmpty');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (entries.length < 2) { ctx.clearRect(0,0,canvas.width,canvas.height); empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  const W = canvas.offsetWidth || 300, H = 150;
  canvas.width = W; canvas.height = H;
  ctx.clearRect(0,0,W,H);
  const weights = entries.map(e=>e.weight);
  const mn = Math.min(...weights) - 1, mx = Math.max(...weights) + 1;
  const pts = weights.map((w,i) => ({ x: (i/(weights.length-1))*(W-40)+20, y: H-20 - ((w-mn)/(mx-mn))*(H-40) }));
  // Grid
  ctx.strokeStyle = 'rgba(59,130,246,0.06)'; ctx.lineWidth = 1;
  for(let i=0;i<4;i++){const y=20+i*(H-40)/3;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Gradient fill
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,'rgba(59,130,246,0.2)'); grad.addColorStop(1,'rgba(59,130,246,0)');
  ctx.beginPath(); ctx.moveTo(pts[0].x,H-20);
  pts.forEach(p=>ctx.lineTo(p.x,p.y));
  ctx.lineTo(pts[pts.length-1].x,H-20); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  // Line
  ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.stroke();
  // Dots
  pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#06b6d4';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();});
  // Labels
  ctx.fillStyle='rgba(107,141,176,0.8)'; ctx.font='10px JetBrains Mono,monospace';
  entries.forEach((e,i)=>{ctx.fillText('W'+e.week,pts[i].x-8,H-4);});
}

// ============================================================
//  LIVE CALORIE BURN TICKER
// ============================================================
let tickerBMR = 0, tickerStart = null;

function startTicker(bmr) {
  tickerBMR = bmr; tickerStart = Date.now();
  const ticker = document.getElementById('calorieTicker');
  if (!ticker) return;
  ticker.style.display = 'block';
  function update() {
    if (!tickerBMR) return;
    const elapsed = (Date.now() - tickerStart) / 1000;
    const burned = (tickerBMR / 86400) * elapsed;
    document.getElementById('tickerNum').textContent = burned.toFixed(1);
    requestAnimationFrame(update);
  }
  update();
}

// ============================================================
//  RIPPLE EFFECT
// ============================================================
document.addEventListener('click', e => {
  const r = document.createElement('div');
  r.className = 'ripple-wave';
  const size = 80;
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX}px;top:${e.clientY}px;`;
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 700);
});

// ============================================================
//  MAGNETIC BUTTONS
// ============================================================
function initMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============================================================
//  TYPEWRITER EFFECT (hero sub)
// ============================================================
function initTypewriter() {
  const el = document.querySelector('.hero-sub');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);
  let i = 0;
  const type = () => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 28 + Math.random() * 18);
    } else {
      setTimeout(() => cursor.remove(), 2000);
    }
  };
  setTimeout(type, 1000);
}

// ============================================================
//  ANIMATED STAT COUNTERS
// ============================================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const num = parseFloat(raw.replace(/[^0-9.]/g,''));
      const suffix = raw.replace(/[0-9.]/g,'');
      if (isNaN(num)) return;
      let start = 0, duration = 1500, step = num / (duration / 16);
      const tick = () => {
        start = Math.min(start + step, num);
        el.textContent = (Number.isInteger(num) ? Math.round(start) : start.toFixed(1)) + suffix;
        if (start < num) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

// ============================================================
//  PARALLAX ORB MOUSE TRACKING
// ============================================================
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.orb');
  document.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.forEach((orb, i) => {
      const depth = [25, 15, 10][i] || 10;
      orb.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
    });
  });
}

// ============================================================
//  RETURNING USER BADGE
// ============================================================
function checkReturning() {
  const last = localStorage.getItem('ff_last_visit');
  const badge = document.getElementById('returningBadge');
  if (last && badge) {
    badge.style.display = 'block';
    badge.textContent = '👋 Welcome back, Athlete';
    setTimeout(() => { badge.style.opacity='0'; badge.style.transition='opacity 0.5s'; setTimeout(()=>badge.style.display='none',500); }, 4000);
  }
  localStorage.setItem('ff_last_visit', Date.now());
}

// ============================================================
//  PATCH calculate() TO SAVE DATA + TRIGGER TICKER
// ============================================================
const _originalCalc = calculate;
calculate = function() {
  _originalCalc();
  const res = document.getElementById('resultsContent');
  if (!res || res.classList.contains('hidden')) return;

  const wKg = document.getElementById('weightUnit').value === 'lbs'
    ? parseFloat(document.getElementById('weight').value) * 0.453592
    : parseFloat(document.getElementById('weight').value);
  const hCm = document.getElementById('heightUnit').value === 'in'
    ? parseFloat(document.getElementById('height').value) * 2.54
    : parseFloat(document.getElementById('height').value);
  const hM = hCm / 100;
  const bmi = parseFloat((wKg / (hM * hM)).toFixed(1));
  const bf = document.getElementById('bodyFat').value ? parseFloat(document.getElementById('bodyFat').value) : null;
  const act = parseFloat(document.getElementById('activity').value);
  const bmrText = document.getElementById('bmrVal').textContent;
  const bmr = parseInt(bmrText.replace(/[^0-9]/g,''));
  const deltaText = document.getElementById('deltaVal').textContent;
  const sign = deltaText.startsWith('-') ? -1 : 1; const delta = sign * parseInt(deltaText.replace(/[^0-9]/g,'')) || 0;
  const pR = selectedGoal==='cut'?.4:selectedGoal==='bulk'?.3:selectedGoal==='recomp'?.4:.3;
  const cR = selectedGoal==='cut'?.35:selectedGoal==='bulk'?.5:selectedGoal==='recomp'?.4:.45;
  const fR = 1 - pR - cR;

  lastCalcData = { goal: selectedGoal, bmi, bf, activity: act, delta, pR, cR, fR, sex: document.getElementById('sex').value };
  localStorage.setItem('ff_last_calc', JSON.stringify(lastCalcData));

  startTicker(bmr);
  initMagnetic();
};

// ============================================================
//  PATCH showPage() TO RENDER SCORE ON VISIT
// ============================================================
// On forge-score page, auto-render on load
if (window.location.pathname.includes('forge-score')) {
  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('ff_last_calc');
    if (saved && !lastCalcData) lastCalcData = JSON.parse(saved);
    setTimeout(renderForgeScore, 200);
    renderLog();
  });
}

// ============================================================
//  INIT ALL NEW FEATURES
// ============================================================
initTypewriter();
initCounters();
initParallaxOrbs();
checkReturning();
initMagnetic();
renderLog();

// Ticker DOM element injection
(function(){
  const t = document.createElement('div');
  t.id = 'calorieTicker';
  t.innerHTML = '<span class="ticker-label">CALORIES BURNED SINCE OPEN</span><span class="ticker-num" id="tickerNum">0.0</span><span class="ticker-unit"> kcal</span>';
  t.title = 'Based on your BMR. Click to dismiss.';
  t.onclick = () => t.style.display='none';
  document.body.appendChild(t);
  // Restore if calc was saved
  const saved = localStorage.getItem('ff_last_calc');
  if (saved) {
    lastCalcData = JSON.parse(saved);
    const d = lastCalcData;
    let bmr;
    if (d.bf) { const lm = (d.activity||70) * (1 - d.bf/100); bmr = 370 + 21.6*lm; }
    // fallback — just start ticker from page-load perspective using a generic estimate
  }
})();

// Returning badge DOM
(function(){
  const b = document.createElement('div');
  b.id = 'returningBadge';
  document.body.appendChild(b);
  checkReturning();
})();

