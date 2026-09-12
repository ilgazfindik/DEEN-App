(()=>{
 if(window.__deenV832HF2A)return; window.__deenV832HF2A=true;
 const REV='832hf2a3', BASE='./assets/avatar-runtime/hf2/defaults/';
 const specs={
  female:[
   ['deen_female_base_clean','Female Base','base_avatar',1,'female_base.b64'],
   ['deen_fa_blush_01','Kadın Allık 1','blush',1,'female_blush.b64'],
   ['deen_female_eyes_style_01','Kadın Göz 1','eyes',1,'female_eyes.b64'],
   ['deen_fa_hair_01','Kadın Saç 1','hair',1,'female_hair.b64'],
   ['deen_fa_mouths_01','Kadın Ağız 1','mouths',1,'female_mouth.b64'],
   ['deen_fa_noses_01','Kadın Burun 1','noses',1,'female_nose.b64']
  ],
  male:[
   ['deen_male_base_clean','Male Base','base_avatar',1,'male_base.b64'],
   ['deen_male_eyebrows_style_01','Erkek Kaş 1','eyebrows',1,'male_brows.b64'],
   ['deen_male_eyes_style_01','Erkek Göz 1','eyes',1,'male_eyes.b64'],
   ['deen_ma_face_shapes_01','Erkek Yüz Şekli 1','face_shapes',1,'male_face.b64'],
   ['deen_ma_hair_01','Erkek Saç 1','hair',1,'male_hair.b64'],
   ['deen_ma_mouths_01','Erkek Ağız 1','mouths',1,'male_mouth.b64'],
   ['deen_ma_noses_01','Erkek Burun 1','noses',1,'male_nose.b64']
  ]
 };
 function b64url(text){
   const s=String(text||'').replace(/\s+/g,''); const bin=atob(s), u=new Uint8Array(bin.length);
   for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
   if(u.length<16||String.fromCharCode(...u.slice(0,4))!=='RIFF')throw new Error('Invalid HF2 WebP payload');
   const declared=(u[4]|u[5]<<8|u[6]<<16|u[7]<<24)>>>0;
   if(declared+8!==u.length)throw new Error('Truncated HF2 WebP payload');
   return URL.createObjectURL(new Blob([u],{type:'image/webp'}));
 }
 async function one(g,s){
   const r=await fetch(BASE+s[4]+'?v='+REV,{cache:'no-store'}); if(!r.ok)throw new Error('HF2 asset '+s[4]+' '+r.status);
   const src=b64url(await r.text());
   return {id:s[0],name:s[1],gender:g,category:s[2],default:!!s[3],x:0,y:0,w:112,h:112,atlasW:112,atlasH:112,src};
 }
 function script(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=res;s.onerror=()=>rej(new Error('Script load failed: '+src));document.head.append(s)})}
 function sanitize(packs){
   try{
    const a=state?.myWorld?.avatarAssets; if(!a?.selected)return;
    for(const g of ['male','female']){const sel=a.selected[g];if(!sel)continue;const ids=new Set(packs[g].map(x=>x.id));for(const k of Object.keys(sel)){if(sel[k]&&!ids.has(sel[k]))delete sel[k]}}
   }catch(e){console.warn('HF2 state sanitize',e)}
 }
 (async()=>{
  try{
   const packs={male:[],female:[]};
   for(const g of ['female','male'])packs[g]=await Promise.all(specs[g].map(s=>one(g,s)));
   window.DEEN_AVATAR_ASSET_PACKS=packs; sanitize(packs);
   await script('./patches/v8.3.1.runtime.js?v='+REV);
   await script('./patches/v8.3.2.wear.js?v='+REV);
   window.DEEN_RELEASE_VERSION='8.3.2-HF2A'; document.title='DEEN v8.3.2 HF2A';
   document.documentElement.dataset.deenHF2A='ready';
   window.DEEN_HF2={revision:REV,avatar:'defaults-safe',wear:true,room:false,assetCounts:{male:packs.male.length,female:packs.female.length},check:()=>({revision:REV,release:window.DEEN_RELEASE_VERSION,avatar:window.DEEN_AVATAR_ASSETS?.check?.(),wear:window.DEEN_REAL_WEAR?.check?.(),wardrobe:window.DEEN_WARDROBE_PRO?.snapshot?.()})};
  }catch(err){console.error('DEEN HF2A bootstrap failed',err);document.documentElement.dataset.deenHF2A='error';window.DEEN_HF2={revision:REV,error:String(err?.message||err)};}
 })();
})();
