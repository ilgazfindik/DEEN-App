import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
export const root=fileURLToPath(new URL('../',import.meta.url));
export const baseQuestions=JSON.parse(Array.from({length:7},(_,i)=>readFileSync(root+'release/v9.9.3-direct/segment-'+String(i+2).padStart(2,'0')+'.txt','utf8')).join('').replace(/^const QUESTIONS=/,'').trim().replace(/;$/,''));
export const sourceFields=['question_tr','explanation_tr','activity_type','options_tr','correct_answer','pairs','items','correct_order'];
export const getSource=q=>Object.fromEntries(sourceFields.map(k=>[k,q[k]??null]));
