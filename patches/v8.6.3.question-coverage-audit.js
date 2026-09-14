(()=>{
 const VERSION='8.6.3-QUESTION-COVERAGE-AUDIT',BUILD='863audit1';
 const addition=`<!-- DEEN v8.6.3 — Question Coverage Audit -->
<script id="deen-v863-coverage-runtime">
(()=>{
 if(window.__deenV863Coverage)return;window.__deenV863Coverage=true;
 const VERSION='8.6.3-QUESTION-COVERAGE-AUDIT',BUILD='863audit1';
 const ALIAS={
  multiple_choice:'mcq',mcq:'mcq',choice:'mcq',
  card:'card',card_grid:'card',large_card:'card',
  true_false:'true_false',boolean:'true_false',
  fill_blank:'fill_blank',missing_item:'fill_blank',progressive_recall:'fill_blank',next_word:'fill_blank',
  matching:'match',match:'match',
  build_sequence:'sequence',sequence:'sequence',ordering:'sequence',
  scenario:'scenario',case:'scenario',
  error_spotting:'odd_one_out',odd_one_out:'odd_one_out',find_wrong:'odd_one_out',find_incorrect:'odd_one_out',wrong_one:'odd_one_out',spot_error:'odd_one_out',
  listening_select:'listen_select',listening_meaning:'listen_select',listen_select:'listen_select','listen-and-select':'listen_select',audio_select:'listen_select',audio_choice:'listen_select',
  pronunciation:'pronunciation',pronounce:'pronunciation',speaking:'pronunciation',repeat_after_me:'pronunciation',speak:'pronunciation'
 };
 const ALL=['mcq','card','true_false','fill_blank','match','sequence','scenario','odd_one_out','listen_select','pronunciation'];
 const EXPECTED={
  'ÖĞREN':['card','mcq','match','fill_blank'],
  'ANLA':['match','fill_blank','odd_one_out','scenario','mcq'],
  'UYGULA':['scenario','odd_one_out','mcq','fill_blank','match'],
  'HATIRLA':['fill_blank','sequence','match','odd_one_out','mcq'],
  'DİNLE':['listen_select','fill_blank','mcq'],
  'USTALAŞ':['scenario','odd_one_out','sequence','match','fill_blank','mcq']
 };
 let scans=0,lastReport=null,retryTimer=0;
 function getQuestions(){
  let q=[];try{if(Array.isArray(QUESTIONS))q=QUESTIONS}catch(_){}
  if(!q.length&&Array.isArray(window.QUESTIONS))q=window.QUESTIONS;
  return Array.isArray(q)?q:[];
 }
 function classify(q){
  try{const t=window.DEEN_LESSON_ORCHESTRATOR?.classify?.(q);if(t)return t}catch(_){}
  const raw=String(q?.type||q?.question_type||q?.activity_type||'').trim().toLowerCase();
  if(ALIAS[raw])return ALIAS[raw];
  if(Array.isArray(q?.pairs))return'match';
  if(Array.isArray(q?.correct_order)||Array.isArray(q?.sequence))return'sequence';
  if(Array.isArray(q?.options_tr)||Array.isArray(q?.options))return'mcq';
  return'fill_blank';
 }
 const concept=q=>String(q?.concept_id||q?.knowledgeKey||q?.skill||q?.objective||q?.topic||'').trim();
 const stage=q=>String(q?.stage_id||q?.stageId||'UNSCOPED').trim()||'UNSCOPED';
 const unit=q=>{const s=stage(q);const m=s.match(/^U\\d{2}/);return m?m[0]:'UNSCOPED'};
 function audioReady(q){
  const direct=String(q?.audio_url||q?.audio_src||q?.reference_audio_url||q?.voice_url||q?.media_url||q?.audio||'').trim();if(direct)return true;
  const key=String(q?.asset_requirement||'').trim();if(!key)return false;
  try{const a=window.DEEN_AUDIO_ASSETS?.[key];return !!(a?.verified&&a?.src)}catch(_){return false}
 }
 function summarize(items,meta={}){
  const qs=Array.isArray(items)?items.filter(Boolean):[],counts={};ALL.forEach(t=>counts[t]=0);
  qs.forEach(q=>{const t=classify(q);counts[t]=(counts[t]||0)+1});
  const present=Object.entries(counts).filter(([,n])=>n>0).map(([t])=>t),n=qs.length;
  const dominant=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]||['none',0];
  const dominantShare=n?dominant[1]/n:0,trueFalseShare=n?(counts.true_false||0)/n:0;
  const conceptMap=new Map();qs.forEach(q=>{const c=concept(q);if(!c)return;const arr=conceptMap.get(c)||[];arr.push(classify(q));conceptMap.set(c,arr)});
  let repeatedConcepts=0,crossFormatConcepts=0;
  for(const types of conceptMap.values())if(types.length>1){repeatedConcepts++;if(new Set(types).size>1)crossFormatConcepts++}
  const crossFormatRate=repeatedConcepts?crossFormatConcepts/repeatedConcepts:null;
  const expected=EXPECTED[meta.role]||[];
  const missingRecommended=expected.filter(t=>!counts[t]);
  const audioItems=qs.filter(q=>['listen_select','pronunciation'].includes(classify(q))),audioReadyCount=audioItems.filter(audioReady).length;
  const flags=[];
  if(n>=5&&present.length<3)flags.push({severity:'critical',code:'LOW_VARIETY',text:'5+ soruluk havuzda 3\u2019ten az etkileşim tipi var.'});
  else if(n>=5&&present.length<4)flags.push({severity:'warning',code:'LOW_VARIETY',text:'Havuz 4 farklı etkileşim tipinin altında.'});
  if((meta.role==='USTALAŞ'||meta.kind==='challenge')&&n>=8&&present.length<5)flags.push({severity:'warning',code:'MASTERY_VARIETY',text:'Ustalık havuzu için format çeşitliliği düşük.'});
  if(dominantShare>.75&&n>=4)flags.push({severity:'critical',code:'DOMINANT_TYPE',text:dominant[0]+' havuzun %'+Math.round(dominantShare*100)+'\u2019ini oluşturuyor.'});
  else if(dominantShare>.55&&n>=5)flags.push({severity:'warning',code:'DOMINANT_TYPE',text:dominant[0]+' havuzun %'+Math.round(dominantShare*100)+'\u2019ini oluşturuyor.'});
  if(trueFalseShare>.25&&n>=5)flags.push({severity:'warning',code:'TRUE_FALSE_HEAVY',text:'Doğru/Yanlış oranı yüksek (%'+Math.round(trueFalseShare*100)+').'});
  if(repeatedConcepts>=2&&crossFormatRate<.35)flags.push({severity:'warning',code:'LOW_CROSS_FORMAT',text:'Tekrarlanan kazanımların çoğu farklı formatla ölçülmüyor.'});
  if(meta.role==='DİNLE'&&n>=3&&!counts.listen_select)flags.push({severity:'warning',code:'LISTEN_MISSING',text:'Dinleme aşamasında Dinle ve Seç içeriği yok.'});
  if(audioItems.length&&audioReadyCount<audioItems.length)flags.push({severity:'media',code:'AUDIO_NOT_READY',text:(audioItems.length-audioReadyCount)+' sesli etkileşimde onaylı/bağlı ses bulunamadı.'});
  return{
   id:meta.id||'',role:meta.role||'',kind:meta.kind||'',count:n,uniqueTypes:present.length,presentTypes:present,counts,
   missingRecommended,dominantType:dominant[0],dominantShare:Number(dominantShare.toFixed(3)),trueFalseShare:Number(trueFalseShare.toFixed(3)),
   concepts:conceptMap.size,repeatedConcepts,crossFormatConcepts,crossFormatRate:crossFormatRate==null?null:Number(crossFormatRate.toFixed(3)),
   audio:{items:audioItems.length,ready:audioReadyCount,missing:Math.max(0,audioItems.length-audioReadyCount)},flags
  };
 }
 function macroDefs(){try{return window.DEEN_FIVE_STAGE?.all?.()||[]}catch(_){return[]}}
 function scan(){
  const qs=getQuestions();
  if(!qs.length){lastReport={version:VERSION,build:BUILD,ready:false,reason:'QUESTIONS_NOT_READY',at:Date.now()};return lastReport}
  const units=[...new Set(qs.map(unit))].sort();
  const stages=[...new Set(qs.map(stage))].sort();
  const unitReports=units.map(id=>summarize(qs.filter(q=>unit(q)===id),{id}));
  const stageReports=stages.map(id=>summarize(qs.filter(q=>stage(q)===id),{id}));
  const macros=macroDefs().map(d=>{
   const ids=new Set(Array.isArray(d?.legacyIds)?d.legacyIds:[]),pool=qs.filter(q=>ids.has(stage(q)));
   return summarize(pool,{id:String(d?.id||''),role:String(d?.role||''),kind:String(d?.kind||'')});
  });
  const all=[...unitReports,...stageReports,...macros],critical=all.filter(x=>x.flags.some(f=>f.severity==='critical')),warnings=all.filter(x=>x.flags.some(f=>f.severity==='warning'));
  const media=all.filter(x=>x.flags.some(f=>f.severity==='media'));
  const gapScore=x=>x.flags.reduce((s,f)=>s+(f.severity==='critical'?4:f.severity==='warning'?2:.5),0)+Math.max(0,4-x.uniqueTypes)*.6+x.missingRecommended.length*.18;
  const topGaps=[...macros].sort((a,b)=>gapScore(b)-gapScore(a)||a.id.localeCompare(b.id,'tr')).slice(0,12).map(x=>({id:x.id,role:x.role,count:x.count,uniqueTypes:x.uniqueTypes,presentTypes:x.presentTypes,missingRecommended:x.missingRecommended,flags:x.flags}));
  const overall=summarize(qs,{id:'ALL'});
  lastReport={version:VERSION,build:BUILD,ready:true,at:Date.now(),questionCount:qs.length,overall,units:unitReports,stages:stageReports,macroStages:macros,summary:{units:unitReports.length,stages:stageReports.length,macroStages:macros.length,critical:critical.length,warnings:warnings.length,mediaWarnings:media.length},topGaps};
  scans++;
  try{document.documentElement.dataset.deenCoverageAudit='ready';document.dispatchEvent(new CustomEvent('deen:coverage:scanned',{detail:{version:VERSION,summary:lastReport.summary,topGaps}}))}catch(_){}
  return lastReport;
 }
 function schedule(){clearTimeout(retryTimer);const tries=[0,220,700,1600,3200];tries.forEach(ms=>setTimeout(()=>{const r=scan();if(r.ready)clearTimeout(retryTimer)},ms))}
 window.DEEN_QUESTION_COVERAGE={
  version:VERSION,build:BUILD,types:[...ALL],scan,report:()=>lastReport,
  get:(scope='macro')=>{const r=lastReport||scan();if(!r?.ready)return[];return scope==='unit'?r.units:scope==='stage'?r.stages:scope==='all'?[r.overall]:r.macroStages},
  check:()=>{const r=lastReport||scan();return{version:VERSION,build:BUILD,ready:!!r?.ready,scans,questions:r?.questionCount||0,summary:r?.summary||null,topGaps:r?.topGaps?.slice(0,5)||[]}}
 };
 document.documentElement.dataset.deenCoverageAudit='loaded';
 schedule();
})();
<\/script>`;
 window.DEEN_PATCH_V863=function(html){let out=String(html);if(out.includes('deen-v863-coverage-runtime'))return{html:out,version:VERSION,applied:0};out+='\\n'+addition+'\\n';return{html:out,version:VERSION,applied:1}};
})();
