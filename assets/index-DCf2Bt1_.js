var nt=Object.defineProperty;var at=(c,t,e)=>t in c?nt(c,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):c[t]=e;var h=(c,t,e)=>at(c,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();const n={ID:"ID",R90:"R90",R180:"R180",R270:"R270",MX:"MX",MY:"MY",MD:"MD",MAD:"MAD"},A={[n.ID]:0,[n.R90]:1,[n.R180]:2,[n.R270]:3,[n.MX]:4,[n.MY]:5,[n.MD]:6,[n.MAD]:7},V=[n.ID,n.R90,n.R180,n.R270,n.MX,n.MY,n.MD,n.MAD];function F(c,t){const{x:e,y:s}=c;switch(t){case n.ID:return{x:e,y:s};case n.R90:return{x:1-s,y:e};case n.R180:return{x:1-e,y:1-s};case n.R270:return{x:s,y:1-e};case n.MX:return{x:e,y:1-s};case n.MY:return{x:1-e,y:s};case n.MD:return{x:s,y:e};case n.MAD:return{x:1-s,y:1-e};default:return{x:e,y:s}}}function J(c,t){const e={x:.23,y:.79},s=F(e,c),i=F(s,t);for(const a of Object.keys(n)){const o=F(e,n[a]);if(Math.abs(o.x-i.x)<.001&&Math.abs(o.y-i.y)<.001)return n[a]}return n.ID}const H=new Uint8Array(64),Z=new Uint8Array(8);for(let c=0;c<8;c++)for(let t=0;t<8;t++){const e=J(V[c],V[t]);H[c*8+t]=A[e]??0}for(let c=0;c<8;c++)for(let t=0;t<8;t++)if(H[c*8+t]===0){Z[c]=t;break}const L={C2:{key:"C2",name:"C₂ (180° 회전군)",ops:[n.ID,n.R180],desc:"180° 회전만 사용하는 2원 대칭군 입문 모드 (최대 5수 해결)"},V4:{key:"V4",name:"V₄ (클라인 4원군)",ops:[n.ID,n.R180,n.MX,n.MY],desc:"가로/세로 반전 및 180° 회전을 사용하는 4원 대칭군 (최대 5수 해결)"},D4:{key:"D4",name:"D₄ (정사면 대칭군)",ops:[n.ID,n.R90,n.R180,n.R270,n.MX,n.MY,n.MD,n.MAD],desc:"90° 회전 및 대각선 대칭을 포함한 풀 D4 정사각 대칭군 (최대 8수)"}};function R(c){const t=[];for(let e=0;e<c;e++)t.push({type:"row",idx:e,label:`${e+1}행`});for(let e=0;e<c;e++)t.push({type:"col",idx:e,label:`${e+1}열`});return t.push({type:"diag",idx:"main",label:"↖ 주대각선"}),t.push({type:"diag",idx:"anti",label:"↗ 부대각선"}),t}function w(c){const t=[];for(let i=0;i<c;i++){const a=[];for(let o=0;o<c;o++)a.push(i*c+o);t.push(a)}for(let i=0;i<c;i++){const a=[];for(let o=0;o<c;o++)a.push(o*c+i);t.push(a)}const e=[];for(let i=0;i<c;i++)e.push(i*c+i);t.push(e);const s=[];for(let i=0;i<c;i++)s.push(i*c+(c-1-i));return t.push(s),t}R(3);const ot=w(3);function lt(c){let t=0;for(let e=0;e<Math.min(c.length,9);e++){const s=typeof c[e]=="number"?c[e]:A[c[e]];t|=s<<e*3}return t}function tt(c,t,e){const s=ot[t];let i=c;for(let a=0;a<s.length;a++){const l=s[a]*3,r=i>>l&7,d=H[r*8+e];i=i&~(7<<l)|d<<l}return i}function rt(c,t,e){const s=Z[e];return tt(c,t,s)}function N(c,t,e){const s=[...c],i=A[e];for(let a=0;a<t.length;a++){const o=t[a],l=A[s[o]],r=H[l*8+i];s[o]=V[r]}return s}function et(c,t="D4",e=!0){const s=lt(c);if(s===0)return[];const i=R(3),l=(L[t]||L.D4).ops.filter(f=>f!=="ID").map(f=>A[f]).filter(f=>f!==void 0&&f>0),r=e?8:6,d=[];for(let f=0;f<r;f++)for(const P of l)d.push({lineId:f,opInt:P,packed:f<<4|P});const u=new Map,m=new Map;u.set(s,null),m.set(0,null);let p=[s],v=[0],g=-1;const S=8;let y=0;for(;y<S&&g===-1&&p.length>0&&v.length>0;){y++;const f=[];for(let I=0;I<p.length;I++){const O=p[I];for(let C=0;C<d.length;C++){const D=d[C],M=tt(O,D.lineId,D.opInt);if(!u.has(M)){if(u.set(M,{prevCode:O,lineId:D.lineId,opInt:D.opInt}),m.has(M)){g=M;break}f.push(M)}}if(g!==-1)break}if(p=f,g!==-1)break;const P=[];for(let I=0;I<v.length;I++){const O=v[I];for(let C=0;C<d.length;C++){const D=d[C],M=rt(O,D.lineId,D.opInt);if(!m.has(M)){if(m.set(M,{prevCode:O,lineId:D.lineId,opInt:D.opInt}),u.has(M)){g=M;break}P.push(M)}}if(g!==-1)break}v=P}if(g===-1)return[];const x=[];let T=g;for(;T!==s;){const f=u.get(T);if(!f)break;x.push({lineId:f.lineId,opInt:f.opInt}),T=f.prevCode}x.reverse();const k=[];for(T=g;T!==0;){const f=m.get(T);if(!f)break;k.push({lineId:f.lineId,opInt:f.opInt}),T=f.prevCode}return[...x,...k].map(f=>({lineId:f.lineId,line:i[f.lineId],op:V[f.opInt],opInt:f.opInt}))}function ct(c,t,e="D4",s=4){if(t===3)return et(c,e,!0);const i=p=>p.every(v=>v==="ID");if(i(c))return[];const a=R(t),o=w(t),r=(L[e]||L.D4).ops.filter(p=>p!=="ID"),d=new Set,u=p=>p.join(",");d.add(u(c));let m=[{ops:c,path:[]}];for(let p=0;p<s;p++){const v=[];for(const g of m)for(let S=0;S<a.length;S++)for(const y of r){const x=N(g.ops,o[S],y),T={lineId:S,line:a[S],op:y,opInt:A[y]},k=[...g.path,T];if(i(x))return k;const q=u(x);d.has(q)||(d.add(q),v.push({ops:x,path:k}))}if(m=v,m.length===0||m.length>25e3)break}return[]}function _(c,t,e="D4"){return t===3?et(c,e,!0):ct(c,t,e,4)}class dt{constructor(){h(this,"ctx",null);h(this,"bgmAudio",null);h(this,"sfxEnabled",!0);h(this,"bgmEnabled",!1);h(this,"comboScale",[261.63,293.66,329.63,349.23,392,440,523.25]);h(this,"lastFlipTime",0);h(this,"comboIndex",0);typeof Audio<"u"&&(this.bgmAudio=new Audio("/assets/bgm.mp3"),this.bgmAudio.loop=!0,this.bgmAudio.volume=.35)}initCtx(){if(!this.ctx){const t=typeof window<"u"?window.AudioContext||window.webkitAudioContext:globalThis.AudioContext;t&&(this.ctx=new t)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}playTap(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(600,this.ctx.currentTime),t.frequency.exponentialRampToValueAtTime(800,this.ctx.currentTime+.05),e.gain.setValueAtTime(.2,this.ctx.currentTime),e.gain.linearRampToValueAtTime(.01,this.ctx.currentTime+.05),t.connect(e),e.connect(this.ctx.destination),t.start(),t.stop(this.ctx.currentTime+.05)}getComboIndex(){return this.comboIndex}resetCombo(){this.comboIndex=0,this.lastFlipTime=0}playFlip(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;const t=Date.now();this.lastFlipTime>0&&t-this.lastFlipTime<=1200?this.comboIndex=Math.min(this.comboIndex+1,this.comboScale.length-1):this.comboIndex=0,this.lastFlipTime=t;const e=this.comboScale[this.comboIndex],s=e*.58,i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(e,this.ctx.currentTime),i.frequency.exponentialRampToValueAtTime(Math.max(50,s),this.ctx.currentTime+.13);const o=.28+this.comboIndex*.02;a.gain.setValueAtTime(o,this.ctx.currentTime),a.gain.linearRampToValueAtTime(.01,this.ctx.currentTime+.13),i.connect(a),a.connect(this.ctx.destination),i.start(),i.stop(this.ctx.currentTime+.13)}playWin(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[{freq:523.25,time:0,dur:.12},{freq:659.25,time:.1,dur:.12},{freq:783.99,time:.2,dur:.12},{freq:1046.5,time:.3,dur:.16},{freq:783.99,time:.44,dur:.12},{freq:1046.5,time:.54,dur:.45},{freq:1318.51,time:.54,dur:.45}].forEach(s=>{const i=this.ctx.currentTime+s.time,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type="triangle",a.frequency.setValueAtTime(s.freq,i),o.gain.setValueAtTime(.28,i),o.gain.exponentialRampToValueAtTime(.001,i+s.dur),a.connect(o),o.connect(this.ctx.destination),a.start(i),a.stop(i+s.dur)}),[1567.98,1760,2093,2637.02].forEach((s,i)=>{const a=this.ctx.currentTime+.6+i*.07,o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(s,a),l.gain.setValueAtTime(.15,a),l.gain.exponentialRampToValueAtTime(.001,a+.25),o.connect(l),l.connect(this.ctx.destination),o.start(a),o.stop(a+.25)})}playCombo(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[440,554.37,659.25,880].forEach((e,s)=>{const i=this.ctx.currentTime+s*.05,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type="triangle",a.frequency.setValueAtTime(e,i),o.gain.setValueAtTime(.22,i),o.gain.exponentialRampToValueAtTime(.001,i+.18),a.connect(o),o.connect(this.ctx.destination),a.start(i),a.stop(i+.18)})}playClear(){if(!this.sfxEnabled||(this.initCtx(),!this.ctx))return;[523.25,659.25,783.99,1046.5].forEach((e,s)=>{const i=this.ctx.currentTime+s*.06,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(e,i),o.gain.setValueAtTime(.2,i),o.gain.exponentialRampToValueAtTime(.001,i+.22),a.connect(o),o.connect(this.ctx.destination),a.start(i),a.stop(i+.22)})}toggleBgm(){return this.bgmEnabled=!this.bgmEnabled,this.bgmAudio&&(this.bgmEnabled?this.bgmAudio.play().catch(()=>{this.bgmEnabled=!1}):this.bgmAudio.pause()),this.bgmEnabled}toggleSfx(){return this.sfxEnabled=!this.sfxEnabled,this.sfxEnabled}isBgmOn(){return this.bgmEnabled}isSfxOn(){return this.sfxEnabled}speak(t){if(this.sfxEnabled&&!(typeof window>"u"||!("speechSynthesis"in window)))try{window.speechSynthesis.cancel();const e=new SpeechSynthesisUtterance(t);e.lang="ko-KR",e.rate=.93,e.pitch=1;const i=window.speechSynthesis.getVoices().filter(o=>o.lang.startsWith("ko")||o.lang.replace("_","-").includes("ko-KR")),a=i.find(o=>/natural/i.test(o.name))||i.find(o=>/google/i.test(o.name))||i.find(o=>/heami|sunhi|yuna|female/i.test(o.name))||i[0];a&&(e.voice=a),window.speechSynthesis.speak(e)}catch{}}}const b=new dt,W=[{id:1,name:"1단계: C₂ 1수 입문",group:"C2",scrambleMoves:1,targetStars:{three:1,two:2}},{id:2,name:"2단계: C₂ 2수 연습",group:"C2",scrambleMoves:2,targetStars:{three:2,two:3}},{id:3,name:"3단계: C₂ 3수 기초",group:"C2",scrambleMoves:3,targetStars:{three:3,two:5}},{id:4,name:"4단계: V₄ 2수 반전",group:"V4",scrambleMoves:2,targetStars:{three:2,two:3}},{id:5,name:"5단계: V₄ 3수 응용",group:"V4",scrambleMoves:3,targetStars:{three:3,two:5}},{id:6,name:"6단계: V₄ 4수 마스터",group:"V4",scrambleMoves:4,targetStars:{three:4,two:6}},{id:7,name:"7단계: D₄ 2수 회전",group:"D4",scrambleMoves:2,targetStars:{three:2,two:3}},{id:8,name:"8단계: D₄ 3수 대각",group:"D4",scrambleMoves:3,targetStars:{three:3,two:5}},{id:9,name:"9단계: D₄ 4수 중급",group:"D4",scrambleMoves:4,targetStars:{three:4,two:6}},{id:10,name:"10단계: D₄ 5수 고급",group:"D4",scrambleMoves:5,targetStars:{three:5,two:7}},{id:11,name:"11단계: D₄ 6수 마스터",group:"D4",scrambleMoves:6,targetStars:{three:6,two:8}},{id:12,name:"12단계: D₄ 7수 신의 영역",group:"D4",scrambleMoves:7,targetStars:{three:7,two:9}}],K="matrix_cube_campaign_progress_v1";class ut{constructor(){h(this,"progress",{});this.loadProgress()}loadProgress(){const t=localStorage.getItem(K);if(t)try{this.progress=JSON.parse(t)}catch{this.progress={}}this.progress[1]||(this.progress[1]={unlocked:!0,bestMoves:null,stars:0})}saveProgress(){localStorage.setItem(K,JSON.stringify(this.progress))}getStageProgress(t){return this.progress[t]||{unlocked:!1,bestMoves:null,stars:0}}completeStage(t,e){const s=W.find(r=>r.id===t);if(!s)return 0;let i=1;e<=s.targetStars.three?i=3:e<=s.targetStars.two&&(i=2);const a=this.getStageProgress(t),o=a.bestMoves===null?e:Math.min(a.bestMoves,e),l=Math.max(a.stars,i);if(this.progress[t]={unlocked:!0,bestMoves:o,stars:l},t+1<=W.length){const r=this.getStageProgress(t+1);this.progress[t+1]={...r,unlocked:!0}}return this.saveProgress(),i}getTotalStars(){return Object.values(this.progress).reduce((t,e)=>t+(e.stars||0),0)}}const ht=new ut,pt="matrix_cube_best_record_v1";function Y(c){if(c<0||isNaN(c))return"00:00.0";const t=Math.floor(c/1e3),e=Math.floor(t/60),s=t%60,i=Math.floor(c%1e3/100),a=String(e).padStart(2,"0"),o=String(s).padStart(2,"0");return`${a}:${o}.${i}`}class mt{constructor(){h(this,"startTime",null);h(this,"accumulatedMs",0);h(this,"timerIntervalId",null);h(this,"tickCallback",null)}getRecordKey(t,e){return`${pt}_${t}x${t}_${e}moves`}getStorage(){return typeof window<"u"&&window.localStorage?window.localStorage:typeof localStorage<"u"?localStorage:null}getRecord(t,e){try{const s=this.getStorage();if(!s)return null;const i=this.getRecordKey(t,e),a=s.getItem(i);if(!a)return null;const o=JSON.parse(a);return{bestTimeMs:typeof o.bestTimeMs=="number"?o.bestTimeMs:null,bestMoves:typeof o.bestMoves=="number"?o.bestMoves:null,updatedAt:o.updatedAt}}catch{return null}}saveRecord(t,e,s,i){const a=this.getRecord(t,e);let o=!1,l=!1,r=(a==null?void 0:a.bestTimeMs)??null,d=(a==null?void 0:a.bestMoves)??null;(r===null||s<r)&&(r=s,o=!0),(d===null||i<d)&&(d=i,l=!0);const u={bestTimeMs:r,bestMoves:d,updatedAt:Date.now()};try{const m=this.getStorage();if(m){const p=this.getRecordKey(t,e);m.setItem(p,JSON.stringify(u))}}catch{}return{isNewBestTime:o,isNewBestMoves:l,bestTimeMs:r,bestMoves:d}}startTimer(t){t&&(this.tickCallback=t),this.timerIntervalId===null&&(this.startTime=performance.now(),this.timerIntervalId=setInterval(()=>{const e=this.getElapsedMs();this.tickCallback&&this.tickCallback(Y(e),e)},100))}stopTimer(){return this.startTime!==null&&(this.accumulatedMs+=performance.now()-this.startTime,this.startTime=null),this.timerIntervalId!==null&&(clearInterval(this.timerIntervalId),this.timerIntervalId=null),this.accumulatedMs}resetTimer(){this.stopTimer(),this.accumulatedMs=0,this.startTime=null,this.tickCallback&&this.tickCallback(Y(0),0)}getElapsedMs(){let t=this.accumulatedMs;return this.startTime!==null&&(t+=performance.now()-this.startTime),Math.floor(t)}getFormattedTime(){return Y(this.getElapsedMs())}isTimerRunning(){return this.timerIntervalId!==null}}const E=new mt;function st(c,t,e,s){const i=c.getContext("2d");if(!i)return;const a=c.width,o=c.height;i.clearRect(0,0,a,o);const r=(t==="MX"||t==="MY"||t==="MD"||t==="MAD")&&s.complete?s:e;switch(i.save(),i.translate(a/2,o/2),t){case"R90":i.rotate(90*Math.PI/180);break;case"R180":i.rotate(180*Math.PI/180);break;case"R270":i.rotate(270*Math.PI/180);break;case"MX":i.scale(1,-1);break;case"MY":i.scale(-1,1);break;case"MD":i.rotate(90*Math.PI/180),i.scale(-1,1);break;case"MAD":i.rotate(-90*Math.PI/180),i.scale(-1,1);break}i.drawImage(r,-a/2,-o/2,a,o),i.restore()}class bt{constructor(t,e,s,i=3){h(this,"boardEl");h(this,"trailCanvas");h(this,"ctx",null);h(this,"onAction");h(this,"points",[]);h(this,"isPointerDown",!1);h(this,"startCell",null);h(this,"isLocked",!1);h(this,"boardSize",3);h(this,"cell11Mode","row");h(this,"longPressTimer",null);h(this,"singleTapTimer",null);h(this,"lastTapInfo",null);h(this,"isLongPressTriggered",!1);this.boardEl=t,this.trailCanvas=e,this.ctx=e.getContext("2d"),this.onAction=s,this.boardSize=i,this.bindEvents(),this.syncCanvasSize(),window.addEventListener("resize",()=>this.syncCanvasSize())}setBoardSize(t){this.boardSize=t}setLocked(t){this.isLocked=t}getCell11Mode(){return this.cell11Mode}toggleCell11Mode(){return this.cell11Mode=this.cell11Mode==="row"?"col":"row",this.cell11Mode}syncCanvasSize(){const t=this.boardEl.getBoundingClientRect();this.trailCanvas.width=t.width,this.trailCanvas.height=t.height}getLineForCell(t,e){const s=this.boardSize,i=R(s);return t===0&&e===0?this.cell11Mode==="col"?i.find(a=>a.type==="col"&&a.idx===0)||null:i.find(a=>a.type==="row"&&a.idx===0)||null:e===0&&t>0?i.find(a=>a.type==="row"&&a.idx===t)||null:t===0&&e>0?i.find(a=>a.type==="col"&&a.idx===e)||null:t===s-1&&e===s-1?i.find(a=>a.type==="diag"&&a.idx==="main")||null:t===1&&e===s-1?i.find(a=>a.type==="diag"&&a.idx==="anti")||null:t===Math.floor(s/2)&&e===Math.floor(s/2)&&i.find(a=>a.type==="row"&&a.idx===t)||null}bindEvents(){this.boardEl.addEventListener("pointerdown",e=>{if(this.isLocked)return;const s=e.target;if(s&&(s.classList.contains("dot-toggle-11")||s.closest(".dual-switch-11")||s.classList.contains("dual-switch-11")))return;const i=e.target.closest(".cell-box");let a=-1,o=-1;if(i&&i.parentElement===this.boardEl){const u=Array.from(this.boardEl.children).indexOf(i);u!==-1&&(a=Math.floor(u/this.boardSize),o=u%this.boardSize)}if(a===-1||o===-1){const u=this.boardEl.getBoundingClientRect(),m=e.clientX-u.left,p=e.clientY-u.top,v=u.width/this.boardSize,g=u.height/this.boardSize;o=Math.max(0,Math.min(this.boardSize-1,Math.floor(m/v))),a=Math.max(0,Math.min(this.boardSize-1,Math.floor(p/g)))}const l=this.getLineForCell(a,o);if(!l)return;try{this.boardEl.setPointerCapture(e.pointerId)}catch{}this.isPointerDown=!0,this.isLongPressTriggered=!1,this.startCell={r:a,c:o,target:l};const r=e.clientX,d=e.clientY;this.points=[{x:r,y:d}],this.longPressTimer&&clearTimeout(this.longPressTimer),this.longPressTimer=setTimeout(()=>{this.isPointerDown&&!this.isLongPressTriggered&&(this.isLongPressTriggered=!0,this.clearTrail(),this.startCell&&this.onAction(this.startCell.target,"R270"))},380)}),this.boardEl.addEventListener("pointermove",e=>{if(this.isPointerDown){if(this.points.push({x:e.clientX,y:e.clientY}),this.points.length>1){const s=this.points[0];Math.hypot(e.clientX-s.x,e.clientY-s.y)>35&&this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null)}this.drawTrail()}});const t=e=>{if(this.longPressTimer&&(clearTimeout(this.longPressTimer),this.longPressTimer=null),!this.isPointerDown||!this.startCell){this.isPointerDown=!1,this.clearTrail();return}if(this.isPointerDown=!1,this.isLongPressTriggered){this.isLongPressTriggered=!1,this.clearTrail();return}const s=this.points[0],i=e.clientX||s.x,a=e.clientY||s.y,o=i-s.x,l=a-s.y,r=Math.hypot(o,l),d=this.startCell.target,u=this.startCell.r,m=this.startCell.c;if(this.clearTrail(),r<35){const v=performance.now(),g=this.lastTapInfo&&this.lastTapInfo.r===u&&this.lastTapInfo.c===m;if(this.singleTapTimer&&g&&v-this.lastTapInfo.time<=380){clearTimeout(this.singleTapTimer),this.singleTapTimer=null,this.lastTapInfo=null,this.onAction(d,"R180");return}this.singleTapTimer&&clearTimeout(this.singleTapTimer),this.lastTapInfo={r:u,c:m,time:v};const S=d;this.singleTapTimer=setTimeout(()=>{this.onAction(S,"R90"),this.singleTapTimer=null,this.lastTapInfo=null},190);return}this.singleTapTimer&&(clearTimeout(this.singleTapTimer),this.singleTapTimer=null,this.lastTapInfo=null);const p=Math.atan2(l,o)*180/Math.PI;Math.abs(p)<=30||Math.abs(p)>=150?this.onAction(d,"MX"):Math.abs(p)>=60&&Math.abs(p)<=120?this.onAction(d,"MY"):p>30&&p<60||p>-150&&p<-120?this.onAction(d,"MD"):p>-60&&p<-30||p>120&&p<150?this.onAction(d,"MAD"):Math.abs(o)>=Math.abs(l)?this.onAction(d,"MX"):this.onAction(d,"MY")};this.boardEl.addEventListener("pointerup",t),this.boardEl.addEventListener("pointercancel",t),window.addEventListener("pointerup",t)}drawTrail(){}clearTrail(){this.ctx&&(this.ctx.clearRect(0,0,this.trailCanvas.width,this.trailCanvas.height),this.points=[])}}function U(c,t){switch(t){case"MX":return`<b>↕ 가로 반사 (MX)</b>: ${c} 상하 뒤집기. 두 번 적용 시 항등원 복원 (<i>MX² = ID</i>)`;case"MY":return`<b>↔ 세로 반사 (MY)</b>: ${c} 좌우 뒤집기. 두 번 적용 시 항등원 복원 (<i>MY² = ID</i>)`;case"MD":return`<b>⤢ 주대각 반사 (MD)</b>: ${c} 전치. 두 반사의 합성으로 회전 분해 (<i>MD ∘ MX = R90</i>)`;case"MAD":return`<b>⤡ 부대각 반사 (MAD)</b>: ${c} 역대각 전치. <i>MAD ∘ MX = R270</i>`;case"R90":return"<b>↻ 90° 회전 (R90)</b>: 시계방향 회전. 4회 회전 시 원상 복구 (<i>R90⁴ = ID</i>)";case"R180":return"<b>🔄 180° 회전 (R180)</b>: 점대칭 반전. 가로와 세로 반사의 합성 (<i>MX ∘ MY = R180</i>)";case"R270":return"<b>↺ 270° 회전 (R270)</b>: 반시계방향 90° 회전 (<i>R90의 역원</i>)";default:return`<b>✨ 항등원</b>: ${c} 정위치 복원`}}class gt{constructor(){h(this,"containerEl",null);h(this,"currentStepIdx",0);h(this,"stateHistory",[]);h(this,"steps",[]);h(this,"callbacks",null)}render(t,e,s,i,a){this.containerEl=t,this.steps=i,this.callbacks=a,this.currentStepIdx=0;const o=w(s);this.stateHistory=[[...e]];let l=[...e];for(const r of i){const d=o[r.lineId]||[];l=N(l,d,r.op),this.stateHistory.push([...l])}this.buildHTML(),this.bindEvents(),b.playTap()}buildHTML(){var i;if(!this.containerEl)return;if(this.steps.length===0){this.containerEl.innerHTML=`
        <div class="inline-solution-panel">
          <div class="inline-solution-header">
            <span class="inline-solution-title">🎉 이미 완성된 상태입니다!</span>
            <button class="btn-solution-close" id="btn-sol-close">✕ 닫기</button>
          </div>
        </div>
      `,(i=this.containerEl.querySelector("#btn-sol-close"))==null||i.addEventListener("click",()=>{this.close()});return}let t=`
      <button class="sol-step-pill active" data-step="0">초기</button>
    `;this.steps.forEach((a,o)=>{t+=`
        <button class="sol-step-pill" data-step="${o+1}">
          ${o+1}수: ${a.line.label} ${a.op}
        </button>
      `});const e=this.steps[0],s=e?U(e.line.label,e.op):"초기 섞인 상태입니다. 각 수를 눌러보세요.";this.containerEl.innerHTML=`
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
          ${t}
        </div>

        <!-- 실시간 수학적 원리 해설 카드 -->
        <div class="sol-math-card" id="sol-math-card">
          <div class="sol-math-step-name" id="sol-math-step-name">현재: 초기 상태</div>
          <div class="sol-math-content" id="sol-math-content">
            ${s}
          </div>
        </div>
      </div>
    `}bindEvents(){var e,s;if(!this.containerEl)return;this.containerEl.querySelectorAll(".sol-step-pill").forEach(i=>{i.addEventListener("click",a=>{const o=parseInt(a.currentTarget.dataset.step||"0",10);this.selectStep(o)})}),(e=this.containerEl.querySelector("#btn-sol-autosolve"))==null||e.addEventListener("click",()=>{this.callbacks&&(this.close(),this.callbacks.onAutoSolve())}),(s=this.containerEl.querySelector("#btn-sol-close"))==null||s.addEventListener("click",()=>{this.close()})}selectStep(t){if(!this.containerEl)return;this.currentStepIdx=Math.max(0,Math.min(this.stateHistory.length-1,t)),this.containerEl.querySelectorAll(".sol-step-pill").forEach((o,l)=>{o.classList.toggle("active",l===this.currentStepIdx)});const s=this.containerEl.querySelector("#sol-math-step-name"),i=this.containerEl.querySelector("#sol-math-content");let a=null;if(this.currentStepIdx===0)s&&(s.textContent="현재: 초기 섞인 상태"),i&&(i.innerHTML="1수부터 클릭하여 보드의 단계별 변화와 수학적 원리를 확인하세요.");else{const o=this.steps[this.currentStepIdx-1];a=o.lineId,s&&(s.textContent=`[${this.currentStepIdx}수] ${o.line.label} ➔ ${o.op} 변환`),i&&(i.innerHTML=U(o.line.label,o.op))}this.callbacks&&this.callbacks.onPreviewState(this.stateHistory[this.currentStepIdx],a),b.playTap()}close(){this.containerEl&&(this.containerEl.innerHTML=""),this.callbacks&&this.callbacks.onClose(),b.playTap()}}const j=new gt;function ft(){var o,l;const c=document.getElementById("about-modal-overlay");c&&c.remove();const t=document.createElement("div");t.id="about-modal-overlay",t.className="modal-overlay",t.innerHTML=`
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
  `,document.body.appendChild(t);const e=()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),250)};(o=t.querySelector("#btn-about-close"))==null||o.addEventListener("click",e),(l=t.querySelector("#btn-about-confirm"))==null||l.addEventListener("click",e),t.addEventListener("click",r=>{r.target===t&&e()});const s=r=>{r.key==="Escape"&&(e(),window.removeEventListener("keydown",s))};window.addEventListener("keydown",s);const i=t.querySelectorAll(".modal-tab-btn"),a=t.querySelectorAll(".about-tab-pane");i.forEach(r=>{r.addEventListener("click",()=>{const d=r.getAttribute("data-tab");i.forEach(u=>u.classList.remove("active")),r.classList.add("active"),a.forEach(u=>{u.classList.remove("active"),u.id===`pane-${d}`&&u.classList.add("active")})})})}const it="matrix_cube_tutorial_completed";function vt(){try{return localStorage.getItem(it)==="true"}catch{return!1}}function Q(){try{localStorage.setItem(it,"true")}catch{}}function yt(c){switch(c){case n.ID:return"0";case n.MX:return"X";case n.MY:return"Y";case n.R180:return"180";case n.R90:return"90";case n.R270:return"270";case n.MD:return"D";case n.MAD:return"AD";default:return"0"}}const $=[{subStep:0,label:"① 11 가로 밀기",boardOps:[n.MX,n.MX,n.MX,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID],highlightCells:[0,1,2],formulaBadge:"💡 [11] 1행 첫 성분",formulaText:"11 가로 쓱 밀기 ➔ 1행 전체 가로 반사(MX)",formulaDesc:"1행의 첫 성분 11을 가로로 쓱 밀면 1행 전체가 일제히 뒤태(X 뱃지)로 뒤집혀요!"},{subStep:1,label:"② 12 세로 밀기",boardOps:[n.MX,n.R180,n.MX,n.ID,n.MY,n.ID,n.ID,n.MY,n.ID],highlightCells:[1,4,7],formulaBadge:"✨ [12] 2열 첫 성분 (MX ∘ MY = R180)",formulaText:"12 세로 쓱 밀기 ➔ 12 타일 180° 회전!",formulaDesc:"1행이 가로 반사(MX)된 상태에서 12를 세로로 밀면(MY), 가로와 세로가 만나 180° 회전(R180)이 돼요!"},{subStep:2,label:"③ 13 대각선 변환",boardOps:[n.MX,n.R180,n.MAD,n.ID,n.MD,n.ID,n.MAD,n.MY,n.ID],highlightCells:[2,4,6],formulaBadge:"⚡ [13] 대각선 변환 (MD / MAD)",formulaText:"13 대각선 복합 밀기 ➔ 대각선 반사 변환!",formulaDesc:"13 성분을 대각선으로 밀면 대각선 라인을 따라 신비로운 대각 반사(MD / MAD)가 일어납니다!"}],X=[{subStep:0,label:"초기",boardOps:[n.R180,n.R180,n.MX,n.MY,n.MY,n.ID,n.R180,n.R180,n.MX],highlightCells:[],formulaBadge:"🧩 V4 문제",formulaText:"V4 스크램블 (초기)",formulaDesc:"반사와 회전 상쇄로 4수 만에 0번 완성!"},{subStep:1,label:"1수",boardOps:[n.R180,n.R180,n.MX,n.MY,n.MY,n.ID,n.ID,n.ID,n.MY],highlightCells:[6,7,8],formulaBadge:"⚡ 1수: 3행 180° 회전",formulaText:"3행 더블 탭 👆👆 (R180)",formulaDesc:"3행의 R180 타일 2개가 0번으로 상쇄돼요."},{subStep:2,label:"2수",boardOps:[n.R180,n.R180,n.R180,n.MY,n.MY,n.MY,n.ID,n.ID,n.ID],highlightCells:[2,5,8],formulaBadge:"⚡ 2수: 3열 세로 반사",formulaText:"3열 세로 밀기 ↕ (MY)",formulaDesc:"MX와 MY가 만나 180° 회전(MX ∘ MY = R180) 합성!"},{subStep:3,label:"3수",boardOps:[n.R180,n.R180,n.R180,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID],highlightCells:[3,4,5],formulaBadge:"⚡ 3수: 2행 세로 반사",formulaText:"2행 세로 밀기 ↕ (MY)",formulaDesc:"2행의 MY 타일들이 정위치 0번으로 상쇄돼요."},{subStep:4,label:"4수 (완성)",boardOps:[n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID],highlightCells:[0,1,2],formulaBadge:"🎉 4수: 1행 180° 회전",formulaText:"1행 더블 탭 👆👆 (R180)",formulaDesc:"1행의 R180 타일들이 0번으로 상쇄되어 전체 완성!"}],z=[{subStep:0,label:"초기",boardOps:[n.MX,n.MAD,n.MD,n.ID,n.R90,n.MY,n.R180,n.MY,n.R270],highlightCells:[],formulaBadge:"🧩 D4 묘수 문제",formulaText:"D4 복합 스크램블 (초기)",formulaDesc:"대각선 반사와 회전을 결합한 5수 최단 해법!"},{subStep:1,label:"1수",boardOps:[n.MD,n.MX,n.MY,n.ID,n.R90,n.MY,n.R180,n.MY,n.R270],highlightCells:[0,1,2],formulaBadge:"⚡ 1수: 1행 90° 회전",formulaText:"1행 1회 탭 👆 (R90)",formulaDesc:"1행 타일들이 시계 방향 90° 회전돼요."},{subStep:2,label:"2수",boardOps:[n.MD,n.MX,n.MY,n.ID,n.R90,n.MY,n.ID,n.MX,n.R90],highlightCells:[6,7,8],formulaBadge:"⚡ 2수: 3행 180° 회전",formulaText:"3행 더블 탭 👆👆 (R180)",formulaDesc:"3행의 R180이 0번으로 상쇄되고 타일들이 재정렬돼요."},{subStep:3,label:"3수",boardOps:[n.MD,n.MX,n.ID,n.ID,n.R90,n.ID,n.ID,n.MX,n.MD],highlightCells:[2,5,8],formulaBadge:"⚡ 3수: 3열 세로 반사",formulaText:"3열 세로 밀기 ↕ (MY)",formulaDesc:"3열의 1·2행 타일들이 0번으로 상쇄돼요."},{subStep:4,label:"4수",boardOps:[n.ID,n.MX,n.ID,n.ID,n.MX,n.ID,n.ID,n.MX,n.ID],highlightCells:[0,4,8],formulaBadge:"⚡ 4수: 대각선 반사",formulaText:"대각선 밀기 ↘ (MD)",formulaDesc:"양 끝의 MD가 상쇄되고 2열이 MX로 정렬돼요."},{subStep:5,label:"5수 (완성)",boardOps:[n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID],highlightCells:[1,4,7],formulaBadge:"🎉 5수: 2열 가로 반사",formulaText:"2열 가로 밀기 ↔ (MX)",formulaDesc:"2열의 모든 MX가 상쇄되어 5수 만에 전체 완성!"}];class St{constructor(){h(this,"isOpen",!1);h(this,"currentStep",1);h(this,"step1SubStep",0);h(this,"v4SubStep",0);h(this,"d4SubStep",0);h(this,"boardOps",Array(9).fill(n.ID));h(this,"cell11Mode","row");h(this,"imgDogFront",null);h(this,"imgDogBack",null);h(this,"autoPlayTimer",null);h(this,"step1Timer",null);h(this,"step1AnimTimers",[]);h(this,"isAutoPlaying",!1);if(typeof Image<"u"){this.imgDogFront=new Image,this.imgDogBack=new Image,this.imgDogFront.src="assets/dog_front.png",this.imgDogBack.src="assets/dog_back.png";const t=()=>{this.isOpen&&this.renderBoard()};this.imgDogFront.onload=t,this.imgDogBack.onload=t}}get step2SubStep(){return this.step1SubStep}set step2SubStep(t){this.step1SubStep=t}get step2Timer(){return this.step1Timer}set step2Timer(t){this.step1Timer=t}get step2AnimTimers(){return this.step1AnimTimers}set step2AnimTimers(t){this.step1AnimTimers=t}open(t=1){this.isOpen=!0,this.cell11Mode="row",this.buildDOM(),this.goToStep(Math.max(1,Math.min(6,t)),!1),this.removePulse(),b.playTap()}close(){if(this.stopStep1DemoLoop(),this.stopAutoPlay(),this.isOpen=!1,typeof document<"u"){const t=document.getElementById("tutorial-modal-overlay");t&&t.remove()}b.playTap()}skip(){this.stopAutoPlay(),Q(),this.close(),b.playTap()}prevStep(){this.currentStep>1&&this.goToStep(this.currentStep-1)}nextStep(){this.currentStep<6?this.goToStep(this.currentStep+1):this.completeTutorial()}goToStep(t,e=!0){this.stopStep1DemoLoop(),this.stopAutoPlay(),this.currentStep=Math.max(1,Math.min(6,t)),this.currentStep===1?this.step1SubStep=0:this.currentStep===4?this.v4SubStep=0:this.currentStep===5&&(this.d4SubStep=0),this.applyStepState(this.currentStep),this.updateStepUI(),this.renderBoard(),e&&b.playTap()}completeTutorial(){this.stopAutoPlay(),Q(),this.close(),b.playWin()}removePulse(){if(typeof document>"u")return;const t=document.getElementById("btn-header-tutorial");t&&t.classList.remove("pulse-active")}buildDOM(){if(typeof document>"u")return;const t=document.getElementById("tutorial-modal-overlay");t&&t.remove();const e=document.createElement("div");e.id="tutorial-modal-overlay",e.className="tutorial-overlay",e.innerHTML=`
      <div class="tutorial-card">
        <!-- 헤더 -->
        <div class="tutorial-header">
          <div class="tutorial-header-left">
            <span class="tutorial-header-badge">군론 튜토리얼</span>
            <span class="tutorial-header-title">🎓 행렬 대칭 변환 가이드</span>
          </div>
          <button id="btn-tut-close" class="tutorial-header-close" title="닫기">✕</button>
        </div>

        <!-- 스텝 탭 / 프로그레스 바 (총 6단계) -->
        <div class="tutorial-steps-bar" id="tut-steps-bar">
          <div class="tut-step-dot" data-step="1" title="1단계: 퍼즐 목표 & 행렬 변환 실전 시연"></div>
          <div class="tut-step-dot" data-step="2" title="2단계: 반사+반사=회전 (V4)"></div>
          <div class="tut-step-dot" data-step="3" title="3단계: 완전한 대칭 군 D4"></div>
          <div class="tut-step-dot" data-step="4" title="4단계: [실전] V4 4수 마스터"></div>
          <div class="tut-step-dot" data-step="5" title="5단계: [실전] D4 5수 묘수 풀이"></div>
          <div class="tut-step-dot" data-step="6" title="6단계: 군론 행렬 퍼즐 완전 정복"></div>
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
              <span id="tut-btn-action-text">다음 (1/6) ➔</span>
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(e);const s=document.getElementById("tut-board-grid");if(s){s.innerHTML="";for(let i=0;i<9;i++){const a=document.createElement("div");a.className="tut-cell-box",a.id=`tut-cell-${i}`,a.dataset.index=String(i);const o=document.createElement("canvas");if(o.className="tut-cell-canvas",o.width=160,o.height=160,a.appendChild(o),i===0){const r=document.createElement("div");r.className=`dual-switch-11 ${this.cell11Mode==="col"?"mode-col":"mode-row"}`,r.id="tut-switch-11",r.title="탭하여 1행 / 1열 모드 전환",r.innerHTML=`
            <span class="switch-opt switch-row">↔ 1행</span>
            <span class="switch-divider">|</span>
            <span class="switch-opt switch-col">↕ 1열</span>
          `,r.addEventListener("click",d=>{d.stopPropagation(),this.handleDotClick()}),a.appendChild(r)}else if(i===1||i===2){const r=document.createElement("div");r.className="controller-guide-label guide-col",r.innerText=`${i+1}열`,a.appendChild(r)}else if(i===3||i===6){const r=document.createElement("div");r.className="controller-guide-label guide-row",r.innerText=`${Math.floor(i/3)+1}행`,a.appendChild(r)}else if(i===4){const r=document.createElement("div");r.className="controller-guide-label guide-row",r.innerText="2행",a.appendChild(r)}else if(i===5){const r=document.createElement("div");r.className="controller-guide-label guide-diag",r.innerText="↗부대각",a.appendChild(r)}else if(i===8){const r=document.createElement("div");r.className="controller-guide-label guide-diag",r.innerText="↖주대각",a.appendChild(r)}const l=document.createElement("span");l.className="tut-cell-badge",l.textContent="0",a.appendChild(l),s.appendChild(a)}}this.bindEvents()}handleDotClick(){if(this.cell11Mode=this.cell11Mode==="row"?"col":"row",typeof document<"u"){const t=document.getElementById("tut-switch-11");t&&(t.className=`dual-switch-11 ${this.cell11Mode==="col"?"mode-col":"mode-row"}`);const e=document.getElementById("tut-guide-tag-11");e&&(e.innerText=this.cell11Mode==="col"?"1열":"1행",e.className=`controller-guide-label ${this.cell11Mode==="col"?"guide-col":"guide-row"}`)}b.playTap()}bindEvents(){const t=document.getElementById("btn-tut-close"),e=document.getElementById("btn-tut-skip"),s=document.getElementById("btn-tut-prev"),i=document.getElementById("btn-tut-action"),a=document.getElementById("btn-tut-autoplay");t&&t.addEventListener("click",()=>this.close()),e&&e.addEventListener("click",()=>this.skip()),s&&s.addEventListener("click",()=>this.prevStep()),i&&i.addEventListener("click",()=>this.nextStep()),a&&a.addEventListener("click",()=>this.toggleAutoPlay()),document.querySelectorAll(".tut-step-dot").forEach(o=>{o.addEventListener("click",()=>{const l=parseInt(o.dataset.step||"1",10);l>=1&&l<=6&&this.goToStep(l)})})}applyStepState(t){switch(t){case 1:this.boardOps=[...$[this.step1SubStep||0].boardOps];break;case 2:this.executeStep2Success();break;case 3:this.boardOps=[n.ID,n.R90,n.R180,n.R270,n.MX,n.MY,n.MD,n.MAD,n.ID];break;case 4:this.boardOps=[...X[this.v4SubStep].boardOps];break;case 5:this.boardOps=[...z[this.d4SubStep].boardOps];break;case 6:this.boardOps=Array(9).fill(n.ID);break}}executeStep2Success(){this.boardOps=[J(n.MX,n.MY),n.MX,n.MX,n.MY,n.ID,n.ID,n.MY,n.ID,n.ID]}executeStep3Success(){this.executeStep2Success()}positionHandAtCell(t){if(typeof document>"u")return;const e=document.getElementById("tut-hand-demo");if(!e)return;const s=Math.floor(t/3),i=t%3,a=document.getElementById(`tut-cell-${t}`),o=document.getElementById("tut-board-wrapper");if(a&&o&&typeof a.getBoundingClientRect=="function"&&typeof o.getBoundingClientRect=="function"){const d=a.getBoundingClientRect(),u=o.getBoundingClientRect();if(u.width>0&&d.width>0){const m=d.left+d.width/2-u.left,p=d.top+d.height/2-u.top;e.style.left=`${m}px`,e.style.top=`${p}px`;return}}const l=(i*2+1)/6*100,r=(s*2+1)/6*100;e.style.left=`${l.toFixed(1)}%`,e.style.top=`${r.toFixed(1)}%`}updateHandDemo(t,e=0){if(typeof document>"u")return;const s=document.getElementById("tut-hand-demo"),i=document.getElementById("tut-hand-icon"),a=document.getElementById("tut-hand-bubble");if(!(!s||!i||!a))switch(s.className="tut-hand-demo",s.style.top="",s.style.left="",s.style.display="flex",t){case 1:{const o=e!==void 0?e:this.step1SubStep;o===0?(this.positionHandAtCell(0),s.classList.add("hand-anim-cell-swipe-h"),i.textContent="👆",a.textContent="11 가로 쓱 밀기 (↔)"):o===1?(this.positionHandAtCell(1),s.classList.add("hand-anim-cell-swipe-v"),i.textContent="👆",a.textContent="12 세로 쓱 밀기 (↕)"):(this.positionHandAtCell(2),s.classList.add("hand-anim-cell-diag-combo"),i.textContent="👆",a.textContent="13 대각선 밀기 (↘➔↗)")}break;case 2:s.classList.add("hand-anim-swipe-v"),i.textContent="👆",a.textContent="세로로 또 밀기 (↕)";break;case 3:s.style.top="36%",s.style.left="40%",s.classList.add("hand-anim-tap"),i.textContent="✨",a.textContent="8차 대칭군 D4";break;case 4:switch(e){case 0:s.style.top="66%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",a.textContent="1수: 3행 더블 탭";break;case 1:s.style.top="66%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",a.textContent="3행 더블 탭 (180°)";break;case 2:s.style.top="6%",s.style.left="72%",s.classList.add("hand-anim-swipe-col3"),i.textContent="👆",a.textContent="3열 세로 밀기 (↕)";break;case 3:s.style.top="36%",s.style.left="10%",s.classList.add("hand-anim-swipe-v"),i.textContent="👆",a.textContent="2행 세로 밀기 (↕)";break;case 4:s.style.top="6%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",a.textContent="1행 더블 탭 (180°)";break}break;case 5:switch(e){case 0:s.style.top="6%",s.style.left="10%",s.classList.add("hand-anim-tap"),i.textContent="👆",a.textContent="1수: 1행 1회 탭";break;case 1:s.style.top="6%",s.style.left="10%",s.classList.add("hand-anim-tap"),i.textContent="👆",a.textContent="1행 1회 탭 (90°)";break;case 2:s.style.top="66%",s.style.left="10%",s.classList.add("hand-anim-double-tap"),i.textContent="👆👆",a.textContent="3행 더블 탭 (180°)";break;case 3:s.style.top="6%",s.style.left="72%",s.classList.add("hand-anim-swipe-col3"),i.textContent="👆",a.textContent="3열 세로 밀기 (↕)";break;case 4:s.style.top="66%",s.style.left="72%",s.classList.add("hand-anim-swipe-diag"),i.textContent="👆",a.textContent="대각선 밀기 (↘)";break;case 5:s.style.top="6%",s.style.left="41%",s.classList.add("hand-anim-swipe-row2"),i.textContent="👆",a.textContent="2열 가로 밀기 (↔)";break}break;default:s.style.display="none";break}}clearStep1AnimTimers(){this.step1AnimTimers&&this.step1AnimTimers.length>0&&(this.step1AnimTimers.forEach(t=>clearTimeout(t)),this.step1AnimTimers=[])}addCellAnimClass(t,e){typeof document>"u"||t.forEach(s=>{const i=document.getElementById(`tut-cell-${s}`);i&&i.classList.add(e)})}removeCellAnimClass(t,e){typeof document>"u"||t.forEach(s=>{const i=document.getElementById(`tut-cell-${s}`);i&&i.classList.remove(e)})}goToStep1SubStep(t,e=!0){this.clearStep1AnimTimers(),this.step1SubStep=Math.max(0,Math.min($.length-1,t));const s=$[this.step1SubStep];if(this.clearCellHighlights(),s.highlightCells.length>0&&this.highlightCells(s.highlightCells,"highlight-row"),typeof document<"u"){const i=document.getElementById("tut-formula-card"),a=document.getElementById("tut-formula-badge"),o=document.getElementById("tut-formula-text"),l=document.getElementById("tut-formula-desc");i&&(i.style.display="block"),a&&(a.textContent=s.formulaBadge),o&&(o.textContent=s.formulaText),l&&(l.textContent=s.formulaDesc),this.updateMovePillsActive(this.step1SubStep),this.updateHandDemo(1,this.step1SubStep)}if(this.step1SubStep===0){this.boardOps=[n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID],this.renderBoard();const i=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===0&&(this.addCellAnimClass([0,1,2],"tut-cell-flipping-h"),b.playFlip())},350),a=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===0&&(this.boardOps=[...s.boardOps],this.renderBoard())},600),o=setTimeout(()=>{this.removeCellAnimClass([0,1,2],"tut-cell-flipping-h")},1050);this.step1AnimTimers.push(i,a,o)}else if(this.step1SubStep===1){this.boardOps=[n.MX,n.MX,n.MX,n.ID,n.ID,n.ID,n.ID,n.ID,n.ID],this.renderBoard();const i=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===1&&(this.addCellAnimClass([1],"tut-cell-flipping-v-r180"),this.addCellAnimClass([4,7],"tut-cell-flipping-v"),b.playFlip())},350),a=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===1&&(this.boardOps=[...s.boardOps],this.renderBoard())},600),o=setTimeout(()=>{this.removeCellAnimClass([1],"tut-cell-flipping-v-r180"),this.removeCellAnimClass([4,7],"tut-cell-flipping-v")},1050);this.step1AnimTimers.push(i,a,o)}else if(this.step1SubStep===2){this.boardOps=[n.MX,n.R180,n.MX,n.ID,n.MY,n.ID,n.ID,n.MY,n.ID],this.clearCellHighlights(),this.highlightCells([0,4,8],"highlight-diag"),this.renderBoard();const i=setTimeout(()=>{if(this.currentStep===1&&this.step1SubStep===2){this.addCellAnimClass([0,4,8],"tut-cell-flipping-diag"),b.playFlip();const u=document.getElementById("tut-hand-bubble");u&&(u.textContent="1) 주대각선 밀기 (↘ MD)");const m=document.getElementById("tut-formula-badge"),p=document.getElementById("tut-formula-text");m&&(m.textContent="↘ [13] 주대각선 반사 (MD)"),p&&(p.textContent="1) 13 주대각선 밀기 ➔ 주대각선 반사 (MD)")}},350),a=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===2&&(this.boardOps[0]=n.MD,this.boardOps[4]=n.MD,this.boardOps[8]=n.MD,this.renderBoard(),this.removeCellAnimClass([0,4,8],"tut-cell-flipping-diag"))},650),o=setTimeout(()=>{if(this.currentStep===1&&this.step1SubStep===2){this.clearCellHighlights(),this.highlightCells([2,4,6],"highlight-diag"),this.addCellAnimClass([2,4,6],"tut-cell-flipping-diag"),b.playFlip();const u=document.getElementById("tut-hand-bubble");u&&(u.textContent="2) 부대각선 밀기 (↙ MAD)");const m=document.getElementById("tut-formula-badge"),p=document.getElementById("tut-formula-text");m&&(m.textContent="↙ [13] 부대각선 반사 (MAD)"),p&&(p.textContent="2) 이어서 부대각선 밀기 ➔ 부대각선 반사 (MAD)")}},1250),l=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===2&&(this.boardOps[2]=n.MAD,this.boardOps[4]=n.MAD,this.boardOps[6]=n.MAD,this.renderBoard(),this.removeCellAnimClass([2,4,6],"tut-cell-flipping-diag"))},1550),r=setTimeout(()=>{if(this.currentStep===1&&this.step1SubStep===2){this.addCellAnimClass([2,4,6],"tut-cell-flipping-diag"),b.playFlip();const u=document.getElementById("tut-hand-bubble");u&&(u.textContent="3) 다시 부대각선 (↗ 0번 복원)");const m=document.getElementById("tut-formula-badge"),p=document.getElementById("tut-formula-text"),v=document.getElementById("tut-formula-desc");m&&(m.textContent="✨ [13] 반사 자기상쇄 (MAD² = ID)"),p&&(p.textContent="3) 다시 부대각선 밀기 ➔ MAD² = 0번 복원!"),v&&(v.textContent="부대각선 반사가 2번 연속 만나 다시 똑바른 0번(ID)으로 복원돼요! (회전·반사 완전 정복)")}},2150),d=setTimeout(()=>{this.currentStep===1&&this.step1SubStep===2&&(this.boardOps[2]=n.ID,this.boardOps[4]=n.ID,this.boardOps[6]=n.ID,this.renderBoard(),this.removeCellAnimClass([2,4,6],"tut-cell-flipping-diag"))},2450);this.step1AnimTimers.push(i,a,o,l,r,d)}else this.boardOps=[...s.boardOps],this.renderBoard();e&&b.playTap()}goToStep2SubStep(t,e=!0){this.goToStep1SubStep(t,e)}startStep1DemoLoop(){this.stopStep1DemoLoop(),this.step1Timer=setInterval(()=>{if(this.currentStep===1){const t=(this.step1SubStep+1)%$.length;this.goToStep1SubStep(t,!1)}else this.stopStep1DemoLoop()},3200)}stopStep1DemoLoop(){this.step1Timer&&(clearInterval(this.step1Timer),this.step1Timer=null),this.clearStep1AnimTimers()}startStep2DemoLoop(){this.startStep1DemoLoop()}stopStep2DemoLoop(){this.stopStep1DemoLoop()}goToV4SubStep(t,e=!0){this.v4SubStep=Math.max(0,Math.min(X.length-1,t));const s=X[this.v4SubStep];if(this.boardOps=[...s.boardOps],this.clearCellHighlights(),s.highlightCells.length>0&&this.highlightCells(s.highlightCells,"highlight-row"),typeof document<"u"){const i=document.getElementById("tut-formula-card"),a=document.getElementById("tut-formula-badge"),o=document.getElementById("tut-formula-text"),l=document.getElementById("tut-formula-desc");i&&(i.style.display="block"),a&&(a.textContent=s.formulaBadge),o&&(o.textContent=s.formulaText),l&&(l.textContent=s.formulaDesc),this.updateMovePillsActive(this.v4SubStep),this.updateHandDemo(4,this.v4SubStep),this.renderBoard()}e&&b.playTap()}goToD4SubStep(t,e=!0){this.d4SubStep=Math.max(0,Math.min(z.length-1,t));const s=z[this.d4SubStep];if(this.boardOps=[...s.boardOps],this.clearCellHighlights(),s.highlightCells.length>0&&this.highlightCells(s.highlightCells,"highlight-row"),typeof document<"u"){const i=document.getElementById("tut-formula-card"),a=document.getElementById("tut-formula-badge"),o=document.getElementById("tut-formula-text"),l=document.getElementById("tut-formula-desc");i&&(i.style.display="block"),a&&(a.textContent=s.formulaBadge),o&&(o.textContent=s.formulaText),l&&(l.textContent=s.formulaDesc),this.updateMovePillsActive(this.d4SubStep),this.updateHandDemo(5,this.d4SubStep),this.renderBoard()}e&&b.playTap()}toggleAutoPlay(){this.isAutoPlaying?this.stopAutoPlay():this.startAutoPlay()}startAutoPlay(){this.stopAutoPlay(),this.isAutoPlaying=!0,this.updateAutoPlayButtonState(!0),this.autoPlayTimer=setInterval(()=>{if(this.currentStep===4){const t=(this.v4SubStep+1)%X.length;this.goToV4SubStep(t,!1)}else if(this.currentStep===5){const t=(this.d4SubStep+1)%z.length;this.goToD4SubStep(t,!1)}else this.stopAutoPlay()},1200)}stopAutoPlay(){this.autoPlayTimer&&(clearInterval(this.autoPlayTimer),this.autoPlayTimer=null),this.isAutoPlaying=!1,this.updateAutoPlayButtonState(!1)}updateAutoPlayButtonState(t){if(typeof document>"u")return;const e=document.getElementById("btn-tut-autoplay");e&&(e.textContent=t?"⏸ 일시정지":"▶ 한 수씩 보기",e.classList.toggle("playing",t))}renderMovePills(t,e,s){if(typeof document>"u")return;const i=document.getElementById("tut-move-pills");i&&(i.innerHTML="",t.forEach((a,o)=>{const l=document.createElement("button");l.className=`tut-move-pill ${o===e?"active":""}`,l.textContent=a.label,l.addEventListener("click",()=>{this.stopAutoPlay(),s(o)}),i.appendChild(l)}))}updateMovePillsActive(t){if(typeof document>"u")return;document.querySelectorAll(".tut-move-pill").forEach((s,i)=>{s.classList.toggle("active",i===t)})}updateStepUI(){if(typeof document>"u")return;const t=this.currentStep;document.querySelectorAll(".tut-step-dot").forEach(y=>{const x=parseInt(y.dataset.step||"1",10);y.classList.toggle("active",x===t),y.classList.toggle("completed",x<t)});const e=document.getElementById("tut-step-name"),s=document.getElementById("tut-main-text"),i=document.getElementById("tut-sub-text"),a=document.getElementById("tut-formula-card"),o=document.getElementById("tut-formula-badge"),l=document.getElementById("tut-formula-text"),r=document.getElementById("tut-formula-desc"),d=document.getElementById("tut-gesture-card"),u=document.getElementById("tut-master-card"),m=document.getElementById("tut-board-wrapper"),p=document.getElementById("tut-move-controller"),v=document.getElementById("btn-tut-prev"),g=document.getElementById("tut-btn-action-text");if(!e||!s||!i)return;this.clearCellHighlights(),v&&(v.style.display=t>1?"block":"none"),p&&(p.style.display="none");const S=document.getElementById("btn-tut-autoplay");switch(S&&(S.style.display="block"),a&&(a.style.display="none"),d&&(d.style.display="none"),u&&(u.style.display="none"),m&&(m.style.display="block"),t){case 1:e.textContent="STEP 1. 퍼즐 목표 & 행렬 변환 실전 시연",s.textContent="난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요",i.textContent="① 11 가로 쓱(1행 반사 MX) ➔ ② 12 세로 쓱(180° 회전 R180) ➔ ③ 13 대각선 밀기(대각 변환 MD/MAD)",p&&(p.style.display="flex",S&&(S.style.display="none")),this.renderMovePills($,this.step1SubStep,y=>{this.stopStep1DemoLoop(),this.goToStep1SubStep(y)}),this.goToStep1SubStep(this.step1SubStep,!1),this.startStep1DemoLoop(),g&&(g.textContent="다음 (1/6) ➔"),b.speak("난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요.");break;case 2:e.textContent="STEP 2. 반사 + 반사 = 회전 (V4 클라인 4원군 원리)",s.textContent="가로 반사 후 세로 반사를 하면 신기하게 180° 회전이 돼요! (MX ∘ MY = R180)",i.textContent="반사 두 번이 만나면 다시 앞면으로 오며 180도 회전 완성!",this.highlightCells([0],"highlight-center"),this.highlightCells([1,2],"highlight-row"),this.highlightCells([3,6],"highlight-row"),a&&(a.style.display="block",o&&(o.textContent="✨ 반사 + 반사 = 회전"),l&&(l.textContent="MX ∘ MY = R180"),r&&(r.textContent="가로 반사 후 세로 반사로 180° 회전 탄생!")),g&&(g.textContent="다음 (2/6) ➔"),b.speak("가로로 뒤집고 세로로 또 뒤집으면, 신기하게 180도 돌아간 앞면이 돼요."),this.updateHandDemo(2);break;case 3:e.textContent="STEP 3. 완전한 대칭 군 D4 (회전 4종 + 반사 4종)",s.textContent="회전과 반사가 모두 모여 완성되는 8차 대칭군 D4!",i.textContent="회전 4종(0°, 90°, 180°, 270°)과 반사 4종(가로·세로·대각선)의 조화",a&&(a.style.display="block",o&&(o.textContent="🌌 8차 대칭군 D4"),l&&(l.textContent="회전 4종 + 반사 4종"),r&&(r.textContent="회전과 반사가 모여 완벽한 대칭을 이룹니다.")),g&&(g.textContent="다음 (3/6) ➔"),b.speak("회전과 반사가 모두 모여 8가지 완벽한 대칭을 이룹니다."),this.updateHandDemo(3);break;case 4:e.textContent="STEP 4. [실전] V4 4수 마스터",s.textContent="V4 실전 예제: 반사와 회전의 4수 상쇄 풀이",i.textContent="단계별 손동작을 따라가며 4수 만에 0번으로 풀어보세요.",p&&(p.style.display="flex"),this.renderMovePills(X,this.v4SubStep,y=>this.goToV4SubStep(y)),this.goToV4SubStep(this.v4SubStep,!1),g&&(g.textContent="다음 (4/6) ➔"),b.speak("반사와 회전을 차례로 맞춰 4수 만에 0번으로 푸는 모습이에요.");break;case 5:e.textContent="STEP 5. [실전] D4 5수 묘수 풀이",s.textContent="D4 실전 예제: 대각선까지 포함한 5수 묘수 풀이",i.textContent="대각선 반사와 회전이 어우러져 단 5수 만에 깔끔하게 해결!",p&&(p.style.display="flex"),this.renderMovePills(z,this.d4SubStep,y=>this.goToD4SubStep(y)),this.goToD4SubStep(this.d4SubStep,!1),g&&(g.textContent="다음 (5/6) ➔"),b.speak("대각선까지 섞여 있어도 5수 만에 깔끔하게 해결돼요!");break;case 6:e.textContent="STEP 6. 군론 행렬 퍼즐 완전 정복 🎉",s.textContent="준비 완료! 이제 실전 퍼즐에 도전해 보세요",i.textContent="배운 손동작과 대칭 원리로 최단 기록을 달성해 보세요!",m&&(m.style.display="none"),u&&(u.style.display="block"),g&&(g.textContent="🎮 실전 퍼즐 시작하기"),b.playClear(),b.speak("자, 이제 실전 퍼즐을 신나게 맞춰볼까요?"),this.updateHandDemo(6);break}}highlightCells(t,e){typeof document>"u"||t.forEach(s=>{const i=document.getElementById(`tut-cell-${s}`);i&&i.classList.add(e)})}clearCellHighlights(){if(!(typeof document>"u"))for(let t=0;t<9;t++){const e=document.getElementById(`tut-cell-${t}`);e&&(e.className="tut-cell-box")}}renderBoard(){if(!(typeof document>"u"))for(let t=0;t<9;t++){const e=document.getElementById(`tut-cell-${t}`);if(!e)continue;const s=typeof e.querySelector=="function"?e.querySelector(".tut-cell-canvas"):null,i=typeof e.querySelector=="function"?e.querySelector(".tut-cell-badge"):null,a=this.boardOps[t]||n.ID;s&&this.imgDogFront&&this.imgDogBack&&st(s,a,this.imgDogFront,this.imgDogBack),i&&(i.textContent=yt(a),i.dataset.op=a)}}}let G=null;function Mt(c=1){return G||(G=new St),G.open(c),G}class xt{constructor(){h(this,"canvas");h(this,"ctx");h(this,"particles",[]);h(this,"animId",null);h(this,"isRunning",!1);h(this,"animate",()=>{if(!(!this.isRunning||!this.ctx)){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let t=this.particles.length-1;t>=0;t--){const e=this.particles[t];if(e.x+=e.vx,e.y+=e.vy,e.vy+=.45,e.vx*=.985,e.rotation+=e.vRot,e.vy>0&&(e.alpha-=.007),e.alpha<=0||e.y>this.canvas.height+20){this.particles.splice(t,1);continue}if(this.ctx.save(),this.ctx.globalAlpha=Math.max(0,e.alpha),this.ctx.translate(e.x,e.y),this.ctx.rotate(e.rotation*Math.PI/180),this.ctx.fillStyle=e.color,e.shape==="rect")this.ctx.fillRect(-e.size/2,-e.size/2,e.size,e.size*.6);else if(e.shape==="circle")this.ctx.beginPath(),this.ctx.arc(0,0,e.size/2,0,Math.PI*2),this.ctx.fill();else{this.ctx.beginPath();for(let s=0;s<5;s++)this.ctx.lineTo(Math.cos((18+s*72)*Math.PI/180)*e.size,-Math.sin((18+s*72)*Math.PI/180)*e.size),this.ctx.lineTo(Math.cos((54+s*72)*Math.PI/180)*(e.size/2),-Math.sin((54+s*72)*Math.PI/180)*(e.size/2));this.ctx.closePath(),this.ctx.fill()}this.ctx.restore()}this.particles.length>0&&(this.animId=requestAnimationFrame(this.animate))}});this.canvas=document.createElement("canvas"),this.canvas.id="victory-confetti-canvas",this.canvas.style.position="fixed",this.canvas.style.top="0",this.canvas.style.left="0",this.canvas.style.width="100vw",this.canvas.style.height="100vh",this.canvas.style.pointerEvents="none",this.canvas.style.zIndex="999",this.canvas.style.display="none",document.body.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.resizeCanvas(),window.addEventListener("resize",()=>this.resizeCanvas())}resizeCanvas(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}launchVictory(t,e,s,i){this.resizeCanvas(),this.canvas.style.display="block",this.particles=[],this.isRunning=!0,navigator.vibrate&&navigator.vibrate([80,40,120,40,250]);const a=["#facc15","#38bdf8","#4ade80","#f43f5e","#a855f7","#fb923c","#ffffff"],o=this.canvas.width,l=this.canvas.height;for(let r=0;r<150;r++){const d=r%2===0;this.particles.push({x:d?Math.random()*(o*.3):o-Math.random()*(o*.3),y:l+10,vx:(d?1:-1)*(Math.random()*8+3)+(Math.random()-.5)*4,vy:-(Math.random()*16+12),size:Math.random()*9+5,color:a[Math.floor(Math.random()*a.length)],rotation:Math.random()*360,vRot:(Math.random()-.5)*12,alpha:1,shape:r%5===0?"star":r%2===0?"rect":"circle"})}this.animate(),this.showVictoryBanner(t,e,s,i),setTimeout(()=>{this.isRunning=!1,this.animId&&cancelAnimationFrame(this.animId),this.ctx&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.canvas.style.display="none"},4e3)}showVictoryBanner(t,e,s,i){var u,m;const a=document.getElementById("victory-banner-overlay");a&&a.remove();const o=document.createElement("div");o.id="victory-banner-overlay",o.className="victory-banner-anim";const l=(s==null?void 0:s.isNewBestTime)||(s==null?void 0:s.isNewBestMoves),r=s!=null&&s.timeFormatted?`⏱️ 소요 시간: <b>${s.timeFormatted}</b>`:"";o.innerHTML=`
      <div class="victory-card">
        <div class="victory-trophy">🏆</div>
        ${l?'<div class="badge-new-record">🔥 NEW BEST RECORD!</div>':""}
        <div class="victory-title">PERFECT CLEAR!</div>
        <div class="victory-stars">${"⭐".repeat(e)}</div>
        <div class="victory-desc">모든 대칭 타일을 원위치로 맞추셨습니다!</div>
        <div class="victory-stats-box">
          <div class="victory-moves">총 조작: <b>${t} 회</b></div>
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
    `,document.body.appendChild(o);const d=()=>{o.classList.add("fade-out"),setTimeout(()=>o.remove(),300)};(u=o.querySelector("#btn-victory-close"))==null||u.addEventListener("click",d),(m=o.querySelector("#btn-victory-replay"))==null||m.addEventListener("click",()=>{d(),i&&i()}),setTimeout(()=>{document.body.contains(o)&&d()},6e3)}}const Tt=new xt;let B=null;function Dt(){const c=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0,t=document.getElementById("btn-pwa-install");"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(e=>{e.update&&e.update()}).catch(()=>{})}),window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),B=e,!c&&t&&(t.style.display="inline-flex")}),window.addEventListener("appinstalled",()=>{B=null,t&&(t.style.display="none")}),t&&t.addEventListener("click",async()=>{if(B){B.prompt();const{outcome:e}=await B.userChoice;e==="accepted"&&(B=null,t.style.display="none")}else alert("브라우저 메뉴(⋮)에서 [홈 화면에 추가] 또는 [앱 설치]를 선택하시면 바탕화면에 설치됩니다.")})}class It{constructor(){h(this,"boardSize",3);h(this,"scrambleMoves",3);h(this,"currentOps",[]);h(this,"currentGroup","D4");h(this,"moveHistory",[]);h(this,"movesCount",0);h(this,"isAnimating",!1);h(this,"isGameStarted",!1);h(this,"isGuideActive",!1);h(this,"imgDogFront",new Image);h(this,"imgDogBack",new Image);h(this,"boardGrid");h(this,"gestureCanvas");h(this,"gestureRecognizer");this.initBoardOps(),this.initImages(),this.renderLayout(),this.bindControls(),this.updateBoard(),this.updateBestRecordBadge(),Dt()}initBoardOps(){this.currentOps=Array(this.boardSize*this.boardSize).fill(n.ID)}initImages(){this.imgDogFront.src="assets/dog_front.png",this.imgDogBack.src="assets/dog_back.png";const t=()=>this.updateBoard();this.imgDogFront.onload=t,this.imgDogBack.onload=t}renderLayout(){const t=document.getElementById("app");t.innerHTML=`
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
    `,this.boardGrid=document.getElementById("board-grid"),this.gestureCanvas=document.getElementById("gesture-canvas"),this.gestureRecognizer=new bt(this.boardGrid,this.gestureCanvas,(e,s)=>this.handleLineOperation(e,s),this.boardSize),this.rebuildBoardDOM()}rebuildBoardDOM(){this.boardGrid.style.gridTemplateColumns=`repeat(${this.boardSize}, 1fr)`,this.boardGrid.style.gridTemplateRows=`repeat(${this.boardSize}, 1fr)`,this.boardGrid.innerHTML="",this.boardGrid.classList.toggle("show-guide",this.isGuideActive);const t=this.boardSize*this.boardSize;for(let e=0;e<t;e++){const s=document.createElement("div");s.className="cell-box";const i=document.createElement("canvas");i.className="cell-canvas",i.width=100,i.height=100,s.appendChild(i);const a=Math.floor(e/this.boardSize),o=e%this.boardSize;if(e===0){const r=this.gestureRecognizer?this.gestureRecognizer.getCell11Mode():"row",d=document.createElement("div");d.className=`dual-switch-11 ${r==="col"?"mode-col":"mode-row"}`,d.id="dual-switch-11",d.title="탭하여 1행 / 1열 변환 모드 전환",d.innerHTML=`
          <span class="switch-opt switch-row">↔ 1행</span>
          <span class="switch-divider">|</span>
          <span class="switch-opt switch-col">↕ 1열</span>
        `,d.addEventListener("click",u=>{u.stopPropagation();const m=this.gestureRecognizer.toggleCell11Mode();d.className=`dual-switch-11 ${m==="col"?"mode-col":"mode-row"}`,b.playTap(),this.highlightActiveLine(m)}),s.appendChild(d)}else{let r="",d="";if(o===0&&a>0?(r=`${a+1}행`,d="guide-row"):a===0&&o>0?(r=`${o+1}열`,d="guide-col"):a===this.boardSize-1&&o===this.boardSize-1?(r="↖대각",d="guide-diag"):a===1&&o===this.boardSize-1&&(r="↗대각",d="guide-diag"),r){const u=document.createElement("div");u.className=`controller-guide-label ${d}`,u.innerText=r,s.appendChild(u)}}const l=document.createElement("div");l.className="cell-state-badge is-solved",l.innerText="0",s.appendChild(l),this.boardGrid.appendChild(s)}}highlightActiveLine(t){const e=this.boardSize*this.boardSize;for(let i=0;i<e;i++){const a=this.boardGrid.children[i];a&&a.classList.remove("highlight-col","highlight-row")}const s=[];if(t==="col")for(let i=0;i<this.boardSize;i++)s.push(i*this.boardSize);else for(let i=0;i<this.boardSize;i++)s.push(i);s.forEach(i=>{const a=this.boardGrid.children[i];a&&a.classList.add(t==="col"?"highlight-col":"highlight-row")}),setTimeout(()=>{s.forEach(i=>{const a=this.boardGrid.children[i];a&&a.classList.remove("highlight-col","highlight-row")})},1200)}bindControls(){var s,i,a,o,l,r,d,u,m;const t=document.getElementById("btn-header-tutorial");!vt()&&t&&t.classList.add("pulse-active"),t==null||t.addEventListener("click",()=>{b.playTap(),t.classList.remove("pulse-active"),Mt()}),(s=document.getElementById("btn-about"))==null||s.addEventListener("click",()=>{b.playTap(),ft()});const e=document.getElementById("btn-toggle-guide");e&&(e.classList.toggle("active",this.isGuideActive),e.addEventListener("click",()=>{this.isGuideActive=!this.isGuideActive,e.classList.toggle("active",this.isGuideActive),this.boardGrid.classList.toggle("show-guide",this.isGuideActive),b.playTap()})),(i=document.getElementById("btn-toggle-bgm"))==null||i.addEventListener("click",p=>{const v=b.toggleBgm();p.target.innerText=v?"🎵 BGM":"🔇 BGM"}),(a=document.getElementById("btn-toggle-sfx"))==null||a.addEventListener("click",p=>{const v=b.toggleSfx();p.target.innerText=v?"🔊 SFX":"🔈 SFX"}),document.querySelectorAll("#size-button-group .btn-pill").forEach(p=>{p.addEventListener("click",v=>{const g=v.currentTarget,S=parseInt(g.dataset.size||"3",10);S!==this.boardSize&&(document.querySelectorAll("#size-button-group .btn-pill").forEach(y=>y.classList.remove("active")),g.classList.add("active"),this.setBoardSize(S))})}),this.renderDifficultyButtons(),(o=document.getElementById("btn-undo"))==null||o.addEventListener("click",()=>{this.undoMove()}),(l=document.getElementById("btn-hint"))==null||l.addEventListener("click",()=>{this.giveHint()}),(r=document.getElementById("btn-solution"))==null||r.addEventListener("click",()=>{this.openSolution()}),(d=document.getElementById("btn-set-c2"))==null||d.addEventListener("click",()=>this.switchGroup("C2")),(u=document.getElementById("btn-set-v4"))==null||u.addEventListener("click",()=>this.switchGroup("V4")),(m=document.getElementById("btn-set-d4"))==null||m.addEventListener("click",()=>this.switchGroup("D4"))}updateBestRecordBadge(){const t=document.getElementById("badge-best-record");if(!t)return;const e=E.getRecord(this.boardSize,this.scrambleMoves);if(e&&(e.bestTimeMs!==null||e.bestMoves!==null)){const s=e.bestTimeMs!==null?Y(e.bestTimeMs):"-",i=e.bestMoves!==null?`${e.bestMoves}회`:"-";t.innerText=`🏆 ${s} / ${i}`,t.title=`최고 기록: ${s} (${i})`}else t.innerText="🏆 BEST: -",t.title="아직 클리어 기록이 없습니다"}setBoardSize(t){this.boardSize=t,this.initBoardOps(),this.rebuildBoardDOM(),this.gestureRecognizer.setBoardSize(t),this.isGameStarted=!1,E.resetTimer();const e=document.getElementById("label-timer");e&&(e.innerText="00:00.0"),this.moveHistory=[],this.movesCount=0,this.updateMovesLabel(),this.updateStatusInfo(),this.updateBestRecordBadge(),b.playTap(),this.scrambleBoard()}updateStatusInfo(){const t=document.getElementById("label-stage-info");t&&(t.innerText=`${this.boardSize}×${this.boardSize} (${this.scrambleMoves}수 도전)`)}renderDifficultyButtons(){const t=document.getElementById("moves-button-group");if(!t)return;let e=[3,4,5,6,7,8];this.currentGroup==="V4"?e=[2,3,4]:this.currentGroup==="C2"&&(e=[2,3]),e.includes(this.scrambleMoves)||(this.scrambleMoves=e[0]),t.innerHTML="",e.forEach(s=>{const i=document.createElement("button");i.className=`btn-pill ${s===this.scrambleMoves?"active":""}`,i.dataset.moves=String(s),i.innerText=`${s}수`,i.addEventListener("click",()=>{this.scrambleMoves=s,t.querySelectorAll(".btn-pill").forEach(a=>a.classList.remove("active")),i.classList.add("active"),this.updateStatusInfo(),this.updateBestRecordBadge(),this.scrambleBoard()}),t.appendChild(i)}),this.updateStatusInfo(),this.updateBestRecordBadge()}switchGroup(t){this.currentGroup=t;const e=document.getElementById("badge-group-name");e&&(e.innerText=L[t].name),["btn-set-c2","btn-set-v4","btn-set-d4"].forEach(s=>{const i=document.getElementById(s);i&&i.classList.toggle("active",s.endsWith(t.toLowerCase()))}),this.renderDifficultyButtons(),this.scrambleBoard()}handleLineOperation(t,e){if(this.isAnimating)return;let s=e;this.currentGroup==="C2"?s=n.R180:this.currentGroup==="V4"&&(e===n.R90||e===n.R270?s=n.R180:e===n.MD?s=n.MY:e===n.MAD&&(s=n.MX));const a=R(this.boardSize).findIndex(o=>o.type===t.type&&o.idx===t.idx);a!==-1&&this.applyMove(a,s)}applyMove(t,e,s=!0){if(this.isAnimating)return;this.isAnimating=!0,this.gestureRecognizer.setLocked(!0),b.playFlip();const a=w(this.boardSize)[t]||[];let o="scale(0.92)";e==="MX"?o="perspective(900px) scale(0.92) rotateX(180deg)":e==="MY"?o="perspective(900px) scale(0.92) rotateY(180deg)":e==="MD"?o="perspective(900px) scale(0.92) rotate3d(1, 1, 0, 180deg)":e==="MAD"?o="perspective(900px) scale(0.92) rotate3d(-1, 1, 0, 180deg)":e==="R90"?o="perspective(900px) scale(0.92) rotateZ(90deg)":e==="R180"?o="perspective(900px) scale(0.92) rotateZ(180deg)":e==="R270"&&(o="perspective(900px) scale(0.92) rotateZ(270deg)");const l=340;a.forEach(r=>{const d=this.boardGrid.children[r];d&&(d.style.transition=`transform ${l}ms cubic-bezier(0.2, 0.9, 0.3, 1)`,d.style.transform=o)}),setTimeout(()=>{try{const r=[...this.currentOps];this.currentOps=N(this.currentOps,a,e),s&&(this.isGameStarted||(this.isGameStarted=!0,E.startTimer(d=>{const u=document.getElementById("label-timer");u&&(u.innerText=d)})),this.moveHistory.push({lineId:t,op:e,prevOps:r}),this.movesCount++,this.updateMovesLabel()),this.updateBoard(),a.forEach(d=>{const u=this.boardGrid.children[d];u&&(u.style.transition="none",u.style.transform="")}),requestAnimationFrame(()=>{requestAnimationFrame(()=>{a.forEach(d=>{const u=this.boardGrid.children[d];u&&(u.style.transition="")})})}),this.checkWinCondition()}finally{this.isAnimating=!1,this.gestureRecognizer.setLocked(!1)}},l)}undoMove(){if(this.moveHistory.length===0||this.isAnimating)return;const t=this.moveHistory.pop();this.currentOps=t.prevOps,this.movesCount=Math.max(0,this.movesCount-1),this.updateMovesLabel(),b.playTap(),this.updateBoard()}scrambleBoard(){j.close(),this.isGameStarted=!1,E.resetTimer();const t=document.getElementById("label-timer");t&&(t.innerText="00:00.0");const e=R(this.boardSize),s=w(this.boardSize),a=L[this.currentGroup].ops.filter(l=>l!==n.ID);let o=Array(this.boardSize*this.boardSize).fill(n.ID);for(let l=0;l<this.scrambleMoves;l++){const r=Math.floor(Math.random()*e.length),d=a[Math.floor(Math.random()*a.length)];o=N(o,s[r],d)}this.currentOps=o,this.moveHistory=[],this.movesCount=0,this.updateMovesLabel(),this.updateBestRecordBadge(),b.playTap(),this.updateBoard()}giveHint(){if(this.currentOps.every(o=>o===n.ID)){b.playWin();return}const t=_(this.currentOps,this.boardSize,this.currentGroup);if(t.length===0)return;const e=t[0];b.playTap();const s=this.boardSize*this.boardSize;for(let o=0;o<s;o++){const l=this.boardGrid.children[o];l&&l.classList.remove("highlight-hint","highlight-col","highlight-row")}const a=w(this.boardSize)[e.lineId]||[];a.forEach(o=>{const l=this.boardGrid.children[o];l&&l.classList.add("highlight-hint")}),setTimeout(()=>{a.forEach(o=>{const l=this.boardGrid.children[o];l&&l.classList.remove("highlight-hint")})},2500)}openSolution(){const t=document.getElementById("solution-panel-container");if(!t)return;const e=[...this.currentOps],s=_(this.currentOps,this.boardSize,this.currentGroup);j.render(t,this.currentOps,this.boardSize,s,{onPreviewState:(i,a)=>{this.currentOps=[...i],this.updateBoard();const o=this.boardSize*this.boardSize;for(let l=0;l<o;l++){const r=this.boardGrid.children[l];r&&r.classList.remove("highlight-hint")}a!==null&&(w(this.boardSize)[a]||[]).forEach(d=>{const u=this.boardGrid.children[d];u&&u.classList.add("highlight-hint")})},onAutoSolve:()=>{this.currentOps=[...e],this.updateBoard(),this.runAutoSolve(s)},onClose:()=>{const i=this.boardSize*this.boardSize;for(let a=0;a<i;a++){const o=this.boardGrid.children[a];o&&o.classList.remove("highlight-hint")}this.updateBoard()}})}async runAutoSolve(t){for(const e of t){if(this.currentOps.every(s=>s===n.ID))break;await new Promise(s=>{this.applyMove(e.lineId,e.op,!0),setTimeout(s,520)})}}checkWinCondition(){if(this.currentOps.every(e=>e===n.ID)){this.isGameStarted=!1;const e=E.stopTimer(),s=E.getFormattedTime(),i=E.saveRecord(this.boardSize,this.scrambleMoves,e,this.movesCount);this.updateBestRecordBadge(),b.playWin();const a=ht.completeStage(1,this.movesCount),o=this.boardSize*this.boardSize;for(let l=0;l<o;l++){const r=this.boardGrid.children[l];r&&setTimeout(()=>{r.classList.add("celebrate-tile")},l*40)}Tt.launchVictory(this.movesCount,a,{timeFormatted:s,isNewBestTime:i.isNewBestTime,isNewBestMoves:i.isNewBestMoves,bestTimeFormatted:Y(i.bestTimeMs),bestMoves:i.bestMoves},()=>{this.scrambleBoard()}),setTimeout(()=>{for(let l=0;l<o;l++){const r=this.boardGrid.children[l];r&&r.classList.remove("celebrate-tile")}},4200)}}updateMovesLabel(){const t=document.getElementById("label-moves");t&&(t.innerText=`${this.movesCount} 회`)}getBadgeInfo(t){switch(t){case"ID":return{text:"0",isSolved:!0,isSymmetry:!1};case"R90":return{text:"1",isSolved:!1,isSymmetry:!1};case"R180":return{text:"2",isSolved:!1,isSymmetry:!1};case"R270":return{text:"3",isSolved:!1,isSymmetry:!1};case"MX":return{text:"―",isSolved:!1,isSymmetry:!0};case"MY":return{text:"│",isSolved:!1,isSymmetry:!0};case"MD":return{text:"╲",isSolved:!1,isSymmetry:!0};case"MAD":return{text:"╱",isSolved:!1,isSymmetry:!0};default:return{text:"0",isSolved:!0,isSymmetry:!1}}}updateBoard(){const t=this.boardSize*this.boardSize;for(let e=0;e<t;e++){const s=this.boardGrid.children[e];if(!s)continue;const i=s.querySelector("canvas");if(!i)continue;const a=this.currentOps[e];st(i,a,this.imgDogFront,this.imgDogBack);const o=s.querySelector(".cell-state-badge");if(o){const l=this.getBadgeInfo(a);o.innerText=l.text,o.classList.toggle("is-solved",l.isSolved),o.classList.toggle("is-symmetry",l.isSymmetry)}}}}window.addEventListener("DOMContentLoaded",()=>{new It});
