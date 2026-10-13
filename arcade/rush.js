'use strict';
const products=[{name:'Everyday hoodie',icon:'🧥',price:48},{name:'Canvas tote',icon:'👜',price:24},{name:'Studio mug',icon:'☕',price:18},{name:'Everyday tee',icon:'👕',price:32}];
const briefs={
 analytics:[
  {title:'Find the pricing error.',request:'A price looks too high',prompt:'Enter the Sagittarius storefront. Compare the page with the catalog, click the incorrect price, fix it, and push the corrected page to prod.',kind:'price',badIndex:2,badValue:180,reason:'The mug price was inflated by a decimal-place error. The corrected page now matches the source catalog.'},
  {title:'This deal is a little too good.',request:'A price looks too low',prompt:'One storefront price is suspiciously low. Inspect the catalog, edit the wrong product price, and push the fix to prod.',kind:'price',badIndex:0,badValue:4.8,reason:'The hoodie price lost a decimal place. The corrected price is consistent with the catalog.'},
  {title:'Something is off in the storefront.',request:'Storefront price QA',prompt:'Check the published page against the catalog. Repair the inconsistent price and push the validated page to prod.',kind:'price',badIndex:3,badValue:320,reason:'The tee price had an extra zero. The page has been validated against the source catalog.'}
 ],
 dashboard:[
  {title:'Repair the sales dashboard.',request:'Sales dashboard repair',prompt:'This chart is wired to page views instead of completed orders. Cut the wrong wire, drag the Completed orders source onto the chart socket, then push to prod.',kind:'repair',label:'COMPLETED ORDERS BY DAY',correctSource:'orders',wrongSource:'views',sources:[{id:'views',name:'Page views',values:[320,460,390],unit:'views'},{id:'orders',name:'Completed orders',values:[24,36,30],unit:'orders'},{id:'clicks',name:'CTA clicks',values:[92,115,103],unit:'clicks'}],reason:'The sales chart is now connected to completed orders rather than page views.'},
  {title:'Bring the customer dashboard online.',request:'Customer dashboard repair',prompt:'The customer chart is showing visits, not new accounts. Cut the current wire, connect New accounts to the chart, and push the repaired dashboard to prod.',kind:'repair',label:'NEW CUSTOMER ACCOUNTS BY DAY',correctSource:'accounts',wrongSource:'visits',sources:[{id:'visits',name:'Site visits',values:[250,370,310],unit:'visits'},{id:'orders',name:'Completed orders',values:[19,28,22],unit:'orders'},{id:'accounts',name:'New accounts',values:[18,27,21],unit:'accounts'}],reason:'The customer chart now uses new accounts, with the wrong visits connection removed.'},
  {title:'Fix the support dashboard.',request:'Support dashboard repair',prompt:'A chart of resolved tickets is accidentally wired to all incoming tickets. Cut the bad connection, wire Resolved tickets into the chart, and push to prod.',kind:'repair',label:'RESOLVED SUPPORT TICKETS BY DAY',correctSource:'resolved',wrongSource:'incoming',sources:[{id:'resolved',name:'Resolved tickets',values:[12,20,16],unit:'resolved'},{id:'incoming',name:'Incoming tickets',values:[35,47,41],unit:'incoming'},{id:'sessions',name:'Chat sessions',values:[42,58,49],unit:'sessions'}],reason:'The dashboard measures resolved work rather than treating every incoming ticket as resolved.'}
 ],
 feature:[
  {title:'Build a working checkout CTA.',request:'Checkout CTA feature',prompt:'Drag the button into the empty cart slot. Connect its click port to Checkout. Click the finished button to test the experience, then ship the feature.',kind:'feature',cta:'Checkout',endpoint:'Checkout',success:'Checkout opened ✓',reason:'The CTA is placed, its click is wired, and the actual checkout interaction passed its test.'},
  {title:'Give customers a reorder shortcut.',request:'Reorder feature',prompt:'Place a Reorder button in the basket slot. Connect its click to Review basket. Test the working button before shipping.',kind:'feature',cta:'Reorder',endpoint:'Review basket',success:'Basket review opened ✓',reason:'Reordering now leads to a review screen rather than charging without confirmation. The interaction is tested.'},
  {title:'Let customers save a favorite.',request:'Save-for-later feature',prompt:'Place a Save item button in the product slot. Connect its click to Saved items. Test it, then ship your working feature.',kind:'feature',cta:'Save item',endpoint:'Saved items',success:'Item saved successfully ✓',reason:'The action is connected to the saved-items destination, and the interaction was tested before shipment.'}
 ]
};
const personas=[{name:'Maya',role:'Growth',avatar:'👩🏾‍💼'},{name:'Theo',role:'Product',avatar:'👨🏻‍💼'},{name:'Jordan',role:'Ecommerce',avatar:'🧑🏽‍💼'},{name:'Nia',role:'Design',avatar:'👩🏿‍💻'},{name:'Sam',role:'Marketing',avatar:'🧑🏻‍💼'},{name:'Priya',role:'Operations',avatar:'👩🏽‍💼'}];
const typeInfo={dashboard:{emoji:'📊',name:'Dashboard studio'},analytics:{emoji:'🔧',name:'Tracking clinic'},feature:{emoji:'🚀',name:'Feature factory'}};
let state=RushEngine.create(),running=false,paused=false,selectedId=null,taskId=null,lastTime=0,personaIndex=0,briefIndex=0,best={rush:0,cozy:0};
try{const old=JSON.parse(localStorage.getItem('ali-rush-best-v1')||'{}');for(const mode of ['rush','cozy'])if(Number.isFinite(old[mode])&&old[mode]>=0)best[mode]=old[mode];}catch(e){}
const $=id=>document.getElementById(id);
function say(message){$('status').textContent=message;}
function newCustomer(type){type=type||['dashboard','analytics','feature'][Math.floor(Math.random()*3)];const person=personas[personaIndex++%personas.length];const brief=briefs[type][briefIndex++%briefs[type].length];return {...person,type,brief};}
function mood(c){const ratio=c.patience/c.maxPatience;return {ratio,face:ratio>.6?'🙂':ratio>.3?'😐':'😠',label:ratio>.6?'Happy':ratio>.3?'Getting impatient':'About to leave',color:ratio>.6?'#78c0a0':ratio>.3?'#f1c45b':'#ec8768'};}
function start(){
 const mode=document.querySelector('input[name="mode"]:checked').value;
 state=RushEngine.create(mode);running=true;paused=false;selectedId=null;taskId=null;personaIndex=Math.floor(Math.random()*personas.length);briefIndex=0;
 ['start-layer','end-layer','paused-layer','task-layer'].forEach(id=>$(id).hidden=true);
 $('queue').innerHTML='';$('pause').disabled=false;$('pause').textContent='Ⅱ Pause';
 ['dashboard','analytics','feature'].forEach(type=>RushEngine.add(state,newCustomer(type)));
 $('ali').style.left='50%';say('The queue is open! Pick a stakeholder, then the matching station.');lastTime=performance.now();render();requestAnimationFrame(frame);
 const first=$('queue').querySelector('button');if(first)first.focus({preventScroll:true});
}
function frame(now){if(!running)return;const delta=(now-lastTime)/1000;lastTime=now;if(!paused){const departed=RushEngine.tick(state,delta);for(const c of departed){if(selectedId===c.id)selectedId=null;if(taskId===c.id)closeTask(false);say(`${c.name} lost patience and left. Prioritize the shortest patience bar.`);}if(!state.ended){while(state.arrival<=0){const added=RushEngine.add(state,newCustomer());state.arrival+=state.config.arrival;if(!added)say('Queue full! A new stakeholder was turned away. Deliver a ready ticket.');}}render();if(state.ended){end();return;}}requestAnimationFrame(frame);}
function render(){
 $('timer').textContent=`${Math.floor(Math.ceil(state.time)/60)}:${String(Math.ceil(state.time)%60).padStart(2,'0')}`;
 $('timer').classList.toggle('urgent',state.time<16);$('score').textContent=state.score.toLocaleString();$('served').textContent=state.served;$('combo').textContent=state.combo?`${state.combo}×`:'—';$('queue-count').textContent=`${state.queue.length} / 5`;
 const queue=$('queue');queue.querySelector('.empty-queue')?.remove();
 queue.querySelectorAll('.customer').forEach(node=>{if(!state.queue.some(c=>String(c.id)===node.dataset.id))node.remove();});
 state.queue.forEach(c=>{
  let node=queue.querySelector(`[data-id="${c.id}"]`);
  if(!node){node=document.createElement('button');node.type='button';node.className='customer';node.dataset.id=c.id;node.innerHTML=`<span class="avatar" aria-hidden="true">${c.avatar}</span><span class="mood" aria-hidden="true"></span><span class="name">${c.name} · ${c.role}</span><span class="request">${typeInfo[c.type].emoji} ${c.brief.request}</span><div class="patience" aria-hidden="true"><div></div></div><small></small>`;queue.append(node);}
  const m=mood(c),job=state.jobs[c.type],ready=c.working&&job?.remaining===0;
  node.classList.toggle('selected',selectedId===c.id);node.classList.toggle('angry',m.ratio<=.3);node.setAttribute('aria-pressed',String(selectedId===c.id));node.setAttribute('aria-label',`${c.name}, ${c.brief.request}, ${m.label}, ${Math.ceil(c.patience)} seconds patience${c.working?ready?', ready for delivery':', work in progress':''}`);
  node.querySelector('.mood').textContent=m.face;node.querySelector('.patience>div').style.width=`${m.ratio*100}%`;node.querySelector('.patience>div').style.background=m.color;node.querySelector('small').textContent=ready?'✓ Ready to deliver':c.working?'Ali is building…':`${Math.ceil(c.patience)}s patience`;
 });
 if(!state.queue.length)queue.innerHTML='<div class="empty-queue">A clear desk! More stakeholders will arrive soon.</div>';
 document.querySelectorAll('.station').forEach(node=>{
  const type=node.dataset.station,job=state.jobs[type],ready=job?.remaining===0;
  node.classList.toggle('busy',Boolean(job));node.classList.toggle('ready',Boolean(ready));
  const c=job?state.queue.find(c=>c.id===job.id):null;
  node.querySelector('.station-status').textContent=job?ready?`✓ Deliver to ${c?.name||'stakeholder'}!`:`Building for ${c?.name||'stakeholder'}…`:'Route a matching ticket here';
  node.querySelector('.job-meter>div').style.width=job?`${(1-job.remaining/job.total)*100}%`:'0%';
 });
 if(taskId!==null){const c=state.queue.find(c=>c.id===taskId);if(c)$('task-patience').textContent=`${mood(c).label} · ${Math.ceil(c.patience)} seconds left`;}
}
function chooseCustomer(id){if(!running||paused)return;const c=state.queue.find(c=>c.id===id);if(!c)return;selectedId=id;if(c.working){const job=state.jobs[c.type];say(job.remaining===0?`${c.name}'s work is ready! Click the ${typeInfo[c.type].name} to deliver.`:`Ali is building for ${c.name}. Pick another ticket while it finishes.`);}else say(`${c.name} needs ${c.brief.request.toLowerCase()}. Choose the ${typeInfo[c.type].name}.`);render();}
function station(type){if(!running||paused||taskId!==null)return;const job=state.jobs[type];if(job){if(job.remaining>0){say('This station is busy. You can solve a ticket at another station.');return;}const result=RushEngine.deliver(state,type);if(result){if(selectedId===result.customer.id)selectedId=null;say(`${result.customer.name} is delighted! +${result.points} points. Keep the good work moving.`);burst();render();}return;}
 const c=state.queue.find(c=>c.id===selectedId);if(!c){say('Pick a stakeholder from the queue first.');return;}if(c.type!==type){say(`${c.name} needs ${c.brief.request.toLowerCase()}. Try the ${typeInfo[c.type].name}.`);return;}
 const percent={dashboard:17,analytics:50,feature:83}[type];$('ali').style.left=`${percent}%`;openTask(c);
}
function openTask(c){
 taskId=c.id;const brief=c.brief;
 if(!c.mini)c.mini={values:brief.kind==='price'?products.map((p,i)=>i===brief.badIndex?brief.badValue:p.price):[0,0,0],placed:false,wired:false,tested:false,editing:null,connecting:false,connectedSource:brief.wrongSource||null,pickedSource:null,cut:false};
 $('task-category').textContent=typeInfo[c.type].name.toUpperCase()+' · WORKSPACE';$('task-avatar').textContent=c.avatar;$('task-name').textContent=`${c.name} · ${c.role}`;$('task-title').textContent=brief.title;$('task-prompt').textContent=brief.prompt;$('task-evidence').innerHTML='';$('task-choices').innerHTML='';$('task-feedback').textContent='';$('task-layer').hidden=false;
 drawMini(c);render();$('task-close').focus({preventScroll:true});
}
function activeCustomer(){return running&&!paused?state.queue.find(c=>c.id===taskId):null;}
function browserHead(label){return `<div class="mini-browser-head"><span class="browser-dots" aria-hidden="true">● ● ●</span><span>staging.sagittarius.studio / ${label}</span><span class="staging-pill">STAGING</span></div><div class="store-brand"><img src="bird.svg" alt="Secretary bird head emblem"><strong>SAGITTARIUS<span>STUDIO</span></strong><span>GOOD THINGS, WELL MADE.</span></div>`;}
function money(value){return '$'+Number(value).toFixed(2);}
function drawMini(c){
 const b=c.brief,m=c.mini;let html='';
 if(b.kind==='price'){
 html=`<div class="mini-browser">${browserHead('shop')}<div class="store-title">The everyday collection <small>Find the price that doesn't belong.</small></div><div class="product-grid">${products.map((p,i)=>`<button class="product-card" data-product="${i}" aria-label="Edit ${p.name} price, currently ${money(m.values[i])}"><span class="product-art" aria-hidden="true">${p.icon}</span><strong>${p.name}</strong><span class="product-price" id="price-${i}">${money(m.values[i])} <small>✎</small></span></button>`).join('')}</div><div class="catalog"><strong>SOURCE CATALOG</strong>${products.map(p=>`<span>${p.name}: <b>${money(p.price)}</b></span>`).join('')}</div><div id="price-editor" class="price-editor" ${m.editing===null?'hidden':''}></div></div><button class="deploy-button" id="push-mini">↑ Push to prod</button>`;
 }else if(b.kind==='repair'){
 const source=b.sources.find(x=>x.id===m.connectedSource),healthy=m.cut&&m.connectedSource===b.correctSource;
 html=`<div class="mini-browser">${browserHead('dashboard-repair')}<div class="repair-heading"><strong>REPAIR THE DATA CONNECTION</strong><span class="repair-state ${healthy?'healthy':''}">${healthy?'✓ SIGNAL RESTORED':source?'⚠ WRONG SIGNAL':'○ DISCONNECTED'}</span></div><div class="repair-steps"><span class="${m.cut?'done':''}">1. Cut the bad wire</span><span class="${healthy?'done':''}">2. Connect the right source</span><span>3. Push to prod</span></div><div class="repair-canvas" id="repair-canvas"><svg class="repair-wires" aria-hidden="true"><path id="repair-wire"/></svg><div class="data-sources"><span class="source-heading">DATA SOURCES · DRAG A CARD</span>${b.sources.map(x=>`<button class="source-node ${m.connectedSource===x.id?'connected':''} ${m.pickedSource===x.id?'picked':''}" data-source="${x.id}" draggable="true"><span class="db-icon" aria-hidden="true">▤</span><span><strong>${x.name}</strong><small>Mon ${x.values[0]} · Tue ${x.values[1]} · Wed ${x.values[2]}</small></span><i aria-hidden="true">●</i></button>`).join('')}</div><div class="repaired-chart" id="chart-drop"><div class="chart-socket-row"><button id="chart-socket" class="chart-socket" aria-label="Connect the picked data source to this chart">●</button><strong>${b.label}</strong></div><div class="repair-chart-bars">${[0,1,2].map(i=>`<div><span>${source?source.values[i]:'—'}</span><i style="height:${source?source.values[i]/Math.max(...source.values)*82:3}px" class="${healthy?'recovered':''}"></i><small>${['Mon','Tue','Wed'][i]}</small></div>`).join('')}</div><div class="chart-source-label">${source?'SOURCE: '+source.name.toUpperCase():'WAITING FOR A DATA CONNECTION'}</div></div></div><div class="repair-controls"><button id="cut-wire" ${m.connectedSource===null?'disabled':''}>✂ Cut connection</button><span>Drag a source onto the chart. Or click a source, then the socket.</span></div></div><button class="deploy-button" id="push-mini">↑ Push dashboard to prod</button>`;
 }else{
 html=`<div class="mini-browser">${browserHead('feature-builder')}<div class="feature-builder"><div class="component-tray"><strong>COMPONENT TRAY</strong><button draggable="true" class="cta-piece" id="cta-piece">${b.cta} →</button><small>Drag to the dashed slot.<br>Or click the component, then the slot.</small></div><div class="cart-preview"><div class="cart-top"><span>YOUR BASKET</span><span>🛒</span></div><div class="basket-item"><span>👕</span><div>Everyday tee<small>1 item · $32.00</small></div></div><button class="cta-drop" id="cta-drop" ${m.placed?'hidden':''}>+ DROP BUTTON HERE</button><button class="built-cta" id="built-cta" ${m.placed?'':'hidden'}>${b.cta} →</button><div class="test-result" id="test-result">${m.tested?b.success:'Test the button after connecting it.'}</div><div id="feature-destination" ${m.tested?'':'hidden'}>${m.tested?featureDestination(b):''}</div></div></div><div class="wire-area" id="wire-area"><svg class="wire-svg" id="wire-svg" aria-hidden="true"><line id="wire-line" x1="0" y1="0" x2="0" y2="0"/></svg><button class="wire-node" id="source-port" aria-label="Start connection from button click" ${m.placed?'':'disabled'}>Button click <span>●</span></button><span class="wire-note">${m.wired?'CONNECTED ✓':'Drag the port → or click both ports'}</span><button class="wire-node" id="target-port" aria-label="Connect to ${b.endpoint}"><span>●</span> ${b.endpoint}</button></div></div><button class="deploy-button" id="push-mini">↑ Ship feature to prod</button>`;
 }
 $('task-choices').innerHTML=html;
 $('push-mini').addEventListener('click',pushMini);
 if(b.kind==='price'){
  document.querySelectorAll('[data-product]').forEach(node=>node.addEventListener('click',()=>{m.editing=Number(node.dataset.product);priceEditor(c);}));
  if(m.editing!==null)priceEditor(c);
 }else if(b.kind==='repair'){
 setupRepair(c);
 }else setupFeature(c);
}
function priceEditor(c){
 const i=c.mini.editing,editor=$('price-editor');editor.hidden=false;editor.innerHTML=`<label>EDIT ${products[i].name.toUpperCase()}<span>$ <input id="price-input" type="number" min="0" step="0.01" value="${c.mini.values[i]}" aria-label="Corrected ${products[i].name} price"></span></label><button id="apply-price">Apply fix ✓</button>`;
 const apply=()=>{if(!activeCustomer())return;const value=$('price-input').value;if(MiniLogic.cents(value)===null){$('task-feedback').textContent='Enter a valid nonnegative price.';return;}c.mini.values[i]=Number(value);c.mini.editing=null;drawMini(c);$('task-feedback').textContent='Price updated in staging. Validate the page, then push to prod.';$('push-mini').focus({preventScroll:true});};
 $('apply-price').addEventListener('click',apply);$('price-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply();}});$('price-input').focus({preventScroll:true});$('price-input').select();
}
function setupRepair(c){
 const m=c.mini;
 $('cut-wire').addEventListener('click',()=>{if(!activeCustomer())return;m.connectedSource=null;m.cut=true;m.pickedSource=null;drawMini(c);$('task-feedback').textContent='Bad wire removed. Connect the source named in the chart title.';});
 const connect=id=>{if(!activeCustomer()||!c.brief.sources.some(x=>x.id===id))return;if(!m.cut){$('task-feedback').textContent='Cut the existing bad connection first.';return;}m.connectedSource=id;m.pickedSource=null;drawMini(c);$('task-feedback').textContent=id===c.brief.correctSource?'Signal restored! The chart recovered. Push the fix to prod.':'Source connected. Check that the source matches the chart title before pushing.';};
 document.querySelectorAll('[data-source]').forEach(node=>{
  node.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','source:'+node.dataset.source);e.dataTransfer.effectAllowed='link';});
  node.addEventListener('click',()=>{if(!activeCustomer())return;m.pickedSource=node.dataset.source;document.querySelectorAll('[data-source]').forEach(n=>n.classList.toggle('picked',n.dataset.source===m.pickedSource));$('task-feedback').textContent='Source picked up. Click the chart socket to connect it.';$('chart-socket').focus({preventScroll:true});});
 });
 $('chart-drop').addEventListener('dragover',e=>{e.preventDefault();$('chart-drop').classList.add('drop-active');});
 $('chart-drop').addEventListener('dragleave',()=> $('chart-drop').classList.remove('drop-active'));
 $('chart-drop').addEventListener('drop',e=>{e.preventDefault();const value=e.dataTransfer.getData('text/plain');if(value.startsWith('source:'))connect(value.slice(7));});
 $('chart-socket').addEventListener('click',()=>{if(m.pickedSource)connect(m.pickedSource);else $('task-feedback').textContent='Pick up a data source first, then connect it to the socket.';});
 requestAnimationFrame(()=>drawRepairWire(c));
}
function drawRepairWire(c){if(taskId!==c.id||c.brief.kind!=='repair')return;const canvas=$('repair-canvas'),path=$('repair-wire');if(!canvas||!path)return;const id=c.mini.connectedSource;if(!id){path.setAttribute('d','');return;}const source=document.querySelector(`[data-source="${id}"]`);if(!source)return;const r=canvas.getBoundingClientRect(),a=source.getBoundingClientRect(),b=$('chart-socket').getBoundingClientRect(),x1=a.right-r.left-10,y1=a.top-r.top+a.height/2,x2=b.left-r.left+b.width/2,y2=b.top-r.top+b.height/2;path.setAttribute('d',`M ${x1} ${y1} C ${x1+45} ${y1}, ${x2-45} ${y2}, ${x2} ${y2}`);path.classList.toggle('recovered',c.mini.cut&&id===c.brief.correctSource);}
window.addEventListener('resize',()=>{const c=activeCustomer();if(c?.brief.kind==='repair')drawRepairWire(c);});
function featureDestination(b){return `<div class="destination-panel"><strong>${b.endpoint.toUpperCase()}</strong><div class="destination-item"><span>👕</span><div>Everyday tee<small>${b.cta==='Save item'?'Added to your saved items':'1 item · $32.00 · ready to review'}</small></div></div><span class="destination-pass">✓ ${b.success}</span></div>`;}
function setupFeature(c){
 const m=c.mini;
 $('cta-piece').addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain','ali-cta'));
 $('cta-piece').addEventListener('click',()=>{m.carrying=true;$('cta-drop').classList.add('drop-active');$('task-feedback').textContent='Component picked up. Click the dashed slot to place it.';});
 $('cta-drop').addEventListener('dragover',e=>{e.preventDefault();$('cta-drop').classList.add('drop-active');});
 $('cta-drop').addEventListener('dragleave',()=> $('cta-drop').classList.remove('drop-active'));
 const place=()=>{if(!activeCustomer())return;m.placed=true;drawMini(c);$('task-feedback').textContent='Button placed. Connect Button click to '+c.brief.endpoint+'.';$('source-port').focus({preventScroll:true});};
 $('cta-drop').addEventListener('drop',e=>{e.preventDefault();if(e.dataTransfer.getData('text/plain')==='ali-cta')place();});
 $('cta-drop').addEventListener('click',()=>{if(m.carrying)place();else $('task-feedback').textContent='Pick up the button from the component tray first.';});
 const connect=()=>{if(!activeCustomer()||!m.placed)return;m.wired=true;m.connecting=false;drawMini(c);$('task-feedback').textContent='Click action connected. Test your actual button in the basket.';$('built-cta').focus({preventScroll:true});};
 $('source-port').addEventListener('click',()=>{if(!m.placed)return;m.connecting=true;$('target-port').classList.add('drop-active');$('task-feedback').textContent='Connection started. Click '+c.brief.endpoint+' to complete the wire.';});
 $('target-port').addEventListener('click',()=>{if(m.connecting)connect();else $('task-feedback').textContent='Start the wire at Button click first.';});
 $('source-port').addEventListener('pointerdown',e=>{if(!m.placed)return;m.connecting=true;wireDrag={customerId:c.id,active:true};e.preventDefault();drawWire(e.clientX,e.clientY);});
 $('built-cta').addEventListener('click',()=>{if(!activeCustomer())return;if(!m.wired){$('task-feedback').textContent='The button is on the page, but its click is not connected yet.';return;}m.tested=true;$('test-result').textContent=c.brief.success;$('test-result').classList.add('passed');$('feature-destination').innerHTML=featureDestination(c.brief);$('feature-destination').hidden=false;$('task-feedback').textContent='Interaction test passed. Your feature is ready to ship.';});
 if(m.wired)requestAnimationFrame(()=>drawWire());
}
let wireDrag=null;
function drawWire(x,y){const area=$('wire-area'),line=$('wire-line');if(!area||!line)return;const r=area.getBoundingClientRect(),a=$('source-port').getBoundingClientRect(),b=$('target-port').getBoundingClientRect();const x1=a.right-r.left-12,y1=a.top-r.top+a.height/2,x2=x===undefined?b.left-r.left+12:x-r.left,y2=y===undefined?b.top-r.top+b.height/2:y-r.top;line.setAttribute('x1',x1);line.setAttribute('y1',y1);line.setAttribute('x2',x2);line.setAttribute('y2',y2);line.style.display='block';}
document.addEventListener('pointermove',e=>{if(wireDrag?.active)drawWire(e.clientX,e.clientY);});
document.addEventListener('pointerup',e=>{if(!wireDrag?.active)return;wireDrag.active=false;const c=activeCustomer();if(!c||c.id!==wireDrag.customerId)return;const target=document.elementFromPoint(e.clientX,e.clientY);if(target?.closest('#target-port')){c.mini.wired=true;c.mini.connecting=false;drawMini(c);$('task-feedback').textContent='Wire connected. Click the button to test your feature.';}else{c.mini.connecting=true;$('task-feedback').textContent='Click the destination port to finish the connection.';}});
function pushMini(){
 const c=activeCustomer();if(!c)return;const b=c.brief,m=c.mini;
 if(b.kind==='price'&&m.editing!==null){$('task-feedback').textContent='Apply the price edit first, then push the page.';return;}
 const good=b.kind==='price'?MiniLogic.priceReady(m.values,products.map(p=>p.price)):b.kind==='repair'?MiniLogic.repairReady(m,b.correctSource):MiniLogic.featureReady(m);
 if(!good){c.patience=Math.max(.1,c.patience-7);state.combo=0;$('task-feedback').textContent=b.kind==='price'?'Validation failed: the page still differs from the catalog. −7s patience.':b.kind==='repair'?'The chart is not connected to the requested data source yet. −7s patience. Cut the wrong wire, then reconnect it.':!m.placed?'Place the component before shipping. −7s patience.':!m.wired?'Wire the click action before shipping. −7s patience.':'Click your working button to test it before shipping. −7s patience.';render();return;}
 if(!RushEngine.startJob(state,c.id,c.type)){say('That station is busy. Try another ticket while it finishes.');closeTask();return;}
 say('Pushing to prod… '+b.reason+' Deliver the result when the station is ready.');closeTask();render();
}
function closeTask(focus=true){wireDrag=null;taskId=null;$('task-layer').hidden=true;if(focus){const node=$('queue').querySelector(`[data-id="${selectedId}"]`);node?.focus({preventScroll:true});}}
function togglePause(force){if(!running)return;paused=typeof force==='boolean'?force:!paused;$('paused-layer').hidden=!paused;$('pause').textContent=paused?'▶ Resume':'Ⅱ Pause';lastTime=performance.now();if(paused)$('resume').focus({preventScroll:true});else $('pause').focus({preventScroll:true});}
function end(){running=false;closeTask(false);$('pause').disabled=true;$('end-layer').hidden=false;$('end-score').textContent=state.score.toLocaleString();$('end-served').textContent=state.served;$('end-lost').textContent=state.lost;const done=state.served;$('end-title').textContent=done>=10?'Stakeholder whisperer!':done>=5?'Ali kept things moving.':'Every analyst starts somewhere.';$('end-description').textContent=`${done} tickets delivered. ${state.queue.length} still in the queue at closing. ${state.lost?'Some stakeholders ran out of patience or found the queue full.':'No stakeholders left or were turned away.'} Try serving ready jobs before starting a fresh brief.`;
 $('end-breakdown').innerHTML=`<div class="end-breakdown"><span>📊 Dashboards: ${state.counts.dashboard}</span><span>🔧 Fixes: ${state.counts.analytics}</span><span>🚀 Features: ${state.counts.feature}</span></div>`;best[state.mode]=Math.max(best[state.mode]||0,state.score);try{localStorage.setItem('ali-rush-best-v1',JSON.stringify(best));}catch(e){}$('end-best').textContent=`Your best ${state.mode==='rush'?'rush':'cozy'} shift: ${best[state.mode].toLocaleString()} points. Saved in this browser.`;$('replay').focus({preventScroll:true});}
function burst(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<18;i++){const bit=document.createElement('i');bit.className='confetti-bit';bit.style.setProperty('--x',`${(Math.random()-.5)*430}px`);bit.style.setProperty('--y',`${(Math.random()-.7)*350}px`);bit.style.background=['#f8d361','#9474d3','#78c0a0','#ef875e'][i%4];$('confetti').append(bit);setTimeout(()=>bit.remove(),900);}}
$('start').addEventListener('click',start);$('replay').addEventListener('click',()=>{$('end-layer').hidden=true;$('start-layer').hidden=false;$('start').focus({preventScroll:true});});$('pause').addEventListener('click',()=>togglePause());$('resume').addEventListener('click',()=>togglePause(false));$('task-close').addEventListener('click',()=>closeTask());$('queue').addEventListener('click',event=>{const node=event.target.closest('.customer');if(node)chooseCustomer(Number(node.dataset.id));});document.querySelectorAll('.station').forEach(node=>node.addEventListener('click',()=>station(node.dataset.station)));
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)togglePause(true);});
document.addEventListener('keydown',event=>{
 if(!running||event.ctrlKey||event.metaKey||event.altKey)return;
 const editing=event.target.matches('input,textarea');
 if(!editing&&event.key.toLowerCase()==='p'){event.preventDefault();togglePause();return;}
 if(paused)return;
 if(taskId!==null){if(event.key==='Escape'){wireDrag=null;closeTask();}}
 else if(!editing&&['1','2','3'].includes(event.key)){event.preventDefault();station(['dashboard','analytics','feature'][Number(event.key)-1]);}
});
// Keep keyboard focus within the active game panel, including before the shift starts.
document.addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const panel=['paused-layer','end-layer','start-layer','task-layer'].map($).find(node=>!node.hidden);
 if(!panel)return;
 const items=[...panel.querySelectorAll('button:not(:disabled),a[href],input:not([disabled])')];
 const visible=items.filter(node=>node.getClientRects().length&&!node.closest('[hidden]'));
 const first=visible[0],last=visible[visible.length-1];
 if(!first)return;
 if(!panel.contains(document.activeElement)){event.preventDefault();(event.shiftKey?last:first).focus();}
 else if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
