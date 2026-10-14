/* French U13 matching ambiguity regression; original Turkish source remains untouched. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const english=read('assets/i18n/questions/en/units/U13.json').translations;
const gate=read('assets/i18n/content-support.json').languages.fr;
assert.equal(gate.question_data,'missing');
assert.equal(gate.global_qa,'blocked');
assert.equal(gate.religious_expert_approved,false);
const affected=[
 'DEEN-U13-S03-006',
 'DEEN-U13-S06-012'
];
let matchingQuestions=0,matchingPairs=0,sourceAmbiguities=0,translatedAmbiguities=0;
const seenAffected=new Set(),problems=[];
const keys=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'];
const eq=(a,b)=>JSON.stringify(a??null)===JSON.stringify(b??null);
for(let i=1;i<=7;i++){
 const stage='U13-S'+String(i).padStart(2,'0');
 const pack=read('assets/i18n/questions/fr/staging/'+stage+'.json');
 assert.equal(pack.release_ready,false);
 assert.equal(pack.native_reviewer_approved,false);
 assert.equal(pack.verified_by_religious_expert,false);
 for(const [id,item] of Object.entries(pack.translations)){
  const original=english[id]?.source,src=item.source,display=item.display;
  assert(original,id+' original source missing');
  for(const field of keys)assert(eq(src[field],original[field]),id+': changed immutable Turkish source '+field);
  if(src.activity_type!=='matching')continue;
  matchingQuestions++;matchingPairs+=src.pairs.length;
  assert.equal(src.pairs.length,display.pairs.length,id+': matching card count drift');
  const leftSource=new Set(src.pairs.map(p=>p.left));
  const leftFR=new Set(display.pairs.map(p=>p.left));
  assert.equal(leftFR.size,leftSource.size,id+': left card collision');
  const srcRight=new Set(src.pairs.map(p=>p.right));
  const destRight=new Set(display.pairs.map(p=>p.right));
  if(srcRight.size!==src.pairs.length)sourceAmbiguities++;
  if(destRight.size!==display.pairs.length){
   translatedAmbiguities++;
   problems.push(id+': French right-side duplicate');
  }
  if(affected.includes(id)){
   seenAffected.add(id);
   assert.equal(srcRight.size,3,id+': original known duplicate no longer matches');
   assert.equal(destRight.size,4,id+': French correction not unique');
   assert.equal(src.pairs[1].right,'4 rekât');
   assert.equal(src.pairs[2].right,'4 rekât');
   assert.deepEqual(display.pairs.map(p=>p.left),[
    'L’horaire de la prière',
    'La prière obligatoire de midi',
    'La prière obligatoire du soir',
    'La purification des impuretés matérielles'
   ]);
   assert.equal(display.pairs[1].right,'4 rakʿât obligatoires pour la prière de midi (dhohr)');
   assert.equal(display.pairs[2].right,'4 rakʿât obligatoires pour la prière du soir (‘ichâ)');
   assert.equal(item.review_notes?.source_turkish_immutable,true);
   assert.equal(item.review_notes?.independent_religious_and_native_french_review_required,true);
   assert.equal(item.expert_approved,false);
   assert.equal(item.native_reviewer_approved,false);
   assert.equal(pack.release_ready,false);
  }else{
   assert.equal(srcRight.size,destRight.size,id+': unapproved source matching cardinality correction');
  }
 }
}
assert.deepEqual([...seenAffected].sort(),affected.slice().sort());
assert.equal(sourceAmbiguities,2,'Additional U13 source ambiguities require separate review');
assert.equal(translatedAmbiguities,0,'All French U13 right-hand matching labels must be distinguishable');
assert.deepEqual(problems,[],'U13 French matching ambiguities persist');
console.log(JSON.stringify({locale:'fr',unit:'U13',status:'staging_only',
 matchingQuestions,matchingPairs,sourceAmbiguities,translatedAmbiguities,
 disambiguatedSourceIds:affected,originalSourceUnchanged:true,
 nativeFrenchReviewed:false,religiousExpertReviewed:false,
 browserGameplayVerified:false,productionActivated:false,structuralErrors:0},null,2));
