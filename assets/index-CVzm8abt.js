var Z=Object.defineProperty;var tt=(l,t,e)=>t in l?Z(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var h=(l,t,e)=>tt(l,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();const c={ID:"ID",R90:"R90",R180:"R180",R270:"R270",MX:"MX",MY:"MY",MD:"MD",MAD:"MAD"},A={[c.ID]:0,[c.R90]:1,[c.R180]:2,[c.R270]:3,[c.MX]:4,[c.MY]:5,[c.MD]:6,[c.MAD]:7},G=[c.ID,c.R90,c.R180,c.R270,c.MX,c.MY,c.MD,c.MAD];function q(l,t){const{x:e,y:n}=l;switch(t){case c.ID:return{x:e,y:n};case c.R90:return{x:1-n,y:e};case c.R180:return{x:1-e,y:1-n};case c.R270:return{x:n,y:1-e};case c.MX:return{x:e,y:1-n};case c.MY:return{x:1-e,y:n};case c.MD:return{x:n,y:e};case c.MAD:return{x:1-n,y:1-e};default:return{x:e,y:n}}}function N(l,t){const e={x:.23,y:.79},n=q(e,l),s=q(n,t);for(const i of Object.keys(c)){const a=q(e,c[i]);if(Math.abs(a.x-s.x)<.001&&Math.abs(a.y-s.y)<.001)return c[i]}return c.ID}const X=new Uint8Array(64),j=new Uint8Array(8);for(let l=0;l<8;l++)for(let t=0;t<8;t++){const e=N(G[l],G[t]);X[l*8+t]=A[e]??0}for(let l=0;l<8;l++)for(let t=0;t<8;t++)if(X[l*8+t]===0){j[l]=t;break}const L={C2:{key:"C2",name:"C₂ (180° 회전군)",ops:[c.ID,c.R180],desc:"180° 회전만 사용하는 2원 대칭군 입문 모드 (최대 5수 해결)"},V4:{key:"V4",name:"V₄ (클라인 4원군)",ops:[c.ID,c.R180,c.MX,c.MY],desc:"가로/세로 반전 및 180° 회전을 사용하는 4원 대칭군 (최대 5수 해결)"},D4:{key:"D4",name:"D₄ (정사면 대칭군)",ops:[c.ID,c.R90,c.R180,c.R270,c.MX,c.MY,c.MD,c.MAD],desc:"90° 회전 및 대각선 대칭을 포함한 풀 D4 정사각 대칭군 (최대 8수)"}};function k(l){const t=[];for(let e=0;e<l;e++)t.push({type:"row",idx:e,label:`${e+1}행`});for(let e=0;e<l;e++)t.push({type:"col",idx:e,label:`${e+1}열`});return t.push({type:"diag",idx:"main",label:"↖ 주대각선"}),t.push({type:"diag",idx:"anti",label:"↗ 부대각선"}),t}function z(l){const t=[];for(let s=0;s<l;s++){const i=[];for(let a=0;a<l;a++)i.push(s*l+a);t.push(i)}for(let s=0;s<l;s++){const i=[];for(let a=0;a<l;a++)i.push(a*l+s);t.push(i)}const e=[];for(let s=0;s<l;s++)e.push(s*l+s);t.push(e);const n=[];for(let s=0;s<l;s++)n.push(s*l+(l-1-s));return t.push(n),t}k(3);const et=z(3);function st(l){let t=0;for(let e=0;e<Math.min(l.length,9);e++){const n=typeof l[e]=="number"?l[e]:A[l[e]];t|=n<<e*3}return t}function K(l,t,e){const n=et[t];let s=l;for(let i=0;i<n.length;i++){const o=n[i]*3,r=s>>o&7,d=X[r*8+e];s=s&~(7<<o)|d<<o}return s}function it(l,t,e){const n=j[e];return K(l,t,n)}function _(l,t,e){const n=[...l],s=A[e];for(let i=0;i<t.length;i++){const a=t[i],o=A[n[a]],r=X[o*8+s];n[a]=G[r]}return n}function U(l,t="D4",e=!0){const n=st(l);if(n===0)return[];const s=k(3),o=(L[t]||L.D4).ops.filter(p=>p!=="ID").map(p=>A[p]).filter(p=>p!==void 0&&p>0),r=e?8:6,d=[];for(let p=0;p<r;p++)for(const $ of o)d.push({lineId:p,opInt:$,packed:p<<4|$});const u=new Map,m=new Map;u.set(n,null),m.set(0,null);let b=[n],g=[0],v=-1;const y=8;let T=0;for(;T<y&&v===-1&&b.length>0&&g.length>0;){T++;const p=[];for(let w=0;w<b.length;w++){const O=b[w];for(let D=0;D<d.length;D++){const E=d[D],S=K(O,E.lineId,E.opInt);if(!u.has(S)){if(u.set(S,{prevCode:O,lineId:E.lineId,opInt:E.opInt}),m.has(S)){v=S;break}p.push(S)}}if(v!==-1)break}if(b=p,v!==-1)break;const $=[];for(let w=0;w<g.length;w++){const O=g[w];for(let D=0;D<d.length;D++){const E=d[D],S=it(O,E.lineId,E.opInt);if(!m.has(S)){if(m.set(S,{prevCode:O,lineId:E.lineId,opInt:E.opInt}),u.has(S)){v=S;break}$.push(S)}}if(v!==-1)break}g=$}if(v===-1)return[];const x=[];let M=v;for(;M!==n;){const p=u.get(M);if(!p)break;x.push({lineId:p.lineId,opInt:p.opInt}),M=p.prevCode}x.reverse();const C=[];for(M=v;M!==0;){const p=m.get(M);if(!p)break;C.push({lineId:p.lineId,opInt:p.opInt}),M=p.prevCode}return[...x,...C].map(p=>({lineId:p.lineId,line:s[p.lineId],op:G[p.opInt],opInt:p.opInt}))}function nt(l,t,e="D4",n=4){if(t===3)return U(l,e,!0);const s=b=>b.every(g=>g==="ID");if(s(l))return[];const i=k(t),a=z(t),r=(L[e]||L.D4).ops.filter(b=>b!=="ID"),d=new Set,u=b=>b.join(",");d.add(u(l));let m=[{ops:l,path:[]}];for(let b=0;b<n;b++){const g=[];for(const v of m)for(let y=0;y<i.length;y++)for(const T of r){const x=_(v.ops,a[y],T),M={lineId:y,line:i[y],op:T,opInt:A[T]},C=[...v.path,M];if(s(x))return C;const I=u(x);d.has(I)||(d.add(I),g.push({ops:x,path:C}))}if(m=g,m.length===0||m.length>25e3)break}return[]}function Y(l,t,e="D4"){return t===3?U(l,e,!0):nt(l,t,e,4)}class at{constructor(){h(this,"ctx",null);h(this,"bgmAudio",null);h(this,"sfxEnabled",!0);h(this,"bgmEnabled",!1);h(this,"comboScale",[261.63,293.66,329.63,349.23,392,440,523.25]);h(this,"lastFlipTime",0);h(this,"comboIndex",0);typeof Audio<"u"&&(this.bgmAudio=new Audio("/assets/bgm.mp3"),this.bgmAudio.loop=!0,this.bgmAudio.volume=.35)}initCtx(){if(!this.ctx){const t=typeof window<"u"?window.AudioContext||window.webkitAudioContext:globalThis.AudioContext;t&&(this.ctx=new t)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}playTap(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(600,this.ctx.currentTime),t.frequency.exponentialRampToValueAtTime(800,this.ctx.currentTime+.05),e.gain.setValueAtTime(.2,this.ctx.currentTime),e.gain.linearRampToValueAtTime(.01,this.ctx.currentTime+.05),t.connect(e),e.connect(this.ctx.destination),t.start(),t.stop(this.ctx.currentTime+.05)}getComboIndex(){return this.comboIndex}resetCombo(){this.comboIndex=0,this.lastFlipTime=0}playFlip(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=Date.now();this.lastFlipTime>0&&t-this.lastFlipTime<=1200?this.comboIndex=Math.min(this.comboIndex+1,this.comboScale.length-1):this.comboIndex=0,this.lastFlipTime=t;const e=this.comboScale[this.comboIndex],n=e*.58,s=this.ctx.createOscillator(),i=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(e,this.ctx.currentTime),s.frequency.exponentialRampToValueAtTime(Math.max(50,n),this.ctx.currentTime+.13);const a=.28+this.comboIndex*.02;i.gain.setValueAtTime(a,this.ctx.currentTime),i.gain.linearRampToValueAtTime(.01,this.ctx.currentTime+.13),s.connect(i),i.connect(this.ctx.destination),s.start(),s.stop(this.ctx.currentTime+.13)}playWin(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[{freq:523.25,time:0,dur:.12},{freq:659.25,time:.1,dur:.12},{freq:783.99,time:.2,dur:.12},{freq:1046.5,time:.3,dur:.16},{freq:783.99,time:.44,dur:.12},{freq:1046.5,time:.54,dur:.45},{freq:1318.51,time:.54,dur:.45}].forEach(n=>{const s=this.ctx.currentTime+n.time,i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(n.freq,s),a.gain.setValueAtTime(.28,s),a.gain.exponentialRampToValueAtTime(.001,s+n.dur),i.connect(a),a.connect(this.ctx.destination),i.start(s),i.stop(s+n.dur)}),[1567.98,1760,2093,2637.02].forEach((n,s)=>{const i=this.ctx.currentTime+.6+s*.07,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(n,i),o.gain.setValueAtTime(.15,i),o.gain.exponentialRampToValueAtTime(.001,i+.25),a.connect(o),o.connect(this.ctx.destination),a.start(i),a.stop(i+.25)})}playCombo(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[440,554.37,659.25,880].forEach((e,n)=>{const s=this.ctx.currentTime+n*.05,i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(e,s),a.gain.setValueAtTime(.22,s),a.gain.exponentialRampToValueAtTime(.001,s+.18),i.connect(a),a.connect(this.ctx.destination),i.start(s),i.stop(s+.18)})}playClear(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[523.25,659.25,783.99,1046.5].forEach((e,n)=>{const s=this.ctx.currentTime+n*.06,i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(e,s),a.gain.setValueAtTime(.2,s),a.gain.exponentialRampToValueAtTime(.001,s+.22),i.connect(a),a.connect(this.ctx.destination),i.start(s),i.stop(s+.22)})}toggleBgm(){return this.bgmEnabled=!this.bgmEnabled,this.bgmAudio&&(this.bgmEnabled?this.bgmAudio.play().catch(()=>{this.bgmEnabled=!1}):this.bgmAudio.pause()),this.bgmEnabled}toggleSfx(){return this.sfxEnabled=!this.sfxEnabled,this.sfxEnabled}isBgmOn(){return this.bgmEnabled}isSfxOn(){return this.sfxEnabled}speak(t){if(this.sfxEnabled&&!(typeof window>"u"||!("speechSynthesis"in window)))try{window.speechSynthesis.cancel();const e=new SpeechSynthesisUtterance(t);e.lang="ko-KR",e.rate=1.05,e.pitch=1.08;const s=window.speechSynthesis.getVoices().find(i=>i.lang.startsWith("ko"));s&&(e.voice=s),window.speechSynthesis.speak(e)}catch{}}}const f=new at,F=[{id:1,name:"1단계: C₂ 1수 입문",group:"C2",scrambleMoves:1,targetStars:{three:1,two:2}},{id:2,name:"2단계: C₂ 2수 연습",group:"C2",scrambleMoves:2,targetStars:{three:2,two:3}},{id:3,name:"3단계: C₂ 3수 기초",group:"C2",scrambleMoves:3,targetStars:{three:3,two:5}},{id:4,name:"4단계: V₄ 2수 반전",group:"V4",scrambleMoves:2,targetStars:{three:2,two:3}},{id:5,name:"5단계: V₄ 3수 응용",group:"V4",scrambleMoves:3,targetStars:{three:3,two:5}},{id:6,name:"6단계: V₄ 4수 마스터",group:"V4",scrambleMoves:4,targetStars:{three:4,two:6}},{id:7,name:"7단계: D₄ 2수 회전",group:"D4",scrambleMoves:2,targetStars:{three:2,two:3}},{id:8,name:"8단계: D₄ 3수 대각",group:"D4",scrambleMoves:3,targetStars:{three:3,two:5}},{id:9,name:"9단계: D₄ 4수 중급",group:"D4",scrambleMoves:4,targetStars:{three:4,two:6}},{id:10,name:"10단계: D₄ 5수 고급",group:"D4",scrambleMoves:5,targetStars:{three:5,two:7}},{id:11,name:"11단계: D₄ 6수 마스터",group:"D4",scrambleMoves:6,targetStars:{three:6,two:8}},{id:12,name:"12단계: D₄ 7수 신의 영역",group:"D4",scrambleMoves:7,targetStars:{three:7,two:9}}],V="matrix_cube_campaign_progress_v1";class ot{constructor(){h(this,"progress",{});this.loadProgress()}loadProgress(){const t=localStorage.getItem(V);if(t)try{this.progress=JSON.parse(t)}catch{this.progress={}}this.progress[1]||(this.progress[1]={unlocked:!0,bestMoves:null,stars:0})}saveProgress(){localStorage.setItem(V,JSON.stringify(this.progress))}getStageProgress(t){return this.progress[t]||{unlocked:!1,bestMoves:null,stars:0}}completeStage(t,e){const n=F.find(r=>r.id===t);if(!n)return 0;let s=1;e<=n.targetStars.three?s=3:e<=n.targetStars.two&&(s=2);const i=this.getStageProgress(t),a=i.bestMoves===null?e:Math.min(i.bestMoves,e),o=Math.max(i.stars,s);if(this.progress[t]={unlocked:!0,bestMoves:a,stars:o},t+1<=F.length){const r=this.getStageProgress(t+1);this.progress[t+1]={...r,unlocked:!0}}return this.saveProgress(),s}getTotalStars(){return Object.values(this.progress).reduce((t,e)=>t+(e.stars||0),0)}}const rt=new ot,lt="matrix_cube_best_record_v1";function P(l){if(l<0||isNaN(l))return"00:00.0";const t=Math.floor(l/1e3),e=Math.floor(t/60),n=t%60,s=Math.floor(l%1e3/100),i=String(e).padStart(2,"0"),a=String(n).padStart(2,"0");return`${i}:${a}.${s}`}class ct{constructor(){h(this,"startTime",null);h(this,"accumulatedMs",0);h(this,"timerIntervalId",null);h(this,"tickCallback",null)}getRecordKey(t,e){return`${lt}_${t}x${t}_${e}moves`}getStorage(){return typeof window<"u"&&window.localStorage?window.localStorage:typeof localStorage<"u"?localStorage:null}getRecord(t,e){try{const n=this.getStorage();if(!n)return null;const s=this.getRecordKey(t,e),i=n.getItem(s);if(!i)return null;const a=JSON.parse(i);return{bestTimeMs:typeof a.bestTimeMs=="number"?a.bestTimeMs:null,bestMoves:typeof a.bestMoves=="number"?a.bestMoves:null,updatedAt:a.updatedAt}}catch{return null}}saveRecord(t,e,n,s){const i=this.getRecord(t,e);let a=!1,o=!1,r=(i==null?void 0:i.bestTimeMs)??null,d=(i==null?void 0:i.bestMoves)??null;(r===null||n<r)&&(r=n,a=!0),(d===null||s<d)&&(d=s,o=!0);const u={bestTimeMs:r,bestMoves:d,updatedAt:Date.now()};try{const m=this.getStorage();if(m){const b=this.getRecordKey(t,e);m.setItem(b,JSON.stringify(u))}}catch{}return{isNewBestTime:a,isNewBestMoves:o,bestTimeMs:r,bestMoves:d}}startTimer(t){t&&(this.tickCallback=t),this.timerIntervalId===null&&(this.startTime=performance.now(),this.timerIntervalId=setInterval(()=>{const e=this.getElapsedMs();this.tickCallback&&this.tickCallback(P(e),e)},100))}stopTimer(){return this.startTime!==null&&(this.accumulatedMs+=performance.now()-this.startTime,this.startTime=null),this.timerIntervalId!==null&&(clearInterval(this.timerIntervalId),this.timerIntervalId=null),this.accumulatedMs}resetTimer(){this.stopTimer(),this.accumulatedMs=0,this.startTime=null,this.tickCallback&&this.tickCallback(P(0),0)}getElapsedMs(){let t=this.accumulatedMs;return this.startTime!==null&&(t+=performance.now()-this.startTime),Math.floor(t)}getFormattedTime(){return P(this.getElapsedMs())}isTimerRunning(){return this.timerIntervalId!==null}}const B=new ct;function Q(l,t,e,n){const s=l.getContext("2d");if(!s)return;const i=l.width,a=l.height;s.clearRect(0,0,i,a);const r=(t==="MX"||t==="MY"||t==="MD"||t==="MAD")&&n.complete?n:e;switch(s.save(),s.translate(i/2,a/2),t){case"R90":s.rotate(90*Math.PI/180);break;case"R180":s.rotate(180*Math.PI/180);break;case"R270":s.rotate(270*Math.PI/180);break;case"MX":s.scale(1,-1);break;case"MY":s.scale(-1,1);break;case"MD":s.rotate(90*Math.PI/180),s.scale(-1,1);break;case"MAD":s.rotate(-90*Math.PI/180),s.scale(-1,1);break}s.drawImage(r,-i/2,-a/2,i,a),s.restore()}class dt{constructor(t,e,n,s=3){h(this,"boardEl");h(this,"trailCanvas");h(this,"ctx",null);h(this,"onAction");h(this,"points",[]);h(this,"isPointerDown",!1);h(this,"startCell",null);h(this,"isLocked",!1);h(this,"boardSize",3);h(this,"cell11Mode","row");h(this,"longPressTimer",null);h(this,"singleTapTimer",null);h(this,"lastTapInfo",null);h(this,"isLongPressTriggered",!1);this.boardEl=t,this.trailCanvas=e,this.ctx=e.getContext("2d"),this.onAction=n,this.boardSize=s,this.bindEvents(),this.syncCanvasSize(),window.addEventListener("resize",()=>this.syncCanvasSize())}setBoardSize(t){this.boardSize=t}setLocked(t){this.isLocked=t}getCell11Mode(){return this.cell11Mode}toggleCell11Mode(){return this.cell11Mode=this.cell11Mode==="row"?"col":"row",this.cell11Mode}syncCanvasSize(){const t=this.boardEl.getBoundingClientRect();this.trailCanvas.width=t.width,this.trailCanvas.height=t.height}getLineForCell(t,e){const n=this.boardSize,s=k(n);return t===0&&e===0?this.cell11Mode==="col"?s.find(i=>i.type==="col"&&i.idx===0)||null:s.find(i=>i.type==="row"&&i.idx===0)||null:e===0&&t>0?s.find(i=>i.type==="row"&&i.idx===t)||null:t===0&&e>0?s.find(i=>i.type==="col"&&i.idx===e)||null:t===n-1&&e===n-1?s.find(i=>i.type==="diag"&&i.idx==="main")||null:t===1&&e===n-1?s.find(i=>i.type==="diag"&&i.idx==="anti")||null:t===Math.floor(n/2)&&e===Math.floor(n/2)&&s.find(i=>i.type==="row"&&i.idx===t)||null}bindEvents(){this.boardEl.addEventListener("pointerdown",e=>{if(this.isLocked)return;const n=e.target;if(n&&n.classList.contains("dot-toggle-11"))return;const s=e.target.closest(".cell-box");let i=-1,a=-1;if(s&&s.parentElement===this.boardEl){const u=Array.from(this.boardEl.children).indexOf(s);u!==-1&&(i=Math.floor(u/this.boardSize),a=u%this.boardSize)}if(i===-1||a===-1){const u=this.boardEl.getBoundingClientRect(),m=e.clientX-u.left,b=e.clientY-u.top,g=u.width/this.boardSize,v=u.height/this.boardSize;a=Math.max(0,Math.min(this.boardSize-1,Math.floor(m/g))),i=Math.max(0,Math.min(this.boardSize-1,Math.floor(b/v)))}const o=this.getLineForCell(i,a);if(!o)return;try{this.boardEl.setPointerCapture(e.pointerId)}catch{}this.isPointerDown=!0,this.isLongPressTriggered=!1,this.startCell={r:i,c:a,target:o};const r=e.clientX,d=e.clientY;this.points=[{x:r,y:d}],this.longPressTimer&&clearTimeout(this.longPressTimer),this.longPressTimer=setTimeout(()=>{this.isPointerDown&&!this.isLongPressTriggered&&(this.isLongPressTriggered=!0,this.clearTrail(),this.startCell&&this.onAction(this.startCell.target,"R270"))},380)}),this.boardEl.addEventListener("pointermove",e=>{if(this.isPointerDown){if(this.points.push({x:e.clientX,y:e.clientY}),this.points.length>1){const n=this.points[0];Math.hypot(e.clientX-n.x,e.clientY-n.y)>35&&this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null)}this.drawTrail()}});const t=e=>{if(this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null),!this.isPointerDown||!this.startCell){this.isPointerDown=!1,this.clearTrail();return}if(this.isPointerDown=!1,this.isLongPressTriggered){this.isLongPressTriggered=!1,this.clearTrail();return}const n=this.points[0],s=e.clientX||n.x,i=e.clientY||n.y,a=s-n.x,o=i-n.y,r=Math.hypot(a,o),d=this.startCell.target,u=this.startCell.r,m=this.startCell.c;if(this.clearTrail(),r<35){const g=performance.now(),v=this.lastTapInfo&&this.lastTapInfo.r===u&&this.lastTapInfo.c===m;if(this.singleTapTimer&&v&&g-this.lastTapInfo.time<=380){clearTimeout(this.singleTapTimer),this.singleTapTimer=null,this.lastTapInfo=null,this.onAction(d,"R180");return}this.singleTapTimer&&clearTimeout(this.singleTapTimer),this.lastTapInfo={r:u,c:m,time:g};const y=d;this.singleTapTimer=setTimeout(()=>{this.onAction(y,"R90"),this.singleTapTimer=null,this.lastTapInfo=null},190);return}this.singleTapTimer&&(clearTimeout(this.singleTapTimer),this.singleTapTimer=null,this.lastTapInfo=null);const b=Math.atan2(o,a)*180/Math.PI;Math.abs(b)<=30||Math.abs(b)>=150?this.onAction(d,"MX"):Math.abs(b)>=60&&Math.abs(b)<=120?this.onAction(d,"MY"):b>30&&b<60||b>-150&&b<-120?this.onAction(d,"MD"):b>-60&&b<-30||b>120&&b<150?this.onAction(d,"MAD"):Math.abs(a)>=Math.abs(o)?this.onAction(d,"MX"):this.onAction(d,"MY")};this.boardEl.addEventListener("pointerup",t),this.boardEl.addEventListener("pointercancel",t),window.addEventListener("pointerup",t)}drawTrail(){}clearTrail(){this.ctx&&(this.ctx.clearRect(0,0,this.trailCanvas.width,this.trailCanvas.height),this.points=[])}}function ut(l,t){switch(t){case"MX":return`
        <div class="math-report-box">
          <div class="math-report-title">↕ 가로축 거울 대칭 반사 (Horizontal Reflection: <i>M<sub>X</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 사상</b>: 가로 중심선(X축)을 거울축으로 삼아 (<i>x</i>, <i>y</i>) ↦ (<i>x</i>, -<i>y</i>)로 반전합니다.</li>
            <li><b>위상 소거 성질</b>: <i>M<sub>X</sub></i> ∘ <i>M<sub>X</sub></i> = <i>ID</i> 성질을 통해 상하 뒤집힘을 한 번에 해소합니다.</li>
            <li><b>대칭 분해 관계</b>: <i>M<sub>X</sub></i> = <i>M<sub>D</sub></i> ∘ <i>R</i>₉₀ = <i>R</i>₉₀ ∘ <i>M<sub>AD</sub></i> 입니다.</li>
            <li><b>라인 수렴 효과</b>: ${l} 상의 모든 타일의 상하 패리티를 통일합니다.</li>
          </ul>
        </div>
      `;case"MY":return`
        <div class="math-report-box">
          <div class="math-report-title">↔ 세로축 거울 대칭 반사 (Vertical Reflection: <i>M<sub>Y</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 사상</b>: 세로 중심선(Y축)을 거울축으로 삼아 (<i>x</i>, <i>y</i>) ↦ (-<i>x</i>, <i>y</i>)로 반전합니다.</li>
            <li><b>위상 소거 성질</b>: <i>M<sub>Y</sub></i> ∘ <i>M<sub>Y</sub></i> = <i>ID</i> 성질을 통해 좌우 뒤집힘을 즉시 원상 복구합니다.</li>
            <li><b>대칭 분해 관계</b>: <i>M<sub>Y</sub></i> = <i>R</i>₉₀ ∘ <i>M<sub>D</sub></i> = <i>M<sub>AD</sub></i> ∘ <i>R</i>₉₀ 입니다.</li>
            <li><b>라인 수렴 효과</b>: ${l} 상의 모든 타일의 좌우 거울상을 소거합니다.</li>
          </ul>
        </div>
      `;case"MD":return`
        <div class="math-report-box">
          <div class="math-report-title">⤢ 주대각 거울 대칭 전치 (Main Diagonal Reflection: <i>M<sub>D</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 전치</b>: 주대각선(↖-↘, <i>y</i> = <i>x</i>)을 기준으로 (<i>x</i>, <i>y</i>) ↦ (<i>y</i>, <i>x</i>) 전치합니다.</li>
            <li><b>회전의 대칭 분해 (Cartan-Dieudonné)</b>: 90° 회전은 <i>R</i>₉₀ = <i>M<sub>D</sub></i> ∘ <i>M<sub>X</sub></i> 로 완벽히 분해됩니다. 행과 열 사이의 비가환 뒤틀림을 풀어내는 핵심 축입니다.</li>
            <li><b>라인 수렴 효과</b>: ${l} 상의 주대각 거울 패리티 불일치를 상쇄합니다.</li>
          </ul>
        </div>
      `;case"MAD":return`
        <div class="math-report-box">
          <div class="math-report-title">⤡ 부대각 거울 대칭 반사 (Anti-Diagonal Reflection: <i>M<sub>AD</sub></i>)</div>
          <ul class="math-report-list">
            <li><b>대칭축 및 좌표 사상</b>: 부대각선(↗-↙, <i>y</i> = -<i>x</i>)을 기준으로 (<i>x</i>, <i>y</i>) ↦ (-<i>y</i>, -<i>x</i>)로 전치 반전합니다.</li>
            <li><b>분해 관계</b>: <i>R</i>₂₇₀ = <i>M<sub>AD</sub></i> ∘ <i>M<sub>X</sub></i> 입니다.</li>
            <li><b>라인 수렴 효과</b>: ${l} 상의 부대각선 방향 위상차를 정렬합니다.</li>
          </ul>
        </div>
      `;case"R90":return`
        <div class="math-report-box">
          <div class="math-report-title">↻ 90° 시계방향 회전 (Quarter Rotation: <i>R</i>₉₀)</div>
          <ul class="math-report-list">
            <li><b>순환군 구조</b>: 4차 순환군(<i>C</i>₄)의 생성원(Generator)으로 좌표를 (<i>x</i>, <i>y</i>) ↦ (<i>y</i>, -<i>x</i>)로 90° 회전합니다.</li>
            <li><b>두 반사의 합성</b>: <i>R</i>₉₀ = <i>M<sub>D</sub></i> ∘ <i>M<sub>X</sub></i> (45° 교각을 이루는 두 거울 대칭축의 합성)으로 유도됩니다.</li>
            <li><b>역원 수렴</b>: <i>R</i>₂₇₀ ∘ <i>R</i>₉₀ = <i>ID</i>(0° 원본)로 완성합니다.</li>
            <li><b>라인 수렴 효과</b>: ${l} 상의 각도 불일치를 90° 회전하여 해소합니다.</li>
          </ul>
        </div>
      `;case"R180":return`
        <div class="math-report-box">
          <div class="math-report-title">🔄 180° 점대칭 회전 (Half Rotation: <i>R</i>₁₈₀)</div>
          <ul class="math-report-list">
            <li><b>점대칭 구조</b>: 원점 중심 대칭으로 (<i>x</i>, <i>y</i>) ↦ (-<i>x</i>, -<i>y</i>)로 반전합니다.</li>
            <li><b>직교 두 반사의 합성</b>: <i>R</i>₁₈₀ = <i>M<sub>X</sub></i> ∘ <i>M<sub>Y</sub></i> = <i>M<sub>D</sub></i> ∘ <i>M<sub>AD</sub></i>. 클라인 4원군(<i>V</i>₄)의 중심 원소입니다.</li>
            <li><b>2차 대합 성질</b>: <i>R</i>₁₈₀ ∘ <i>R</i>₁₈₀ = <i>ID</i> 이므로 180° 돌아간 타일을 즉시 원위치로 환원합니다.</li>
          </ul>
        </div>
      `;case"R270":return`
        <div class="math-report-box">
          <div class="math-report-title">↺ 270° 반시계 회전 (Counter Rotation: <i>R</i>₂₇₀)</div>
          <ul class="math-report-list">
            <li><b>순환군 구조</b>: <i>R</i>₉₀의 역원(<i>R</i>₉₀⁻¹ = <i>R</i>₂₇₀)으로 좌표를 (<i>x</i>, <i>y</i>) ↦ (-<i>y</i>, <i>x</i>)로 회전합니다.</li>
            <li><b>역원 수렴</b>: <i>R</i>₉₀ ∘ <i>R</i>₂₇₀ = <i>ID</i> 로 정위치 복원합니다.</li>
            <li><b>라인 수렴 효과</b>: ${l} 타일들을 반시계방향 90° 회전시켜 위상을 일치시킵니다.</li>
          </ul>
        </div>
      `;default:return`
        <div class="math-report-box">
          <div class="math-report-title">✨ 항등원 합성 (Identity Convergence)</div>
          <ul class="math-report-list">
            <li>${l} 타일에 해당 역연산을 합성하여 0번 원본(ID)으로 복원합니다.</li>
          </ul>
        </div>
      `}}function ht(l,t,e){var g,v,y,T;const n=document.createElement("div");n.className="modal-overlay";const s=document.createElement("div");s.className="modal-content";let i="";l.length===0?i='<div style="text-align: center; color: #4ade80; padding: 20px;">🎉 이미 모든 타일이 완성된 상태입니다!</div>':i=l.map((x,M)=>`
      <div class="solution-step-card" data-step-idx="${M}">
        <div class="step-card-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="step-badge">[${M+1}]</span>
            <span style="font-weight:700; color:#f8fafc;">${x.line.label}</span>
            <span style="color:#64748b;">➔</span>
            <span class="step-op-code">${x.op}</span>
          </div>
          <button class="btn-math-why" data-step-idx="${M}">💡 원리</button>
        </div>
        <div class="math-report-container" id="math-report-${M}" style="display:none;">
          ${ut(x.line.label,x.op)}
        </div>
      </div>
    `).join(""),s.innerHTML=`
    <div class="modal-header">
      <div class="modal-title">📖 해설 및 수학적 원리</div>
      <button class="btn-close">&times;</button>
    </div>

    <!-- 탭 선택 헤더 -->
    <div class="modal-tab-bar">
      <button class="modal-tab-btn active" id="tab-btn-steps">🎯 최단 풀이 (${l.length}수)</button>
      <button class="modal-tab-btn" id="tab-btn-theory">📐 군론 수학 원리</button>
    </div>

    <!-- 탭 1: 단계별 풀이 화면 -->
    <div class="modal-tab-content active" id="tab-view-steps">
      <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">
        각 단계의 <b>[💡 원리]</b> 버튼을 누르면 대수학적 작용 원리를 확인할 수 있습니다.
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
        ${i}
      </div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        ${l.length>0?'<button id="btn-modal-autoplay" class="btn-action primary" style="flex:1;">▶ 자동 풀기</button>':""}
        <button id="btn-modal-close" class="btn-action" style="flex:1;">닫기</button>
      </div>
    </div>

    <!-- 탭 2: 군론 대수학 원리 총람 -->
    <div class="modal-tab-content" id="tab-view-theory" style="display:none; max-height: 320px; overflow-y: auto; padding-right: 4px;">
      <div class="theory-section">
        <h4 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.95rem;">🏛️ 1. $D_4$ 군론(Dihedral Group)과 8대 대칭</h4>
        <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.45; margin:0 0 8px 0;">
          정사각형의 대칭을 나타내는 8차 이면군 $D_4$는 4개의 순수 회전($C_4$)과 4개의 거울 반사($sC_4$)로 구성됩니다.
        </p>
        <div style="background:#090d16; padding:8px; border-radius:8px; border:1px solid #334155; font-size:0.75rem; color:#94a3b8; line-height:1.5;">
          • <b>회전</b>: ID(0°), R90(90° ↻), R180(180° 🔄), R270(270° ↺)<br/>
          • <b>반사</b>: MX(가로 상하), MY(세로 좌우), MD(주대각 ↖), MAD(부대각 ↗)
        </div>
      </div>

      <div class="theory-section" style="margin-top:10px;">
        <h4 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.95rem;">⚡ 2. 2단계(2-Phase) 해법과 신의 숫자(8수)</h4>
        <div style="background:#090d16; padding:8px; border-radius:8px; border:1px solid #334155; font-size:0.75rem; color:#94a3b8; line-height:1.5;">
          • <b>Phase 1 (반사 소거, 최대 5수)</b>: 반사 준동형사상 $\\pi: D_4 \\to \\{+1, -1\\}$을 이용해 모든 뒤집힌 타일을 가환적으로 소거하여 순수 회전 상태로 통일합니다.<br/>
          • <b>Phase 2 (회전 소거, 최대 3수)</b>: $\\mathbb{Z}_4$ 상의 피벗 소거법으로 잔여 회전을 0° 원본(ID)으로 일치시킵니다.<br/>
          • <b>신의 숫자(God's Number)</b>: 임의의 섞인 행렬 큐브 상태는 <b>최대 8수 이내</b>에 반드시 해결됩니다.
        </div>
      </div>

      <div class="theory-section" style="margin-top:10px;">
        <h4 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.95rem;">💡 3. 카르탕-디외도네 대칭 분해 정리</h4>
        <p style="font-size:0.8rem; color:#cbd5e1; line-height:1.45; margin:0;">
          모든 90° 회전은 45° 교각을 이루는 두 거울 대칭의 합성(예: $R_{90} = M_D \\circ M_X$)으로 분해되며, 행렬 큐브의 라인 연산은 이 비가환 대칭 군론의 궤도를 정확히 따릅니다.
        </p>
      </div>

      <div style="margin-top: 14px;">
        <button id="btn-theory-back" class="btn-action" style="width:100%;">← 단계별 풀이로 돌아가기</button>
      </div>
    </div>
  `,n.appendChild(s),document.body.appendChild(n);const a=s.querySelector("#tab-btn-steps"),o=s.querySelector("#tab-btn-theory"),r=s.querySelector("#tab-view-steps"),d=s.querySelector("#tab-view-theory"),u=()=>{a.classList.add("active"),o.classList.remove("active"),r.style.display="block",d.style.display="none"},m=()=>{o.classList.add("active"),a.classList.remove("active"),d.style.display="block",r.style.display="none"};a.addEventListener("click",u),o.addEventListener("click",m),(g=s.querySelector("#btn-theory-back"))==null||g.addEventListener("click",u),s.querySelectorAll(".btn-math-why").forEach(x=>{x.addEventListener("click",M=>{const C=M.currentTarget.dataset.stepIdx,I=s.querySelector(`#math-report-${C}`);if(I){const p=I.style.display==="none";I.style.display=p?"block":"none",M.currentTarget.classList.toggle("active",p)}})});const b=()=>{n.remove()};(v=s.querySelector(".btn-close"))==null||v.addEventListener("click",b),(y=s.querySelector("#btn-modal-close"))==null||y.addEventListener("click",b),(T=s.querySelector("#btn-modal-autoplay"))==null||T.addEventListener("click",()=>{n.remove(),t()})}function bt(){var a,o;const l=document.getElementById("about-modal-overlay");l&&l.remove();const t=document.createElement("div");t.id="about-modal-overlay",t.className="modal-overlay",t.innerHTML=`
    <div class="modal-content about-modal-content">
      <div class="modal-header">
        <div class="modal-title">🏆 작품 소개 & 수학적 배경</div>
        <button id="btn-about-close" class="btn-close" aria-label="닫기">✕</button>
      </div>

      <!-- 탭 바 -->
      <div class="modal-tab-bar" id="about-tab-bar">
        <button class="modal-tab-btn active" data-tab="intro">💡 기획 의도</button>
        <button class="modal-tab-btn" data-tab="math">📐 D₄ 대칭군</button>
        <button class="modal-tab-btn" data-tab="god8">⚡ 신의 숫자 8</button>
        <button class="modal-tab-btn" data-tab="edu">🎓 교육적 효과</button>
      </div>

      <!-- 탭 내용 영역 -->
      <div class="about-tab-body">
        <!-- 1. 기획 의도 -->
        <div class="about-tab-pane active" id="pane-intro">
          <div class="about-card">
            <div class="about-card-badge">🧩 개념의 재해석</div>
            <h4 class="about-card-title">루빅스 큐브의 3차원 회전을 2차원 행렬 대칭군으로</h4>
            <p class="about-desc">
              기존의 3차원 루빅스 큐브는 공간 조작이 복잡하고 모바일 터치 제어가 어렵다는 한계가 있었습니다.
              <strong>행렬 큐브(Matrix Cube)</strong>는 이를 <strong>$N \\times N$ 평면 행렬의 대칭 변환</strong>으로 혁신적으로 재해석하여,
              모바일 화면에서 직관적인 탭·스와이프 제스처만으로 즐길 수 있는 신개념 수학 퍼즐입니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">🐕 감성적 비주얼</div>
            <h4 class="about-card-title">귀여운 웰시코기 강아지와 함께하는 직관적 인지</h4>
            <p class="about-desc">
              딱딱한 숫자나 기호 대신 귀여운 강아지의 정면·뒤통수 및 꼬리 흔들기 애니메이션을 통해
              타일의 회전(0°, 90°, 180°, 270°)과 대칭(앞뒤 반전) 상태를 한눈에 직관적으로 파악할 수 있도록 설계했습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">📱 완벽한 PWA 지원</div>
            <h4 class="about-card-title">설치 없는 즉시 실행 & 오프라인 완벽 구동</h4>
            <p class="about-desc">
              Progressive Web App(PWA) 기술을 탑재하여 앱스토어 설치 없이 홈 화면에 추가할 수 있으며,
              오프라인 환경에서도 100% 동일한 부드러운 플레이가 가능합니다.
            </p>
          </div>
        </div>

        <!-- 2. D4 대칭군 수학 -->
        <div class="about-tab-pane" id="pane-math">
          <div class="about-card">
            <div class="about-card-badge">대수학 군론 (Group Theory)</div>
            <h4 class="about-card-title">정사각 2차원 대칭군 $D_4$ (Dihedral Group)</h4>
            <p class="about-desc">
              정사각형이 갖는 모든 8개의 대칭 변환을 엄밀한 수학적 군 연산 테이블(Cayley Table)로 모델링했습니다:
            </p>
            <ul class="about-list">
              <li><strong>항등원 (ID, 0)</strong>: 원래 상태 (0° 회전)</li>
              <li><strong>회전원 (R90, R180, R270)</strong>: 시계 방향 90°, 180°, 270° 회전 ($C_4$ 부분군)</li>
              <li><strong>축 대칭원 (MX, MY)</strong>: 가로 X축 상하 반전, 세로 Y축 좌우 반전</li>
              <li><strong>대각 대칭원 (MD, MAD)</strong>: 주대각선(↖-↘) 및 부대각선(↗-↙) 대칭</li>
            </ul>
          </div>

          <div class="about-card">
            <div class="about-card-badge">비가환 연산 (Non-commutative)</div>
            <h4 class="about-card-title">연산 순서가 결과를 바꾸는 깊이 있는 퍼즐성</h4>
            <p class="about-desc">
              대칭군 연산은 교환법칙이 성립하지 않습니다 ($A \\circ B \\neq B \\circ A$).
              예를 들어 가로 대칭 후 90도 회전한 결과는 90도 회전 후 가로 대칭한 결과와 완전히 다릅니다.
              이러한 비가환 대수학적 특성이 깊이 있는 수읽기와 전략적 퍼즐 풀이의 묘미를 선사합니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">단계별 부분군 모드</div>
            <h4 class="about-card-title">수학적 수준에 맞춘 $C_2 \\to V_4 \\to D_4$ 학습 곡선</h4>
            <p class="about-desc">
              - <strong>$C_2$ 모드</strong>: 180도 회전만 사용하는 순환군 (가장 쉬운 입문)<br>
              - <strong>$V_4$ 모드</strong>: 클라인 4원군 (가로·세로 반전 및 180도 회전, 가환군)<br>
              - <strong>$D_4$ 모드</strong>: 완전한 8개 원소 정사면군 (본격적인 최상위 도전)
            </p>
          </div>
        </div>

        <!-- 3. 신의 숫자 8 -->
        <div class="about-tab-pane" id="pane-god8">
          <div class="about-card highlight">
            <div class="about-card-badge gold">⚡ 수학적 정리 & 증명</div>
            <h4 class="about-card-title">행렬 큐브의 '신의 숫자'는 단 8수 (God's Number 8)</h4>
            <p class="about-desc">
              루빅스 큐브의 모든 배치가 최대 20수 이내에 풀린다는 사실이 '신의 숫자 20'으로 증명되었듯,
              <strong>3×3 행렬 큐브는 어떠한 상태에서 시작하더라도 최단 8수 이내에 100% 원상 복원이 가능함</strong>을
              양방향 BFS(Bidirectional Breadth-First Search) 알고리즘을 통해 수학적으로 규명 및 전수 검증했습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">초고속 최단수 솔버</div>
            <h4 class="about-card-title">비트마스크 양방향 BFS 엔진</h4>
            <p class="about-desc">
              - 각 타일의 8가지 상태를 3비트로 압축하여 64비트 정수 하나로 전체 보드를 표현.<br>
              - 시작 상태와 목표 상태(모두 0) 양방향에서 동시에 너비 우선 탐색을 수행하여 탐색 공간을 $O(b^d)$에서 $O(b^{d/2})$로 기하급수적 단축.<br>
              - 모바일 브라우저 환경에서도 0.05초 이내에 완벽한 최단수 해법 및 실시간 힌트를 산출합니다.
            </p>
          </div>
        </div>

        <!-- 4. 교육적 효과 -->
        <div class="about-tab-pane" id="pane-edu">
          <div class="about-card">
            <div class="about-card-badge">STEM / 수학교육</div>
            <h4 class="about-card-title">대학 수학(군론)을 초·중·고등학생도 즐기는 에듀테인먼트</h4>
            <p class="about-desc">
              일반적으로 대학 수학과에서 다루는 추상대수학의 '대칭군(Symmetric/Dihedral Group)' 개념을
              공식 암기가 아닌 <strong>손가락 터치와 시각적 회전 피드백</strong>을 통해
              어린 학생부터 성인까지 자연스럽게 '연산', '항등원', '역원', '합성'의 원리를 체득할 수 있습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">인터랙티브 경험</div>
            <h4 class="about-card-title">피치 상승 콤보 사운드 & 햅틱 촉각 피드백</h4>
            <p class="about-desc">
              연속 조작 시 음악적 음계(도-레-미-파-솔-라-도)로 상승하는 Web Audio API 신디사이저 사운드와,
              성공 시 터지는 화려한 컨페티 폭죽 및 햅틱 진동으로 퍼즐 풀이의 쾌감을 극대화했습니다.
            </p>
          </div>

          <div class="about-card">
            <div class="about-card-badge">알고리즘적 사고력 증진</div>
            <h4 class="about-card-title">수학적 이유(Why)가 적힌 단계별 해설서 제공</h4>
            <p class="about-desc">
              단순히 답만 알려주는 것이 아니라, 각 조작 단계마다 '어떤 성분이 어떻게 상쇄되어 항등원으로 수렴하는지'
              수학적 해설을 제공하여 논리적 문제 해결 능력을 신장시킵니다.
            </p>
          </div>
        </div>
      </div>

      <div class="modal-footer" style="display: flex; justify-content: flex-end; margin-top: 10px;">
        <button id="btn-about-confirm" class="btn-action primary" style="width: 100%;">확인 및 플레이 시작</button>
      </div>
    </div>
  `,document.body.appendChild(t);const e=()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),250)};(a=t.querySelector("#btn-about-close"))==null||a.addEventListener("click",e),(o=t.querySelector("#btn-about-confirm"))==null||o.addEventListener("click",e),t.addEventListener("click",r=>{r.target===t&&e()});const n=r=>{r.key==="Escape"&&(e(),window.removeEventListener("keydown",n))};window.addEventListener("keydown",n);const s=t.querySelectorAll(".modal-tab-btn"),i=t.querySelectorAll(".about-tab-pane");s.forEach(r=>{r.addEventListener("click",()=>{const d=r.getAttribute("data-tab");s.forEach(u=>u.classList.remove("active")),r.classList.add("active"),i.forEach(u=>{u.classList.remove("active"),u.id===`pane-${d}`&&u.classList.add("active")})})})}const J="matrix_cube_tutorial_completed";function mt(){try{return localStorage.getItem(J)==="true"}catch{return!1}}function H(){try{localStorage.setItem(J,"true")}catch{}}function W(l){switch(l){case c.ID:return"0";case c.MX:return"X";case c.MY:return"Y";case c.R180:return"180";case c.R90:return"90";case c.R270:return"270";case c.MD:return"D";case c.MAD:return"AD";default:return"0"}}class pt{constructor(){h(this,"isOpen",!1);h(this,"currentStep",1);h(this,"boardOps",Array(9).fill(c.ID));h(this,"step3SubStep",1);h(this,"step4TapCount",0);h(this,"dragStart",null);h(this,"autoTimer",null);h(this,"imgDogFront",null);h(this,"imgDogBack",null);if(typeof Image<"u"){this.imgDogFront=new Image,this.imgDogBack=new Image,this.imgDogFront.src="assets/dog_front.png",this.imgDogBack.src="assets/dog_back.png";const t=()=>{this.isOpen&&this.renderBoard()};this.imgDogFront.onload=t,this.imgDogBack.onload=t}}open(t=1){this.isOpen=!0,this.currentStep=Math.max(1,Math.min(5,t)),this.step3SubStep=1,this.step4TapCount=0,this.boardOps=Array(9).fill(c.ID),this.clearAutoTimer(),this.buildDOM(),this.updateStepUI(),this.renderBoard(),this.removePulse(),f.playTap()}close(){this.clearAutoTimer(),this.isOpen=!1;const t=document.getElementById("tutorial-modal-overlay");t&&(t.classList.add("hidden"),setTimeout(()=>t.remove(),250))}skip(){H(),this.close(),f.playTap()}nextStep(){this.clearAutoTimer(),this.currentStep<5?(this.currentStep++,this.updateStepUI(),f.playTap()):this.completeTutorial()}completeTutorial(){H(),this.close(),f.playWin()}clearAutoTimer(){this.autoTimer&&(clearTimeout(this.autoTimer),this.autoTimer=null)}removePulse(){const t=document.getElementById("btn-header-tutorial");t&&t.classList.remove("pulse-active")}buildDOM(){const t=document.getElementById("tutorial-modal-overlay");t&&t.remove();const e=document.createElement("div");e.id="tutorial-modal-overlay",e.className="tutorial-overlay",e.innerHTML=`
      <div class="tutorial-card">
        <!-- 헤더 -->
        <div class="tutorial-header">
          <div class="tutorial-header-left">
            <span class="tutorial-header-badge">30초 마스터</span>
            <span class="tutorial-header-title">🎓 대칭 & 회전 연산 튜토리얼</span>
          </div>
          <button id="btn-tut-close" class="tutorial-header-close" title="닫기">✕</button>
        </div>

        <!-- 스텝 프로그레스 바 -->
        <div class="tutorial-steps-bar">
          <div class="tut-step-dot" data-step="1"></div>
          <div class="tut-step-dot" data-step="2"></div>
          <div class="tut-step-dot" data-step="3"></div>
          <div class="tut-step-dot" data-step="4"></div>
          <div class="tut-step-dot" data-step="5"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 첫 번째 대칭</div>
            <div class="tut-guide-main-text" id="tut-main-text">1행을 가로(↔)로 쓱 그어보세요!</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">손가락으로 1행 강아지들을 왼쪽에서 오른쪽으로 스와이프하세요.</div>
          </div>

          <!-- 3x3 인터랙티브 보드 -->
          <div class="tut-board-wrapper" id="tut-board-wrapper">
            <div class="tut-board-grid" id="tut-board-grid"></div>
            <!-- 제스처 가이드 레이어 (손가락 및 화살표) -->
            <div class="tut-gesture-layer" id="tut-gesture-layer">
              <div class="tut-finger tut-finger-swipe-x" id="tut-finger">👆</div>
            </div>
          </div>

          <!-- 공식 발견 팝업 카드 (성공 시 노출) -->
          <div class="tut-formula-card" id="tut-formula-card" style="display: none;">
            <span class="tut-formula-badge" id="tut-formula-badge">💡 연산 공식 발견</span>
            <div class="tut-formula-text" id="tut-formula-text">MX + MY = R180</div>
            <div class="tut-formula-desc" id="tut-formula-desc">가로 대칭 후 세로 대칭을 적용하면 180° 회전이 됩니다!</div>
          </div>

          <!-- 스텝 5 최종 마스터 카드 (스텝 5에서만 노출) -->
          <div class="tut-master-card" id="tut-master-card" style="display: none;">
            <div class="tut-master-badge-icon">🏆</div>
            <div class="tut-master-title">군론 대칭 연산 완전 정복!</div>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 10px 0;">대칭과 회전의 핵심 연산 관계를 모두 습득하셨습니다.</p>
            <div class="tut-rules-summary-list">
              <div class="tut-rule-item"><span>1️⃣</span> <span><b>MX + MY = R180</b> : 직교 대칭 2번 합성은 180° 회전</span></div>
              <div class="tut-rule-item"><span>2️⃣</span> <span><b>S² = ID (자기상쇄)</b> : 대칭 연산은 2번 반복하면 제자리</span></div>
              <div class="tut-rule-item"><span>3️⃣</span> <span><b>R⁴ = ID (4주기)</b> : 90° 회전은 4번 누적 시 360° 원상복구</span></div>
            </div>
          </div>
        </div>

        <!-- 하단 컨트롤 버튼 바 -->
        <div class="tutorial-footer">
          <button id="btn-tut-skip" class="tut-btn-skip">건너뛰기</button>
          <button id="btn-tut-action" class="tut-btn-action">
            <span id="tut-btn-action-text">다음 단계 (1/5) ➔</span>
          </button>
        </div>
      </div>
    `,document.body.appendChild(e);const n=document.getElementById("tut-board-grid");if(n){n.innerHTML="";for(let s=0;s<9;s++){const i=document.createElement("div");i.className="tut-cell-box",i.id=`tut-cell-${s}`,i.dataset.index=String(s);const a=document.createElement("canvas");a.className="tut-cell-canvas",a.width=100,a.height=100,i.appendChild(a);const o=document.createElement("span");o.className="tut-cell-badge",o.textContent="0",i.appendChild(o),n.appendChild(i)}}this.bindEvents()}bindEvents(){const t=document.getElementById("tutorial-modal-overlay"),e=document.getElementById("btn-tut-close"),n=document.getElementById("btn-tut-skip"),s=document.getElementById("btn-tut-action"),i=document.getElementById("tut-board-wrapper");e==null||e.addEventListener("click",()=>this.close()),n==null||n.addEventListener("click",()=>this.skip()),s==null||s.addEventListener("click",()=>this.handleActionClick()),t==null||t.addEventListener("click",a=>{a.target===t&&this.close()}),i&&(i.addEventListener("touchstart",a=>{if(a.touches&&a.touches.length>0){a.preventDefault();const o=a.touches[0],r=i.getBoundingClientRect();this.handleGestureStart(o.clientX-r.left,o.clientY-r.top)}},{passive:!1}),i.addEventListener("touchend",a=>{if(a.changedTouches&&a.changedTouches.length>0){a.preventDefault();const o=a.changedTouches[0],r=i.getBoundingClientRect();this.handleGestureEnd(o.clientX-r.left,o.clientY-r.top,r.width,r.height)}},{passive:!1}),i.addEventListener("mousedown",a=>{const o=i.getBoundingClientRect();this.handleGestureStart(a.clientX-o.left,a.clientY-o.top)}),i.addEventListener("mouseup",a=>{const o=i.getBoundingClientRect();this.handleGestureEnd(a.clientX-o.left,a.clientY-o.top,o.width,o.height)}))}updateStepUI(){const t=this.currentStep;document.querySelectorAll(".tut-step-dot").forEach(u=>{const m=parseInt(u.dataset.step||"1",10);u.classList.toggle("active",m===t),u.classList.toggle("completed",m<t)});const e=document.getElementById("tut-step-name"),n=document.getElementById("tut-main-text"),s=document.getElementById("tut-sub-text"),i=document.getElementById("tut-formula-card"),a=document.getElementById("tut-master-card"),o=document.getElementById("tut-board-wrapper"),r=document.getElementById("tut-finger"),d=document.getElementById("tut-btn-action-text");if(!(!e||!n)){switch(i&&(i.style.display="none"),a&&(a.style.display="none"),o&&(o.style.display="block"),this.clearCellHighlights(),t){case 1:e.textContent="STEP 1. 첫 번째 대칭 (가로 뒤집기)",n.textContent="1행을 가로(↔)로 쓱 그어보세요!",s&&(s.textContent="손가락으로 1행 강아지들을 가로질러 스와이프하세요."),r&&(r.className="tut-finger tut-finger-swipe-x",r.textContent="👆"),this.highlightCells([0,1,2],"highlight-row"),this.boardOps=Array(9).fill(c.ID),d&&(d.textContent="직접 해보기 (1/5)"),f.speak("1행을 가로로 쓱 그어보세요!");break;case 2:e.textContent="STEP 2. 두 번째 대칭 ➔ 회전 탄생!",n.textContent="이번엔 1행을 세로(↕)로 한 번 더 그어보세요!",s&&(s.textContent="가로로 뒤집힌 1행을 위아래로 쓱 그어 세로 대칭(MY)을 줍니다."),r&&(r.className="tut-finger tut-finger-swipe-y",r.textContent="👆"),this.highlightCells([0,1,2],"highlight-row"),d&&(d.textContent="직접 해보기 (2/5)"),f.speak("이번엔 1행을 세로로 한 번 더 그어보세요!");break;case 3:this.step3SubStep=1,this.boardOps=Array(9).fill(c.ID),e.textContent="STEP 3. 대칭의 자기상쇄 (2번 = 제자리)",n.textContent="주대각선(↖ ➔ ↘) 방향으로 그어보세요!",s&&(s.textContent="좌상단에서 우하단 대각선으로 시원하게 그어보세요."),r&&(r.className="tut-finger tut-finger-swipe-diag",r.textContent="👆"),this.highlightCells([0,4,8],"highlight-diag"),d&&(d.textContent="직접 해보기 (3/5)"),f.speak("주대각선 방향으로 그어보세요!");break;case 4:this.step4TapCount=0,this.boardOps=Array(9).fill(c.ID),e.textContent="STEP 4. 탭 회전의 4주기 (360° 제자리)",n.textContent="중앙 타일을 콕 탭해보세요! (0/4회)",s&&(s.textContent="중앙 강아지를 탭할 때마다 90°씩 순환 회전합니다."),r&&(r.className="tut-finger tut-finger-tap",r.textContent="👉"),this.highlightCells([4],"highlight-center"),d&&(d.textContent="직접 해보기 (4/5)"),f.speak("중앙 타일을 콕 탭해보세요!");break;case 5:e.textContent="STEP 5. 마스터 인증 완료 🎉",n.textContent="축하합니다! 대칭과 회전 연산 마스터!",s&&(s.textContent="이제 실전 행렬 큐브 퍼즐에서 놀라운 실력을 발휘해 보세요!"),o&&(o.style.display="none"),a&&(a.style.display="block"),d&&(d.textContent="🎮 실전 퍼즐 시작하기"),f.playClear(),f.speak("축하합니다! 대칭과 회전 연산을 마스터하셨습니다!");break}this.renderBoard()}}highlightCells(t,e){t.forEach(n=>{const s=document.getElementById(`tut-cell-${n}`);s&&s.classList.add(e)})}clearCellHighlights(){for(let t=0;t<9;t++){const e=document.getElementById(`tut-cell-${t}`);e&&(e.className="tut-cell-box")}}handleGestureStart(t,e){this.dragStart={x:t,y:e,time:Date.now()}}handleGestureEnd(t,e,n,s){if(!this.dragStart)return;const i=t-this.dragStart.x,a=e-this.dragStart.y,o=Math.sqrt(i*i+a*a),r=this.dragStart.y/s,d=this.dragStart.x/n,u=r<.42;this.dragStart=null,this.currentStep===1?(Math.abs(i)>25&&Math.abs(i)>Math.abs(a)*1.1&&u||o<25&&u)&&this.executeStep1Success():this.currentStep===2?(Math.abs(a)>20&&u||o<25&&u)&&this.executeStep2Success():this.currentStep===3?(i>20&&a>20||o<25)&&this.executeStep3Success():this.currentStep===4&&o<35&&d>.25&&d<.75&&r>.25&&r<.75&&this.executeStep4Tap()}executeStep1Success(){this.boardOps[0]=c.MX,this.boardOps[1]=c.MX,this.boardOps[2]=c.MX,this.renderBoard(),f.playFlip();const t=document.getElementById("tut-formula-card"),e=document.getElementById("tut-formula-badge"),n=document.getElementById("tut-formula-text"),s=document.getElementById("tut-formula-desc"),i=document.getElementById("tut-btn-action-text");e&&(e.textContent="💡 1단계 완료: 가로 대칭"),n&&(n.textContent="앞면 (0) ➔ 뒤태 (X)"),s&&(s.textContent="가로(↔)로 그으니 1행 강아지들이 뒤태(X 뱃지)로 뒤집혔습니다!"),t&&(t.style.display="block"),i&&(i.textContent="다음 연산 배우기 ➔"),this.clearAutoTimer(),this.autoTimer=setTimeout(()=>{this.currentStep===1&&this.isOpen&&this.nextStep()},1600)}executeStep2Success(){const t=N(c.MX,c.MY);this.boardOps[0]=t,this.boardOps[1]=t,this.boardOps[2]=t,this.renderBoard(),f.playCombo();const e=document.getElementById("tut-formula-card"),n=document.getElementById("tut-formula-badge"),s=document.getElementById("tut-formula-text"),i=document.getElementById("tut-formula-desc"),a=document.getElementById("tut-btn-action-text");n&&(n.textContent="✨ 대박 공식 발견!"),s&&(s.textContent="MX (가로 대칭) + MY (세로 대칭) = R180 (180° 회전)"),i&&(i.textContent="두 번 뒤집으니 회전이 탄생했습니다! (뒤태 ➔ 180° 거꾸로 선 앞면)"),e&&(e.style.display="block"),a&&(a.textContent="대칭 자기상쇄 배우기 ➔"),this.clearAutoTimer(),this.autoTimer=setTimeout(()=>{this.currentStep===2&&this.isOpen&&this.nextStep()},2e3)}executeStep3Success(){const t=document.getElementById("tut-main-text"),e=document.getElementById("tut-sub-text"),n=document.getElementById("tut-formula-card"),s=document.getElementById("tut-formula-badge"),i=document.getElementById("tut-formula-text"),a=document.getElementById("tut-formula-desc"),o=document.getElementById("tut-btn-action-text");this.step3SubStep===1?([0,4,8].forEach(r=>{this.boardOps[r]=c.MD}),this.renderBoard(),f.playFlip(),this.step3SubStep=2,t&&(t.textContent="한 번 더 같은 주대각선(↖ ➔ ↘)을 그어보세요!"),e&&(e.textContent="대각선 대칭을 한 번 더 적용하면 어떻게 될까요?")):([0,4,8].forEach(r=>{this.boardOps[r]=N(c.MD,c.MD)}),this.renderBoard(),f.playClear(),s&&(s.textContent="✨ 자기상쇄 공식 발견!"),i&&(i.textContent="S² = ID (대칭 2회 = 원래대로 복구)"),a&&(a.textContent="모든 대칭 연산은 2번 누적되면 0번 원본으로 완벽 복원됩니다!"),n&&(n.style.display="block"),o&&(o.textContent="회전 주기 배우기 ➔"),this.clearAutoTimer(),this.autoTimer=setTimeout(()=>{this.currentStep===3&&this.isOpen&&this.nextStep()},2e3))}executeStep4Tap(){this.step4TapCount++;const t=this.step4TapCount,e=document.getElementById("tut-main-text"),n=document.getElementById("tut-sub-text"),s=document.getElementById("tut-formula-card"),i=document.getElementById("tut-formula-badge"),a=document.getElementById("tut-formula-text"),o=document.getElementById("tut-formula-desc"),r=document.getElementById("tut-btn-action-text"),u=[c.ID,c.R90,c.R180,c.R270,c.ID][t%5];if(this.boardOps[4]=u,this.renderBoard(),t<4){f.playTap(),e&&(e.textContent=`중앙 타일을 콕 탭해보세요! (${t}/4회)`);const m=t*90;n&&(n.textContent=`현재 상태: ${m}° 회전 (${W(u)} 뱃지)`)}else f.playClear(),e&&(e.textContent="중앙 타일 4회 탭 완료! (4/4회)"),n&&(n.textContent="360° 한 바퀴 돌아 완벽한 원본(0 뱃지)으로 복구되었습니다!"),i&&(i.textContent="✨ 4주기 순환 공식 발견!"),a&&(a.textContent="R⁴ = ID (90° 회전 4회 = 360° 원상복구)"),o&&(o.textContent="90도 회전은 4번 누적되면 제자리로 돌아오는 순환군(C₄)입니다!"),s&&(s.style.display="block"),r&&(r.textContent="마스터 완료하기 ➔"),this.clearAutoTimer(),this.autoTimer=setTimeout(()=>{this.currentStep===4&&this.isOpen&&this.nextStep()},2e3)}handleActionClick(){this.clearAutoTimer(),this.currentStep===1?this.executeStep1Success():this.currentStep===2?this.executeStep2Success():this.currentStep===3?this.executeStep3Success():this.currentStep===4?this.step4TapCount<4?this.executeStep4Tap():this.nextStep():this.currentStep===5&&this.completeTutorial()}renderBoard(){for(let t=0;t<9;t++){const e=document.getElementById(`tut-cell-${t}`);if(!e)continue;const n=e.querySelector(".tut-cell-canvas"),s=e.querySelector(".tut-cell-badge"),i=this.boardOps[t]||c.ID;n&&this.imgDogFront&&this.imgDogBack&&Q(n,i,this.imgDogFront,this.imgDogBack),s&&(s.textContent=W(i))}}}const gt=new pt;function ft(l=1){gt.open(l)}class vt{constructor(){h(this,"canvas");h(this,"ctx");h(this,"particles",[]);h(this,"animId",null);h(this,"isRunning",!1);h(this,"animate",()=>{if(!(!this.isRunning||!this.ctx)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let t=this.particles.length-1;t>=0;t--){const e=this.particles[t];if(e.x+=e.vx,e.y+=e.vy,e.vy+=.45,e.vx*=.985,e.rotation+=e.vRot,e.vy>0&&(e.alpha-=.007),e.alpha<=0||e.y>this.canvas.height+20){this.particles.splice(t,1);continue}if(this.ctx.save(),this.ctx.globalAlpha=Math.max(0,e.alpha),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.rotation*Math.PI/180),this.ctx.fillStyle=e.color,e.shape==="rect")this.ctx.fillRect(-e.size/2,-e.size/2,e.size,e.size*.6);else if(e.shape==="circle")this.ctx.beginPath(),this.ctx.arc(0,0,e.size/2,0,Math.PI*2),this.ctx.fill();else{this.ctx.beginPath();for(let n=0;n<5;n++)this.ctx.lineTo(Math.cos((18+n*72)*Math.PI/180)*e.size,-Math.sin((18+n*72)*Math.PI/180)*e.size),this.ctx.lineTo(Math.cos((54+n*72)*Math.PI/180)*(e.size/2),-Math.sin((54+n*72)*Math.PI/180)*(e.size/2));this.ctx.closePath(),this.ctx.fill()}this.ctx.restore()}this.particles.length>0&&(this.animId=requestAnimationFrame(this.animate))}});this.canvas=document.createElement("canvas"),this.canvas.id="victory-confetti-canvas",this.canvas.style.position="fixed",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.width="100vw",this.canvas.style.height="100vh",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="999",this.canvas.style.display="none",document.body.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",()=>this.resizeCanvas())}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}launchVictory(t,e,n,s){this.resizeCanvas(),this.canvas.style.display="block",this.particles=[],this.isRunning=!0,navigator.vibrate&&navigator.vibrate([80,40,120,40,250]);const i=["#facc15","#38bdf8","#4ade80","#f43f5e","#a855f7","#fb923c","#ffffff"],a=this.canvas.width,o=this.canvas.height;for(let r=0;r<150;r++){const d=r%2===0;this.particles.push({x:d?Math.random()*(a*.3):a-Math.random()*(a*.3),y:o+10,vx:(d?1:-1)*(Math.random()*8+3)+(Math.random()-.5)*4,vy:-(Math.random()*16+12),size:Math.random()*9+5,color:i[Math.floor(Math.random()*i.length)],rotation:Math.random()*360,vRot:(Math.random()-.5)*12,alpha:1,shape:r%5===0?"star":r%2===0?"rect":"circle"})}this.animate(),this.showVictoryBanner(t,e,n,s),setTimeout(()=>{this.isRunning=!1,this.animId&&cancelAnimationFrame(this.animId),this.ctx&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.style.display="none"},4e3)}showVictoryBanner(t,e,n,s){var u,m;const i=document.getElementById("victory-banner-overlay");i&&i.remove();const a=document.createElement("div");a.id="victory-banner-overlay",a.className="victory-banner-anim";const o=(n==null?void 0:n.isNewBestTime)||(n==null?void 0:n.isNewBestMoves),r=n!=null&&n.timeFormatted?`⏱️ 소요 시간: <b>${n.timeFormatted}</b>`:"";a.innerHTML=`
      <div class="victory-card">
        <div class="victory-trophy">🏆</div>
        ${o?'<div class="badge-new-record">🔥 NEW BEST RECORD!</div>':""}
        <div class="victory-title">PERFECT CLEAR!</div>
        <div class="victory-stars">${"⭐".repeat(e)}</div>
        <div class="victory-desc">모든 대칭 타일을 원위치로 맞추셨습니다!</div>
        <div class="victory-stats-box">
          <div class="victory-moves">총 조작: <b>${t} 회</b></div>
          ${r?`<div class="victory-time">${r}</div>`:""}
        </div>
        ${n!=null&&n.bestTimeFormatted||(n==null?void 0:n.bestMoves)!==void 0?`
          <div class="victory-best-summary">
            최고 기록: ${n.bestMoves?`${n.bestMoves}회`:"-"} / ${n.bestTimeFormatted||"-"}
          </div>
        `:""}
        <div class="victory-actions">
          <button id="btn-victory-replay" class="btn-action primary">🎲 다시 섞기</button>
          <button id="btn-victory-close" class="btn-action">닫기</button>
        </div>
      </div>
    `,document.body.appendChild(a);const d=()=>{a.classList.add("fade-out"),setTimeout(()=>a.remove(),300)};(u=a.querySelector("#btn-victory-close"))==null||u.addEventListener("click",d),(m=a.querySelector("#btn-victory-replay"))==null||m.addEventListener("click",()=>{d(),s&&s()}),setTimeout(()=>{document.body.contains(a)&&d()},6e3)}}const yt=new vt;let R=null;function xt(){const l=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0,t=document.getElementById("btn-pwa-install");"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(e=>{e.update&&e.update()}).catch(()=>{})}),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),R=e,!l&&t&&(t.style.display="inline-flex")}),window.addEventListener("appinstalled",()=>{R=null,t&&(t.style.display="none")}),t&&t.addEventListener("click",async()=>{if(R){R.prompt();const{outcome:e}=await R.userChoice;e==="accepted"&&(R=null,t.style.display="none")}else alert("브라우저 메뉴(⋮)에서 [홈 화면에 추가] 또는 [앱 설치]를 선택하시면 바탕화면에 설치됩니다.")})}class Mt{constructor(){h(this,"boardSize",3);h(this,"scrambleMoves",3);h(this,"currentOps",[]);h(this,"currentGroup","D4");h(this,"moveHistory",[]);h(this,"movesCount",0);h(this,"isAnimating",!1);h(this,"isGameStarted",!1);h(this,"isGuideActive",!1);h(this,"imgDogFront",new Image);h(this,"imgDogBack",new Image);h(this,"boardGrid");h(this,"gestureCanvas");h(this,"gestureRecognizer");this.initBoardOps(),this.initImages(),this.renderLayout(),this.bindControls(),this.updateBoard(),this.updateBestRecordBadge(),xt()}initBoardOps(){this.currentOps=Array(this.boardSize*this.boardSize).fill(c.ID)}initImages(){this.imgDogFront.src="assets/dog_front.png",this.imgDogBack.src="assets/dog_back.png";const t=()=>this.updateBoard();this.imgDogFront.onload=t,this.imgDogBack.onload=t}renderLayout(){const t=document.getElementById("app");t.innerHTML=`
      <div class="header-bar">
        <div class="header-title">🧩 행렬 큐브</div>
        <div class="header-actions">
          <button id="btn-pwa-install" class="btn-icon" style="display:none; background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: bold; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);" title="스마트폰에 앱으로 설치">📱 앱설치</button>
          <button id="btn-header-tutorial" class="btn-icon btn-nav-tutorial" title="30초 인터랙티브 D4 연산 튜토리얼">🎓 튜토리얼</button>
          <button id="btn-about" class="btn-icon" title="작품 소개 및 수학적 배경">ℹ️ 소개</button>
          <button id="btn-toggle-guide" class="btn-icon" title="컨트롤러 타일 가이드">🧭 가이드</button>
          <button id="btn-toggle-bgm" class="btn-icon">🔇 BGM</button>
          <button id="btn-toggle-sfx" class="btn-icon">🔊 SFX</button>
        </div>
      </div>

      <!-- 보드 크기 & 난이도 설정 패널 -->
      <div class="settings-panel">
        <div class="settings-row">
          <span class="settings-label">📐 크기</span>
          <div class="button-group" id="size-button-group">
            <button class="btn-pill active" data-size="3">3×3</button>
            <button class="btn-pill" data-size="4">4×4</button>
            <button class="btn-pill" data-size="5">5×5</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label">🎲 난이도</span>
          <div class="button-group" id="moves-button-group">
            <button class="btn-pill active" data-moves="3">3수</button>
            <button class="btn-pill" data-moves="4">4수</button>
            <button class="btn-pill" data-moves="5">5수</button>
            <button class="btn-pill" data-moves="6">6수</button>
            <button class="btn-pill" data-moves="7">7수</button>
            <button class="btn-pill" data-moves="8">8수</button>
          </div>
        </div>
      </div>

      <div class="status-bar">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="badge-group" id="badge-group-name">D₄ (정사면군)</span>
          <span id="label-stage-info">${this.boardSize}×${this.boardSize} (${this.scrambleMoves}수)</span>
        </div>
        <div class="timer-container">
          <span class="timer-display" id="label-timer">00:00.0</span>
          <span id="label-moves">0 회</span>
          <span class="best-record-badge" id="badge-best-record">🏆 BEST: -</span>
        </div>
      </div>

      <div class="board-container">
        <div class="board-grid" id="board-grid"></div>
        <canvas id="gesture-canvas"></canvas>
      </div>

      <div class="controls-panel">
        <button id="btn-scramble" class="btn-action">🎲 섞기</button>
        <button id="btn-undo" class="btn-action">↩ 되돌리기</button>
        <button id="btn-hint" class="btn-action">💡 힌트</button>
        <button id="btn-solution" class="btn-action primary">📖 해설</button>
      </div>

      <div class="controls-panel" style="margin-top: 4px;">
        <button id="btn-set-c2" class="btn-icon" style="flex:1;">C₂ 모드</button>
        <button id="btn-set-v4" class="btn-icon" style="flex:1;">V₄ 모드</button>
        <button id="btn-set-d4" class="btn-icon active" style="flex:1;">D₄ 모드</button>
      </div>
    `,this.boardGrid=document.getElementById("board-grid"),this.gestureCanvas=document.getElementById("gesture-canvas"),this.gestureRecognizer=new dt(this.boardGrid,this.gestureCanvas,(e,n)=>this.handleLineOperation(e,n),this.boardSize),this.rebuildBoardDOM()}rebuildBoardDOM(){this.boardGrid.style.gridTemplateColumns=`repeat(${this.boardSize}, 1fr)`,this.boardGrid.style.gridTemplateRows=`repeat(${this.boardSize}, 1fr)`,this.boardGrid.innerHTML="",this.boardGrid.classList.toggle("show-guide",this.isGuideActive);const t=this.boardSize*this.boardSize;for(let e=0;e<t;e++){const n=document.createElement("div");n.className="cell-box";const s=document.createElement("canvas");s.className="cell-canvas",s.width=100,s.height=100,n.appendChild(s);const i=Math.floor(e/this.boardSize),a=e%this.boardSize;let o="",r="";if(i===0&&a===0){const u=this.gestureRecognizer?this.gestureRecognizer.getCell11Mode():"row";o=u==="col"?"1열":"1행",r=u==="col"?"guide-col":"guide-row"}else a===0&&i>0?(o=`${i+1}행`,r="guide-row"):i===0&&a>0?(o=`${a+1}열`,r="guide-col"):i===this.boardSize-1&&a===this.boardSize-1?(o="↖대각",r="guide-diag"):i===1&&a===this.boardSize-1&&(o="↗대각",r="guide-diag");if(o){const u=document.createElement("div");u.className=`controller-guide-label ${r}`,u.innerText=o,i===0&&a===0&&(u.id="guide-label-11"),n.appendChild(u)}if(e===0){const u=document.createElement("div");u.className="dot-toggle-11",u.title="클릭하여 1행 / 1열 변환 모드 전환",u.addEventListener("click",m=>{m.stopPropagation();const b=this.gestureRecognizer.toggleCell11Mode();u.classList.toggle("col-mode",b==="col"),f.playTap();const g=document.getElementById("guide-label-11");g&&(g.innerText=b==="col"?"1열":"1행",g.className=`controller-guide-label ${b==="col"?"guide-col":"guide-row"}`),this.highlightActiveLine(b)}),n.appendChild(u)}const d=document.createElement("div");d.className="cell-state-badge is-solved",d.innerText="0",n.appendChild(d),this.boardGrid.appendChild(n)}}highlightActiveLine(t){const e=this.boardSize*this.boardSize;for(let s=0;s<e;s++){const i=this.boardGrid.children[s];i&&i.classList.remove("highlight-col","highlight-row")}const n=[];if(t==="col")for(let s=0;s<this.boardSize;s++)n.push(s*this.boardSize);else for(let s=0;s<this.boardSize;s++)n.push(s);n.forEach(s=>{const i=this.boardGrid.children[s];i&&i.classList.add(t==="col"?"highlight-col":"highlight-row")}),setTimeout(()=>{n.forEach(s=>{const i=this.boardGrid.children[s];i&&i.classList.remove("highlight-col","highlight-row")})},1200)}bindControls(){var n,s,i,a,o,r,d,u,m,b;const t=document.getElementById("btn-header-tutorial");!mt()&&t&&t.classList.add("pulse-active"),t==null||t.addEventListener("click",()=>{f.playTap(),t.classList.remove("pulse-active"),ft()}),(n=document.getElementById("btn-about"))==null||n.addEventListener("click",()=>{f.playTap(),bt()});const e=document.getElementById("btn-toggle-guide");e&&(e.classList.toggle("active",this.isGuideActive),e.addEventListener("click",()=>{this.isGuideActive=!this.isGuideActive,e.classList.toggle("active",this.isGuideActive),this.boardGrid.classList.toggle("show-guide",this.isGuideActive),f.playTap()})),(s=document.getElementById("btn-toggle-bgm"))==null||s.addEventListener("click",g=>{const v=f.toggleBgm();g.target.innerText=v?"🎵 BGM":"🔇 BGM"}),(i=document.getElementById("btn-toggle-sfx"))==null||i.addEventListener("click",g=>{const v=f.toggleSfx();g.target.innerText=v?"🔊 SFX":"🔈 SFX"}),document.querySelectorAll("#size-button-group .btn-pill").forEach(g=>{g.addEventListener("click",v=>{const y=v.currentTarget,T=parseInt(y.dataset.size||"3",10);T!==this.boardSize&&(document.querySelectorAll("#size-button-group .btn-pill").forEach(x=>x.classList.remove("active")),y.classList.add("active"),this.setBoardSize(T))})}),document.querySelectorAll("#moves-button-group .btn-pill").forEach(g=>{g.addEventListener("click",v=>{const y=v.currentTarget,T=parseInt(y.dataset.moves||"3",10);this.scrambleMoves=T,document.querySelectorAll("#moves-button-group .btn-pill").forEach(x=>x.classList.remove("active")),y.classList.add("active"),this.updateStatusInfo(),this.updateBestRecordBadge(),this.scrambleBoard()})}),(a=document.getElementById("btn-scramble"))==null||a.addEventListener("click",()=>{this.scrambleBoard()}),(o=document.getElementById("btn-undo"))==null||o.addEventListener("click",()=>{this.undoMove()}),(r=document.getElementById("btn-hint"))==null||r.addEventListener("click",()=>{this.giveHint()}),(d=document.getElementById("btn-solution"))==null||d.addEventListener("click",()=>{this.openSolution()}),(u=document.getElementById("btn-set-c2"))==null||u.addEventListener("click",()=>this.switchGroup("C2")),(m=document.getElementById("btn-set-v4"))==null||m.addEventListener("click",()=>this.switchGroup("V4")),(b=document.getElementById("btn-set-d4"))==null||b.addEventListener("click",()=>this.switchGroup("D4"))}updateBestRecordBadge(){const t=document.getElementById("badge-best-record");if(!t)return;const e=B.getRecord(this.boardSize,this.scrambleMoves);if(e&&(e.bestTimeMs!==null||e.bestMoves!==null)){const n=e.bestTimeMs!==null?P(e.bestTimeMs):"-",s=e.bestMoves!==null?`${e.bestMoves}회`:"-";t.innerText=`🏆 ${n} / ${s}`,t.title=`최고 기록: ${n} (${s})`}else t.innerText="🏆 BEST: -",t.title="아직 클리어 기록이 없습니다"}setBoardSize(t){this.boardSize=t,this.initBoardOps(),this.rebuildBoardDOM(),this.gestureRecognizer.setBoardSize(t),this.isGameStarted=!1,B.resetTimer();const e=document.getElementById("label-timer");e&&(e.innerText="00:00.0"),this.moveHistory=[],this.movesCount=0,this.updateMovesLabel(),this.updateStatusInfo(),this.updateBestRecordBadge(),f.playTap(),this.scrambleBoard()}updateStatusInfo(){const t=document.getElementById("label-stage-info");t&&(t.innerText=`${this.boardSize}×${this.boardSize} (${this.scrambleMoves}수 도전)`)}switchGroup(t){this.currentGroup=t;const e=document.getElementById("badge-group-name");e&&(e.innerText=L[t].name),["btn-set-c2","btn-set-v4","btn-set-d4"].forEach(n=>{const s=document.getElementById(n);s&&s.classList.toggle("active",n.endsWith(t.toLowerCase()))}),this.scrambleBoard()}handleLineOperation(t,e){if(this.isAnimating)return;let n=e;this.currentGroup==="C2"?n=c.R180:this.currentGroup==="V4"&&(e===c.R90||e===c.R270?n=c.R180:e===c.MD?n=c.MY:e===c.MAD&&(n=c.MX));const i=k(this.boardSize).findIndex(a=>a.type===t.type&&a.idx===t.idx);i!==-1&&this.applyMove(i,n)}applyMove(t,e,n=!0){if(this.isAnimating)return;this.isAnimating=!0,this.gestureRecognizer.setLocked(!0),f.playFlip();const i=z(this.boardSize)[t]||[];let a="scale(0.92)";e==="MX"?a="perspective(900px) scale(0.92) rotateX(180deg)":e==="MY"?a="perspective(900px) scale(0.92) rotateY(180deg)":e==="MD"?a="perspective(900px) scale(0.92) rotate3d(1, 1, 0, 180deg)":e==="MAD"?a="perspective(900px) scale(0.92) rotate3d(-1, 1, 0, 180deg)":e==="R90"?a="perspective(900px) scale(0.92) rotateZ(90deg)":e==="R180"?a="perspective(900px) scale(0.92) rotateZ(180deg)":e==="R270"&&(a="perspective(900px) scale(0.92) rotateZ(270deg)");const o=340;i.forEach(r=>{const d=this.boardGrid.children[r];d&&(d.style.transition=`transform ${o}ms cubic-bezier(0.2, 0.9, 0.3, 1)`,d.style.transform=a)}),setTimeout(()=>{try{const r=[...this.currentOps];this.currentOps=_(this.currentOps,i,e),n&&(this.isGameStarted||(this.isGameStarted=!0,B.startTimer(d=>{const u=document.getElementById("label-timer");u&&(u.innerText=d)})),this.moveHistory.push({lineId:t,op:e,prevOps:r}),this.movesCount++,this.updateMovesLabel()),this.updateBoard(),i.forEach(d=>{const u=this.boardGrid.children[d];u&&(u.style.transition="none",u.style.transform="")}),requestAnimationFrame(()=>{requestAnimationFrame(()=>{i.forEach(d=>{const u=this.boardGrid.children[d];u&&(u.style.transition="")})})}),this.checkWinCondition()}finally{this.isAnimating=!1,this.gestureRecognizer.setLocked(!1)}},o)}undoMove(){if(this.moveHistory.length===0||this.isAnimating)return;const t=this.moveHistory.pop();this.currentOps=t.prevOps,this.movesCount=Math.max(0,this.movesCount-1),this.updateMovesLabel(),f.playTap(),this.updateBoard()}scrambleBoard(){this.isGameStarted=!1,B.resetTimer();const t=document.getElementById("label-timer");t&&(t.innerText="00:00.0");const e=k(this.boardSize),n=z(this.boardSize),i=L[this.currentGroup].ops.filter(o=>o!==c.ID);let a=Array(this.boardSize*this.boardSize).fill(c.ID);for(let o=0;o<this.scrambleMoves;o++){const r=Math.floor(Math.random()*e.length),d=i[Math.floor(Math.random()*i.length)];a=_(a,n[r],d)}this.currentOps=a,this.moveHistory=[],this.movesCount=0,this.updateMovesLabel(),this.updateBestRecordBadge(),f.playTap(),this.updateBoard()}giveHint(){if(this.currentOps.every(a=>a===c.ID)){f.playWin();return}const t=Y(this.currentOps,this.boardSize,this.currentGroup);if(t.length===0)return;const e=t[0];f.playTap();const n=this.boardSize*this.boardSize;for(let a=0;a<n;a++){const o=this.boardGrid.children[a];o&&o.classList.remove("highlight-hint","highlight-col","highlight-row")}const i=z(this.boardSize)[e.lineId]||[];i.forEach(a=>{const o=this.boardGrid.children[a];o&&o.classList.add("highlight-hint")}),setTimeout(()=>{i.forEach(a=>{const o=this.boardGrid.children[a];o&&o.classList.remove("highlight-hint")})},2500)}openSolution(){const t=Y(this.currentOps,this.boardSize,this.currentGroup);ht(t,()=>this.runAutoSolve(t))}async runAutoSolve(t){for(const e of t){if(this.currentOps.every(n=>n===c.ID))break;await new Promise(n=>{this.applyMove(e.lineId,e.op,!0),setTimeout(n,520)})}}checkWinCondition(){if(this.currentOps.every(e=>e===c.ID)){this.isGameStarted=!1;const e=B.stopTimer(),n=B.getFormattedTime(),s=B.saveRecord(this.boardSize,this.scrambleMoves,e,this.movesCount);this.updateBestRecordBadge(),f.playWin();const i=rt.completeStage(1,this.movesCount),a=this.boardSize*this.boardSize;for(let o=0;o<a;o++){const r=this.boardGrid.children[o];r&&setTimeout(()=>{r.classList.add("celebrate-tile")},o*40)}yt.launchVictory(this.movesCount,i,{timeFormatted:n,isNewBestTime:s.isNewBestTime,isNewBestMoves:s.isNewBestMoves,bestTimeFormatted:P(s.bestTimeMs),bestMoves:s.bestMoves},()=>{this.scrambleBoard()}),setTimeout(()=>{for(let o=0;o<a;o++){const r=this.boardGrid.children[o];r&&r.classList.remove("celebrate-tile")}},4200)}}updateMovesLabel(){const t=document.getElementById("label-moves");t&&(t.innerText=`${this.movesCount} 회`)}getBadgeInfo(t){switch(t){case"ID":return{text:"0",isSolved:!0,isSymmetry:!1};case"R90":return{text:"1",isSolved:!1,isSymmetry:!1};case"R180":return{text:"2",isSolved:!1,isSymmetry:!1};case"R270":return{text:"3",isSolved:!1,isSymmetry:!1};case"MX":return{text:"―",isSolved:!1,isSymmetry:!0};case"MY":return{text:"│",isSolved:!1,isSymmetry:!0};case"MD":return{text:"╲",isSolved:!1,isSymmetry:!0};case"MAD":return{text:"╱",isSolved:!1,isSymmetry:!0};default:return{text:"0",isSolved:!0,isSymmetry:!1}}}updateBoard(){const t=this.boardSize*this.boardSize;for(let e=0;e<t;e++){const n=this.boardGrid.children[e];if(!n)continue;const s=n.querySelector("canvas");if(!s)continue;const i=this.currentOps[e];Q(s,i,this.imgDogFront,this.imgDogBack);const a=n.querySelector(".cell-state-badge");if(a){const o=this.getBadgeInfo(i);a.innerText=o.text,a.classList.toggle("is-solved",o.isSolved),a.classList.toggle("is-symmetry",o.isSymmetry)}}}}window.addEventListener("DOMContentLoaded",()=>{new Mt});
