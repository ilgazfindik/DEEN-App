(()=>{
 const VERSION='8.8.3-WRONG-REVIEW-MASTERY',BUILD='883review1';
 const addition=`<!-- DEEN v8.8.3 — End-of-lesson Wrong Review + Mastery -->
<script id="deen-v883-wrong-review-mastery">
(()=>{
 if(window.__deenV883WrongReviewMastery)return;window.__deenV883WrongReviewMastery=true;
 const VERSION='8.8.3-WRONG-REVIEW-MASTERY',BUILD='883review1';
 const META='__deenWrongReviewMastery';
 const RETRY='__deenReviewRetry';
 let queued=0,requeued=0,resolved=0,masteredLessons=0,lastEvent=null;

 const clone=v=>{try{return structuredClone(v)}catch(_){try{return JSON.parse(JSON.stringify(v))}catch(__){return v&&typeof v==='object'?{...v}:v}}};
 function getSession(){let s=null;try{s=session}catch(_){try{s=window.session}catch(__){}}return s}
 function questionId(q){return String(q?.id||q?.question_id||q?.questionId||q?.concept_id||q?.question_tr||q?.prompt||'question')}
 function emit(type,detail={}){
   lastEvent={type,at:Date.now(),...detail};
   try{document.dispatchEvent(new CustomEvent('deen:wrong-review:'+type,{detail:{version:VERSION,build:BUILD,...lastEvent}}))}catch(_){}
 }
 function ensureMeta(s){
   if(!s||!Array.isArray(s.questions))return null;
   let m=s[META];
   const baseCount=s.questions.reduce((n,q)=>n+(!q?.[RETRY]?1:0),0);
   const shouldReset=!m||typeof m!=='object'||(Number(s.index)===0&&baseCount>0&&m.completed===true);
   if(shouldReset){
     m={version:VERSION,baseCount,initialLength:s.questions.length,pending:0,hadMistake:false,mastered:false,completed:false,wrongAttempts:0,retryCorrect:0,startedAt:Date.now()};
     try{Object.defineProperty(s,META,{value:m,writable:true,configurable:true,enumerable:true})}catch(_){s[META]=m}
   }else{
     m.baseCount=Math.max(Number(m.baseCount)||0,baseCount||0);
     m.pending=Math.max(0,Number(m.pending)||0);
   }
   return m;
 }
 function makeRetry(q){
   const retry=clone(q)||{};
   retry[RETRY]=true;
   retry.__deenReviewOriginId=questionId(q);
   retry.__deenReviewQueuedAt=Date.now();
   return retry;
 }
 function setIfNumber(obj,key,value){
   if(obj&&Object.prototype.hasOwnProperty.call(obj,key)&&typeof obj[key]==='number'&&Number.isFinite(obj[key]))obj[key]=value;
 }
 function normalizeMastery(s,m){
   if(!s||!m||m.mastered)return false;
   m.mastered=true;m.completed=true;m.pending=0;m.masteredAt=Date.now();
   const base=s.questions.filter(q=>!q?.[RETRY]);
   if(base.length){
     m.baseCount=base.length;
     s.questions.splice(0,s.questions.length,...base);
   }
   const total=Math.max(0,Number(m.baseCount)||base.length||0);
   ['wrong','wrongs','wrongCount','incorrect','incorrectCount','mistakes','mistakeCount','errors','errorCount'].forEach(k=>setIfNumber(s,k,0));
   ['correct','correctCount','correctAnswers','right','rightCount'].forEach(k=>setIfNumber(s,k,total));
   ['answered','answeredCount','totalAnswered'].forEach(k=>setIfNumber(s,k,total));
   ['accuracy','accuracyPct','accuracyPercent','percentage','percent','mastery','masteryScore','masteryPercent'].forEach(k=>setIfNumber(s,k,100));
   s.reviewMastery=100;
   s.masteryPercent=100;
   masteredLessons++;
   emit('mastered',{baseCount:total,wrongAttempts:m.wrongAttempts,retryCorrect:m.retryCorrect,index:Number(s.index)||0});
   return true;
 }
 function queueWrong(s,m,q,isRetry){
   if(!s||!m||!q)return;
   if(isRetry)m.pending=Math.max(0,m.pending-1);
   const retry=makeRetry(q);
   s.questions.push(retry);
   m.pending++;
   m.hadMistake=true;
   m.wrongAttempts++;
   if(isRetry)requeued++;else queued++;
   emit(isRetry?'requeued':'queued',{id:questionId(q),pending:m.pending,index:Number(s.index)||0,total:s.questions.length});
 }
 function resolveRetry(m,q){
   if(!m)return;
   m.pending=Math.max(0,m.pending-1);
   m.retryCorrect++;
   resolved++;
   emit('resolved',{id:questionId(q),pending:m.pending});
 }
 function wrapCompleteQuestion(){
   const old=typeof completeQuestion==='function'?completeQuestion:window.completeQuestion;
   if(typeof old!=='function'||old.__v883WrongReview)return false;
   const wrapped=function(correct,q,...rest){
     const s=getSession(),m=ensureMeta(s),current=s?.questions?.[Number(s?.index)||0]||q;
     const actualQ=q||current;
     const isRetry=!!(current?.[RETRY]||actualQ?.[RETRY]);
     const ok=correct===true;

     if(m&&actualQ){
       if(!ok)queueWrong(s,m,actualQ,isRetry);
       else if(isRetry)resolveRetry(m,actualQ);
     }

     const out=old.call(this,correct,q,...rest);

     if(m&&ok&&isRetry&&m.pending===0&&m.hadMistake){
       normalizeMastery(s,m);
     }
     return out;
   };
   wrapped.__v883WrongReview=true;
   wrapped.__v883Original=old;
   try{window.completeQuestion=wrapped;completeQuestion=wrapped}catch(_){window.completeQuestion=wrapped}
   return true;
 }
 function wrapRenderQuestion(){
   const old=typeof renderQuestion==='function'?renderQuestion:window.renderQuestion;
   if(typeof old!=='function'||old.__v883WrongReview)return false;
   const wrapped=function(...args){
     const s=getSession();
     if(s&&Array.isArray(s.questions))ensureMeta(s);
     return old.apply(this,args);
   };
   wrapped.__v883WrongReview=true;
   wrapped.__v883Original=old;
   try{window.renderQuestion=wrapped;renderQuestion=wrapped}catch(_){window.renderQuestion=wrapped}
   return true;
 }
 function install(){
   const completeWrapped=wrapCompleteQuestion();
   const renderWrapped=wrapRenderQuestion();
   if(!completeWrapped||!renderWrapped){
     let tries=0;
     const timer=setInterval(()=>{
       tries++;
       const c=wrapCompleteQuestion(),r=wrapRenderQuestion();
       if((c||window.completeQuestion?.__v883WrongReview)&&(r||window.renderQuestion?.__v883WrongReview)||tries>20)clearInterval(timer);
     },120);
   }
   document.documentElement.dataset.deenWrongReview='ready';
   emit('ready',{completeWrapped:!!(window.completeQuestion?.__v883WrongReview),renderWrapped:!!(window.renderQuestion?.__v883WrongReview)});
 }
 window.DEEN_WRONG_REVIEW_MASTERY={
   version:VERSION,build:BUILD,
   state:()=>{const s=getSession(),m=s?.[META];return m?{...m,index:Number(s.index)||0,total:s.questions?.length||0}:null},
   forceNormalize:()=>{const s=getSession(),m=ensureMeta(s);return normalizeMastery(s,m)},
   check:()=>({version:VERSION,build:BUILD,ready:true,queued,requeued,resolved,masteredLessons,lastEvent,completeWrapped:!!window.completeQuestion?.__v883WrongReview,renderWrapped:!!window.renderQuestion?.__v883WrongReview})
 };
 install();
})();
<\/script>`;
 window.DEEN_PATCH_V883=function(html){
   let out=String(html);
   if(out.includes('deen-v883-wrong-review-mastery'))return{html:out,version:VERSION,applied:0};
   out+='\n'+addition+'\n';
   return{html:out,version:VERSION,applied:1};
 };
})();