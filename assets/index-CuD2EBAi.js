var it=Object.defineProperty;var nt=(c,e,t)=>e in c?it(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var u=(c,e,t)=>nt(c,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const a={ID:"ID",R90:"R90",R180:"R180",R270:"R270",MX:"MX",MY:"MY",MD:"MD",MAD:"MAD"},L={[a.ID]:0,[a.R90]:1,[a.R180]:2,[a.R270]:3,[a.MX]:4,[a.MY]:5,[a.MD]:6,[a.MAD]:7},Y=[a.ID,a.R90,a.R180,a.R270,a.MX,a.MY,a.MD,a.MAD];function H(c,e){const{x:t,y:s}=c;switch(e){case a.ID:return{x:t,y:s};case a.R90:return{x:1-s,y:t};case a.R180:return{x:1-t,y:1-s};case a.R270:return{x:s,y:1-t};case a.MX:return{x:t,y:1-s};case a.MY:return{x:1-t,y:s};case a.MD:return{x:s,y:t};case a.MAD:return{x:1-s,y:1-t};default:return{x:t,y:s}}}function Q(c,e){const t={x:.23,y:.79},s=H(t,c),i=H(s,e);for(const n of Object.keys(a)){const o=H(t,a[n]);if(Math.abs(o.x-i.x)<.001&&Math.abs(o.y-i.y)<.001)return a[n]}return a.ID}const N=new Uint8Array(64),J=new Uint8Array(8);for(let c=0;c<8;c++)for(let e=0;e<8;e++){const t=Q(Y[c],Y[e]);N[c*8+e]=L[t]??0}for(let c=0;c<8;c++)for(let e=0;e<8;e++)if(N[c*8+e]===0){J[c]=e;break}const k={C2:{key:"C2",name:"C₂ (180° 회전군)",ops:[a.ID,a.R180],desc:"180° 회전만 사용하는 2원 대칭군 입문 모드 (최대 5수 해결)"},V4:{key:"V4",name:"V₄ (클라인 4원군)",ops:[a.ID,a.R180,a.MX,a.MY],desc:"가로/세로 반전 및 180° 회전을 사용하는 4원 대칭군 (최대 5수 해결)"},D4:{key:"D4",name:"D₄ (정사면 대칭군)",ops:[a.ID,a.R90,a.R180,a.R270,a.MX,a.MY,a.MD,a.MAD],desc:"90° 회전 및 대각선 대칭을 포함한 풀 D4 정사각 대칭군 (최대 8수)"}};function A(c){const e=[];for(let t=0;t<c;t++)e.push({type:"row",idx:t,label:`${t+1}행`});for(let t=0;t<c;t++)e.push({type:"col",idx:t,label:`${t+1}열`});return e.push({type:"diag",idx:"main",label:"↖ 주대각선"}),e.push({type:"diag",idx:"anti",label:"↗ 부대각선"}),e}function w(c){const e=[];for(let i=0;i<c;i++){const n=[];for(let o=0;o<c;o++)n.push(i*c+o);e.push(n)}for(let i=0;i<c;i++){const n=[];for(let o=0;o<c;o++)n.push(o*c+i);e.push(n)}const t=[];for(let i=0;i<c;i++)t.push(i*c+i);e.push(t);const s=[];for(let i=0;i<c;i++)s.push(i*c+(c-1-i));return e.push(s),e}A(3);const at=w(3);function ot(c){let e=0;for(let t=0;t<Math.min(c.length,9);t++){const s=typeof c[t]=="number"?c[t]:L[c[t]];e|=s<<t*3}return e}function Z(c,e,t){const s=at[e];let i=c;for(let n=0;n<s.length;n++){const l=s[n]*3,r=i>>l&7,d=N[r*8+t];i=i&~(7<<l)|d<<l}return i}function lt(c,e,t){const s=J[t];return Z(c,e,s)}function V(c,e,t){const s=[...c],i=L[t];for(let n=0;n<e.length;n++){const o=e[n],l=L[s[o]],r=N[l*8+i];s[o]=Y[r]}return s}function tt(c,e="D4",t=!0){const s=ot(c);if(s===0)return[];const i=A(3),l=(k[e]||k.D4).ops.filter(f=>f!=="ID").map(f=>L[f]).filter(f=>f!==void 0&&f>0),r=t?8:6,d=[];for(let f=0;f<r;f++)for(const P of l)d.push({lineId:f,opInt:P,packed:f<<4|P});const h=new Map,b=new Map;h.set(s,null),b.set(0,null);let p=[s],v=[0],m=-1;const y=8;let M=0;for(;M<y&&m===-1&&p.length>0&&v.length>0;){M++;const f=[];for(let D=0;D<p.length;D++){const O=p[D];for(let I=0;I<d.length;I++){const T=d[I],x=Z(O,T.lineId,T.opInt);if(!h.has(x)){if(h.set(x,{prevCode:O,lineId:T.lineId,opInt:T.opInt}),b.has(x)){m=x;break}f.push(x)}}if(m!==-1)break}if(p=f,m!==-1)break;const P=[];for(let D=0;D<v.length;D++){const O=v[D];for(let I=0;I<d.length;I++){const T=d[I],x=lt(O,T.lineId,T.opInt);if(!b.has(x)){if(b.set(x,{prevCode:O,lineId:T.lineId,opInt:T.opInt}),h.has(x)){m=x;break}P.push(x)}}if(m!==-1)break}v=P}if(m===-1)return[];const E=[];let S=m;for(;S!==s;){const f=h.get(S);if(!f)break;E.push({lineId:f.lineId,opInt:f.opInt}),S=f.prevCode}E.reverse();const R=[];for(S=m;S!==0;){const f=b.get(S);if(!f)break;R.push({lineId:f.lineId,opInt:f.opInt}),S=f.prevCode}return[...E,...R].map(f=>({lineId:f.lineId,line:i[f.lineId],op:Y[f.opInt],opInt:f.opInt}))}function rt(c,e,t="D4",s=4){if(e===3)return tt(c,t,!0);const i=p=>p.every(v=>v==="ID");if(i(c))return[];const n=A(e),o=w(e),r=(k[t]||k.D4).ops.filter(p=>p!=="ID"),d=new Set,h=p=>p.join(",");d.add(h(c));let b=[{ops:c,path:[]}];for(let p=0;p<s;p++){const v=[];for(const m of b)for(let y=0;y<n.length;y++)for(const M of r){const E=V(m.ops,o[y],M),S={lineId:y,line:n[y],op:M,opInt:L[M]},R=[...m.path,S];if(i(E))return R;const q=h(E);d.has(q)||(d.add(q),v.push({ops:E,path:R}))}if(b=v,b.length===0||b.length>25e3)break}return[]}function _(c,e,t="D4"){return e===3?tt(c,t,!0):rt(c,e,t,4)}class ct{constructor(){u(this,"ctx",null);u(this,"bgmAudio",null);u(this,"sfxEnabled",!0);u(this,"bgmEnabled",!1);u(this,"comboScale",[261.63,293.66,329.63,349.23,392,440,523.25]);u(this,"lastFlipTime",0);u(this,"comboIndex",0);typeof Audio<"u"&&(this.bgmAudio=new Audio("/assets/bgm.mp3"),this.bgmAudio.loop=!0,this.bgmAudio.volume=.35)}initCtx(){if(!this.ctx){const e=typeof window<"u"?window.AudioContext||window.webkitAudioContext:globalThis.AudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}playTap(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(600,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(800,this.ctx.currentTime+.05),t.gain.setValueAtTime(.2,this.ctx.currentTime),t.gain.linearRampToValueAtTime(.01,this.ctx.currentTime+.05),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.05)}getComboIndex(){return this.comboIndex}resetCombo(){this.comboIndex=0,this.lastFlipTime=0}playFlip(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const e=Date.now();this.lastFlipTime>0&&e-this.lastFlipTime<=1200?this.comboIndex=Math.min(this.comboIndex+1,this.comboScale.length-1):this.comboIndex=0,this.lastFlipTime=e;const t=this.comboScale[this.comboIndex],s=t*.58,i=this.ctx.createOscillator(),n=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(t,this.ctx.currentTime),i.frequency.exponentialRampToValueAtTime(Math.max(50,s),this.ctx.currentTime+.13);const o=.28+this.comboIndex*.02;n.gain.setValueAtTime(o,this.ctx.currentTime),n.gain.linearRampToValueAtTime(.01,this.ctx.currentTime+.13),i.connect(n),n.connect(this.ctx.destination),i.start(),i.stop(this.ctx.currentTime+.13)}playWin(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[{freq:523.25,time:0,dur:.12},{freq:659.25,time:.1,dur:.12},{freq:783.99,time:.2,dur:.12},{freq:1046.5,time:.3,dur:.16},{freq:783.99,time:.44,dur:.12},{freq:1046.5,time:.54,dur:.45},{freq:1318.51,time:.54,dur:.45}].forEach(s=>{const i=this.ctx.currentTime+s.time,n=this.ctx.createOscillator(),o=this.ctx.createGain();n.type="triangle",n.frequency.setValueAtTime(s.freq,i),o.gain.setValueAtTime(.28,i),o.gain.exponentialRampToValueAtTime(.001,i+s.dur),n.connect(o),o.connect(this.ctx.destination),n.start(i),n.stop(i+s.dur)}),[1567.98,1760,2093,2637.02].forEach((s,i)=>{const n=this.ctx.currentTime+.6+i*.07,o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(s,n),l.gain.setValueAtTime(.15,n),l.gain.exponentialRampToValueAtTime(.001,n+.25),o.connect(l),l.connect(this.ctx.destination),o.start(n),o.stop(n+.25)})}playCombo(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[440,554.37,659.25,880].forEach((t,s)=>{const i=this.ctx.currentTime+s*.05,n=this.ctx.createOscillator(),o=this.ctx.createGain();n.type="triangle",n.frequency.setValueAtTime(t,i),o.gain.setValueAtTime(.22,i),o.gain.exponentialRampToValueAtTime(.001,i+.18),n.connect(o),o.connect(this.ctx.destination),n.start(i),n.stop(i+.18)})}playClear(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[523.25,659.25,783.99,1046.5].forEach((t,s)=>{const i=this.ctx.currentTime+s*.06,n=this.ctx.createOscillator(),o=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(t,i),o.gain.setValueAtTime(.2,i),o.gain.exponentialRampToValueAtTime(.001,i+.22),n.connect(o),o.connect(this.ctx.destination),n.start(i),n.stop(i+.22)})}toggleBgm(){return this.bgmEnabled=!this.bgmEnabled,this.bgmAudio&&(this.bgmEnabled?this.bgmAudio.play().catch(()=>{this.bgmEnabled=!1}):this.bgmAudio.pause()),this.bgmEnabled}toggleSfx(){return this.sfxEnabled=!this.sfxEnabled,this.sfxEnabled}isBgmOn(){return this.bgmEnabled}isSfxOn(){return this.sfxEnabled}speak(e){if(this.sfxEnabled&&!(typeof window>"u"||!("speechSynthesis"in window)))try{window.speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);t.lang="ko-KR",t.rate=.93,t.pitch=1;const i=window.speechSynthesis.getVoices().filter(o=>o.lang.startsWith("ko")||o.lang.replace("_","-").includes("ko-KR")),n=i.find(o=>/natural/i.test(o.name))||i.find(o=>/google/i.test(o.name))||i.find(o=>/heami|sunhi|yuna|female/i.test(o.name))||i[0];n&&(t.voice=n),window.speechSynthesis.speak(t)}catch{}}}const g=new ct,F=[{id:1,name:"1단계: C₂ 1수 입문",group:"C2",scrambleMoves:1,targetStars:{three:1,two:2}},{id:2,name:"2단계: C₂ 2수 연습",group:"C2",scrambleMoves:2,targetStars:{three:2,two:3}},{id:3,name:"3단계: C₂ 3수 기초",group:"C2",scrambleMoves:3,targetStars:{three:3,two:5}},{id:4,name:"4단계: V₄ 2수 반전",group:"V4",scrambleMoves:2,targetStars:{three:2,two:3}},{id:5,name:"5단계: V₄ 3수 응용",group:"V4",scrambleMoves:3,targetStars:{three:3,two:5}},{id:6,name:"6단계: V₄ 4수 마스터",group:"V4",scrambleMoves:4,targetStars:{three:4,two:6}},{id:7,name:"7단계: D₄ 2수 회전",group:"D4",scrambleMoves:2,targetStars:{three:2,two:3}},{id:8,name:"8단계: D₄ 3수 대각",group:"D4",scrambleMoves:3,targetStars:{three:3,two:5}},{id:9,name:"9단계: D₄ 4수 중급",group:"D4",scrambleMoves:4,targetStars:{three:4,two:6}},{id:10,name:"10단계: D₄ 5수 고급",group:"D4",scrambleMoves:5,targetStars:{three:5,two:7}},{id:11,name:"11단계: D₄ 6수 마스터",group:"D4",scrambleMoves:6,targetStars:{three:6,two:8}},{id:12,name:"12단계: D₄ 7수 신의 영역",group:"D4",scrambleMoves:7,targetStars:{three:7,two:9}}],W="matrix_cube_campaign_progress_v1";class dt{constructor(){u(this,"progress",{});this.loadProgress()}loadProgress(){const e=localStorage.getItem(W);if(e)try{this.progress=JSON.parse(e)}catch{this.progress={}}this.progress[1]||(this.progress[1]={unlocked:!0,bestMoves:null,stars:0})}saveProgress(){localStorage.setItem(W,JSON.stringify(this.progress))}getStageProgress(e){return this.progress[e]||{unlocked:!1,bestMoves:null,stars:0}}completeStage(e,t){const s=F.find(r=>r.id===e);if(!s)return 0;let i=1;t<=s.targetStars.three?i=3:t<=s.targetStars.two&&(i=2);const n=this.getStageProgress(e),o=n.bestMoves===null?t:Math.min(n.bestMoves,t),l=Math.max(n.stars,i);if(this.progress[e]={unlocked:!0,bestMoves:o,stars:l},e+1<=F.length){const r=this.getStageProgress(e+1);this.progress[e+1]={...r,unlocked:!0}}return this.saveProgress(),i}getTotalStars(){return Object.values(this.progress).reduce((e,t)=>e+(t.stars||0),0)}}const ut=new dt,ht="matrix_cube_best_record_v1";function X(c){if(c<0||isNaN(c))return"00:00.0";const e=Math.floor(c/1e3),t=Math.floor(e/60),s=e%60,i=Math.floor(c%1e3/100),n=String(t).padStart(2,"0"),o=String(s).padStart(2,"0");return`${n}:${o}.${i}`}class pt{constructor(){u(this,"startTime",null);u(this,"accumulatedMs",0);u(this,"timerIntervalId",null);u(this,"tickCallback",null)}getRecordKey(e,t){return`${ht}_${e}x${e}_${t}moves`}getStorage(){return typeof window<"u"&&window.localStorage?window.localStorage:typeof localStorage<"u"?localStorage:null}getRecord(e,t){try{const s=this.getStorage();if(!s)return null;const i=this.getRecordKey(e,t),n=s.getItem(i);if(!n)return null;const o=JSON.parse(n);return{bestTimeMs:typeof o.bestTimeMs=="number"?o.bestTimeMs:null,bestMoves:typeof o.bestMoves=="number"?o.bestMoves:null,updatedAt:o.updatedAt}}catch{return null}}saveRecord(e,t,s,i){const n=this.getRecord(e,t);let o=!1,l=!1,r=(n==null?void 0:n.bestTimeMs)??null,d=(n==null?void 0:n.bestMoves)??null;(r===null||s<r)&&(r=s,o=!0),(d===null||i<d)&&(d=i,l=!0);const h={bestTimeMs:r,bestMoves:d,updatedAt:Date.now()};try{const b=this.getStorage();if(b){const p=this.getRecordKey(e,t);b.setItem(p,JSON.stringify(h))}}catch{}return{isNewBestTime:o,isNewBestMoves:l,bestTimeMs:r,bestMoves:d}}startTimer(e){e&&(this.tickCallback=e),this.timerIntervalId===null&&(this.startTime=performance.now(),this.timerIntervalId=setInterval(()=>{const t=this.getElapsedMs();this.tickCallback&&this.tickCallback(X(t),t)},100))}stopTimer(){return this.startTime!==null&&(this.accumulatedMs+=performance.now()-this.startTime,this.startTime=null),this.timerIntervalId!==null&&(clearInterval(this.timerIntervalId),this.timerIntervalId=null),this.accumulatedMs}resetTimer(){this.stopTimer(),this.accumulatedMs=0,this.startTime=null,this.tickCallback&&this.tickCallback(X(0),0)}getElapsedMs(){let e=this.accumulatedMs;return this.startTime!==null&&(e+=performance.now()-this.startTime),Math.floor(e)}getFormattedTime(){return X(this.getElapsedMs())}isTimerRunning(){return this.timerIntervalId!==null}}const C=new pt;function et(c,e,t,s){const i=c.getContext("2d");if(!i)return;const n=c.width,o=c.height;i.clearRect(0,0,n,o);const r=(e==="MX"||e==="MY"||e==="MD"||e==="MAD")&&s.complete?s:t;switch(i.save(),i.translate(n/2,o/2),e){case"R90":i.rotate(90*Math.PI/180);break;case"R180":i.rotate(180*Math.PI/180);break;case"R270":i.rotate(270*Math.PI/180);break;case"MX":i.scale(1,-1);break;case"MY":i.scale(-1,1);break;case"MD":i.rotate(90*Math.PI/180),i.scale(-1,1);break;case"MAD":i.rotate(-90*Math.PI/180),i.scale(-1,1);break}i.drawImage(r,-n/2,-o/2,n,o),i.restore()}class mt{constructor(e,t,s,i=3){u(this,"boardEl");u(this,"trailCanvas");u(this,"ctx",null);u(this,"onAction");u(this,"points",[]);u(this,"isPointerDown",!1);u(this,"startCell",null);u(this,"isLocked",!1);u(this,"boardSize",3);u(this,"cell11Mode","row");u(this,"longPressTimer",null);u(this,"singleTapTimer",null);u(this,"lastTapInfo",null);u(this,"isLongPressTriggered",!1);this.boardEl=e,this.trailCanvas=t,this.ctx=t.getContext("2d"),this.onAction=s,this.boardSize=i,this.bindEvents(),this.syncCanvasSize(),window.addEventListener("resize",()=>this.syncCanvasSize())}setBoardSize(e){this.boardSize=e}setLocked(e){this.isLocked=e}getCell11Mode(){return this.cell11Mode}toggleCell11Mode(){return this.cell11Mode=this.cell11Mode==="row"?"col":"row",this.cell11Mode}syncCanvasSize(){const e=this.boardEl.getBoundingClientRect();this.trailCanvas.width=e.width,this.trailCanvas.height=e.height}getLineForCell(e,t){const s=this.boardSize,i=A(s);return e===0&&t===0?this.cell11Mode==="col"?i.find(n=>n.type==="col"&&n.idx===0)||null:i.find(n=>n.type==="row"&&n.idx===0)||null:t===0&&e>0?i.find(n=>n.type==="row"&&n.idx===e)||null:e===0&&t>0?i.find(n=>n.type==="col"&&n.idx===t)||null:e===s-1&&t===s-1?i.find(n=>n.type==="diag"&&n.idx==="main")||null:e===1&&t===s-1?i.find(n=>n.type==="diag"&&n.idx==="anti")||null:e===Math.floor(s/2)&&t===Math.floor(s/2)&&i.find(n=>n.type==="row"&&n.idx===e)||null}bindEvents(){this.boardEl.addEventListener("pointerdown",t=>{if(this.isLocked)return;const s=t.target;if(s&&(s.classList.contains("dot-toggle-11")||s.closest(".dual-switch-11")||s.classList.contains("dual-switch-11")))return;const i=t.target.closest(".cell-box");let n=-1,o=-1;if(i&&i.parentElement===this.boardEl){const h=Array.from(this.boardEl.children).indexOf(i);h!==-1&&(n=Math.floor(h/this.boardSize),o=h%this.boardSize)}if(n===-1||o===-1){const h=this.boardEl.getBoundingClientRect(),b=t.clientX-h.left,p=t.clientY-h.top,v=h.width/this.boardSize,m=h.height/this.boardSize;o=Math.max(0,Math.min(this.boardSize-1,Math.floor(b/v))),n=Math.max(0,Math.min(this.boardSize-1,Math.floor(p/m)))}const l=this.getLineForCell(n,o);if(!l)return;try{this.boardEl.setPointerCapture(t.pointerId)}catch{}this.isPointerDown=!0,this.isLongPressTriggered=!1,this.startCell={r:n,c:o,target:l};const r=t.clientX,d=t.clientY;this.points=[{x:r,y:d}],this.longPressTimer&&clearTimeout(this.longPressTimer),this.longPressTimer=setTimeout(()=>{this.isPointerDown&&!this.isLongPressTriggered&&(this.isLongPressTriggered=!0,this.clearTrail(),this.startCell&&this.onAction(this.startCell.target,"R270"))},380)}),this.boardEl.addEventListener("pointermove",t=>{if(this.isPointerDown){if(this.points.push({x:t.clientX,y:t.clientY}),this.points.length>1){const s=this.points[0];Math.hypot(t.clientX-s.x,t.clientY-s.y)>35&&this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null)}this.drawTrail()}});const e=t=>{if(this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null),!this.isPointerDown||!this.startCell){this.isPointerDown=!1,this.clearTrail();return}if(this.isPointerDown=!1,this.isLongPressTriggered){this.isLongPressTriggered=!1,this.clearTrail();return}const s=this.points[0],i=t.clientX||s.x,n=t.clientY||s.y,o=i-s.x,l=n-s.y,r=Math.hypot(o,l),d=this.startCell.target,h=this.startCell.r,b=this.startCell.c;if(this.clearTrail(),r<35){const v=performance.now(),m=this.lastTapInfo&&this.lastTapInfo.r===h&&this.lastTapInfo.c===b;if(this.singleTapTimer&&m&&v-this.lastTapInfo.time<=380){clearTimeout(this.singleTapTimer),this.singleTapTimer=null,this.lastTapInfo=null,this.onAction(d,"R180");return}this.singleTapTimer&&clearTimeout(this.singleTapTimer),this.lastTapInfo={r:h,c:b,time:v};const y=d;this.singleTapTimer=setTimeout(()=>{this.onAction(y,"R90"),this.singleTapTimer=null,this.lastTapInfo=null},190);return}this.singleTapTimer&&(clearTimeout(this.singleTapTimer),this.singleTapTimer=null,this.lastTapInfo=null);const p=Math.atan2(l,o)*180/Math.PI;Math.abs(p)<=30||Math.abs(p)>=150?this.onAction(d,"MX"):Math.abs(p)>=60&&Math.abs(p)<=120?this.onAction(d,"MY"):p>30&&p<60||p>-150&&p<-120?this.onAction(d,"MD"):p>-60&&p<-30||p>120&&p<150?this.onAction(d,"MAD"):Math.abs(o)>=Math.abs(l)?this.onAction(d,"MX"):this.onAction(d,"MY")};this.boardEl.addEventListener("pointerup",e),this.boardEl.addEventListener("pointercancel",e),window.addEventListener("pointerup",e)}drawTrail(){}clearTrail(){this.ctx&&(this.ctx.clearRect(0,0,this.trailCanvas.width,this.trailCanvas.height),this.points=[])}}function K(c,e){switch(e){case"MX":return`<b>↕ 가로 반사 (MX)</b>: ${c} 상하 뒤집기. 두 번 적용 시 항등원 복원 (<i>MX² = ID</i>)`;case"MY":return`<b>↔ 세로 반사 (MY)</b>: ${c} 좌우 뒤집기. 두 번 적용 시 항등원 복원 (<i>MY² = ID</i>)`;case"MD":return`<b>⤢ 주대각 반사 (MD)</b>: ${c} 전치. 두 반사의 합성으로 회전 분해 (<i>MD ∘ MX = R90</i>)`;case"MAD":return`<b>⤡ 부대각 반사 (MAD)</b>: ${c} 역대각 전치. <i>MAD ∘ MX = R270</i>`;case"R90":return"<b>↻ 90° 회전 (R90)</b>: 시계방향 회전. 4회 회전 시 원상 복구 (<i>R90⁴ = ID</i>)";case"R180":return"<b>🔄 180° 회전 (R180)</b>: 점대칭 반전. 가로와 세로 반사의 합성 (<i>MX ∘ MY = R180</i>)";case"R270":return"<b>↺ 270° 회전 (R270)</b>: 반시계방향 90° 회전 (<i>R90의 역원</i>)";default:return`<b>✨ 항등원</b>: ${c} 정위치 복원`}}class bt{constructor(){u(this,"containerEl",null);u(this,"currentStepIdx",0);u(this,"stateHistory",[]);u(this,"steps",[]);u(this,"callbacks",null)}render(e,t,s,i,n){this.containerEl=e,this.steps=i,this.callbacks=n,this.currentStepIdx=0;const o=w(s);this.stateHistory=[[...t]];let l=[...t];for(const r of i){const d=o[r.lineId]||[];l=V(l,d,r.op),this.stateHistory.push([...l])}this.buildHTML(),this.bindEvents(),g.playTap()}buildHTML(){var i;if(!this.containerEl)return;if(this.steps.length===0){this.containerEl.innerHTML=`
        <div class="inline-solution-panel">
          <div class="inline-solution-header">
            <span class="inline-solution-title">🎉 이미 완성된 상태입니다!</span>
            <button class="btn-solution-close" id="btn-sol-close">✕ 닫기</button>
          </div>
        </div>
      `,(i=this.containerEl.querySelector("#btn-sol-close"))==null||i.addEventListener("click",()=>{this.close()});return}let e=`
      <button class="sol-step-pill active" data-step="0">초기</button>
    `;this.steps.forEach((n,o)=>{e+=`
        <button class="sol-step-pill" data-step="${o+1}">
          ${o+1}수: ${n.line.label} ${n.op}
        </button>
      `});const t=this.steps[0],s=t?K(t.line.label,t.op):"초기 섞인 상태입니다. 각 수를 눌러보세요.";this.containerEl.innerHTML=`
      <div class="inline-solution-panel">
        <!-- 해설 패널 상단 바 -->
        <div class="inline-solution-header">
          <div class="inline-solution-title-wrap">
            <span class="inline-solution-badge">📖 최단 해법</span>
            <span class="inline-solution-title">총 ${this.steps.length}수 풀이 과정</span>
          </div>
          <div class="inline-solution-actions">
            <button class="btn-sol-action primary" id="btn-sol-autosolve">▶ 자동 풀기</button>
            <button class="btn-sol-action" id="btn-sol-close">✕ 닫기</button>
          </div>
        </div>

        <!-- 수별 알약 네비게이션 버튼 바 -->
        <div class="sol-step-pills-bar" id="sol-pills-bar">
          ${e}
        </div>

        <!-- 실시간 수학적 원리 해설 카드 -->
        <div class="sol-math-card" id="sol-math-card">
          <div class="sol-math-step-name" id="sol-math-step-name">현재: 초기 상태</div>
          <div class="sol-math-content" id="sol-math-content">
            ${s}
          </div>
        </div>
      </div>
    `}bindEvents(){var t,s;if(!this.containerEl)return;this.containerEl.querySelectorAll(".sol-step-pill").forEach(i=>{i.addEventListener("click",n=>{const o=parseInt(n.currentTarget.dataset.step||"0",10);this.selectStep(o)})}),(t=this.containerEl.querySelector("#btn-sol-autosolve"))==null||t.addEventListener("click",()=>{this.callbacks&&(this.close(),this.callbacks.onAutoSolve())}),(s=this.containerEl.querySelector("#btn-sol-close"))==null||s.addEventListener("click",()=>{this.close()})}selectStep(e){if(!this.containerEl)return;this.currentStepIdx=Math.max(0,Math.min(this.stateHistory.length-1,e)),this.containerEl.querySelectorAll(".sol-step-pill").forEach((o,l)=>{o.classList.toggle("active",l===this.currentStepIdx)});const s=this.containerEl.querySelector("#sol-math-step-name"),i=this.containerEl.querySelector("#sol-math-content");let n=null;if(this.currentStepIdx===0)s&&(s.textContent="현재: 초기 섞인 상태"),i&&(i.innerHTML="1수부터 클릭하여 보드의 단계별 변화와 수학적 원리를 확인하세요.");else{const o=this.steps[this.currentStepIdx-1];n=o.lineId,s&&(s.textContent=`[${this.currentStepIdx}수] ${o.line.label} ➔ ${o.op} 변환`),i&&(i.innerHTML=K(o.line.label,o.op))}this.callbacks&&this.callbacks.onPreviewState(this.stateHistory[this.currentStepIdx],n),g.playTap()}close(){this.containerEl&&(this.containerEl.innerHTML=""),this.callbacks&&this.callbacks.onClose(),g.playTap()}}const j=new bt;function gt(){var o,l;const c=document.getElementById("about-modal-overlay");c&&c.remove();const e=document.createElement("div");e.id="about-modal-overlay",e.className="modal-overlay",e.innerHTML=`
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
  `,document.body.appendChild(e);const t=()=>{e.classList.add("fade-out"),setTimeout(()=>e.remove(),250)};(o=e.querySelector("#btn-about-close"))==null||o.addEventListener("click",t),(l=e.querySelector("#btn-about-confirm"))==null||l.addEventListener("click",t),e.addEventListener("click",r=>{r.target===e&&t()});const s=r=>{r.key==="Escape"&&(t(),window.removeEventListener("keydown",s))};window.addEventListener("keydown",s);const i=e.querySelectorAll(".modal-tab-btn"),n=e.querySelectorAll(".about-tab-pane");i.forEach(r=>{r.addEventListener("click",()=>{const d=r.getAttribute("data-tab");i.forEach(h=>h.classList.remove("active")),r.classList.add("active"),n.forEach(h=>{h.classList.remove("active"),h.id===`pane-${d}`&&h.classList.add("active")})})})}const st="matrix_cube_tutorial_completed";function ft(){try{return localStorage.getItem(st)==="true"}catch{return!1}}function U(){try{localStorage.setItem(st,"true")}catch{}}function vt(c){switch(c){case a.ID:return"0";case a.MX:return"X";case a.MY:return"Y";case a.R180:return"180";case a.R90:return"90";case a.R270:return"270";case a.MD:return"D";case a.MAD:return"AD";default:return"0"}}const $=[{subStep:0,label:"초기",boardOps:[a.R180,a.R180,a.MX,a.MY,a.MY,a.ID,a.R180,a.R180,a.MX],highlightCells:[],formulaBadge:"🧩 V4 문제",formulaText:"V4 스크램블 (초기)",formulaDesc:"반사와 회전 상쇄로 4수 만에 0번 완성!"},{subStep:1,label:"1수",boardOps:[a.R180,a.R180,a.MX,a.MY,a.MY,a.ID,a.ID,a.ID,a.MY],highlightCells:[6,7,8],formulaBadge:"⚡ 1수: 3행 180° 회전",formulaText:"3행 더블 탭 👆👆 (R180)",formulaDesc:"3행의 R180 타일 2개가 0번으로 상쇄돼요."},{subStep:2,label:"2수",boardOps:[a.R180,a.R180,a.R180,a.MY,a.MY,a.MY,a.ID,a.ID,a.ID],highlightCells:[2,5,8],formulaBadge:"⚡ 2수: 3열 세로 반사",formulaText:"3열 세로 밀기 ↕ (MY)",formulaDesc:"MX와 MY가 만나 180° 회전(MX ∘ MY = R180) 합성!"},{subStep:3,label:"3수",boardOps:[a.R180,a.R180,a.R180,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID],highlightCells:[3,4,5],formulaBadge:"⚡ 3수: 2행 세로 반사",formulaText:"2행 세로 밀기 ↕ (MY)",formulaDesc:"2행의 MY 타일들이 정위치 0번으로 상쇄돼요."},{subStep:4,label:"4수 (완성)",boardOps:[a.ID,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID],highlightCells:[0,1,2],formulaBadge:"🎉 4수: 1행 180° 회전",formulaText:"1행 더블 탭 👆👆 (R180)",formulaDesc:"1행의 R180 타일들이 0번으로 상쇄되어 전체 완성!"}],z=[{subStep:0,label:"초기",boardOps:[a.MX,a.MAD,a.MD,a.ID,a.R90,a.MY,a.R180,a.MY,a.R270],highlightCells:[],formulaBadge:"🧩 D4 묘수 문제",formulaText:"D4 복합 스크램블 (초기)",formulaDesc:"대각선 반사와 회전을 결합한 5수 최단 해법!"},{subStep:1,label:"1수",boardOps:[a.MD,a.MX,a.MY,a.ID,a.R90,a.MY,a.R180,a.MY,a.R270],highlightCells:[0,1,2],formulaBadge:"⚡ 1수: 1행 90° 회전",formulaText:"1행 1회 탭 👆 (R90)",formulaDesc:"1행 타일들이 시계 방향 90° 회전돼요."},{subStep:2,label:"2수",boardOps:[a.MD,a.MX,a.MY,a.ID,a.R90,a.MY,a.ID,a.MX,a.R90],highlightCells:[6,7,8],formulaBadge:"⚡ 2수: 3행 180° 회전",formulaText:"3행 더블 탭 👆👆 (R180)",formulaDesc:"3행의 R180이 0번으로 상쇄되고 타일들이 재정렬돼요."},{subStep:3,label:"3수",boardOps:[a.MD,a.MX,a.ID,a.ID,a.R90,a.ID,a.ID,a.MX,a.MD],highlightCells:[2,5,8],formulaBadge:"⚡ 3수: 3열 세로 반사",formulaText:"3열 세로 밀기 ↕ (MY)",formulaDesc:"3열의 1·2행 타일들이 0번으로 상쇄돼요."},{subStep:4,label:"4수",boardOps:[a.ID,a.MX,a.ID,a.ID,a.MX,a.ID,a.ID,a.MX,a.ID],highlightCells:[0,4,8],formulaBadge:"⚡ 4수: 대각선 반사",formulaText:"대각선 밀기 ↘ (MD)",formulaDesc:"양 끝의 MD가 상쇄되고 2열이 MX로 정렬돼요."},{subStep:5,label:"5수 (완성)",boardOps:[a.ID,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID],highlightCells:[1,4,7],formulaBadge:"🎉 5수: 2열 가로 반사",formulaText:"2열 가로 밀기 ↔ (MX)",formulaDesc:"2열의 모든 MX가 상쇄되어 5수 만에 전체 완성!"}];class yt{constructor(){u(this,"isOpen",!1);u(this,"currentStep",1);u(this,"v4SubStep",0);u(this,"d4SubStep",0);u(this,"boardOps",Array(9).fill(a.ID));u(this,"cell11Mode","row");u(this,"imgDogFront",null);u(this,"imgDogBack",null);u(this,"autoPlayTimer",null);u(this,"isAutoPlaying",!1);if(typeof Image<"u"){this.imgDogFront=new Image,this.imgDogBack=new Image,this.imgDogFront.src="assets/dog_front.png",this.imgDogBack.src="assets/dog_back.png";const e=()=>{this.isOpen&&this.renderBoard()};this.imgDogFront.onload=e,this.imgDogBack.onload=e}}open(e=1){this.isOpen=!0,this.cell11Mode="row",this.buildDOM(),this.goToStep(Math.max(1,Math.min(7,e)),!1),this.removePulse(),g.playTap()}close(){if(this.stopAutoPlay(),this.isOpen=!1,typeof document<"u"){const e=document.getElementById("tutorial-modal-overlay");e&&e.remove()}g.playTap()}skip(){this.stopAutoPlay(),U(),this.close(),g.playTap()}prevStep(){this.currentStep>1&&this.goToStep(this.currentStep-1)}nextStep(){this.currentStep<7?this.goToStep(this.currentStep+1):this.completeTutorial()}goToStep(e,t=!0){this.stopAutoPlay(),this.currentStep=Math.max(1,Math.min(7,e)),this.currentStep===5?this.v4SubStep=0:this.currentStep===6&&(this.d4SubStep=0),this.applyStepState(this.currentStep),this.updateStepUI(),this.renderBoard(),t&&g.playTap()}completeTutorial(){this.stopAutoPlay(),U(),this.close(),g.playWin()}removePulse(){if(typeof document>"u")return;const e=document.getElementById("btn-header-tutorial");e&&e.classList.remove("pulse-active")}buildDOM(){if(typeof document>"u")return;const e=document.getElementById("tutorial-modal-overlay");e&&e.remove();const t=document.createElement("div");t.id="tutorial-modal-overlay",t.className="tutorial-overlay",t.innerHTML=`
      <div class="tutorial-card">
        <!-- 헤더 -->
        <div class="tutorial-header">
          <div class="tutorial-header-left">
            <span class="tutorial-header-badge">군론 튜토리얼</span>
            <span class="tutorial-header-title">🎓 행렬 대칭 변환 가이드</span>
          </div>
          <button id="btn-tut-close" class="tutorial-header-close" title="닫기">✕</button>
        </div>

        <!-- 스텝 탭 / 프로그레스 바 (총 7단계) -->
        <div class="tutorial-steps-bar" id="tut-steps-bar">
          <div class="tut-step-dot" data-step="1" title="1단계: 게임 목표 & 행렬 구조"></div>
          <div class="tut-step-dot" data-step="2" title="2단계: 성분별 변환 & 손동작 조작"></div>
          <div class="tut-step-dot" data-step="3" title="3단계: 반사+반사=회전 (V4)"></div>
          <div class="tut-step-dot" data-step="4" title="4단계: 완전한 대칭 군 D4"></div>
          <div class="tut-step-dot" data-step="5" title="5단계: [실전] V4 4수 마스터"></div>
          <div class="tut-step-dot" data-step="6" title="6단계: [실전] D4 5수 묘수 풀이"></div>
          <div class="tut-step-dot" data-step="7" title="7단계: 군론 행렬 퍼즐 완전 정복"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 게임의 목표 & 행렬 성분 구조</div>
            <div class="tut-guide-main-text" id="tut-main-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키기</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키는 것이 목표입니다! 3×3 행렬의 각 성분(1~3행, 1~3열)이 해당 라인의 대칭 변환을 이끄는 컨트롤러 역할을 합니다.</div>
          </div>

          <!-- 실전 예제 수별 컨트롤러 (Step 5, Step 6에서만 표시) -->
          <div class="tut-move-controller" id="tut-move-controller" style="display: none;">
            <div class="tut-move-pills" id="tut-move-pills"></div>
            <button id="btn-tut-autoplay" class="tut-btn-autoplay" title="자동 한 수씩 보기">▶ 한 수씩 보기</button>
          </div>

          <!-- 3x3 자동 시연 보드 -->
          <div class="tut-board-wrapper" id="tut-board-wrapper">
            <div class="tut-board-grid" id="tut-board-grid"></div>
            <div class="tut-hand-demo" id="tut-hand-demo" style="display: none;">
              <span class="tut-hand-icon" id="tut-hand-icon">👆</span>
              <span class="tut-hand-bubble" id="tut-hand-bubble">가로 밀기</span>
            </div>
          </div>

          <!-- 공식 설명 카드 -->
          <div class="tut-formula-card" id="tut-formula-card" style="display: none;">
            <span class="tut-formula-badge" id="tut-formula-badge">💡 성분별 대칭 변환</span>
            <div class="tut-formula-text" id="tut-formula-text">1행 가로 반사 (MX)</div>
            <div class="tut-formula-desc" id="tut-formula-desc">1행 성분들이 가로 반사로 일제히 뒤집힙니다.</div>
          </div>

          <!-- 손동작(제스처) 조작법 인포그래픽 치트시트 카드 -->
          <div class="tut-gesture-card" id="tut-gesture-card" style="display: none;">
            <div class="tut-gesture-header">
              <span class="tut-gesture-title">🎮 제스처(손동작) 조작법 안내</span>
              <span class="tut-gesture-subtitle">터치/밀기로 원하는 대칭 변환 적용</span>
            </div>
            <div class="tut-gesture-grid">
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">👆</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">1회 탭</span>
                  <span class="tut-gesture-result">90° 시계 회전 (R90)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">👆👆</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">더블 탭</span>
                  <span class="tut-gesture-result">180° 반전 회전 (R180)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">⏱️</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">길게 누르기</span>
                  <span class="tut-gesture-result">270° 회전 (R270)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">↔</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">가로 밀기</span>
                  <span class="tut-gesture-result">가로 반사 (MX, 상하반전)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">↕</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">세로 밀기</span>
                  <span class="tut-gesture-result">세로 반사 (MY, 좌우반전)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">↘</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">대각선 밀기</span>
                  <span class="tut-gesture-result">대각 반사 (MD / MAD)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 스텝 7 최종 마스터 카드 -->
          <div class="tut-master-card" id="tut-master-card" style="display: none;">
            <div class="tut-master-badge-icon">🏆</div>
            <div class="tut-master-title">군론 행렬 퍼즐 완전 정복!</div>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 10px 0;">게임의 목표와 D4 정이면체군 대칭 변환 원리, 실전 해법을 모두 마스터하셨습니다.</p>
            <div class="tut-rules-summary-list">
              <div class="tut-rule-item"><span>🎯</span> <span><b>게임 목표</b> : 뒤섞인 모든 타일을 <b>0번(항등원·정위치 앞면)</b>으로 완성</span></div>
              <div class="tut-rule-item"><span>📐</span> <span><b>행렬 컨트롤러</b> : 테두리 타일(1~3행, 1~3열, 대각선)을 조작하여 해당 라인 전체 변환</span></div>
              <div class="tut-rule-item"><span>🔄</span> <span><b>1행 1열 스위치</b> : [↔1행|↕1열] 탭으로 1행 ↔ 1열 조작 모드 자유 전환</span></div>
              <div class="tut-rule-item"><span>🎮</span> <span><b>손동작 변환</b> : 탭(90°), 더블탭(180°), 롱프레스(270°), 가로밀기(MX), 세로밀기(MY), 대각밀기(MD)</span></div>
              <div class="tut-rule-item"><span>⚡</span> <span><b>반사 + 반사 = 회전</b> : MX ∘ MY = R180 (클라인 4원군 V4)</span></div>
              <div class="tut-rule-item"><span>🌌</span> <span><b>8차 정이면체군 D4</b> : 회전 4종(0°, 90°, 180°, 270°) + 반사 4종(MX, MY, MD, MAD)</span></div>
              <div class="tut-rule-item"><span>🧩</span> <span><b>V4 4수 최단 해법</b> : 3행 R180 ➔ 3열 MY ➔ 2행 MY ➔ 1행 R180 완성!</span></div>
              <div class="tut-rule-item"><span>💎</span> <span><b>D4 5수 묘수 풀이</b> : 1행 R90 ➔ 3행 R180 ➔ 3열 MY ➔ 주대각 MD ➔ 2열 MX 완성!</span></div>
            </div>
          </div>
        </div>

        <!-- 하단 슬라이드 네비게이션 버튼 바 -->
        <div class="tutorial-footer">
          <button id="btn-tut-skip" class="tut-btn-skip">닫기</button>
          <div class="tut-footer-nav">
            <button id="btn-tut-prev" class="tut-btn-prev" style="display: none;">◀ 이전</button>
            <button id="btn-tut-action" class="tut-btn-action">
              <span id="tut-btn-action-text">다음 (1/7) ➔</span>
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(t);const s=document.getElementById("tut-board-grid");if(s){s.innerHTML="";for(let i=0;i<9;i++){const n=document.createElement("div");n.className="tut-cell-box",n.id=`tut-cell-${i}`,n.dataset.index=String(i);const o=document.createElement("canvas");if(o.className="tut-cell-canvas",o.width=160,o.height=160,n.appendChild(o),i===0){const r=document.createElement("div");r.className=`dual-switch-11 ${this.cell11Mode==="col"?"mode-col":"mode-row"}`,r.id="tut-switch-11",r.title="탭하여 1행 / 1열 모드 전환",r.innerHTML=`
            <span class="switch-opt switch-row">↔ 1행</span>
            <span class="switch-divider">|</span>
            <span class="switch-opt switch-col">↕ 1열</span>
          `,r.addEventListener("click",d=>{d.stopPropagation(),this.handleDotClick()}),n.appendChild(r)}else if(i===1||i===2){const r=document.createElement("div");r.className="controller-guide-label guide-col",r.innerText=`${i+1}열`,n.appendChild(r)}else if(i===3||i===6){const r=document.createElement("div");r.className="controller-guide-label guide-row",r.innerText=`${Math.floor(i/3)+1}행`,n.appendChild(r)}else if(i===4){const r=document.createElement("div");r.className="controller-guide-label guide-row",r.innerText="2행",n.appendChild(r)}else if(i===5){const r=document.createElement("div");r.className="controller-guide-label guide-diag",r.innerText="↗부대각",n.appendChild(r)}else if(i===8){const r=document.createElement("div");r.className="controller-guide-label guide-diag",r.innerText="↖주대각",n.appendChild(r)}const l=document.createElement("span");l.className="tut-cell-badge",l.textContent="0",n.appendChild(l),s.appendChild(n)}}this.bindEvents()}handleDotClick(){if(this.cell11Mode=this.cell11Mode==="row"?"col":"row",typeof document<"u"){const e=document.getElementById("tut-switch-11");e&&(e.className=`dual-switch-11 ${this.cell11Mode==="col"?"mode-col":"mode-row"}`);const t=document.getElementById("tut-guide-tag-11");t&&(t.innerText=this.cell11Mode==="col"?"1열":"1행",t.className=`controller-guide-label ${this.cell11Mode==="col"?"guide-col":"guide-row"}`)}g.playTap()}bindEvents(){const e=document.getElementById("btn-tut-close"),t=document.getElementById("btn-tut-skip"),s=document.getElementById("btn-tut-prev"),i=document.getElementById("btn-tut-action"),n=document.getElementById("btn-tut-autoplay");e&&e.addEventListener("click",()=>this.close()),t&&t.addEventListener("click",()=>this.skip()),s&&s.addEventListener("click",()=>this.prevStep()),i&&i.addEventListener("click",()=>this.nextStep()),n&&n.addEventListener("click",()=>this.toggleAutoPlay()),document.querySelectorAll(".tut-step-dot").forEach(o=>{o.addEventListener("click",()=>{const l=parseInt(o.dataset.step||"1",10);l>=1&&l<=7&&this.goToStep(l)})})}applyStepState(e){switch(e){case 1:this.boardOps=[a.MX,a.R90,a.MY,a.ID,a.R180,a.MX,a.MY,a.ID,a.R90];break;case 2:this.executeStep2Success();break;case 3:this.executeStep3Success();break;case 4:this.boardOps=[a.ID,a.R90,a.R180,a.R270,a.MX,a.MY,a.MD,a.MAD,a.ID];break;case 5:this.boardOps=[...$[this.v4SubStep].boardOps];break;case 6:this.boardOps=[...z[this.d4SubStep].boardOps];break;case 7:this.boardOps=Array(9).fill(a.ID);break}}executeStep2Success(){this.boardOps=[a.MX,a.MX,a.MX,a.ID,a.ID,a.ID,a.ID,a.ID,a.ID]}executeStep3Success(){this.boardOps=[Q(a.MX,a.MY),a.MX,a.MX,a.MY,a.ID,a.ID,a.MY,a.ID,a.ID]}updateHandDemo(e,t=0){if(typeof document>"u")return;const s=document.getElementById("tut-hand-demo"),i=document.getElementById("tut-hand-icon"),n=document.getElementById("tut-hand-bubble");if(!(!s||!i||!n))switch(s.className="tut-hand-demo",s.style.top="",s.style.left="",s.style.display="flex",e){case 1:s.style.top="36%",s.style.left="40%",s.classList.add("hand-anim-tap"),i.textContent="👆",n.textContent="모두 0번 앞면으로!";break;case 2:s.classList.add("hand-anim-swipe-h"),i.textContent="👆",n.textContent="가로로 쓱 밀기 (↔)";break;case 3:s.classList.add("hand-anim-swipe-v"),i.textContent="👆",n.textContent="세로로 또 밀기 (↕)";break;case 4:s.style.top="36%",s.style.left="40%",s.classList.add("hand-anim-tap"),i.textContent="✨",n.textContent="8차 대칭군 D4";break;case 5:switch(t){case 0:s.style.top="66%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",n.textContent="1수: 3행 더블 탭";break;case 1:s.style.top="66%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",n.textContent="3행 더블 탭 (180°)";break;case 2:s.style.top="6%",s.style.left="72%",s.classList.add("hand-anim-swipe-col3"),i.textContent="👆",n.textContent="3열 세로 밀기 (↕)";break;case 3:s.style.top="36%",s.style.left="10%",s.classList.add("hand-anim-swipe-v"),i.textContent="👆",n.textContent="2행 세로 밀기 (↕)";break;case 4:s.style.top="6%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",n.textContent="1행 더블 탭 (180°)";break}break;case 6:switch(t){case 0:s.style.top="6%",s.style.left="10%",s.classList.add("hand-anim-tap"),i.textContent="👆",n.textContent="1수: 1행 1회 탭";break;case 1:s.style.top="6%",s.style.left="10%",s.classList.add("hand-anim-tap"),i.textContent="👆",n.textContent="1행 1회 탭 (90°)";break;case 2:s.style.top="66%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",n.textContent="3행 더블 탭 (180°)";break;case 3:s.style.top="6%",s.style.left="72%",s.classList.add("hand-anim-swipe-col3"),i.textContent="👆",n.textContent="3열 세로 밀기 (↕)";break;case 4:s.style.top="66%",s.style.left="72%",s.classList.add("hand-anim-swipe-diag"),i.textContent="👆",n.textContent="대각선 밀기 (↘)";break;case 5:s.style.top="6%",s.style.left="41%",s.classList.add("hand-anim-swipe-row2"),i.textContent="👆",n.textContent="2열 가로 밀기 (↔)";break}break;default:s.style.display="none";break}}goToV4SubStep(e,t=!0){this.v4SubStep=Math.max(0,Math.min($.length-1,e));const s=$[this.v4SubStep];if(this.boardOps=[...s.boardOps],this.clearCellHighlights(),s.highlightCells.length>0&&this.highlightCells(s.highlightCells,"highlight-row"),typeof document<"u"){const i=document.getElementById("tut-formula-card"),n=document.getElementById("tut-formula-badge"),o=document.getElementById("tut-formula-text"),l=document.getElementById("tut-formula-desc");i&&(i.style.display="block"),n&&(n.textContent=s.formulaBadge),o&&(o.textContent=s.formulaText),l&&(l.textContent=s.formulaDesc),this.updateMovePillsActive(this.v4SubStep),this.updateHandDemo(5,this.v4SubStep),this.renderBoard()}t&&g.playTap()}goToD4SubStep(e,t=!0){this.d4SubStep=Math.max(0,Math.min(z.length-1,e));const s=z[this.d4SubStep];if(this.boardOps=[...s.boardOps],this.clearCellHighlights(),s.highlightCells.length>0&&this.highlightCells(s.highlightCells,"highlight-row"),typeof document<"u"){const i=document.getElementById("tut-formula-card"),n=document.getElementById("tut-formula-badge"),o=document.getElementById("tut-formula-text"),l=document.getElementById("tut-formula-desc");i&&(i.style.display="block"),n&&(n.textContent=s.formulaBadge),o&&(o.textContent=s.formulaText),l&&(l.textContent=s.formulaDesc),this.updateMovePillsActive(this.d4SubStep),this.updateHandDemo(6,this.d4SubStep),this.renderBoard()}t&&g.playTap()}toggleAutoPlay(){this.isAutoPlaying?this.stopAutoPlay():this.startAutoPlay()}startAutoPlay(){this.stopAutoPlay(),this.isAutoPlaying=!0,this.updateAutoPlayButtonState(!0),this.autoPlayTimer=setInterval(()=>{if(this.currentStep===5){const e=(this.v4SubStep+1)%$.length;this.goToV4SubStep(e,!1)}else if(this.currentStep===6){const e=(this.d4SubStep+1)%z.length;this.goToD4SubStep(e,!1)}else this.stopAutoPlay()},1200)}stopAutoPlay(){this.autoPlayTimer&&(clearInterval(this.autoPlayTimer),this.autoPlayTimer=null),this.isAutoPlaying=!1,this.updateAutoPlayButtonState(!1)}updateAutoPlayButtonState(e){if(typeof document>"u")return;const t=document.getElementById("btn-tut-autoplay");t&&(t.textContent=e?"⏸ 일시정지":"▶ 한 수씩 보기",t.classList.toggle("playing",e))}renderMovePills(e,t,s){if(typeof document>"u")return;const i=document.getElementById("tut-move-pills");i&&(i.innerHTML="",e.forEach((n,o)=>{const l=document.createElement("button");l.className=`tut-move-pill ${o===t?"active":""}`,l.textContent=n.label,l.addEventListener("click",()=>{this.stopAutoPlay(),s(o)}),i.appendChild(l)}))}updateMovePillsActive(e){if(typeof document>"u")return;document.querySelectorAll(".tut-move-pill").forEach((s,i)=>{s.classList.toggle("active",i===e)})}updateStepUI(){if(typeof document>"u")return;const e=this.currentStep;document.querySelectorAll(".tut-step-dot").forEach(y=>{const M=parseInt(y.dataset.step||"1",10);y.classList.toggle("active",M===e),y.classList.toggle("completed",M<e)});const t=document.getElementById("tut-step-name"),s=document.getElementById("tut-main-text"),i=document.getElementById("tut-sub-text"),n=document.getElementById("tut-formula-card"),o=document.getElementById("tut-formula-badge"),l=document.getElementById("tut-formula-text"),r=document.getElementById("tut-formula-desc"),d=document.getElementById("tut-gesture-card"),h=document.getElementById("tut-master-card"),b=document.getElementById("tut-board-wrapper"),p=document.getElementById("tut-move-controller"),v=document.getElementById("btn-tut-prev"),m=document.getElementById("tut-btn-action-text");if(!(!t||!s||!i))switch(this.clearCellHighlights(),v&&(v.style.display=e>1?"block":"none"),p&&(p.style.display="none"),n&&(n.style.display="none"),d&&(d.style.display="none"),h&&(h.style.display="none"),b&&(b.style.display="block"),e){case 1:t.textContent="STEP 1. 퍼즐 목표 & 행렬 구조",s.textContent="모든 강아지를 바른 앞면(0번)으로 맞추면 성공!",i.textContent="뒤섞인 타일을 모두 정위치 앞면(0번)으로 정렬해 보세요.",m&&(m.textContent="다음 (1/7) ➔"),g.speak("뒤섞인 강아지들을 모두 바르게 세워 0번으로 맞추면 성공이에요!"),this.updateHandDemo(1);break;case 2:t.textContent="STEP 2. 성분별 변환 & 손동작 조작",s.textContent="1행 타일을 ↔ 가로로 밀면 1행 전체가 뒤집혀요",i.textContent="스위치 칩([↔1행|↕1열])을 누르면 1열 모드로 전환돼요.",this.highlightCells([0,1,2],"highlight-row"),n&&(n.style.display="block",o&&(o.textContent="💡 1행 가로 반사"),l&&(l.textContent="↔ 가로 밀기 (MX)"),r&&(r.textContent="1행 전체가 뒤로 휙 뒤집혀요.")),m&&(m.textContent="다음 (2/7) ➔"),g.speak("1행 타일을 옆으로 쓱 밀면, 1행 강아지들이 모두 뒤로 휙 뒤집혀요."),this.updateHandDemo(2);break;case 3:t.textContent="STEP 3. 반사 + 반사 = 회전 (V4)",s.textContent="가로 반사 후 세로 반사를 하면 신기하게 180° 회전이 돼요! (MX ∘ MY = R180)",i.textContent="반사 두 번이 만나면 다시 앞면으로 오며 180도 회전 완성!",this.highlightCells([0],"highlight-center"),this.highlightCells([1,2],"highlight-row"),this.highlightCells([3,6],"highlight-row"),n&&(n.style.display="block",o&&(o.textContent="✨ 반사 + 반사 = 회전"),l&&(l.textContent="MX ∘ MY = R180"),r&&(r.textContent="가로 반사 후 세로 반사로 180° 회전 탄생!")),m&&(m.textContent="다음 (3/7) ➔"),g.speak("가로로 뒤집고 세로로 또 뒤집으면, 신기하게 180도 돌아간 앞면이 돼요."),this.updateHandDemo(3);break;case 4:t.textContent="STEP 4. 완전한 대칭 군 D4",s.textContent="회전과 반사가 모두 모여 완성되는 8차 대칭군 D4!",i.textContent="회전 4종(0°, 90°, 180°, 270°)과 반사 4종(가로·세로·대각선)의 조화",n&&(n.style.display="block",o&&(o.textContent="🌌 8차 대칭군 D4"),l&&(l.textContent="회전 4종 + 반사 4종"),r&&(r.textContent="회전과 반사가 모여 완벽한 대칭을 이룹니다.")),m&&(m.textContent="다음 (4/7) ➔"),g.speak("회전과 반사가 모두 모여 8가지 완벽한 대칭을 이룹니다."),this.updateHandDemo(4);break;case 5:t.textContent="STEP 5. [실전] V4 4수 마스터",s.textContent="V4 실전 예제: 반사와 회전의 4수 상쇄 풀이",i.textContent="단계별 손동작을 따라가며 4수 만에 0번으로 풀어보세요.",p&&(p.style.display="flex"),this.renderMovePills($,this.v4SubStep,y=>this.goToV4SubStep(y)),this.goToV4SubStep(this.v4SubStep,!1),m&&(m.textContent="다음 (5/7) ➔"),g.speak("반사와 회전을 차례로 맞춰 4수 만에 0번으로 푸는 모습이에요.");break;case 6:t.textContent="STEP 6. [실전] D4 5수 묘수 풀이",s.textContent="D4 실전 예제: 대각선까지 포함한 5수 묘수 풀이",i.textContent="대각선 반사와 회전이 어우러져 단 5수 만에 깔끔하게 해결!",p&&(p.style.display="flex"),this.renderMovePills(z,this.d4SubStep,y=>this.goToD4SubStep(y)),this.goToD4SubStep(this.d4SubStep,!1),m&&(m.textContent="다음 (6/7) ➔"),g.speak("대각선까지 섞여 있어도 5수 만에 깔끔하게 해결돼요!");break;case 7:t.textContent="STEP 7. 군론 행렬 퍼즐 정복",s.textContent="준비 완료! 이제 실전 퍼즐에 도전해 보세요",i.textContent="배운 손동작과 대칭 원리로 최단 기록을 달성해 보세요!",b&&(b.style.display="none"),h&&(h.style.display="block"),m&&(m.textContent="🎮 실전 퍼즐 시작하기"),g.playClear(),g.speak("자, 이제 실전 퍼즐을 신나게 맞춰볼까요?"),this.updateHandDemo(7);break}}highlightCells(e,t){typeof document>"u"||e.forEach(s=>{const i=document.getElementById(`tut-cell-${s}`);i&&i.classList.add(t)})}clearCellHighlights(){if(!(typeof document>"u"))for(let e=0;e<9;e++){const t=document.getElementById(`tut-cell-${e}`);t&&(t.className="tut-cell-box")}}renderBoard(){if(!(typeof document>"u"))for(let e=0;e<9;e++){const t=document.getElementById(`tut-cell-${e}`);if(!t)continue;const s=typeof t.querySelector=="function"?t.querySelector(".tut-cell-canvas"):null,i=typeof t.querySelector=="function"?t.querySelector(".tut-cell-badge"):null,n=this.boardOps[e]||a.ID;s&&this.imgDogFront&&this.imgDogBack&&et(s,n,this.imgDogFront,this.imgDogBack),i&&(i.textContent=vt(n),i.dataset.op=n)}}}let G=null;function Mt(c=1){return G||(G=new yt),G.open(c),G}class xt{constructor(){u(this,"canvas");u(this,"ctx");u(this,"particles",[]);u(this,"animId",null);u(this,"isRunning",!1);u(this,"animate",()=>{if(!(!this.isRunning||!this.ctx)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=this.particles.length-1;e>=0;e--){const t=this.particles[e];if(t.x+=t.vx,t.y+=t.vy,t.vy+=.45,t.vx*=.985,t.rotation+=t.vRot,t.vy>0&&(t.alpha-=.007),t.alpha<=0||t.y>this.canvas.height+20){this.particles.splice(e,1);continue}if(this.ctx.save(),this.ctx.globalAlpha=Math.max(0,t.alpha),this.ctx.translate(t.x,t.y),this.ctx.rotate(t.rotation*Math.PI/180),this.ctx.fillStyle=t.color,t.shape==="rect")this.ctx.fillRect(-t.size/2,-t.size/2,t.size,t.size*.6);else if(t.shape==="circle")this.ctx.beginPath(),this.ctx.arc(0,0,t.size/2,0,Math.PI*2),this.ctx.fill();else{this.ctx.beginPath();for(let s=0;s<5;s++)this.ctx.lineTo(Math.cos((18+s*72)*Math.PI/180)*t.size,-Math.sin((18+s*72)*Math.PI/180)*t.size),this.ctx.lineTo(Math.cos((54+s*72)*Math.PI/180)*(t.size/2),-Math.sin((54+s*72)*Math.PI/180)*(t.size/2));this.ctx.closePath(),this.ctx.fill()}this.ctx.restore()}this.particles.length>0&&(this.animId=requestAnimationFrame(this.animate))}});this.canvas=document.createElement("canvas"),this.canvas.id="victory-confetti-canvas",this.canvas.style.position="fixed",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.width="100vw",this.canvas.style.height="100vh",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="999",this.canvas.style.display="none",document.body.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",()=>this.resizeCanvas())}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}launchVictory(e,t,s,i){this.resizeCanvas(),this.canvas.style.display="block",this.particles=[],this.isRunning=!0,navigator.vibrate&&navigator.vibrate([80,40,120,40,250]);const n=["#facc15","#38bdf8","#4ade80","#f43f5e","#a855f7","#fb923c","#ffffff"],o=this.canvas.width,l=this.canvas.height;for(let r=0;r<150;r++){const d=r%2===0;this.particles.push({x:d?Math.random()*(o*.3):o-Math.random()*(o*.3),y:l+10,vx:(d?1:-1)*(Math.random()*8+3)+(Math.random()-.5)*4,vy:-(Math.random()*16+12),size:Math.random()*9+5,color:n[Math.floor(Math.random()*n.length)],rotation:Math.random()*360,vRot:(Math.random()-.5)*12,alpha:1,shape:r%5===0?"star":r%2===0?"rect":"circle"})}this.animate(),this.showVictoryBanner(e,t,s,i),setTimeout(()=>{this.isRunning=!1,this.animId&&cancelAnimationFrame(this.animId),this.ctx&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.style.display="none"},4e3)}showVictoryBanner(e,t,s,i){var h,b;const n=document.getElementById("victory-banner-overlay");n&&n.remove();const o=document.createElement("div");o.id="victory-banner-overlay",o.className="victory-banner-anim";const l=(s==null?void 0:s.isNewBestTime)||(s==null?void 0:s.isNewBestMoves),r=s!=null&&s.timeFormatted?`⏱️ 소요 시간: <b>${s.timeFormatted}</b>`:"";o.innerHTML=`
      <div class="victory-card">
        <div class="victory-trophy">🏆</div>
        ${l?'<div class="badge-new-record">🔥 NEW BEST RECORD!</div>':""}
        <div class="victory-title">PERFECT CLEAR!</div>
        <div class="victory-stars">${"⭐".repeat(t)}</div>
        <div class="victory-desc">모든 대칭 타일을 원위치로 맞추셨습니다!</div>
        <div class="victory-stats-box">
          <div class="victory-moves">총 조작: <b>${e} 회</b></div>
          ${r?`<div class="victory-time">${r}</div>`:""}
        </div>
        ${s!=null&&s.bestTimeFormatted||(s==null?void 0:s.bestMoves)!==void 0?`
          <div class="victory-best-summary">
            최고 기록: ${s.bestMoves?`${s.bestMoves}회`:"-"} / ${s.bestTimeFormatted||"-"}
          </div>
        `:""}
        <div class="victory-actions">
          <button id="btn-victory-replay" class="btn-action primary">🎲 다시 섞기</button>
          <button id="btn-victory-close" class="btn-action">닫기</button>
        </div>
      </div>
    `,document.body.appendChild(o);const d=()=>{o.classList.add("fade-out"),setTimeout(()=>o.remove(),300)};(h=o.querySelector("#btn-victory-close"))==null||h.addEventListener("click",d),(b=o.querySelector("#btn-victory-replay"))==null||b.addEventListener("click",()=>{d(),i&&i()}),setTimeout(()=>{document.body.contains(o)&&d()},6e3)}}const St=new xt;let B=null;function Tt(){const c=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0,e=document.getElementById("btn-pwa-install");"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(t=>{t.update&&t.update()}).catch(()=>{})}),window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),B=t,!c&&e&&(e.style.display="inline-flex")}),window.addEventListener("appinstalled",()=>{B=null,e&&(e.style.display="none")}),e&&e.addEventListener("click",async()=>{if(B){B.prompt();const{outcome:t}=await B.userChoice;t==="accepted"&&(B=null,e.style.display="none")}else alert("브라우저 메뉴(⋮)에서 [홈 화면에 추가] 또는 [앱 설치]를 선택하시면 바탕화면에 설치됩니다.")})}class Et{constructor(){u(this,"boardSize",3);u(this,"scrambleMoves",3);u(this,"currentOps",[]);u(this,"currentGroup","D4");u(this,"moveHistory",[]);u(this,"movesCount",0);u(this,"isAnimating",!1);u(this,"isGameStarted",!1);u(this,"isGuideActive",!1);u(this,"imgDogFront",new Image);u(this,"imgDogBack",new Image);u(this,"boardGrid");u(this,"gestureCanvas");u(this,"gestureRecognizer");this.initBoardOps(),this.initImages(),this.renderLayout(),this.bindControls(),this.updateBoard(),this.updateBestRecordBadge(),Tt()}initBoardOps(){this.currentOps=Array(this.boardSize*this.boardSize).fill(a.ID)}initImages(){this.imgDogFront.src="assets/dog_front.png",this.imgDogBack.src="assets/dog_back.png";const e=()=>this.updateBoard();this.imgDogFront.onload=e,this.imgDogBack.onload=e}renderLayout(){const e=document.getElementById("app");e.innerHTML=`
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

      <!-- 보드 아래쪽 실시간 인라인 해설 패널 컨테이너 -->
      <div id="solution-panel-container"></div>

      <div class="controls-panel">
        <button id="btn-undo" class="btn-action">↩ 되돌리기</button>
        <button id="btn-hint" class="btn-action">💡 힌트</button>
        <button id="btn-solution" class="btn-action primary">📖 해설</button>
      </div>

      <div class="controls-panel" style="margin-top: 4px;">
        <button id="btn-set-c2" class="btn-icon" style="flex:1;">C₂ 모드</button>
        <button id="btn-set-v4" class="btn-icon" style="flex:1;">V₄ 모드</button>
        <button id="btn-set-d4" class="btn-icon active" style="flex:1;">D₄ 모드</button>
      </div>
    `,this.boardGrid=document.getElementById("board-grid"),this.gestureCanvas=document.getElementById("gesture-canvas"),this.gestureRecognizer=new mt(this.boardGrid,this.gestureCanvas,(t,s)=>this.handleLineOperation(t,s),this.boardSize),this.rebuildBoardDOM()}rebuildBoardDOM(){this.boardGrid.style.gridTemplateColumns=`repeat(${this.boardSize}, 1fr)`,this.boardGrid.style.gridTemplateRows=`repeat(${this.boardSize}, 1fr)`,this.boardGrid.innerHTML="",this.boardGrid.classList.toggle("show-guide",this.isGuideActive);const e=this.boardSize*this.boardSize;for(let t=0;t<e;t++){const s=document.createElement("div");s.className="cell-box";const i=document.createElement("canvas");i.className="cell-canvas",i.width=100,i.height=100,s.appendChild(i);const n=Math.floor(t/this.boardSize),o=t%this.boardSize;if(t===0){const r=this.gestureRecognizer?this.gestureRecognizer.getCell11Mode():"row",d=document.createElement("div");d.className=`dual-switch-11 ${r==="col"?"mode-col":"mode-row"}`,d.id="dual-switch-11",d.title="탭하여 1행 / 1열 변환 모드 전환",d.innerHTML=`
          <span class="switch-opt switch-row">↔ 1행</span>
          <span class="switch-divider">|</span>
          <span class="switch-opt switch-col">↕ 1열</span>
        `,d.addEventListener("click",h=>{h.stopPropagation();const b=this.gestureRecognizer.toggleCell11Mode();d.className=`dual-switch-11 ${b==="col"?"mode-col":"mode-row"}`,g.playTap(),this.highlightActiveLine(b)}),s.appendChild(d)}else{let r="",d="";if(o===0&&n>0?(r=`${n+1}행`,d="guide-row"):n===0&&o>0?(r=`${o+1}열`,d="guide-col"):n===this.boardSize-1&&o===this.boardSize-1?(r="↖대각",d="guide-diag"):n===1&&o===this.boardSize-1&&(r="↗대각",d="guide-diag"),r){const h=document.createElement("div");h.className=`controller-guide-label ${d}`,h.innerText=r,s.appendChild(h)}}const l=document.createElement("div");l.className="cell-state-badge is-solved",l.innerText="0",s.appendChild(l),this.boardGrid.appendChild(s)}}highlightActiveLine(e){const t=this.boardSize*this.boardSize;for(let i=0;i<t;i++){const n=this.boardGrid.children[i];n&&n.classList.remove("highlight-col","highlight-row")}const s=[];if(e==="col")for(let i=0;i<this.boardSize;i++)s.push(i*this.boardSize);else for(let i=0;i<this.boardSize;i++)s.push(i);s.forEach(i=>{const n=this.boardGrid.children[i];n&&n.classList.add(e==="col"?"highlight-col":"highlight-row")}),setTimeout(()=>{s.forEach(i=>{const n=this.boardGrid.children[i];n&&n.classList.remove("highlight-col","highlight-row")})},1200)}bindControls(){var s,i,n,o,l,r,d,h,b;const e=document.getElementById("btn-header-tutorial");!ft()&&e&&e.classList.add("pulse-active"),e==null||e.addEventListener("click",()=>{g.playTap(),e.classList.remove("pulse-active"),Mt()}),(s=document.getElementById("btn-about"))==null||s.addEventListener("click",()=>{g.playTap(),gt()});const t=document.getElementById("btn-toggle-guide");t&&(t.classList.toggle("active",this.isGuideActive),t.addEventListener("click",()=>{this.isGuideActive=!this.isGuideActive,t.classList.toggle("active",this.isGuideActive),this.boardGrid.classList.toggle("show-guide",this.isGuideActive),g.playTap()})),(i=document.getElementById("btn-toggle-bgm"))==null||i.addEventListener("click",p=>{const v=g.toggleBgm();p.target.innerText=v?"🎵 BGM":"🔇 BGM"}),(n=document.getElementById("btn-toggle-sfx"))==null||n.addEventListener("click",p=>{const v=g.toggleSfx();p.target.innerText=v?"🔊 SFX":"🔈 SFX"}),document.querySelectorAll("#size-button-group .btn-pill").forEach(p=>{p.addEventListener("click",v=>{const m=v.currentTarget,y=parseInt(m.dataset.size||"3",10);y!==this.boardSize&&(document.querySelectorAll("#size-button-group .btn-pill").forEach(M=>M.classList.remove("active")),m.classList.add("active"),this.setBoardSize(y))})}),this.renderDifficultyButtons(),(o=document.getElementById("btn-undo"))==null||o.addEventListener("click",()=>{this.undoMove()}),(l=document.getElementById("btn-hint"))==null||l.addEventListener("click",()=>{this.giveHint()}),(r=document.getElementById("btn-solution"))==null||r.addEventListener("click",()=>{this.openSolution()}),(d=document.getElementById("btn-set-c2"))==null||d.addEventListener("click",()=>this.switchGroup("C2")),(h=document.getElementById("btn-set-v4"))==null||h.addEventListener("click",()=>this.switchGroup("V4")),(b=document.getElementById("btn-set-d4"))==null||b.addEventListener("click",()=>this.switchGroup("D4"))}updateBestRecordBadge(){const e=document.getElementById("badge-best-record");if(!e)return;const t=C.getRecord(this.boardSize,this.scrambleMoves);if(t&&(t.bestTimeMs!==null||t.bestMoves!==null)){const s=t.bestTimeMs!==null?X(t.bestTimeMs):"-",i=t.bestMoves!==null?`${t.bestMoves}회`:"-";e.innerText=`🏆 ${s} / ${i}`,e.title=`최고 기록: ${s} (${i})`}else e.innerText="🏆 BEST: -",e.title="아직 클리어 기록이 없습니다"}setBoardSize(e){this.boardSize=e,this.initBoardOps(),this.rebuildBoardDOM(),this.gestureRecognizer.setBoardSize(e),this.isGameStarted=!1,C.resetTimer();const t=document.getElementById("label-timer");t&&(t.innerText="00:00.0"),this.moveHistory=[],this.movesCount=0,this.updateMovesLabel(),this.updateStatusInfo(),this.updateBestRecordBadge(),g.playTap(),this.scrambleBoard()}updateStatusInfo(){const e=document.getElementById("label-stage-info");e&&(e.innerText=`${this.boardSize}×${this.boardSize} (${this.scrambleMoves}수 도전)`)}renderDifficultyButtons(){const e=document.getElementById("moves-button-group");if(!e)return;let t=[3,4,5,6,7,8];this.currentGroup==="V4"?t=[2,3,4]:this.currentGroup==="C2"&&(t=[2,3]),t.includes(this.scrambleMoves)||(this.scrambleMoves=t[0]),e.innerHTML="",t.forEach(s=>{const i=document.createElement("button");i.className=`btn-pill ${s===this.scrambleMoves?"active":""}`,i.dataset.moves=String(s),i.innerText=`${s}수`,i.addEventListener("click",()=>{this.scrambleMoves=s,e.querySelectorAll(".btn-pill").forEach(n=>n.classList.remove("active")),i.classList.add("active"),this.updateStatusInfo(),this.updateBestRecordBadge(),this.scrambleBoard()}),e.appendChild(i)}),this.updateStatusInfo(),this.updateBestRecordBadge()}switchGroup(e){this.currentGroup=e;const t=document.getElementById("badge-group-name");t&&(t.innerText=k[e].name),["btn-set-c2","btn-set-v4","btn-set-d4"].forEach(s=>{const i=document.getElementById(s);i&&i.classList.toggle("active",s.endsWith(e.toLowerCase()))}),this.renderDifficultyButtons(),this.scrambleBoard()}handleLineOperation(e,t){if(this.isAnimating)return;let s=t;this.currentGroup==="C2"?s=a.R180:this.currentGroup==="V4"&&(t===a.R90||t===a.R270?s=a.R180:t===a.MD?s=a.MY:t===a.MAD&&(s=a.MX));const n=A(this.boardSize).findIndex(o=>o.type===e.type&&o.idx===e.idx);n!==-1&&this.applyMove(n,s)}applyMove(e,t,s=!0){if(this.isAnimating)return;this.isAnimating=!0,this.gestureRecognizer.setLocked(!0),g.playFlip();const n=w(this.boardSize)[e]||[];let o="scale(0.92)";t==="MX"?o="perspective(900px) scale(0.92) rotateX(180deg)":t==="MY"?o="perspective(900px) scale(0.92) rotateY(180deg)":t==="MD"?o="perspective(900px) scale(0.92) rotate3d(1, 1, 0, 180deg)":t==="MAD"?o="perspective(900px) scale(0.92) rotate3d(-1, 1, 0, 180deg)":t==="R90"?o="perspective(900px) scale(0.92) rotateZ(90deg)":t==="R180"?o="perspective(900px) scale(0.92) rotateZ(180deg)":t==="R270"&&(o="perspective(900px) scale(0.92) rotateZ(270deg)");const l=340;n.forEach(r=>{const d=this.boardGrid.children[r];d&&(d.style.transition=`transform ${l}ms cubic-bezier(0.2, 0.9, 0.3, 1)`,d.style.transform=o)}),setTimeout(()=>{try{const r=[...this.currentOps];this.currentOps=V(this.currentOps,n,t),s&&(this.isGameStarted||(this.isGameStarted=!0,C.startTimer(d=>{const h=document.getElementById("label-timer");h&&(h.innerText=d)})),this.moveHistory.push({lineId:e,op:t,prevOps:r}),this.movesCount++,this.updateMovesLabel()),this.updateBoard(),n.forEach(d=>{const h=this.boardGrid.children[d];h&&(h.style.transition="none",h.style.transform="")}),requestAnimationFrame(()=>{requestAnimationFrame(()=>{n.forEach(d=>{const h=this.boardGrid.children[d];h&&(h.style.transition="")})})}),this.checkWinCondition()}finally{this.isAnimating=!1,this.gestureRecognizer.setLocked(!1)}},l)}undoMove(){if(this.moveHistory.length===0||this.isAnimating)return;const e=this.moveHistory.pop();this.currentOps=e.prevOps,this.movesCount=Math.max(0,this.movesCount-1),this.updateMovesLabel(),g.playTap(),this.updateBoard()}scrambleBoard(){j.close(),this.isGameStarted=!1,C.resetTimer();const e=document.getElementById("label-timer");e&&(e.innerText="00:00.0");const t=A(this.boardSize),s=w(this.boardSize),n=k[this.currentGroup].ops.filter(l=>l!==a.ID);let o=Array(this.boardSize*this.boardSize).fill(a.ID);for(let l=0;l<this.scrambleMoves;l++){const r=Math.floor(Math.random()*t.length),d=n[Math.floor(Math.random()*n.length)];o=V(o,s[r],d)}this.currentOps=o,this.moveHistory=[],this.movesCount=0,this.updateMovesLabel(),this.updateBestRecordBadge(),g.playTap(),this.updateBoard()}giveHint(){if(this.currentOps.every(o=>o===a.ID)){g.playWin();return}const e=_(this.currentOps,this.boardSize,this.currentGroup);if(e.length===0)return;const t=e[0];g.playTap();const s=this.boardSize*this.boardSize;for(let o=0;o<s;o++){const l=this.boardGrid.children[o];l&&l.classList.remove("highlight-hint","highlight-col","highlight-row")}const n=w(this.boardSize)[t.lineId]||[];n.forEach(o=>{const l=this.boardGrid.children[o];l&&l.classList.add("highlight-hint")}),setTimeout(()=>{n.forEach(o=>{const l=this.boardGrid.children[o];l&&l.classList.remove("highlight-hint")})},2500)}openSolution(){const e=document.getElementById("solution-panel-container");if(!e)return;const t=[...this.currentOps],s=_(this.currentOps,this.boardSize,this.currentGroup);j.render(e,this.currentOps,this.boardSize,s,{onPreviewState:(i,n)=>{this.currentOps=[...i],this.updateBoard();const o=this.boardSize*this.boardSize;for(let l=0;l<o;l++){const r=this.boardGrid.children[l];r&&r.classList.remove("highlight-hint")}n!==null&&(w(this.boardSize)[n]||[]).forEach(d=>{const h=this.boardGrid.children[d];h&&h.classList.add("highlight-hint")})},onAutoSolve:()=>{this.currentOps=[...t],this.updateBoard(),this.runAutoSolve(s)},onClose:()=>{const i=this.boardSize*this.boardSize;for(let n=0;n<i;n++){const o=this.boardGrid.children[n];o&&o.classList.remove("highlight-hint")}this.updateBoard()}})}async runAutoSolve(e){for(const t of e){if(this.currentOps.every(s=>s===a.ID))break;await new Promise(s=>{this.applyMove(t.lineId,t.op,!0),setTimeout(s,520)})}}checkWinCondition(){if(this.currentOps.every(t=>t===a.ID)){this.isGameStarted=!1;const t=C.stopTimer(),s=C.getFormattedTime(),i=C.saveRecord(this.boardSize,this.scrambleMoves,t,this.movesCount);this.updateBestRecordBadge(),g.playWin();const n=ut.completeStage(1,this.movesCount),o=this.boardSize*this.boardSize;for(let l=0;l<o;l++){const r=this.boardGrid.children[l];r&&setTimeout(()=>{r.classList.add("celebrate-tile")},l*40)}St.launchVictory(this.movesCount,n,{timeFormatted:s,isNewBestTime:i.isNewBestTime,isNewBestMoves:i.isNewBestMoves,bestTimeFormatted:X(i.bestTimeMs),bestMoves:i.bestMoves},()=>{this.scrambleBoard()}),setTimeout(()=>{for(let l=0;l<o;l++){const r=this.boardGrid.children[l];r&&r.classList.remove("celebrate-tile")}},4200)}}updateMovesLabel(){const e=document.getElementById("label-moves");e&&(e.innerText=`${this.movesCount} 회`)}getBadgeInfo(e){switch(e){case"ID":return{text:"0",isSolved:!0,isSymmetry:!1};case"R90":return{text:"1",isSolved:!1,isSymmetry:!1};case"R180":return{text:"2",isSolved:!1,isSymmetry:!1};case"R270":return{text:"3",isSolved:!1,isSymmetry:!1};case"MX":return{text:"―",isSolved:!1,isSymmetry:!0};case"MY":return{text:"│",isSolved:!1,isSymmetry:!0};case"MD":return{text:"╲",isSolved:!1,isSymmetry:!0};case"MAD":return{text:"╱",isSolved:!1,isSymmetry:!0};default:return{text:"0",isSolved:!0,isSymmetry:!1}}}updateBoard(){const e=this.boardSize*this.boardSize;for(let t=0;t<e;t++){const s=this.boardGrid.children[t];if(!s)continue;const i=s.querySelector("canvas");if(!i)continue;const n=this.currentOps[t];et(i,n,this.imgDogFront,this.imgDogBack);const o=s.querySelector(".cell-state-badge");if(o){const l=this.getBadgeInfo(n);o.innerText=l.text,o.classList.toggle("is-solved",l.isSolved),o.classList.toggle("is-symmetry",l.isSymmetry)}}}}window.addEventListener("DOMContentLoaded",()=>{new Et});
