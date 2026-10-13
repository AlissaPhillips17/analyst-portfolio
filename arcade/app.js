'use strict';
const repo='https://github.com/AlissaPhillips17/analyst-portfolio/tree/main/projects/';
const missions=[
 {label:'MISSION 01 / MEASUREMENT',title:'Five events. One misleading metric.',scenario:'The dashboard reports three purchases, but the order system confirms only two completed orders. These are the full relevant events. Find the counting defect before the team reports conversion.',path:'event-quality',hint:'Event IDs are unique. Compare the order IDs: a distinct event is not necessarily a distinct purchase.',question:'What should the analyst change?',options:[['remove','Remove every purchase event with a revenue value.'],['deduplicate','Count each completed order once, even when purchase fires twice.'],['event_id','Use distinct event_id; that will remove duplicate purchases.']],evidence:`<div class="source-label"><span>CLIENT EVENTS · CHECKOUT</span><span>ORDER SYSTEM: O-101 + O-102 COMPLETED</span></div><div class="table-wrap"><table><caption class="sr-only">Five synthetic checkout events</caption><thead><tr><th>EVENT ID</th><th>EVENT</th><th>SESSION</th><th>ORDER</th></tr></thead><tbody><tr><td>evt_001</td><td>page_view</td><td>s_01</td><td>—</td></tr><tr><td>evt_002</td><td>purchase</td><td>s_01</td><td>O-101</td></tr><tr class="duplicate"><td>evt_003</td><td>purchase</td><td>s_01</td><td>O-101</td></tr><tr><td>evt_004</td><td>page_view</td><td>s_02</td><td>—</td></tr><tr><td>evt_005</td><td>purchase</td><td>s_02</td><td>O-102</td></tr></tbody></table></div><p class="table-note">Each row is a separate emitted event. Both orders are valid; no order is refunded.</p>`,explanation:'O-101 appears in two purchase events with different event IDs. Counting purchase events yields 3; counting distinct completed orders yields 2. For session conversion, count each session with at least one completed order once, then divide by eligible sessions. Correct the metric and investigate why the event fired twice.',takeaway:'Define the grain before writing the query. Events, orders, and converted sessions are different units.',incorrect:'Look again at O-101. A retry or duplicate trigger can create a new event ID for the same order. Removing revenue-bearing events loses valid purchases; counting distinct event IDs still counts all three.'},
 {label:'MISSION 02 / EXPERIMENTATION',title:'The lift looks good. Would you launch?',scenario:'A fixed-horizon test of a redesigned checkout is complete. Assignment and instrumentation checks passed. Conversion improved, but the revenue guardrail has only a point estimate. Choose the next decision.',path:'experimentation',hint:'Evidence for a conversion improvement does not establish that every guardrail is safe. What still needs validation?',question:'What is the most defensible next step?',options:[['ship','Launch to everyone now; the conversion interval is above zero.'],['reject','Reject the change because any uncertainty makes the result unusable.'],['validate','Validate revenue uncertainty and refund impact, then consider a staged rollout.']],evidence:`<div class="metrics"><div class="metric"><div class="metric-label">CONTROL · 10,000 VISITORS</div><div class="metric-value">7.80<span>% conversion</span></div><div class="metric-sub">780 converted · $6.24 revenue / visitor</div></div><div class="metric"><div class="metric-label">VARIANT · 10,100 VISITORS</div><div class="metric-value">8.90<span>% conversion</span></div><div class="metric-sub">899 converted · $6.51 revenue / visitor</div></div></div><div class="bar-chart" role="img" aria-label="Conversion: control 7.8 percent; variant 8.9 percent."><div class="bar"><span>CONTROL</span></div><div class="bar variant"><span>VARIANT</span></div></div><div class="lift"><strong>+1.10 percentage points</strong> absolute conversion lift<br>Approximate 95% interval: +0.34 to +1.87 percentage points.</div><div class="guardrail"><strong>Still open</strong><br>Revenue uncertainty and refund impact have not been evaluated.</div>`,explanation:'The interval supports a positive conversion effect under the stated test assumptions. It does not provide a revenue uncertainty interval or tell us what happens after refunds. Validate the guardrail with suitable visitor-level revenue data and a completed refund window; if acceptable, a staged rollout with monitoring is a reasonable next step.',takeaway:'Statistical evidence answers a metric question. A rollout decision also depends on business guardrails.',incorrect:'The conversion result is useful, but it is not a complete launch decision. Revenue per visitor rose as a point estimate; its uncertainty and refund impact remain unknown. Validate those before choosing rollout scope.'},
 {label:'MISSION 03 / AI REQUIREMENTS',title:'A confident draft. Two critical gaps.',scenario:'An AI assistant drafted a measurement specification. Before engineering builds it, review the metric definition and payload. Choose the two implementation blockers. This is a simulated draft, not a live model response.',path:'ai-requirements',hint:'Can two analysts calculate the same rate? Can the payload actually provide the identity field the spec requires?',question:'Select the two gaps that must be resolved.',multi:true,options:[['naming','The event name must be changed; snake_case is invalid.'],['denominator','The conversion denominator is undefined.'],['identity','The required anonymous_id is absent from the sample payload.'],['timestamp','The event timestamp needs a UTC timezone marker.']],evidence:`<pre class="spec" aria-label="Simulated AI draft"><span class="spec-comment">// Draft measurement contract</span>
event_name: "checkout_cta_clicked"
identity_key: "anonymous_id"
primary_metric:
  numerator: "sessions with completed orders"
  denominator: <span class="warning">"TBD"</span>
example_payload:
  event_id: "evt_demo_001"
  session_id: "session_demo_001"
  event_ts_utc: "2026-01-01T00:00:00Z"
  cta_variant: "variant_b"</pre>`,explanation:'“TBD” leaves the rate undefined: all assigned visitors, cart sessions, and CTA clickers produce different denominators. The contract also requires anonymous_id, but the example payload omits it. Clarify the eligible population and make the identity requirement consistent with the payload before implementation. The name already uses snake_case, and Z already marks UTC.',takeaway:'A structured draft can still be incomplete. Validate its meaning, required fields, and feasibility before approval.',incorrect:'Check the two mismatches between the stated contract and usable data. The denominator is TBD, and the payload lacks anonymous_id. The event name follows the intended convention, and the timestamp already includes Z for UTC.'}
];
const content=document.getElementById('mission-content');
const feedback=document.getElementById('feedback');
let active=0, selected=[];
let completed=[];
try {completed=LabLogic.cleanProgress(JSON.parse(localStorage.getItem('alissa-lab-progress-v1')||'[]'));} catch(e) {completed=[];}
function updateProgress(){
 document.getElementById('progress-label').textContent=`${completed.length} / 3 missions explored`;
 document.getElementById('progress-fill').style.width=`${completed.length/3*100}%`;
 document.getElementById('finish').hidden=completed.length!==3;
 document.querySelectorAll('.mission-tab').forEach((tab,i)=>{
  tab.classList.toggle('active',i===active);tab.classList.toggle('complete',completed.includes(i));tab.setAttribute('aria-pressed',String(i===active));tab.querySelector('.mission-mark').textContent=completed.includes(i)?'✓':'↗';
 });
}
function render(mission){
 active=mission;selected=[];const m=missions[active];
 document.getElementById('mission-label').textContent=m.label;
 document.getElementById('code-link').href=repo+m.path;
 document.getElementById('hint').textContent=m.hint;
 document.getElementById('hint').hidden=true;document.getElementById('hint-toggle').setAttribute('aria-expanded','false');
 feedback.hidden=true;feedback.innerHTML='';feedback.classList.remove('incorrect');
 content.innerHTML=`<div class="mission-body"><h3>${m.title}</h3><p class="scenario">${m.scenario}</p>${m.evidence}<p class="question">${m.question}</p><div class="choices ${m.multi?'multi':''}" role="group" aria-label="Answer choices">${m.options.map(([id,text],i)=>`<button class="choice" data-answer="${id}" aria-pressed="false"><span class="choice-marker" aria-hidden="true">${m.multi?'':String.fromCharCode(65+i)}</span><span>${text}</span></button>`).join('')}</div><div class="answer-actions"><button class="primary" id="check-answer">Check my reasoning <span aria-hidden="true">↗</span></button><span class="answer-help">${m.multi?'Select two answers.':'Choose an answer, then check it.'}</span></div></div>`;
 content.querySelectorAll('.choice').forEach(btn=>btn.addEventListener('click',()=>{
  const id=btn.dataset.answer;
  selected=m.multi?(selected.includes(id)?selected.filter(x=>x!==id):[...selected,id]):[id];
  content.querySelectorAll('.choice').forEach(b=>{const on=selected.includes(b.dataset.answer);b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));if(m.multi)b.querySelector('.choice-marker').textContent=on?'✓':'';});
  feedback.hidden=true;
 }));
 document.getElementById('check-answer').addEventListener('click',check);
 updateProgress();
}
function check(){
 const m=missions[active];feedback.hidden=false;
 if(selected.length===0 || (m.multi&&selected.length!==2)){
  feedback.classList.add('incorrect');feedback.innerHTML=`<div class="feedback-heading">${m.multi?'Choose exactly two gaps.':'Choose an answer first.'}</div><p>Your reasoning starts with a choice. You can change it before checking again.</p>`;return;
 }
 const correct=LabLogic.evaluate(active,selected);feedback.classList.toggle('incorrect',!correct);
 if(correct){
  if(!completed.includes(active))completed.push(active);
  try{localStorage.setItem('alissa-lab-progress-v1',JSON.stringify(completed));}catch(e){}
  feedback.innerHTML=`<div class="feedback-heading"><span aria-hidden="true">✓</span> ${['Measurement detective','Decision maker','AI reviewer'][active]} · mission complete</div><p>${m.explanation}</p><p class="takeaway"><strong>My takeaway:</strong> ${m.takeaway}</p><button class="next" id="next-mission">${active<2?'Explore the next mission →':'Review my portfolio →'}</button>`;
  document.getElementById('next-mission').addEventListener('click',()=>{if(active<2){render(active+1);document.getElementById('workspace').scrollIntoView({block:'start'});}else document.getElementById('summary-dialog').showModal();});
 }else{feedback.innerHTML=`<div class="feedback-heading">A useful clue to reconsider.</div><p>${m.incorrect}</p><p class="takeaway">Try another choice. Exploring the reasoning is the point.</p>`;}
 updateProgress();
}
document.querySelectorAll('.mission-tab').forEach(tab=>tab.addEventListener('click',()=>render(Number(tab.dataset.mission))));
document.getElementById('hint-toggle').addEventListener('click',()=>{const hint=document.getElementById('hint');hint.hidden=!hint.hidden;document.getElementById('hint-toggle').setAttribute('aria-expanded',String(!hint.hidden));});
document.getElementById('reset').addEventListener('click',()=>{completed=[];try{localStorage.removeItem('alissa-lab-progress-v1');}catch(e){}render(0);});
const summary=document.getElementById('summary-dialog');
document.getElementById('summary-open').addEventListener('click',()=>summary.showModal());
document.getElementById('summary-close').addEventListener('click',()=>summary.close());
summary.addEventListener('click',event=>{if(event.target===summary){const rect=summary.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)summary.close();}});
render(0);
