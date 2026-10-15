/* DEEN Arabic phase 11 — device-local daily study plan.
 * Daily counts are actual written lesson completions and correct card reviews.
 * Durations are user preferences, never measured or guaranteed study time.
 * No background scheduling, notifications or audio claims.
 */
(()=>{
 'use strict';
 if(window.DEEN_ARABIC_DAILY)return;
 const allowed=Object.freeze([5,10,15]);
 const localDay=(when=new Date())=>{
  const d=when instanceof Date?when:new Date(when);
  if(Number.isNaN(d.getTime()))return null;
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 };
 const unique=items=>[...new Set(Array.isArray(items)?items.filter(x=>typeof x==='string'&&x.length>0&&x.length<120):[])];
 const safeMinutes=value=>allowed.includes(Number(value))?Number(value):10;
 const normalizeActivity=(raw,day=localDay())=>{
  const empty={day,lessons:[],reviews:[]};
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.day!==day)return Object.freeze(empty);
  return Object.freeze({day,lessons:Object.freeze(unique(raw.lessons).slice(0,50)),
   reviews:Object.freeze(unique(raw.reviews).slice(0,100))});
 };
 const mark=(raw,type,id,day=localDay())=>{
  const before=normalizeActivity(raw,day);
  if(!['lesson','review'].includes(type)||typeof id!=='string'||!id)return before;
  const key=type==='lesson'?'lessons':'reviews';
  return normalizeActivity({...before,[key]:unique([...before[key],id])},day);
 };
 function suggest(args={}){
  const minutes=safeMinutes(args.minutes);
  const activity=normalizeActivity(args.activity,args.day||localDay());
  const lessonCandidates=Array.isArray(args.lessons)?args.lessons:[];
  const next=lessonCandidates.find(l=>l&&typeof l.id==='string'&&Number.isInteger(l.index)&&l.unlocked===true&&!l.completed)||null;
  const due=unique(args.due||[]);
  const weak=unique(args.weak||[]).filter(id=>!due.includes(id));
  const availableCards=unique([...due,...weak]);
  const quotas={5:{lessons:1,reviews:2},10:{lessons:1,reviews:4},15:{lessons:2,reviews:6}}[minutes];
  const lessonQuota=next||activity.lessons.length?quotas.lessons:0;
  const reviewQuota=Math.min(quotas.reviews,availableCards.length+activity.reviews.length);
  const lessonDone=Math.min(lessonQuota,activity.lessons.length);
  const reviewDone=Math.min(reviewQuota,activity.reviews.length);
  const total=lessonQuota+reviewQuota;
  const remainingLesson=Math.max(0,lessonQuota-lessonDone);
  const remainingReviews=Math.max(0,reviewQuota-reviewDone);
  const cardsToStudy=unique([...due,...weak]).filter(id=>!activity.reviews.includes(id)).slice(0,remainingReviews);
  const completed=lessonDone+reviewDone;
  return Object.freeze({
   version:1,day:activity.day,minutes,lessonQuota,reviewQuota,
   lessonDone,reviewDone,total,completed,
   completionPct:total?Math.round(100*completed/total):100,
   dueCount:due.length,weakCount:weak.length,
   remainingLesson,remainingReviews,
   nextLesson:remainingLesson&&next?Object.freeze({id:next.id,index:next.index}):null,
   cardsToStudy:Object.freeze(cardsToStudy),
   isRestDay:total===0,
   hasTasksLeft:completed<total,
   // This is a study suggestion, not an assessment of actual learning effectiveness.
   source:'local lesson completions and written practice only'
  });
 }
 window.DEEN_ARABIC_DAILY=Object.freeze({version:1,allowedMinutes:allowed,localDay,safeMinutes,normalizeActivity,mark,suggest});
})();
