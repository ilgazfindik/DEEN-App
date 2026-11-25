/* Outfit catalogue (assets/companions/outfits.json) and the replacement of the outfits taken out of the shop:
   every outfit has art for all six companions on the 512x768 canvas, ids are unique, the new outfits cover all four
   rarities, and a learner who owned, wore or saved a look with an old outfit gets the new one in its place (once),
   without losing Sparkles. */
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.png':'image/png','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{let p=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';
 fs.readFile(p,(e,b)=>{if(e){res.writeHead(404);return res.end()}res.writeHead(200,{'content-type':mime[path.extname(p)]||'application/octet-stream'});res.end(b)})});
const A=['lion','cat','wolf','owl','turtle','eagle'];
const cat=JSON.parse(fs.readFileSync(path.join(root,'assets/companions/outfits.json'),'utf8'));
const ids=cat.items.map(i=>i.id);assert.equal(new Set(ids).size,ids.length,'unique ids');
const webpSize=f=>{const b=fs.readFileSync(f);assert.equal(b.toString('ascii',0,4),'RIFF');const t=b.toString('ascii',12,16);
 if(t==='VP8X')return [1+b.readUIntLE(24,3),1+b.readUIntLE(27,3)];if(t==='VP8L'){const v=b.readUInt32LE(21);return [1+(v&0x3fff),1+((v>>14)&0x3fff)]}
 return [b.readUInt16LE(26)&0x3fff,b.readUInt16LE(28)&0x3fff]};
for(const it of cat.items){
 if(it.slot!=='body'||!it.full)continue;
 for(const [a,f] of Object.entries(it.art)){assert.ok(fs.existsSync(path.join(root,f)),'missing '+f);assert.deepEqual(webpSize(path.join(root,f)),[512,768],f)}
 for(const l of ['tr','en','de','fr','ar'])assert.ok(it.name&&it.name[l],it.id+' name '+l);
}
const NEW=['ot_robe_brown_tasbih','ot_thobe_kufi_knit','ot_thobe_brown_vest','ot_thobe_mosque_scarf','ot_robe_green_vest_dark','ot_cloak_green','ot_robe_white_green_shawl','ot_robe_brown_gold_sash','ot_robe_green_sash','ot_robe_navy_crescent','ot_robe_green_gold_vest','ot_robe_white_crescent','ot_robe_navy_gold_sash','ot_robe_burgundy_gold','ot_robe_black_gold'];
const rar=c=>c<=60?'common':c<=110?'rare':c<=160?'epic':'legendary';
for(const id of NEW){const it=cat.items.find(i=>i.id===id);assert.ok(it,'new outfit '+id);assert.deepEqual(Object.keys(it.art).sort(),[...A].sort(),id+' for every companion')}
assert.deepEqual([...new Set(NEW.map(id=>rar(cat.items.find(i=>i.id===id).cost)))].sort(),['common','epic','legendary','rare'],'all four rarities');
const OLD=['ot_glasses_bow_jacket_beige','ot_glasses_scarf_vest_black','ot_glasses_scarf_vest_brown','ot_thobe_kufi_vest_brown','ot_thobe_kufi_scarf_brown','ot_thobe_kufi_scarf_vest_brown','ot_thobe_kufi_glasses','ot_thobe_kufi_bow','ot_jacket_1','ot_jacket_2','ot_vest_green_mosque'];
for(const id of OLD){assert.ok(!ids.includes(id),'taken out: '+id);for(const a of A)assert.ok(!fs.existsSync(path.join(root,'assets/companions/outfits',a,id+'.webp')),'old art removed '+a+'/'+id)}
// Outfits whose art did not fit some companions are kept only for the ones they fit.
const only={ot_jacket_3:['cat','lion'],ot_jacket_4:['cat','lion'],ot_glasses_jacket_navy:['eagle','turtle'],ot_glasses_jacket_navy_tunic:['eagle','turtle']};
for(const [id,keep] of Object.entries(only)){const it=cat.items.find(i=>i.id===id);assert.deepEqual(Object.keys(it.art).sort(),keep,id);
 for(const a of A)if(!keep.includes(a))assert.ok(!fs.existsSync(path.join(root,'assets/companions/outfits',a,id+'.webp')),'removed art '+a+'/'+id)}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/index.html';
 let browser;try{browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})}catch(_){browser=await chromium.launch({headless:true,args:['--no-sandbox']})}
 const ctx=await browser.newContext({viewport:{width:393,height:852},serviceWorkers:'block'});
 await ctx.addInitScript(()=>{if(sessionStorage.getItem('s'))return;sessionStorage.setItem('s','1');localStorage.setItem('deen_app_language_v1','tr');
  localStorage.setItem('deen_v4_1_state',JSON.stringify({onboarded:true,energy:30,xp:420,currency:77,profile:{name:'QA',companion:'owl'},settings:{language:'tr',onboardingLanguageConfirmed:true},completed:[],mistakes:[],
   companionMeta:{owned:['owl'],seen:[],eq:{},items:['ot_thobe_kufi_vest_brown','ot_jacket_1','ot_thobe_blue','ot_thobe_brown_vest'],outfit:{owl:{body:'ot_jacket_2'},cat:{body:'ot_thobe_kufi_bow'}},combos:{owl:[{k:{'o:body':'ot_thobe_kufi_glasses'}},null]}}}))});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForSelector('.navbtn',{timeout:90000});await page.waitForTimeout(2500);
 const m=await page.evaluate(()=>{const m=state.companionMeta;return {items:m.items,outfit:m.outfit,combos:m.combos,mig:m.outfitMig,cur:state.currency}});
 assert.deepEqual(m.items,['ot_thobe_brown_vest','ot_robe_brown_gold_sash','ot_thobe_blue'],'owned outfits moved to the new ones (no duplicate)');
 assert.deepEqual(m.outfit,{owl:{body:'ot_robe_green_sash'},cat:{body:'ot_cloak_green'}},'worn outfits moved');
 assert.equal(m.combos.owl[0].k['o:body'],'ot_robe_green_vest_dark','saved look moved');assert.equal(m.mig,1);assert.equal(m.cur,77,'Sparkles unchanged');
 // Once only: a later outfit with an old id is not touched again.
 await page.evaluate(()=>{state.companionMeta.items.push('ot_jacket_1');window.DEEN_OUTFIT_MIGRATE(state.companionMeta)});
 assert.ok(await page.evaluate(()=>state.companionMeta.items.includes('ot_jacket_1')),'migration runs once');
 // The shop lists the new outfits for the owl, with their rarity.
 await page.evaluate(()=>navigate('marketScreen'));await page.waitForTimeout(1500);
 const shop=await page.evaluate(()=>document.querySelector('#marketScreen').innerHTML);
 for(const id of ['ot_robe_black_gold','ot_cloak_green','ot_robe_brown_tasbih'])assert.ok(shop.includes('owl/'+id+'.webp'),'shop shows '+id);
 assert.ok(!/ot_jacket_1\.webp|ot_thobe_kufi_bow\.webp/.test(shop),'old outfits not in the shop');
 assert.deepEqual(errors,[]);
 await browser.close();server.close();console.log('PASS: outfit catalogue and replacement of the old outfits');
})().catch(e=>{console.error(e);process.exit(1)});
