/* Regression: rejecting an unavailable language from Turkish settings
 * must use the TARGET language for the sheet, not fall back to Turkish.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const dir=fileURLToPath(new URL('../',import.meta.url));
const source=readFileSync(dir+'assets/i18n/boot.js','utf8');
const notices=[],language={get:()=> 'tr',normalize:id=>['tr','de','fr'].includes(id)?id:null,renderSettings:()=>{}};
const dictionary={t:(key,_,lang)=>String(lang||'tr')+':'+key};
const win={DEEN_APP_LOCALE:language,DEEN_I18N:dictionary,DEEN_CONTENT_LOCALE:{available:()=>false}};
const ctx={window:win,DEEN_APP_LOCALE:language,document:{getElementById:()=>null},state:{onboarded:true},
 sheet:(title,html)=>notices.push({title,html}),console:{error:()=>{}},setTimeout:()=>{}};
vm.runInNewContext(source,ctx,{filename:'assets/i18n/boot.js'});
assert(win.DEEN_BOOT,'Real production boot API was not installed');
assert.equal(await win.DEEN_BOOT.changeLanguage('de'),false,'Unreleased German must stay unavailable');
assert.equal(await win.DEEN_BOOT.changeLanguage('fr'),false,'Unreleased French must stay unavailable');
assert.equal(notices.length,2);
assert.deepEqual({...notices[0]},{title:'de:unavailableTitle',html:'<p>de:unavailableSub</p>'});
assert.deepEqual({...notices[1]},{title:'fr:unavailableTitle',html:'<p>fr:unavailableSub</p>'});
assert.equal(language.get(),'tr','Blocked locale must never replace the current usable language');
const locale=readFileSync(dir+'assets/i18n/locale.js','utf8');
assert(locale.includes("Die deutschen Lerninhalte werden noch geprüft."),'German in-app error explanation missing');
assert(locale.includes("Türkisch, Arabisch oder Englisch wählen."),'English language was incorrectly omitted as an available fallback');
console.log(JSON.stringify({status:'passed',target_locale_notice:'de',no_turkish_fallback:true,
 blocked_locale_not_committed:true,other_target_locale:'fr',
 german_prod_enabled:false,public_deployment_ready:false},null,2));
