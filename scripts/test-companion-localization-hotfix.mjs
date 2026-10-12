import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const segment=readFileSync('release/v9.9.3-direct/segment-24.txt','utf8');
const index=readFileSync('index.html','utf8');
const digest=createHash('sha256').update(segment).digest('hex');
const marker=index.match(/const SEGMENT_HASHES=\/\* DEEN_HASHES_START \*\/(\[[^\n]+?\])\/\* DEEN_HASHES_END \*\//);
assert(marker,'Missing segment hash manifest');
assert.equal(JSON.parse(marker[1])[24],digest,'Companion release segment hash drift');
const source=segment.match(/<script id="deen-v994-animal-companion-js">([\s\S]*?)<\/script>/)?.[1];
assert(source,'Companion picker script missing');
function checkPicker(translator,expected){
 let html='';
 const ctx={
  state:{profile:{companion:'owl'},onboarded:false},
  window:{DEEN_I18N:translator?{t:translator}:undefined},
  document:{readyState:'loading',addEventListener(){},getElementById(){return null}},
  sheet:(title,body)=>{html=body;assert(title)},
  setTimeout(){},
 };
 vm.runInNewContext(source,ctx,{timeout:2500});
 assert.equal(typeof ctx.window.DEEN_COMPANION?.open,'function');
 assert.equal(ctx.window.DEEN_COMPANION.open('profile'),true);
 assert(html.includes(expected),'Companion selector failed to localize/fallback');
 assert(html.includes('v994-animal-card selected'),'Selected companion missing');
}
checkPicker(key=>({owl:'Eule',owlTrait:'Weisheit'})[key]||key,'Eule');
checkPicker(null,'Baykuş');
console.log(JSON.stringify({passed:true,segment:24,sha256:digest,translated_picker:true,early_boot_fallback:true}));
