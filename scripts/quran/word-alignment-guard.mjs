/* Strict staging alignment acceptance. No generated timing is a reviewed recital. */
function wordsOf(text){
  if(typeof text!=='string'||!text.trim())throw Error('Empty Arabic source');
  return text.trim().split(/\s+/u).filter(Boolean);
}
function finiteLoss(value){
  return typeof value==='number'&&Number.isFinite(value)?value:null;
}
export function validateAlignmentCandidate(entry,data){
  if(!entry||typeof entry.key!=='string'||typeof entry.audio!=='string')
    throw Error('Invalid manifest ayah');
  const source=wordsOf(entry.text);
  if(!data||!Array.isArray(data.words))throw Error('Missing word timings for '+entry.key);
  if(data.words.length!==source.length)
    throw Error('Word-count mismatch '+entry.key+': '+data.words.length+'/'+source.length);
  let previousEnd=0;
  const words=data.words.map((segment,index)=>{
    const text=typeof segment?.text==='string'?segment.text.trim():'';
    if(text!==source[index])
      throw Error('Arabic token mismatch '+entry.key+'['+index+']');
    const start=segment?.start,end=segment?.end;
    if(typeof start!=='number'||typeof end!=='number'||
       !Number.isFinite(start)||!Number.isFinite(end)||
       start<0||end<=start||start<previousEnd-0.025)
      throw Error('Invalid timestamp '+entry.key+'['+index+']');
    previousEnd=end;
    return {text:source[index],start,end,loss:finiteLoss(segment.loss)};
  });
  return {
    surahId:entry.surahId,ayah:entry.ayah,text:entry.text,audio:entry.audio,
    expectedWords:source.length,alignedWords:words.length,wordCountMatch:true,
    loss:finiteLoss(data.loss),words
  };
}
export function validateStoredAlignment(entry,stored){
  const cleaned=validateAlignmentCandidate(entry,stored);
  for(const key of ['surahId','ayah','text','audio','expectedWords','alignedWords','wordCountMatch'])
    if(stored[key]!==cleaned[key])throw Error('Stored alignment metadata mismatch '+entry.key+': '+key);
  return cleaned;
}
